import SiteLayout from "@/components/SiteLayout";
import Newsletter from "@/components/Newsletter";
import ContactForm from "@/components/ContactForm";
import { getPageBlocks, getPageSeo } from "../../lib/pageContentBlocks";
import "../../styles/contactuspage.css";

/* The Shopify Page handle that holds the "Content Blocks" metafield */
const PAGE_HANDLE = "contact-us";

/* SEO comes from the Page's "Search engine listing" in Shopify.
   The text below is used whenever a field is left empty there. */
const SEO_FALLBACK = {
  title: "Contact Us",
  description:
    "Questions about a product, your order or delivery? Contact the LensMartIndia team and we will get back to you.",
};

export async function generateMetadata() {
  const seo = await getPageSeo(PAGE_HANDLE);
  const title = seo?.title?.trim() || SEO_FALLBACK.title;
  const description = seo?.description?.trim() || SEO_FALLBACK.description;

  return {
    title,
    description,
    alternates: { canonical: "/contact-us" },
    openGraph: {
      title,
      description,
      url: "https://lensmartindia.com/contact-us",
      type: "website",
    },
  };
}

/* =========================================================
   FALLBACKS – used only if a block/field is missing in Shopify
========================================================= */
const FALLBACK = {
  hero: {
    eyebrow: "CONTACT LENSMARTINDIA",
    heading: "Let's talk.",
    highlight: "We're happy to help.",
    body: "Questions about a product, your order or delivery? Send us a message and our team will get back to you.",
  },
  email: {
    eyebrow: "EMAIL US",
    heading: "support@lensmartindia.com",
    body: "Send us your questions and our team will assist you.",
  },
  support: {
    eyebrow: "CUSTOMER SUPPORT",
    heading: "We're Here to Help",
    body: "Product, order and general shopping questions.",
  },
  delivery: {
    eyebrow: "DELIVERY",
    heading: "Order Assistance",
    body: "Delivery or order-related question? We'll help.",
  },
  touch: {
    eyebrow: "GET IN TOUCH",
    heading: "Send us a message",
    body: "Have a question about our products, your order or shopping with LensMartIndia? Fill out the form and our team will be happy to assist you.",
    list: [
      "Help with product information",
      "Help with order-related questions",
      "General customer support",
    ],
  },
};

/* Which Shopify block feeds which section.
   Exact IDs are tried first, then any ID that contains one of the words.
   If your 4th/5th block IDs differ, add them to these lists. */
const BLOCK_IDS = {
  hero: ["contact-lensmart"],
  email: ["contact-email-us", "email"],
  support: ["contact-support", "support"],
  delivery: ["contact-delivery", "delivery"],
  touch: ["contact-message", "contact-touch", "contact-form", "touch", "message"],
};

function findBlock(blocks, candidates) {
  for (const id of candidates) if (blocks[id]) return blocks[id];
  const ids = Object.keys(blocks);
  for (const word of candidates) {
    const hit = ids.find((id) => id.includes(word));
    if (hit) return blocks[hit];
  }
  return undefined;
}

/* Use the Shopify value if it has content, otherwise the fallback */
function resolve(blocks, name) {
  const block = findBlock(blocks, BLOCK_IDS[name]) || {};
  const fb = FALLBACK[name];
  const out = {};
  for (const key of Object.keys(fb)) {
    const v = block[key];
    const has = Array.isArray(v) ? v.length > 0 : Boolean(v && String(v).trim());
    out[key] = has ? v : fb[key];
  }
  return out;
}

/* =========================================================
   ICONS – design, so they stay in code
========================================================= */
const EMAIL_ICON = (
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </>
);

const SUPPORT_ICON = (
  <>
    <path d="M4 13v-2a8 8 0 0 1 16 0v2" />
    <path d="M4 13h3v6H4z" />
    <path d="M17 13h3v6h-3z" />
    <path d="M17 19c0 1-1 2-3 2h-2" />
  </>
);

const DELIVERY_ICON = (
  <>
    <path d="M3 7h11v9H3z" />
    <path d="M14 10h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="18" cy="18" r="2" />
  </>
);

export default async function ContactUsPage() {
  const blocks = await getPageBlocks(PAGE_HANDLE);

  const hero = resolve(blocks, "hero");
  const email = resolve(blocks, "email");
  const support = resolve(blocks, "support");
  const delivery = resolve(blocks, "delivery");
  const touch = resolve(blocks, "touch");

  // The email card heading is the address itself, so reuse it for the mailto link.
  const emailAddress = email.heading.includes("@")
    ? email.heading
    : FALLBACK.email.heading;

  return (
    <SiteLayout>
      <div className="contact-page">

        {/* HERO */}
        <section className="contact-hero">
          <img
            src="/images/contactusbannerNew.png"
            alt=""
            aria-hidden="true"
            className="contact-hero-image"
          />
          <div className="contact-hero-overlay" />
          <span className="contact-hero-orb orb-one" aria-hidden="true" />
          <span className="contact-hero-orb orb-two" aria-hidden="true" />

          <div className="contact-container contact-hero-content">
            <span className="contact-pill">
              <i /> {hero.eyebrow}
            </span>

            <h1>
              {hero.heading}
              <em> {hero.highlight}</em>
            </h1>

            <p>{hero.body}</p>
          </div>
        </section>

        {/* FLOATING QUICK CONTACT CARDS */}
        <section className="contact-quick">
          <div className="contact-container contact-quick-grid">

            <a href={`mailto:${emailAddress}`} className="contact-quick-card">
              <div className="contact-quick-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">{EMAIL_ICON}</svg>
              </div>
              <div className="contact-quick-text">
                <span>{email.eyebrow}</span>
                <strong>{email.heading}</strong>
                <p>{email.body}</p>
              </div>
              <span className="contact-quick-go" aria-hidden="true">→</span>
            </a>

            <div className="contact-quick-card">
              <div className="contact-quick-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">{SUPPORT_ICON}</svg>
              </div>
              <div className="contact-quick-text">
                <span>{support.eyebrow}</span>
                <strong>{support.heading}</strong>
                <p>{support.body}</p>
              </div>
            </div>

            <div className="contact-quick-card">
              <div className="contact-quick-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">{DELIVERY_ICON}</svg>
              </div>
              <div className="contact-quick-text">
                <span>{delivery.eyebrow}</span>
                <strong>{delivery.heading}</strong>
                <p>{delivery.body}</p>
              </div>
            </div>

          </div>
        </section>

        {/* MESSAGE + FORM */}
        <section className="contact-main-section">
          <div className="contact-container contact-main-grid">

            <aside className="contact-left-content">
              <span className="contact-label">{touch.eyebrow}</span>

              <h2>{touch.heading}</h2>

              <p>{touch.body}</p>

              <ul className="contact-help-points">
                {touch.list.map((text) => (
                  <li className="contact-help-item" key={text}>
                    <span className="contact-check">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m5 12.5 4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>

              <a href={`mailto:${emailAddress}`} className="contact-left-mail">
                {emailAddress}
              </a>
            </aside>

            <ContactForm />

          </div>
        </section>

        

      </div>
    </SiteLayout>
  );
}