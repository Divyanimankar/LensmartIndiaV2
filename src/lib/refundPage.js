/* =========================================================
   RETURN & REFUND - Shopify se content
   Shopify: Pages -> "Return & Refund" -> Metafield "Content Blocks"
   (sirf server par chalta hai, token browser tak nahi jata)
========================================================= */

/* Shopify na chale / field khali ho to ye content dikhega */
export const DEFAULT_CONTENT = {
  hero: {
    eyebrow: "LENSMARTINDIA",
    title: "Returns & refunds,",
    accent: "made simple.",
    text: "Your satisfaction matters. Find out how returns work and what to expect when requesting a refund.",
    buttonLabel: "Explore the process",
    note: "Here to help, every step of the way",
    strip: ["TRANSPARENT POLICIES", "HASSLE-FREE SUPPORT"],
  },
  process: {
    eyebrow: "THE PROCESS",
    title: "Four steps.",
    accent: "That's all.",
    text: "We keep the process clear, so you always know what happens next.",
    steps: [
      {
        number: "01",
        icon: "↗",
        title: "Request a return",
        text: "Contact our support team with your order details and reason for return.",
      },
      {
        number: "02",
        icon: "□",
        title: "Product verification",
        text: "Our team will check your request and confirm the next steps.",
      },
      {
        number: "03",
        icon: "✓",
        title: "Return approval",
        text: "Follow the return instructions shared by our support team.",
      },
      {
        number: "04",
        icon: "₹",
        title: "Receive your refund",
        text: "Once approved, your refund will be processed according to the policy.",
      },
    ],
  },
  eligibility: {
    eyebrow: "BEFORE YOU REQUEST",
    title: "Know what",
    accent: "qualifies.",
    text: "A quick guide to help you understand your return eligibility.",
    disclaimer:
      "Eligibility is subject to LensMartIndia's return policy. Our support team will confirm the details for your order.",
    cards: [
      {
        icon: "✓",
        title: "Eligible for review",
        items: [
          "Products received in damaged condition",
          "Incorrect item delivered",
          "Manufacturing defects, where applicable",
          "Requests that meet the applicable return policy",
        ],
        footnote: "Contact support with your order details and evidence.",
      },
      {
        icon: "!",
        title: "Restrictions may apply",
        items: [
          "Opened contact lenses and hygiene-sensitive items",
          "Used or damaged products, where not covered",
          "Requests outside the applicable return window",
          "Items excluded by the product-specific policy",
        ],
        footnote: "Product type and reason for return will be considered.",
      },
    ],
  },
  money: {
    eyebrow: "THE MONEY PART",
    title: "Your refund.",
    accent: "Without the guesswork.",
    text: "Once your return is approved, we will explain the refund method and the expected processing time.",
    linkText: "Need help with a refund?",
    linkLabel: "Get in touch ↗",
    rows: [
      {
        icon: "₹",
        title: "Prepaid orders",
        text: "Refunds are generally issued to the original payment method, subject to processing rules.",
      },
      {
        icon: "↗",
        title: "Cash on delivery",
        text: "An eligible refund may require bank details or another approved refund method.",
      },
      {
        icon: "◷",
        title: "Refund timeline",
        text: "The timeline will be communicated after approval and may vary by payment provider.",
      },
    ],
  },
  help: {
    eyebrow: "WE'RE HERE TO HELP",
    title: "Let's sort it out.",
    text: "Our support team can help you understand your return or refund options.",
    buttonLabel: "Email our team",
    buttonUrl: "mailto:support@lensmartindia.com",
  },
};

/* ---------- Shopify query ---------- */

const BLOCK_FIELDS = `
  handle
  type
  fields { key type value }
`;

