import Link from "next/link";
import "../../styles/search.css";

import {
  getContactLensProducts,
  getSunglassesProducts,
} from "@/lib/shopify-products";

/* search results always come fresh from the URL ?q= */
export const dynamic = "force-dynamic";

const norm = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9+&]+/g, " ")
    .trim();

/* smaller Shopify CDN image for the result cards */
const sized = (url, width = 400) =>
  url && url.includes("cdn.shopify.com")
    ? `${url}${url.includes("?") ? "&" : "?"}width=${width}`
    : url;

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

/* every word typed must be found somewhere in the product text */
const matches = (text, words) => words.every((word) => text.includes(word));

function toResult(product, kind) {
  const isSun = kind === "sunglasses";

  return {
    key: `${kind}-${product.slug}`,
    kind: isSun ? "Sunglasses" : "Contact Lenses",
    href: `/${isSun ? "sunglasses" : "contact-lenses"}/${product.slug}`,
    name: product.name,
    pack: product.pack || "",
    brand: product.brand,
    image: sized(product.image),
    price: product.price,
    oldPrice: product.oldPrice,
    text: norm(
      isSun
        ? [product.name, product.brand, product.shape, product.material, product.category, "sunglasses"]
        : [
            product.name,
            product.pack,
            product.brand,
            product.manufacturer,
            product.type,
            product.replacementSchedule,
            "contact lenses",
          ].join(" "),
    ),
  };
}

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params?.q) ? params.q[0] : params?.q;
  const query = String(rawQuery || "").trim();
  const words = norm(query).split(" ").filter(Boolean);

  let results = [];

  if (words.length) {
    const [lenses, sunglasses] = await Promise.all([
      getContactLensProducts(),
      getSunglassesProducts(),
    ]);

    results = [
      ...lenses.map((p) => toResult(p, "contact-lenses")),
      ...sunglasses.map((p) => toResult(p, "sunglasses")),
    ]
      .filter((item) => matches(item.text, words))
      .slice(0, 60);
  }

  return (
    <section className="search-page">
      <h1>Search Results</h1>

      <p className="search-query">
        {query ? (
          <>
            Results for: <strong>{query}</strong>
            {results.length > 0 && ` (${results.length})`}
          </>
        ) : (
          "Type a brand, frame or lens name in the search box."
        )}
      </p>

      {results.length > 0 ? (
        <div className="search-results">
          {results.map((product) => (
            <Link
              href={product.href}
              className="search-result-card"
              key={product.key}
            >
              {product.image && (
                <span className="search-result-image">
                  <img src={product.image} alt={product.name} loading="lazy" />
                </span>
              )}

              <span className="search-result-kind">{product.kind}</span>

              <h2>
                {product.name}
                {product.pack && (
                  <span className="search-result-pack"> ({product.pack})</span>
                )}
              </h2>

              <p>{product.brand}</p>

              {product.price > 0 && (
                <p className="search-result-price">
                  <strong>{money(product.price)}</strong>
                  {product.oldPrice > product.price && (
                    <s>{money(product.oldPrice)}</s>
                  )}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        query && (
          <p className="no-results">
            No products found for &quot;{query}&quot;
          </p>
        )
      )}
    </section>
  );
}