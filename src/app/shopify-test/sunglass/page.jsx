import { storefront } from "@/lib/shopify-storefront";

export const dynamic = "force-dynamic";

/* keys we guess from the Shopify admin labels */
const KEYS = [
  "frame_for",
  "frame_shape",
  "sunglasses_frame_material",
  "eyeglasses_frame_material",
  "frame_material",
  "glasses_frame_material",
  "frame_material",
  "eyeglasses_frame_material",
  "eyewear_frame_material",
  "eyeglasses_frame_material",
  "frame_material",
  "glasses_frame_material",
  "glasses_product_details",
  "product_faqs",
  "lens_compatibility",
  "care_instructions",
  "complementary_products",
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
query Sunglass($q: String!) {
  products(first: 1, query: $q) {
    nodes {
      title
      handle
      productType
      vendor
      tags
      options { name values }
      variants(first: 50) {
        nodes {
          title
          availableForSale
          price { amount }
          selectedOptions { name value }
          image { url }
        }
      }
      ${META}
    }
  }
}`;

export default async function SunglassTest({ searchParams }) {
  const sp = await searchParams;
  const q = sp?.q || "Minyan";
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
      <p>
        <b>Options:</b>{" "}
        {node.options.map((o) => `${o.name}: ${o.values.join(", ")}`).join("  |  ")}
      </p>
      <p>
        <b>Variants:</b> {node.variants.nodes.length}
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