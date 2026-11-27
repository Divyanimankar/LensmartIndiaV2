/* =========================================================
   PRESCRIPTION GUIDE - Shopify se content
   Shopify: Pages -> "Prescription Guide" -> Metafield "Content Blocks"
   (sirf server par chalta hai, token browser tak nahi jata)
========================================================= */

/* Shopify na chale / field khali ho to ye content dikhega */
export const DEFAULT_CONTENT = {
  hero: {
    eyebrow: "LENS MART INDIA / CUSTOMER GUIDE",
    title: "Your prescription,",
    accent: "made simple.",
    text: "Understand your eye prescription, learn what each value means, and feel more confident when choosing your contact lenses.",
    buttonLabel: "Explore the guide",
  },
  steps: [
    {
      label: "PRESCRIPTION BASICS",
      title: "Know your numbers.",
      description:
        "Understand the important values that describe your vision correction.",
      note: "Illustrative example only, not a prescription.",
    },
    {
      label: "UNDERSTAND SPH",
      title: "Your lens power.",
      description:
        "SPH indicates the power used to correct nearsightedness or farsightedness.",
      note: "Always follow the values on your prescription.",
    },
    {
      label: "ASTIGMATISM",
      title: "CYL and Axis.",
      description:
        "CYL and Axis describe the amount and orientation of astigmatism correction.",
      note: "These values are examples only.",
    },
    {
      label: "BEFORE YOU ORDER",
      title: "Check your details.",
      description:
        "Confirm your contact lens prescription and lens specifications before ordering.",
      note: "Consult your eye care professional if unsure.",
    },
  ],
  basics: {
    eyebrow: "01 / THE BASICS",
    title: "First, understand your prescription.",
    paragraphs: [
      "An eye prescription records the measurements recommended by your eye care professional to correct your vision. For contact lenses, the prescription may also include lens brand, base curve and diameter.",
      "These details help determine which lenses are suitable for your eyes. Your glasses prescription alone may not provide everything needed to order contact lenses safely.",
    ],
  },
  decode: {
    eyebrow: "02 / DECODE THE DETAILS",
    title: "What do the numbers mean?",
    text: "Here are the common abbreviations you may see on an eye prescription.",
    note: "Prescription formats vary. Do not interpret, convert or guess values yourself. Ask your eye care professional if anything is unclear.",
    fields: [
      {
        number: "01",
        title: "SPH (Sphere)",
        description:
          "Shows the lens power needed to correct nearsightedness or farsightedness. A minus sign (-) usually indicates nearsightedness, while a plus sign (+) indicates farsightedness.",
      },
      {
        number: "02",
        title: "CYL (Cylinder)",
        description:
          "Indicates the amount of correction required for astigmatism. This field may be blank if you do not have astigmatism.",
      },
      {
        number: "03",
        title: "AXIS",
        description:
          "A number between 1 and 180 degrees that specifies the orientation of astigmatism correction. It is generally used when CYL is present.",
      },
      {
        number: "04",
        title: "ADD",
        description:
          "Shows the additional magnifying power needed for near vision. It is commonly found on multifocal or presbyopia prescriptions.",
      },
    ],
  },
  byo: {
    eyebrow: "03 / BEFORE YOU ORDER",
    title: "Glasses prescription or contact lens prescription?",
    paragraphs: [
      "They are not always interchangeable. Contact lenses rest on your eye, so their measurements and power can differ from glasses.",
      "Always follow a current contact lens prescription and the fitting advice provided by your eye care professional.",
    ],
    checklistTitle: "Before placing your order",
    items: [
      "Check that your prescription is current.",
      "Confirm the prescribed lens brand and type.",
      "Match the specified power for each eye.",
      "Verify base curve and diameter where applicable.",
      "Ask your eye care professional about missing values.",
    ],
  },
  ready: {
    eyebrow: "04 / READY TO SHOP?",
    title: "Keep your prescription handy.",
    text: "Keep a copy of your valid prescription nearby while shopping. Check your lens details carefully before proceeding with your order.",
    steps: [
      "Locate your current contact lens prescription.",
      "Review the power and lens specifications.",
      "Confirm the details before checkout.",
    ],
  },
};

/* ---------- Shopify query ---------- */

const BLOCK_FIELDS = `
  handle
  type
  fields { key type value }
`;

