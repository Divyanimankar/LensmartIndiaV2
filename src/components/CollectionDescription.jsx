import { COLLECTION_CONTENT } from "../data/collectionContent";

import "../styles/collectionDescription.css";

/* =========================================
   CollectionDescription

   Short SEO block for a collection page.

   <CollectionDescription type="eyeglasses" products={products} />
   type:     "eyeglasses" | "sunglasses" | "contact-lenses"
   products: the page's FULL product list (not the filtered
             one), used to build the brand / manufacturer list

   OPTIONAL (Shopify collection):
   title:            collection title  -> replaces the heading
   descriptionHtml:  collection description (HTML) -> replaces
                     the intro + details paragraphs
   If they are empty / not passed, the text from
   data/collectionContent.js is used as before.

   OPTIONAL (page specific content):
   override:  object that replaces fields of the base content
              (name, heading, intro, details, faqs, brandsHeading,
              brandsNote, brandField, brandType, unit)
   url:       path of the page, used in the JSON-LD
              (example: "/lens-type/daily")

   Layout:  intro  ->  FAQ  ->  brands / manufacturers

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
  title,
  descriptionHtml,
  override = {}, // NEW (1/3)
  url, // NEW (1/3)
}) {
  const base = COLLECTION_CONTENT[type]; // NEW (2/3)

  if (!base) {
    return null;
  }

  const content = { ...base, ...override }; // NEW (2/3)

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

  /* Shopify description (if any) wins over the static text.
     If it starts with a heading (<h1>..<h6>), that heading becomes the big
     title on the left and the rest becomes the paragraphs. */
  const stripTags = (text) =>
    text
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();

  const fullHtml = String(descriptionHtml || "").trim();
  const headMatch = fullHtml.match(/^\s*<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/i);

  const htmlHeading = headMatch ? stripTags(headMatch[2]) : "";
  const shopifyHtml = headMatch
    ? fullHtml.slice(headMatch[0].length).trim()
    : fullHtml;

  const pageHeading = htmlHeading || String(title || "").trim() || heading;
  const plainDescription = shopifyHtml
    ? stripTags(shopifyHtml)
    : `${intro} ${details}`;

  const Heading = `h${headingLevel}`;
  const SubHeading = `h${Math.min(headingLevel + 1, 6)}`;
  const headingId = `collection-desc-${type}`;
  const brandsId = `${headingId}-brands`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: pageHeading,
        description: plainDescription,
        ...(SITE_URL && { url: `${SITE_URL}${url || `/${type}`}` }), // NEW (3/3)
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
          {pageHeading}
        </Heading>

        {shopifyHtml ? (
          <div
            className="collection-desc__intro-copy"
            dangerouslySetInnerHTML={{ __html: shopifyHtml }}
          />
        ) : (
          <div className="collection-desc__intro-copy">
            <p>{intro}</p>
            <p>{details}</p>
          </div>
        )}
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