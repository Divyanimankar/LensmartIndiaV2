import { storefront } from "@/lib/shopify-storefront";

export const dynamic = "force-dynamic";

const QUERY = `
query Filters($handle: String!) {
  collection(handle: $handle) {
    title
    products(first: 1) {
      filters {
        id
        label
        type
        values { id label count input }
      }
    }
  }
}`;

export default async function FiltersTest({ searchParams }) {
  const sp = await searchParams;
  const handle = sp?.handle || "contact-lenses";
  let data = null;
  let error = null;
  try {
    data = await storefront(QUERY, { handle });
  } catch (e) {
    error = String(e.message || e);
  }
  const filters = data?.collection?.products?.filters || [];

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h2>Filters test: {handle}</h2>
      {error && <pre style={{ color: "red" }}>{error}</pre>}
      {!data?.collection && !error && <p>Collection not found</p>}
      {filters.map((f) => (
        <div key={f.id} style={{ marginBottom: 20 }}>
          <b>{f.label}</b> <code>({f.id})</code>
          <div style={{ fontSize: 13, color: "#555" }}>
            {f.values.map((v) => `${v.label} [${v.count}]`).join("  |  ")}
          </div>
        </div>
      ))}
    </div>
  );
}