const QUERY = `
  query RefundPage($handle: String!) {
    page(handle: $handle) {
      metafield(namespace: "custom", key: "content_blocks") {
        references(first: 20) {
          nodes {
            ... on Metaobject {
              ${BLOCK_FIELDS}
              fields {
                key
                references(first: 20) {
                  nodes {
                    ... on Metaobject { ${BLOCK_FIELDS} }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

/* ---------- helpers ---------- */

const clean = (value) => String(value || "").trim();

const getField = (block, key) =>
  clean(block?.fields?.find((field) => field.key === key)?.value);

const getChildren = (block) =>
  block?.fields?.find((field) => field.key === "children")?.references?.nodes ||
  [];

/* list.single_line_text_field -> array */
const getList = (block, key) => {
  try {
    const list = JSON.parse(getField(block, key));
    return Array.isArray(list) ? list.filter(Boolean) : [];
  } catch (error) {
    return [];
  }
};

/* label ke aakhir ka ↗ hata do (page khud arrow lagata hai) */
const stripArrow = (value) => clean(value).replace(/[\s↗]+$/u, "");

/* "support@x.com" -> "mailto:support@x.com" */
const toHref = (value, fallback) => {
  const url = clean(value);
  if (!url) return fallback;
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(url)) return url;
  if (url.includes("@")) return `mailto:${url}`;
  return fallback;
};

/* =========================================================
   MAIN
========================================================= */

export async function getRefundPage() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN;

  if (!domain || !token) return DEFAULT_CONTENT;

  try {
    const res = await fetch(`https://${domain}/api/2025-01/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { handle: "return-refund" },
      }),
      next: { revalidate: 300 },
    });

    if (!res.ok) return DEFAULT_CONTENT;

    const json = await res.json();
    const nodes = json?.data?.page?.metafield?.references?.nodes || [];

    if (!nodes.length) return DEFAULT_CONTENT;

    const byId = {};
    nodes.forEach((block) => {
      const id = getField(block, "block_id") || block.handle;
      byId[id.toLowerCase()] = block;
    });

    const D = DEFAULT_CONTENT;
    const hero = byId["return-lmi"];
    const processBlock = byId["return-process"];
    const request = byId["return-request"];
    const money = byId["return-money"];
    const help = byId["return-help"];

    const steps = getChildren(processBlock).map((child, index) => ({
      number: getField(child, "eyebrow") || String(index + 1).padStart(2, "0"),
      icon: getField(child, "icon_symbol") || D.process.steps[index]?.icon || "",
      title: getField(child, "title"),
      text: getField(child, "text"),
    }));

    const cards = getChildren(request).map((child, index) => ({
      icon:
        getField(child, "icon_symbol") ||
        D.eligibility.cards[index]?.icon ||
        "",
      title: getField(child, "title"),
      items: getList(child, "items"),
      footnote: getField(child, "note"),
    }));

    const rows = getChildren(money).map((child, index) => ({
      icon: getField(child, "icon_symbol") || D.money.rows[index]?.icon || "",
      title: getField(child, "title"),
      text: getField(child, "text"),
    }));

    const strip = hero ? getList(hero, "items") : [];

    return {
      hero: hero
        ? {
            eyebrow: getField(hero, "eyebrow") || D.hero.eyebrow,
            title: getField(hero, "title") || D.hero.title,
            accent: getField(hero, "accent") || D.hero.accent,
            text: getField(hero, "text") || D.hero.text,
            buttonLabel:
              stripArrow(getField(hero, "button_label")) || D.hero.buttonLabel,
            note: getField(hero, "note") || D.hero.note,
            strip: strip.length ? strip : D.hero.strip,
          }
        : D.hero,
      process: processBlock
        ? {
            eyebrow: getField(processBlock, "eyebrow") || D.process.eyebrow,
            title: getField(processBlock, "title") || D.process.title,
            accent: getField(processBlock, "accent") || D.process.accent,
            text: getField(processBlock, "text") || D.process.text,
            steps: steps.length ? steps : D.process.steps,
          }
        : D.process,
      eligibility: request
        ? {
            eyebrow: getField(request, "eyebrow") || D.eligibility.eyebrow,
            title: getField(request, "title") || D.eligibility.title,
            accent: getField(request, "accent") || D.eligibility.accent,
            text: getField(request, "text") || D.eligibility.text,
            disclaimer: getField(request, "note") || D.eligibility.disclaimer,
            cards: cards.length ? cards : D.eligibility.cards,
          }
        : D.eligibility,
      money: money
        ? {
            eyebrow: getField(money, "eyebrow") || D.money.eyebrow,
            title: getField(money, "title") || D.money.title,
            accent: getField(money, "accent") || D.money.accent,
            text: getField(money, "text") || D.money.text,
            linkText: getField(money, "note") || D.money.linkText,
            linkLabel: getField(money, "button_label") || D.money.linkLabel,
            rows: rows.length ? rows : D.money.rows,
          }
        : D.money,
      help: help
        ? {
            eyebrow: getField(help, "eyebrow") || D.help.eyebrow,
            title: getField(help, "title") || D.help.title,
            text: getField(help, "text") || D.help.text,
            buttonLabel:
              stripArrow(getField(help, "button_label")) || D.help.buttonLabel,
            buttonUrl: toHref(getField(help, "button_url"), D.help.buttonUrl),
          }
        : D.help,
    };
  } catch (error) {
    console.error("Refund page fetch error:", error);
    return DEFAULT_CONTENT;
  }
}