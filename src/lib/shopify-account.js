import { SHOP_ID } from "@/lib/shopify-auth";

const API = `https://shopify.com/${SHOP_ID}/account/customer/api/2025-07/graphql`;

export async function customerQuery(token, query, variables = {}) {
  const r = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (r.status === 401) return { unauthorized: true };
  return r.json();
}

export function emailFromIdToken(idToken) {
  try {
    const payload = JSON.parse(
      Buffer.from(idToken.split(".")[1], "base64url").toString()
    );
    return payload.email || "";
  } catch {
    return "";
  }
}