import { NextResponse } from "next/server";

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;
const ENDPOINT = `https://${DOMAIN}/admin/api/2025-01/graphql.json`;

// Token 24 ghante chalta hai, isliye memory me cache karte hain
let cached = { token: null, expires: 0 };

async function getToken() {
  if (cached.token && Date.now() < cached.expires) return cached.token;

  const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  const data = await res.json().catch(() => ({}));
  console.log("Token HTTP status:", res.status);

  if (!data.access_token) {
    console.error("Token error:", JSON.stringify(data));
    throw new Error("Could not get Shopify token");
  }

  cached = {
    token: data.access_token,
    expires: Date.now() + 23 * 60 * 60 * 1000,
  };
  return cached.token;
}

async function shopify(query, variables) {
  const token = await getToken();

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  const text = await res.text();
  console.log("Shopify HTTP status:", res.status);
  console.log("Shopify response:", text);

  try {
    return JSON.parse(text);
  } catch {
    return { errors: text };
  }
}

const CREATE = `
mutation customerCreate($input: CustomerInput!) {
  customerCreate(input: $input) {
    customer { id }
    userErrors { field message }
  }
}`;

const FIND = `
query ($q: String!) {
  customers(first: 1, query: $q) { nodes { id } }
}`;

const UPDATE_CONSENT = `
mutation ($input: CustomerEmailMarketingConsentUpdateInput!) {
  customerEmailMarketingConsentUpdate(input: $input) {
    customer { id }
    userErrors { field message }
  }
}`;

export async function POST(req) {
  try {
    console.log(
      "ENV check -> domain:", DOMAIN,
      "| client id set:", Boolean(CLIENT_ID),
      "| secret set:", Boolean(CLIENT_SECRET)
    );

    if (!DOMAIN || !CLIENT_ID || !CLIENT_SECRET) {
      return NextResponse.json({ error: "Missing env variables" }, { status: 500 });
    }

    const { email } = await req.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const consent = {
      marketingState: "SUBSCRIBED",
      marketingOptInLevel: "SINGLE_OPT_IN",
      consentUpdatedAt: new Date().toISOString(),
    };

    const created = await shopify(CREATE, {
      input: { email, tags: ["newsletter"], emailMarketingConsent: consent },
    });

    if (created.errors || !created.data) {
      return NextResponse.json({ error: "Shopify request failed" }, { status: 500 });
    }

    const errors = created.data?.customerCreate?.userErrors || [];
    if (errors.length === 0) return NextResponse.json({ ok: true });

    // Customer pehle se hai -> consent update karo
    const taken = errors.some((e) => /taken|already/i.test(e.message));
    if (taken) {
      const found = await shopify(FIND, { q: `email:${email}` });
      const id = found.data?.customers?.nodes?.[0]?.id;

      if (id) {
        const updated = await shopify(UPDATE_CONSENT, {
          input: { customerId: id, emailMarketingConsent: consent },
        });
        const upErrors =
          updated.data?.customerEmailMarketingConsentUpdate?.userErrors || [];
        if (updated.errors || upErrors.length) {
          return NextResponse.json(
            { error: upErrors[0]?.message || "Update failed" },
            { status: 400 }
          );
        }
        return NextResponse.json({ ok: true });
      }
    }

    return NextResponse.json({ error: errors[0]?.message || "Failed" }, { status: 400 });
  } catch (e) {
    console.error("Newsletter route crashed:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}