import { cookies } from "next/headers";

/* Customer Account API (logged-in customer) ke helpers.
   Login cookie: sh_access (Shopify access token, "Bearer" nahi lagta). */

const env = (name) => String(process.env[name] || "").trim();

export const customerEndpoint = () =>
  `https://shopify.com/${env("SHOPIFY_SHOP_ID")}/account/customer/api/2025-01/graphql`;

export async function getAccessToken() {
  const store = await cookies();
  return store.get("sh_access")?.value || "";
}

/* returns { data } ya { error } */
export async function customerGql(query, variables = {}) {
  const token = await getAccessToken();
  if (!token) return { error: "not logged in (no sh_access cookie)" };

  const res = await fetch(customerEndpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  let json = {};
  try {
    json = await res.json();
  } catch {
    return { error: `Customer API returned ${res.status} (not JSON)` };
  }

  if (!res.ok || json.errors?.length) {
    return {
      error: JSON.stringify(json.errors || json).slice(0, 500),
      status: res.status,
    };
  }

  return { data: json.data };
}

/* customer id + saved cart id + wishlist */
export async function readCustomerMeta() {
  const out = await customerGql(`{
    customer {
      id
      cartId: metafield(namespace: "custom", key: "cart_id") { value }
      wishlist: metafield(namespace: "custom", key: "wishlist") { value }
    }
  }`);

  if (out.error) return out;

  const c = out.data?.customer;
  return {
    id: c?.id || "",
    cartId: c?.cartId?.value || "",
    wishlist: c?.wishlist?.value || "",
  };
}

/* metafield likho (type: single_line_text_field | json) */
export async function writeCustomerMeta(ownerId, key, type, value) {
  const out = await customerGql(
    `mutation Set($m: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $m) {
        metafields { key value }
        userErrors { field message code }
      }
    }`,
    { m: [{ ownerId, namespace: "custom", key, type, value }] },
  );

  if (out.error) return out;

  const errors = out.data?.metafieldsSet?.userErrors || [];
  if (errors.length) return { error: errors.map((e) => e.message).join("; ") };

  return { ok: true };
}