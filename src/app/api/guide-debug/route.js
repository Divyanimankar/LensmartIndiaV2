// TEMPORARY test route - kaam hone ke baad is folder ko delete kar dena.
// Open: http://localhost:3000/api/guide-debug?handle=shipping-delivery
export const dynamic = "force-dynamic";

const FRAGMENT = `
  fragment M on Metaobject {
    handle
    type
    fields {
      key
      type
      value
      reference {
        ... on MediaImage { image { url } }
        ... on Metaobject { handle type fields { key type value } }
      }
      references(first: 20) {
        nodes {
          ... on Metaobject { handle type fields { key type value } }
        }
      }
    }
  }
`;

const meta = (alias, key) => `
  ${alias}: metafield(namespace: "custom", key: "${key}") {
    namespace
    key
    type
    value
    references(first: 20) { nodes { ...M } }
  }
`;

const QUERY = `
  ${FRAGMENT}
  query ($handle: String!) {
    page(handle: $handle) {
      id
      title
      handle
      body
      ${meta("a", "content_blocks")}
      ${meta("b", "contentblocks")}
      ${meta("c", "blocks")}
    }
  }
`;

export async function GET(request) {
  const handle =
    new URL(request.url).searchParams.get("handle") || "prescription-guide";

  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN;

  if (!domain || !token) {
    return Response.json({ error: "SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_TOKEN .env.local me nahi mile" });
  }

  const res = await fetch(`https://${domain}/api/2025-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query: QUERY, variables: { handle } }),
    cache: "no-store",
  });

  const json = await res.json();
  return Response.json(json);
}