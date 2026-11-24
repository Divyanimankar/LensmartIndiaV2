import SiteLayout from "@/components/SiteLayout";
import Newsletter from "@/components/Newsletter";
import { getPageBlocks, getPageSeo } from "../../lib/pageContentBlocks";
import "../../styles/aboutuspage.css";

/* The Shopify Page handle that holds the "Content Blocks" metafield */
const PAGE_HANDLE = "about-us";

/* SEO comes from the Page's "Search engine listing" in Shopify.
   The text below is used whenever a field is left empty there. */
const SEO_FALLBACK = {
  title: "About Us",
  description:
    "Learn about LensMartIndia and our commitment to a simple, transparent and convenient eyewear shopping experience.",
};

export async function generateMetadata() {
  const seo = await getPageSeo(PAGE_HANDLE);
  const title = seo?.title?.trim() || SEO_FALLBACK.title;
  const description = seo?.description?.trim() || SEO_FALLBACK.description;

  return {
    title,
    description,
    alternates: { canonical: "/about-us" },
    openGraph: {
      title,
      description,
      url: "https://lensmartindia.com/about-us",
      type: "website",
    },
  };
}

/* =========================================================
   FALLBACKS – used only if a block is missing in Shopify,
   so the page never renders empty.
========================================================= */
const FALLBACK = {
  "about-intro": {
    eyebrow: "ABOUT LENSMARTINDIA",
    heading: "See the world clearly",
    highlight: "with LensMartIndia",
    body: "At LensMartIndia, we believe eyewear shopping should be simple, comfortable and convenient. We make it easy for you to explore eyeglasses, sunglasses and contact lenses through one clean online shopping experience.",
  },
  "about-vision": {
    heading: "Our Vision",
    body: "To create a simple and dependable online destination where customers can conveniently discover eyewear and contact lens options for their everyday needs.",
  },
  "about-mission": {
    heading: "Our Mission",
    body: "To make eyewear shopping easier through clear information, convenient browsing, transparent choices and a customer-focused online experience.",
  },
  "about-promise": {
    eyebrow: "OUR PROMISE",
    heading: "Your Shopping Experience",
    highlight: "Comes First",
    body: "At LensMartIndia, we are focused on:",
    list: [
      "Clear and useful product information",
      "Simple and transparent pricing",
      "Convenient online ordering",
      "Easy product browsing",
      "Helpful customer support",
    ],
  },
};

/* Use the Shopify value if it has content, otherwise the fallback */
function withFallback(block = {}, id) {
  const fb = FALLBACK[id];
  const merged = {};
  for (const key of Object.keys(fb)) {
    const v = block[key];
    const hasValue = Array.isArray(v) ? v.length > 0 : Boolean(v && String(v).trim());
    merged[key] = hasValue ? v : fb[key];
  }
  return merged;
}

/* =========================================================
   ICONS – these stay in code (they are design, not content).
   The promise icons are matched to list items by position,
   so keep the list order the same in Shopify.
========================================================= */
const PROMISE_ICONS = [
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </>,
  <>
    <path d="M3 12V4h8l10 10-8 8L3 12Z" />
    <circle cx="7.5" cy="8.5" r="1" />
  </>,
  <>
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="18" cy="20" r="1.5" />
    <path d="M2 3h3l2.5 12h11L21 7H6" />
  </>,
  <>
    <path d="M7 4v16M17 4v16" />
    <path d="m3 8 4-4 4 4M13 16l4 4 4-4" />
  </>,
  <>
    <path d="M4 13v-2a8 8 0 0 1 16 0v2" />
    <path d="M4 13h3v6H4zM17 13h3v6h-3z" />
    <path d="M17 19c0 1-1 2-3 2h-2" />
  </>,
];

const VISION_ICON = (
  <>
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </>
);

const MISSION_ICON = (
  <>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" />
    <path d="m15 9 5-5" />
  </>
);

export default async function AboutUsPage() {
  const blocks = await getPageBlocks(PAGE_HANDLE);

  const intro = withFallback(blocks["about-intro"], "about-intro");
  const vision = withFallback(blocks["about-vision"], "about-vision");
  const mission = withFallback(blocks["about-mission"], "about-mission");
  const promise = withFallback(blocks["about-promise"], "about-promise");

  const vmCards = [
    { num: "01", icon: VISION_ICON, block: vision },
    { num: "02", icon: MISSION_ICON, block: mission },
  ];

  return (
    <SiteLayout>
      <div className="updatedAbout-Page">

        {/* BANNER */}
        <section className="updatedAbout-Banner">
          <img
            src="/images/aboutusbannerNew.jpg"
            alt="Eyeglasses, sunglasses and contact lenses at LensMartIndia"
            className="updatedAbout-Banner-Image"
          />
        </section>

        {/* INTRO */}
        <section className="updatedAbout-Intro">
          <div className="updatedAbout-Container updatedAbout-Intro-Inner">

            <span className="updatedAbout-Label">
              <i /> {intro.eyebrow} <i />
            </span>

            <h1>
              <span>{intro.heading}</span>
              <em>{intro.highlight}</em>
            </h1>

            <div className="updatedAbout-Heading-Line" aria-hidden="true">
              <i />
            </div>

            <p className="updatedAbout-Lead">{intro.body}</p>
          </div>
        </section>

        {/* VISION & MISSION */}
        <section className="updatedAbout-Values-Section">
          <div className="updatedAbout-Container">
            <div className="updatedAbout-Vm-Panel">
              {vmCards.map(({ num, icon, block }) => (
                <article className="updatedAbout-Vm-Col" key={num}>
                  <div className="updatedAbout-Vm-Top">
                    <div className="updatedAbout-Vm-Icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        {icon}
                      </svg>
                    </div>
                    <span className="updatedAbout-Vm-Num">{num}</span>
                  </div>

                  <h2>{block.heading}</h2>
                  <span className="updatedAbout-Vm-Rule" aria-hidden="true" />

                  <p>{block.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CUSTOMER FOCUS */}
        <section className="updatedAbout-Focus">
          <span className="updatedAbout-Focus-Ring" aria-hidden="true" />

          <div className="updatedAbout-Container">

            <div className="updatedAbout-Focus-Head">
              <span className="updatedAbout-Label">{promise.eyebrow}</span>
              <h2>
                {promise.heading} <em>{promise.highlight}</em>
              </h2>
              <p>{promise.body}</p>
            </div>

            <ul className="updatedAbout-Focus-Grid">
              {promise.list.map((text, i) => (
                <li className="updatedAbout-Focus-Card" key={`${i}-${text}`}>
                  <span className="updatedAbout-Focus-Num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="updatedAbout-Focus-Icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      {PROMISE_ICONS[i % PROMISE_ICONS.length]}
                    </svg>
                  </span>

                  <strong>{text}</strong>

                  <span className="updatedAbout-Focus-Bar" aria-hidden="true" />
                </li>
              ))}
            </ul>

          </div>
        </section>

      </div>
    </SiteLayout>
  );
}