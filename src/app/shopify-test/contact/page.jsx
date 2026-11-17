import { storefront } from "@/lib/shopify-storefront";

export const dynamic = "force-dynamic";

/* guesses for the contact-lens details / "designed for" fields */
const KEYS = [
  "contact_lenses_product_details",
  "contact_lens_product_details",
  "contact_lens_details",
  "contact_lenses_details",
  "product_details",
  "lens_details",
  "details",
  "designed_for",
  "contacts_designed_for",
  "contact_lenses_designed_for",
  "designedfor",
  "lens_prescription",
  "product_faqs",
];

const META = KEYS.map(
  (key) => `
  ${key}: metafield(namespace: "custom", key: "${key}") {
    type
    value
    reference {
      ... on Metaobject { type handle fields { key type value } }
    }
  }`,
).join("\n");

const QUERY = `
query ContactTest($q: String!) {
  products(first: 1, query: $q) {
    nodes {
      title
      handle
      productType
      vendor
      ${META}
    }
  }
}`;

export default async function ContactTest({ searchParams }) {
  const sp = await searchParams;
  const q = sp?.q || "Air Optix Color";
  let node = null;
  let error = null;

  try {
    const data = await storefront(QUERY, { q });
    node = data.products.nodes[0] || null;
  } catch (e) {
    error = String(e.message || e);
  }

  if (error) return <pre style={{ padding: 24, color: "red" }}>{error}</pre>;
  if (!node) return <p style={{ padding: 24 }}>Product not found for: {q}</p>;

  const found = KEYS.filter((k) => node[k]);
  const missing = KEYS.filter((k) => !node[k]);

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif", fontSize: 14 }}>
      <h2>
        {node.title} <small>({node.handle})</small>
      </h2>
      <p>
        Type: {node.productType} | Vendor: {node.vendor}
      </p>

      <h3 style={{ color: "green" }}>FOUND ({found.length})</h3>
      {found.map((k) => (
        <details key={k} open style={{ marginBottom: 10 }}>
          <summary>
            <b>custom.{k}</b> ({node[k].type})
          </summary>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f4f4f4", padding: 8 }}>
            {JSON.stringify(
              node[k].reference
                ? { value: node[k].value, reference: node[k].reference }
                : node[k].value,
              null,
              2,
            )}
          </pre>
        </details>
      ))}

      <h3 style={{ color: "crimson" }}>NOT FOUND ({missing.length})</h3>
      <p>{missing.map((k) => `custom.${k}`).join("  |  ") || "none"}</p>
    </div>
  );
}