import { storefront } from "@/lib/shopify-storefront";

export const dynamic = "force-dynamic";

const QUERY = `
query CollectionProducts($handle: String!) {
  collection(handle: $handle) {
    title
    products(first: 12) {
      nodes {
        id
        handle
        title
        vendor
        featuredImage { url altText }
        priceRange {
          minVariantPrice { amount currencyCode }
        }
      }
    }
  }
}`;

const money = (m) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: m.currencyCode,
  }).format(m.amount);

export default async function ShopifyTestPage({ searchParams }) {
  // Change collection from the URL: /shopify-test?handle=alcon
  const { handle = "acuvue" } = await searchParams;

  let collection = null;
  let error = "";

  try {
    const data = await storefront(QUERY, { handle });
    collection = data.collection;
  } catch (e) {
    error = e.message;
  }

  const products = collection?.products?.nodes || [];

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Shopify products test</h1>
      <p>
        Collection handle: <b>{handle}</b>
      </p>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!error && !collection && (
        <p>No collection found with this handle.</p>
      )}

      {collection && (
        <>
          <h2>{collection.title}</h2>
          <p>{products.length} products loaded</p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {products.map((p) => (
              <div
                key={p.id}
                style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}
              >
                {p.featuredImage?.url ? (
                  <img
                    src={p.featuredImage.url}
                    alt={p.featuredImage.altText || p.title}
                    style={{ width: "100%", height: 160, objectFit: "contain" }}
                  />
                ) : (
                  <div style={{ height: 160, background: "#f3f3f3" }} />
                )}
                <p style={{ margin: "8px 0 2px", fontSize: 12, color: "#666" }}>
                  {p.vendor}
                </p>
                <p style={{ margin: 0, fontWeight: 600 }}>{p.title}</p>
                <p style={{ margin: "6px 0 0" }}>
                  From {money(p.priceRange.minVariantPrice)}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#888" }}>
                  handle: {p.handle}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}