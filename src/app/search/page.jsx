import Link from "next/link";
import "../../styles/search.css";

import { searchProducts } from "@/lib/search";
import SearchResults from "@/components/SearchResults";

/* search results always come fresh from the URL ?q= */
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search | LensMartIndia",
  robots: { index: false, follow: true },
};

const TABS = [
  { id: "all", label: "All" },
  { id: "eyeglasses", label: "Eyeglasses" },
  { id: "sunglasses", label: "Sunglasses" },
  { id: "contact-lenses", label: "Contact Lenses" },
];

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const first = (v) => (Array.isArray(v) ? v[0] : v);

  const query = String(first(params?.q) || "").trim();
  const requested = String(first(params?.type) || "all");
  const type = TABS.some((t) => t.id === requested) ? requested : "all";

  let results = [];
  let counts = { all: 0, eyeglasses: 0, sunglasses: 0, "contact-lenses": 0 };
  let failed = false;

  if (query) {
    try {
      ({ results, counts } = await searchProducts(query, { type, limit: 60 }));
    } catch {
      failed = true;
    }
  }

  const tabHref = (id) =>
    `/search?q=${encodeURIComponent(query)}${id === "all" ? "" : `&type=${id}`}`;

  return (
    <section className="search-page">
      <h1>Search Results</h1>

      <p className="search-query">
        {query ? (
          <>
            Results for: <strong>{query}</strong>
            {counts.all > 0 && ` (${counts.all})`}
          </>
        ) : (
          "Type a brand, frame or lens name in the search box."
        )}
      </p>

      {query && counts.all > 0 && (
        <nav className="search-tabs" aria-label="Filter results by product type">
          {TABS.filter((t) => t.id === "all" || counts[t.id] > 0).map((t) => (
            <Link
              key={t.id}
              href={tabHref(t.id)}
              className={`search-tab ${type === t.id ? "is-active" : ""}`}
            >
              {t.label} <span>{counts[t.id]}</span>
            </Link>
          ))}
        </nav>
      )}

      {results.length > 0 ? (
        <SearchResults results={results} />
      ) : (
        query && (
          <p className="no-results">
            {failed
              ? "Search is not working right now. Please try again."
              : `No products found for "${query}"`}
          </p>
        )
      )}
    </section>
  );
}