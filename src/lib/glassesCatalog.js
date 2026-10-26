import { createSlug } from "./slug";

// ⚠️ ADJUST: apne asli data/filter file ke naam likho
import { eyeglassesProducts } from "@/data/eyeglassesProducts";
import { sunglassesProducts } from "@/data/sunglassesProducts";
import { EYEGLASSES_FILTERS, SUNGLASSES_FILTERS } from "@/data/filterConfig";

export const CATALOGS = {
  eyeglasses: {
    name: "Eyeglasses",
    base: "/eyeglasses",
    products: eyeglassesProducts,
    filters: EYEGLASSES_FILTERS,
    productType: "eyeglasses",
  },
  sunglasses: {
    name: "Sunglasses",
    base: "/sunglasses",
    products: sunglassesProducts,
    filters: SUNGLASSES_FILTERS,
    productType: "sunglasses",
  },
};

// ⚠️ ADJUST: fields = product ki kaun si property padhni hai,
// filterKey = filterConfig mein us group ka key
export const GROUPS = {
  category: { label: "Category", fields: ["gender", "category"], filterKey: "category" },
  type: { label: "Type", fields: ["type", "lensType", "need", "lens"], filterKey: "type" },
  shape: { label: "Shape", fields: ["shape", "frameShape"], filterKey: "shape" },
  brand: { label: "Brand", fields: ["brand"], filterKey: "brand" },
};

// URL slug aur product data ki value alag ho sakti hai, isliye alternate naam
const ALIASES = {
  women: ["womens", "female", "ladies", "unisex"],
  men: ["mens", "male", "gents", "unisex"],
  kids: ["kid", "children", "boys", "girls"],
  "blue-light": ["computer-blue-light", "blue-cut", "computer"],
  progressives: ["progressive", "progressive-multifocal", "multifocal"],
  readers: ["reading", "reading-glasses"],
  "non-prescription": ["zero-power", "plano"],
  prescription: ["prescription-power", "power"],
  polarized: ["polarised"],
};

// flag wali categories
const SPECIAL = {
  "new-arrivals": (p) =>
    Boolean(p.newArrival || p.isNew || p.new) ||
    String(p.badge ?? "").toLowerCase() === "new",
  bestsellers: (p) => Boolean(p.bestseller || p.bestSeller || p.isBestseller),
};

const TITLES = {
  "blue-light": "Computer / Blue Light",
  progressives: "Progressive / Multifocal",
  readers: "Reading Glasses",
  "non-prescription": "Zero Power",
  prescription: "Prescription (Power)",
  "new-arrivals": "New Arrivals",
  "anti-fatigue": "Anti-Fatigue",
  "cat-eye": "Cat-Eye",
};

const titleCase = (slug) =>
  slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

export const getAccepted = (slug) => [slug, ...(ALIASES[slug] ?? [])];

const valuesOf = (product, fields) =>
  fields
    .flatMap((f) => [].concat(product[f] ?? []))
    .map((v) => createSlug(v))
    .filter(Boolean);

const getMatcher = (group, slug) => {
  if (group === "category" && SPECIAL[slug]) return SPECIAL[slug];
  const accepted = getAccepted(slug);
  const { fields } = GROUPS[group];
  return (p) => valuesOf(p, fields).some((v) => accepted.includes(v));
};

export const getProductsFor = (category, group, slug) => {
  if (!CATALOGS[category] || !GROUPS[group]) return [];
  return CATALOGS[category].products.filter(getMatcher(group, slug));
};

export const getTitle = (category, group, slug) => {
  if (group === "brand") {
    return getProductsFor(category, group, slug)[0]?.brand ?? titleCase(slug);
  }
  return TITLES[slug] ?? titleCase(slug);
};

export const getHeadingParts = (category, group, slug) => {
  const cat = CATALOGS[category].name;
  const name = getTitle(category, group, slug);
  if (group === "category") {
    return SPECIAL[slug]
      ? { pre: "", name, post: ` in ${cat}` }
      : { pre: `${cat} for `, name, post: "" };
  }
  return { pre: "", name, post: ` ${cat}` };
};

export const getHeroText = (category, group, slug) => {
  const cat = CATALOGS[category].name.toLowerCase();
  const name = getTitle(category, group, slug);
  switch (group) {
    case "category":
      return `Shop ${cat} in this category and refine by type, shape, brand and price.`;
    case "type":
      return `Browse ${name} ${cat} and refine by shape, brand and price.`;
    case "shape":
      return `Find ${name} ${cat} in every style and refine by type, brand and price.`;
    default:
      return `Discover the full ${name} ${cat} range and refine by type, shape and price.`;
  }
};