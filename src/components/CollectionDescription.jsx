import { COLLECTION_CONTENT } from "../data/collectionContent";

import "../styles/collectionDescription.css";

/* =========================================
   CollectionDescription

   Short SEO block for a collection page.

   <CollectionDescription type="eyeglasses" products={products} />
   type:     "eyeglasses" | "sunglasses" | "contact-lenses"
   products: the page's FULL product list (not the filtered
             one), used to build the brand / manufacturer list

   Layout:  intro  ->  brands / manufacturers  ->  FAQ

   SEO:
   - real, crawlable text (nothing hidden behind JS)
   - brands are a semantic <ul>
   - FAQ uses native <details>, so answers stay in the DOM
   - JSON-LD (CollectionPage + brand ItemList + FAQPage) is
     generated from the same data as the visible text
   - set NEXT_PUBLIC_SITE_URL to add absolute URLs (optional)
========================================= */

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");

/* "<" is escaped so content can never close the script tag */
const toJsonLd = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

/* unique names + how many products each has, biggest first */
function getBrands(products, field) {
  const counts = new Map();

  products.forEach((product) => {
    const name = String(
      product[field] || product.brand || product.manufacturer || "",
    ).trim();

    if (name) {
      counts.set(name, (counts.get(name) || 0) + 1);
    }
  });

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export default function CollectionDescription({
  type,
  products = [],
  headingLevel = 2,
}) {
  const content = COLLECTION_CONTENT[type];

  if (!content) {
    return null;
  }

  const {
    name,
    heading,
    intro,
    details,
    brandsHeading,
    brandsNote,
    brandField,
    brandType,
    unit,
    faqs,
  } = content;

  const brands = getBrands(products, brandField);

  const Heading = `h${headingLevel}`;
  const SubHeading = `h${Math.min(headingLevel + 1, 6)}`;
  const headingId = `collection-desc-${type}`;
  const brandsId = `${headingId}-brands`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: heading,
        description: `${intro} ${details}`,
        ...(SITE_URL && { url: `${SITE_URL}/${type}` }),
        isPartOf: { "@type": "WebSite", name: "LensMartIndia" },
      },
      ...(brands.length > 0
        ? [
            {
              "@type": "ItemList",
              name: brandsHeading,
              itemListElement: brands.map((brand, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: { "@type": brandType, name: brand.name },
              })),
            },
          ]
        : []),
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };

  return (
    <section className="collection-desc" aria-labelledby={headingId}>
      {/* 1. INTRO */}

      <header className="collection-desc__intro">
        <Heading id={headingId} className="collection-desc__title">
          {heading}
        </Heading>

        <div className="collection-desc__intro-copy">
          <p>{intro}</p>
          <p>{details}</p>
        </div>
      </header>

      {/* 2. FAQ */}

      <div className="collection-desc__block">
        <div className="collection-desc__block-head">
          <SubHeading className="collection-desc__subtitle">
            {name}: common questions
          </SubHeading>
        </div>

        <div className="collection-desc__faq">
          {faqs.map(({ q, a }) => (
            <details key={q} className="collection-desc__item">
              <summary>
                <span>{q}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* 3. BRANDS / MANUFACTURERS */}

      {brands.length > 0 && (
        <div className="collection-desc__block">
          <div className="collection-desc__block-head">
            <SubHeading id={brandsId} className="collection-desc__subtitle">
              {brandsHeading}
            </SubHeading>
            <p>{brandsNote}</p>
          </div>

          <ul className="collection-desc__brands" aria-labelledby={brandsId}>
            {brands.map((brand) => (
              <li key={brand.name} className="collection-desc__brand">
                <span className="collection-desc__brand-name">
                  {brand.name}
                </span>
                <span className="collection-desc__brand-count">
                  {brand.count} {unit}
                  {brand.count === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(schema) }}
      />
    </section>
  );
}