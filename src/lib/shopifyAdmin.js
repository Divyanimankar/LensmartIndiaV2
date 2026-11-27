// lib/shopifyAdmin.js
// Shopify Admin API helper (Dev Dashboard app, client credentials).
// Sirf server (API routes) me import karna, browser me kabhi nahi.

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
// "Prescription Upload" app ke credentials (newsletter wale app se alag)
const CLIENT_ID = process.env.SHOPIFY_FILES_CLIENT_ID;
const CLIENT_SECRET = process.env.SHOPIFY_FILES_CLIENT_SECRET;
const API_VERSION = "2025-01";

// Token ~24 ghante chalta hai, isliye memory me cache karte hain
let cached = { token: null, expires: 0 };

export async function getAdminToken() {
  if (cached.token && Date.now() < cached.expires) return cached.token;

  if (!DOMAIN || !CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("Missing Shopify env variables");
  }

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

  if (!data.access_token) {
    console.error("Shopify token error:", res.status, JSON.stringify(data));
    throw new Error("Could not get Shopify token");
  }

  cached = {
    token: data.access_token,
    expires: Date.now() + 23 * 60 * 60 * 1000,
  };

  return cached.token;
}

export async function adminGraphQL(query, variables) {
  const token = await getAdminToken();

  const res = await fetch(
    `https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  const json = await res.json().catch(() => ({}));

  if (!res.ok || json.errors) {
    console.error("Shopify GraphQL error:", res.status, JSON.stringify(json.errors || json));
    throw new Error("Shopify request failed");
  }

  return json.data;
}