const QUERY = `
  query PrescriptionGuide($handle: String!) {
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

const getField = (block, key) =>
  block?.fields?.find((field) => field.key === key)?.value || "";

const getChildren = (block) =>
  block?.fields?.find((field) => field.key === "children")?.references?.nodes ||
  [];

/* multi-line text -> paragraphs */
const toParagraphs = (text) =>
  String(text || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

/* list.single_line_text_field -> array */
const toList = (value) => {
  try {
    const list = JSON.parse(value);
    return Array.isArray(list) ? list.filter(Boolean) : [];
  } catch (error) {
    return [];
  }
};

const clean = (value) => String(value || "").trim();

/* =========================================================
   MAIN
========================================================= */

export async function getPrescriptionGuide() {
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
        variables: { handle: "prescription-guide" },
      }),
      next: { revalidate: 300 },
    });

    if (!res.ok) return DEFAULT_CONTENT;

    const json = await res.json();
    const nodes = json?.data?.page?.metafield?.references?.nodes || [];

    if (!nodes.length) return DEFAULT_CONTENT;

    /* block_id se dhundo (guide-LMI, guide-steps ...) */
    const byId = {};
    nodes.forEach((block) => {
      const id = getField(block, "block_id") || block.handle;
      byId[id.toLowerCase()] = block;
    });

    const D = DEFAULT_CONTENT;
    const lmi = byId["guide-lmi"];
    const stepsBlock = byId["guide-steps"];
    const basics = byId["guide-basics"];
    const decode = byId["guide-decode"];
    const byo = byId["guide-byo"];
    const ready = byId["guide-ready"];

    /* steps: Shopify se, kam ho to default se bhar do */
    const stepChildren = getChildren(stepsBlock);
    const steps = stepChildren.length
      ? stepChildren.map((child, index) => ({
          label: clean(getField(child, "eyebrow")) || D.steps[index]?.label || "",
          title: clean(getField(child, "title")) || D.steps[index]?.title || "",
          description:
            clean(getField(child, "text")) || D.steps[index]?.description || "",
          note: clean(getField(child, "note")) || D.steps[index]?.note || "",
        }))
      : D.steps;

    const decodeChildren = getChildren(decode);
    const fields = decodeChildren.length
      ? decodeChildren.map((child, index) => ({
          number: clean(getField(child, "eyebrow")) || String(index + 1).padStart(2, "0"),
          title: clean(getField(child, "title")),
          description: clean(getField(child, "text")),
        }))
      : D.decode.fields;

    return {
      hero: lmi
        ? {
            eyebrow: clean(getField(lmi, "eyebrow")) || D.hero.eyebrow,
            title: clean(getField(lmi, "title")) || D.hero.title,
            accent: clean(getField(lmi, "accent")) || D.hero.accent,
            text: clean(getField(lmi, "text")) || D.hero.text,
            buttonLabel:
              clean(getField(lmi, "button_label")) || D.hero.buttonLabel,
          }
        : D.hero,
      steps,
      basics: basics
        ? {
            eyebrow: clean(getField(basics, "eyebrow")) || D.basics.eyebrow,
            title: clean(getField(basics, "title")) || D.basics.title,
            paragraphs: toParagraphs(getField(basics, "text")).length
              ? toParagraphs(getField(basics, "text"))
              : D.basics.paragraphs,
          }
        : D.basics,
      decode: decode
        ? {
            eyebrow: clean(getField(decode, "eyebrow")) || D.decode.eyebrow,
            title: clean(getField(decode, "title")) || D.decode.title,
            text: clean(getField(decode, "text")) || D.decode.text,
            note: clean(getField(decode, "note")) || D.decode.note,
            fields,
          }
        : D.decode,
      byo: byo
        ? {
            eyebrow: clean(getField(byo, "eyebrow")) || D.byo.eyebrow,
            title: clean(getField(byo, "title")) || D.byo.title,
            paragraphs: toParagraphs(getField(byo, "text")).length
              ? toParagraphs(getField(byo, "text"))
              : D.byo.paragraphs,
            checklistTitle:
              clean(getField(byo, "note")) || D.byo.checklistTitle,
            items: toList(getField(byo, "items")).length
              ? toList(getField(byo, "items"))
              : D.byo.items,
          }
        : D.byo,
      ready: ready
        ? {
            eyebrow: clean(getField(ready, "eyebrow")) || D.ready.eyebrow,
            title: clean(getField(ready, "title")) || D.ready.title,
            text: clean(getField(ready, "text")) || D.ready.text,
            steps: toList(getField(ready, "items")).length
              ? toList(getField(ready, "items"))
              : D.ready.steps,
          }
        : D.ready,
    };
  } catch (error) {
    console.error("Prescription guide fetch error:", error);
    return DEFAULT_CONTENT;
  }
}