/* =========================================================
   FAQ PAGE - Shopify se content
   Shopify: Pages -> "FAQ" -> Metafield "Content Blocks"
     faq-help  = hero
     faq-topic = "Explore topics" heading + FAQ categories (sawal-jawab)
     faq-need  = "Still need help?" box
   (sirf server par chalta hai, token browser tak nahi jata)
========================================================= */

/* Shopify na chale / field khali ho to ye content dikhega */
const DEFAULT_CATEGORIES = [
  {
    id: "eyeglasses",
    icon: "◉",
    title: "Eyeglasses",
    description: "Frames, lenses, fit and care.",
    questions: [
      {
        question: "How do I choose the right eyeglasses?",
        answer:
          "Choose a frame that fits comfortably and suits your face shape. Check the frame width, bridge fit and temple length. For prescription lenses, confirm your current prescription and available lens options.",
      },
      {
        question: "Can I order eyeglasses with my prescription?",
        answer:
          "Prescription options depend on the selected product. Check its product details for available lens powers and follow the prescription instructions provided on the website.",
      },
      {
        question: "How do I find the right frame size?",
        answer:
          "Compare the frame measurements with a pair you already wear comfortably. Check the frame width, bridge size and temple length listed on the product page.",
      },
      {
        question: "How should I clean my eyeglasses?",
        answer:
          "Rinse the lenses with clean water, use a suitable lens-cleaning solution and wipe them with a clean microfiber cloth. Avoid tissues and harsh household cleaners.",
      },
    ],
  },
  {
    id: "sunglasses",
    icon: "☼",
    title: "Sunglasses",
    description: "Style, UV protection and comfort.",
    questions: [
      {
        question: "How do I choose sunglasses for everyday use?",
        answer:
          "Choose a comfortable frame that fits securely and check the product specifications for UV protection and other lens features.",
      },
      {
        question: "What does UV protection mean?",
        answer:
          "UV protection helps shield your eyes from ultraviolet rays. Check the product specifications to confirm the level of protection offered.",
      },
      {
        question: "How do I choose sunglasses for my face shape?",
        answer:
          "Consider your face shape, frame width and personal style. Your sunglasses should sit comfortably on your nose and ears without pinching or slipping.",
      },
      {
        question: "Can I wear sunglasses every day?",
        answer:
          "Yes, sunglasses with suitable UV protection can be worn outdoors during everyday activities. Follow the product guidance for the intended use.",
      },
    ],
  },
  {
    id: "contact-lenses",
    icon: "◎",
    title: "Contact Lenses",
    description: "Comfort, prescriptions and lens care.",
    questions: [
      {
        question: "How do I choose the right contact lenses?",
        answer:
          "Choose lenses based on a prescription and fitting recommended by an eye-care professional. Base curve, diameter, material and replacement schedule can affect fit and comfort.",
      },
      {
        question: "Can I sleep while wearing contact lenses?",
        answer:
          "Do not sleep in contact lenses unless your eye-care professional has specifically approved that lens and wearing schedule. Sleeping in lenses can increase the risk of eye complications.",
      },
      {
        question: "How should I care for contact lenses?",
        answer:
          "Wash and dry your hands before handling lenses. Follow the manufacturer's instructions, use the recommended solution and never use tap water to clean or store contact lenses.",
      },
      {
        question: "Can I use my spectacle prescription for contact lenses?",
        answer:
          "A spectacle prescription is not always the same as a contact lens prescription. Get a contact lens fitting and prescription from an eye-care professional before ordering.",
      },
    ],
  },
  {
    id: "orders-delivery",
    icon: "↗",
    title: "Orders & Delivery",
    description: "Payments, shipping and order support.",
    questions: [
      {
        question: "How can I check my order status?",
        answer:
          "Use the order tracking option on the website or check your order confirmation and shipping messages. Contact customer support if you need help.",
      },
      {
        question: "What payment methods are available?",
        answer:
          "Available payment methods are displayed during checkout. Review the options shown before confirming your order.",
      },
      {
        question: "How can I request a return or refund?",
        answer:
          "Review the website's return and refund policy for eligibility and timelines. Contact support with your order details if you need help.",
      },
      {
        question: "What should I do if my order arrives damaged?",
        answer:
          "Keep the product and packaging, take clear photos of the issue and contact customer support with your order details.",
      },
    ],
  },
];

