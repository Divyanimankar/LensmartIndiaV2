"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import "../../styles/search.css";

const products = [
  {
    name: "Acuvue Oasys",
    brand: "Acuvue",
    url: "/product/acuvue-oasys",
  },
  {
    name: "Acuvue Moist",
    brand: "Acuvue",
    url: "/product/acuvue-moist",
  },
  {
    name: "Air Optix Plus HydraGlyde",
    brand: "Air Optix",
    url: "/product/air-optix-hydraglyde",
  },
  {
    name: "Biofinity",
    brand: "Biofinity",
    url: "/product/biofinity",
  },
  {
    name: "Dailies Total 1",
    brand: "Dailies",
    url: "/product/dailies-total-1",
  },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const results = products.filter((product) =>
    `${product.name} ${product.brand}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <section className="search-page">
      <h1>Search Results</h1>

      <p className="search-query">
        Results for: <strong>{query}</strong>
      </p>

      {results.length > 0 ? (
        <div className="search-results">
          {results.map((product) => (
            <Link
              href={product.url}
              className="search-result-card"
              key={product.name}
            >
              <h2>{product.name}</h2>
              <p>{product.brand}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="no-results">
          No products found for &quot;{query}&quot;
        </p>
      )}
    </section>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <section className="search-page">
          <p>Loading search results...</p>
        </section>
      }
    >
      <SearchContent />
    </Suspense>
  );
}