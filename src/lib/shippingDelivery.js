/* =========================================================
   SHIPPING & DELIVERY - Shopify se content
   Shopify: Pages -> "Shipping & Delivery" -> Metafield "Content Blocks"
   (sirf server par chalta hai, token browser tak nahi jata)
========================================================= */

/* Shopify na chale / field khali ho to ye content dikhega */
export const DEFAULT_CONTENT = {
  hero: {
    eyebrow: "DELIVERY, MADE SIMPLE",
    title: "Shipping &",
    accent: "Delivery.",
    text: "From our store to your doorstep, we make every delivery simple, secure and easy to follow.",
    buttonLabel: "How delivery works",
    buttonUrl: "#delivery-process",
    points: ["Careful packaging", "Tracking updates"],
  },
  journey: {
    eyebrow: "THE JOURNEY",
    title: "From click",
    accent: "to doorstep.",
    text: "Here is what happens after you place your order.",
    steps: [
      {
        number: "01",
        icon: "✓",
        title: "Order confirmed",
        text: "Your order is received and confirmation details are shared.",
      },
      {
        number: "02",
        icon: "□",
        title: "Packed with care",
        text: "Your products are checked and carefully packed for shipping.",
      },
      {
        number: "03",
        icon: "↗",
        title: "On its way",
        text: "Your order is handed over to the delivery partner.",
      },
      {
        number: "04",
        icon: "⌂",
        title: "Delivered to you",
        text: "Your order arrives at your selected delivery address.",
      },
    ],
  },
  details: {
    eyebrow: "THE LITTLE DETAILS",
    title: "Good products.",
    accent: "Handled with care.",
    text: "We want your shopping experience to feel easy from checkout to delivery.",
    cards: [
      {
        icon: "◎",
        title: "Delivery across India",
        text: "Delivery availability depends on your PIN code.",
      },
      {
        icon: "◇",
        title: "Careful packaging",
        text: "Products are packed to help protect them in transit.",
      },
      {
        icon: "↗",
        title: "Order tracking",
        text: "Use your tracking details to follow your shipment.",
      },
      {
        icon: "♡",
        title: "Here to help",
        text: "Our support team can assist with delivery queries.",
      },
    ],
  },
  ahead: {
    eyebrow: "PLAN AHEAD",
    title: "When will it",
    accent: "arrive?",
    text: "Your estimated delivery date is the best guide for your specific order.",
    note: "Delivery estimates vary by PIN code, product availability, order processing and courier service. Please refer to the estimate displayed at checkout.",
    bottom:
      "Orders are processed according to product availability and the applicable dispatch schedule.",
  },
  help: {
    eyebrow: "WE'RE HERE TO HELP",
    title: "Something about your delivery?",
    text: "Tell us what you need help with. We're happy to help you find the next step.",
    buttonLabel: "Contact support",
    icon: "↗",
  },
};

/* ---------- Shopify query ---------- */

const BLOCK_FIELDS = `
  handle
  type
  fields { key type value }
`;

const QUERY = `
  query ShippingDelivery($handle: String!) {
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
const toList = (value) => {
  try {
    const list = JSON.parse(value);
    return Array.isArray(list) ? list.filter(Boolean) : [];
  } catch (error) {
    return [];
  }
};

/* "https://www.lensmartindia.com/shipping-delivery#x" -> "/shipping-delivery#x" */
const toLocalUrl = (value, fallback) => {
  if (!value) return fallback;
  try {
    const url = new URL(value, "https://www.lensmartindia.com");
    if (/(^|\.)lensmartindia\.com$/.test(url.hostname)) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
    return url.href;
  } catch (error) {
    return fallback;
  }
};

/* button label ke aakhir me ↗ ho to hata do (page khud arrow lagata hai) */
const stripArrow = (value) => clean(value).replace(/[\s↗]+$/u, "");

/* =========================================================
   MAIN
========================================================= */

export async function getShippingDelivery() {
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
        variables: { handle: "shipping-delivery" },
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
    const hero = byId["shipping-made-simple"];
    const journey = byId["shipping-journey"];
    const details = byId["shipping-details"];
    const ahead = byId["shipping-ahead"];
    const help = byId["shipping-help"];

    const journeySteps = getChildren(journey).map((child, index) => ({
      number: getField(child, "eyebrow") || String(index + 1).padStart(2, "0"),
      icon: getField(child, "note") || D.journey.steps[index]?.icon || "",
      title: getField(child, "title"),
      text: getField(child, "text"),
    }));

    const detailCards = getChildren(details).map((child, index) => ({
      icon: getField(child, "icon_symbol") || D.details.cards[index]?.icon || "",
      title: getField(child, "title"),
      text: getField(child, "text"),
    }));

    const heroPoints = hero ? toList(getField(hero, "items")) : [];
    const aheadItems = ahead ? toList(getField(ahead, "items")) : [];

    return {
      hero: hero
        ? {
            eyebrow: getField(hero, "eyebrow") || D.hero.eyebrow,
            title: getField(hero, "title") || D.hero.title,
            accent: getField(hero, "accent") || D.hero.accent,
            text: getField(hero, "text") || D.hero.text,
            buttonLabel: getField(hero, "button_label") || D.hero.buttonLabel,
            buttonUrl: toLocalUrl(getField(hero, "button_url"), D.hero.buttonUrl),
            points: heroPoints.length ? heroPoints : D.hero.points,
          }
        : D.hero,
      journey: journey
        ? {
            eyebrow: getField(journey, "eyebrow") || D.journey.eyebrow,
            title: getField(journey, "title") || D.journey.title,
            accent: getField(journey, "accent") || D.journey.accent,
            text: getField(journey, "text") || D.journey.text,
            steps: journeySteps.length ? journeySteps : D.journey.steps,
          }
        : D.journey,
      details: details
        ? {
            eyebrow: getField(details, "eyebrow") || D.details.eyebrow,
            title: getField(details, "title") || D.details.title,
            accent: getField(details, "accent") || D.details.accent,
            text: getField(details, "text") || D.details.text,
            cards: detailCards.length ? detailCards : D.details.cards,
          }
        : D.details,
      ahead: ahead
        ? {
            eyebrow: getField(ahead, "eyebrow") || D.ahead.eyebrow,
            title: getField(ahead, "title") || D.ahead.title,
            accent: getField(ahead, "accent") || D.ahead.accent,
            text: getField(ahead, "text") || D.ahead.text,
            note: getField(ahead, "note") || D.ahead.note,
            bottom: aheadItems[0] || D.ahead.bottom,
          }
        : D.ahead,
      help: help
        ? {
            eyebrow: getField(help, "eyebrow") || D.help.eyebrow,
            title: getField(help, "title") || D.help.title,
            text: getField(help, "text") || D.help.text,
            buttonLabel:
              stripArrow(getField(help, "button_label")) || D.help.buttonLabel,
            icon: getField(help, "icon_symbol") || D.help.icon,
          }
        : D.help,
    };
  } catch (error) {
    console.error("Shipping delivery fetch error:", error);
    return DEFAULT_CONTENT;
  }
}