export const DEFAULT_CONTENT = {
  hero: {
    titleLines: ["Good vision starts", "with"],
    accent: "good answers.",
    eyebrow: "HERE TO HELP YOU SEE CLEARLY",
    text: "Find answers about eyeglasses, sunglasses, contact lenses, orders and everything in between.",
  },
  topics: {
    eyebrow: "EXPLORE TOPICS",
    title: "Find what you’re looking for",
    text: "Browse by category to get clear answers, quickly.",
  },
  contact: {
    eyebrow: "STILL NEED HELP?",
    title: "We’re happy to help.",
    text: "Can’t find the answer you need? Get in touch with our team for further assistance.",
    buttonLabel: "Contact Us",
  },
  categories: DEFAULT_CATEGORIES,
};

/* ---------- Shopify query ---------- */

const QUERY = `
  fragment Q on Metaobject {
    handle
    fields { key type value }
  }
  fragment C on Metaobject {
    handle
    fields {
      key
      type
      value
      references(first: 40) { nodes { ...Q } }
    }
  }
  query FaqPage($handle: String!) {
    page(handle: $handle) {
      metafield(namespace: "custom", key: "content_blocks") {
        references(first: 20) {
          nodes {
            ... on Metaobject {
              handle
              fields {
                key
                type
                value
                references(first: 20) { nodes { ...C } }
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

const findField = (block, ...keys) => {
  for (const key of keys) {
    const field = block?.fields?.find((item) => item.key === key);
    if (field && clean(field.value)) return field;
  }
  return null;
};

/* rich text (JSON) ho to plain text bana do */
const richToText = (node) => {
  if (!node) return "";
  if (typeof node.value === "string") return node.value;
  if (Array.isArray(node.children)) {
    const text = node.children.map(richToText).join("");
    return ["paragraph", "list-item", "heading"].includes(node.type)
      ? `${text}\n`
      : text;
  }
  return "";
};

const getText = (block, ...keys) => {
  const field = findField(block, ...keys);
  if (!field) return "";
  if (String(field.type).includes("rich_text")) {
    try {
      return clean(richToText(JSON.parse(field.value)));
    } catch (error) {
      return "";
    }
  }
  return clean(field.value);
};

const getRefs = (block, key) =>
  block?.fields?.find((item) => item.key === key)?.references?.nodes || [];

const stripArrow = (value) => clean(value).replace(/[\s↗]+$/u, "");

/* =========================================================
   MAIN
========================================================= */

export async function getFaqPage() {
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
      body: JSON.stringify({ query: QUERY, variables: { handle: "faq" } }),
      next: { revalidate: 300 },
    });

    if (!res.ok) return DEFAULT_CONTENT;

    const json = await res.json();
    const nodes = json?.data?.page?.metafield?.references?.nodes || [];

    if (!nodes.length) return DEFAULT_CONTENT;

    const byId = {};
    nodes.forEach((block) => {
      const id = getText(block, "block_id") || block.handle;
      byId[id.toLowerCase()] = block;
    });

    const D = DEFAULT_CONTENT;
    const help = byId["faq-help"];
    const topic = byId["faq-topic"];
    const need = byId["faq-need"];

    /* categories + questions */
    const categories = getRefs(topic, "faq_category")
      .map((category, index) => {
        const questions = getRefs(category, "questions")
          .map((item) => ({
            question: getText(item, "question", "title", "name"),
            answer: getText(item, "answer", "text", "description", "content"),
          }))
          .filter((item) => item.question && item.answer);

        return {
          id: category.handle,
          icon: getText(category, "icon") || "◉",
          title: getText(category, "title"),
          description: getText(category, "description"),
          order: Number(getText(category, "sort_order")) || index + 1,
          questions,
        };
      })
      .filter((category) => category.title && category.questions.length)
      .sort((a, b) => a.order - b.order);

    const titleLines = help
      ? getText(help, "title")
          .split(/\n+/)
          .map((line) => line.trim())
          .filter(Boolean)
      : [];

    return {
      hero: help
        ? {
            titleLines: titleLines.length ? titleLines : D.hero.titleLines,
            accent: getText(help, "accent") || D.hero.accent,
            eyebrow: getText(help, "eyebrow") || D.hero.eyebrow,
            text: getText(help, "text") || D.hero.text,
          }
        : D.hero,
      topics: topic
        ? {
            eyebrow: getText(topic, "eyebrow") || D.topics.eyebrow,
            title: getText(topic, "title") || D.topics.title,
            text: getText(topic, "text") || D.topics.text,
          }
        : D.topics,
      contact: need
        ? {
            eyebrow: getText(need, "eyebrow") || D.contact.eyebrow,
            title: getText(need, "title") || D.contact.title,
            text: getText(need, "text") || D.contact.text,
            buttonLabel:
              stripArrow(getText(need, "button_label")) || D.contact.buttonLabel,
          }
        : D.contact,
      categories: categories.length ? categories : D.categories,
    };
  } catch (error) {
    console.error("FAQ page fetch error:", error);
    return DEFAULT_CONTENT;
  }
}