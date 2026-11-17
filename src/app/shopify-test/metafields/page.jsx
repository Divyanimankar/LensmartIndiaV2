import { storefront } from "@/lib/shopify-storefront";

export const dynamic = "force-dynamic";

const HANDLE = "dailies-total-1-30-pack"; // koi bhi ek product handle

const query = `
query ($handle: String!) {
  product(handle: $handle) {
    title
    designedFor: metafield(namespace: "custom", key: "contacts_designed_for") {
      type
      value
    }
    details: metafield(namespace: "custom", key: "contact_lenses_product_details") {
      type
      reference {
        ... on Metaobject {
          handle
          type
          fields {
            key
            value
          }
        }
      }
    }
  }
}`;

export default async function Page() {
  let out;
  try {
    const data = await storefront(query, { handle: HANDLE });
    out = data?.product;
  } catch (e) {
    out = { error: String(e.message || e) };
  }

  return (
    <main style={{ padding: 24, fontFamily: "monospace" }}>
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(out, null, 2)}
      </pre>
    </main>
  );
}