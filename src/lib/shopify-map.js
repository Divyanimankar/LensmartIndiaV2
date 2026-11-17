/* =========================================================
   Shopify product  ->  the shape your pages already use
   (same fields as src/data/allProducts.js)

   brand / lens type / schedule / manufacturer are taken from:
     1. a Shopify TAG that equals the filter option
        (e.g. tag "Daily Disposable", "Toric", "Acuvue"; "brand:Acuvue" also works)
     2. otherwise guessed from the product title
   If the guess is wrong, just add the right tag in Shopify.
========================================================= */

/* the options used by data/filterConfig.js (CONTACT_LENS_FILTERS) */
const BRANDS = [
  "Acuvue", "Air Optix", "Aspire", "Biofinity", "Biomedics", "Biotrue",
  "Dailies", "FreshLook", "Iconnect", "Lacelle", "MyDay", "Optima",
  "Precision1", "Proclear", "PureVision", "SofLens", "Ultra",
];
const BRAND_ALIASES = {
  Precision1: ["Precision", "Precision 1"],
  FreshLook: ["Fresh Look"],
  SofLens: ["Soflens", "Soft Lens"],
  Iconnect: ["i connect"],
};
const MANUFACTURERS = [
  "Johnson & Johnson", "Alcon", "CooperVision", "Bausch + Lomb",
  "Aspire", "Iconnect", "Lacelle",
];
const MANUFACTURER_ALIASES = {
  "Johnson & Johnson": ["J&J", "Johnson and Johnson", "Johnson Johnson"],
  "Bausch + Lomb": ["Bausch & Lomb", "Bausch and Lomb", "Bausch Lomb"],
};
const LENS_TYPES = ["Spherical", "Toric", "Multifocal"];
const SCHEDULES = ["Daily Disposable", "Weekly Disposable", "Monthly Disposable"];

const SCHEDULE_RULES = [
  ["Daily Disposable", /\b(1|one)[ -]?day\b|\bdaily\b|\bdailies\b|\boneday\b|\bmyday\b/i],
  ["Weekly Disposable", /\bweekly\b|\b(2|two)[ -]?weeks?\b|\bbi-?weekly\b/i],
  ["Monthly Disposable", /\bmonthly\b|\b(1|one)[ -]?month\b/i],
];

const norm = (text) =>
  String(text ?? "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\+/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\band\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/* tag "brand:Acuvue" -> "Acuvue" */
const tagValue = (tag) => String(tag).split(":").pop();

const names = (option, aliases) => [option, ...(aliases?.[option] || [])].map(norm);

/* first option that equals one of the tags */
const fromTags = (tags, options, aliases) => {
  const values = tags.map((t) => norm(tagValue(t)));
  return options.find((option) => names(option, aliases).some((n) => values.includes(n)));
};

const numericId = (gid) => {
  const id = Number(String(gid).split("/").pop());
  return Number.isFinite(id) ? id : String(gid);
};

/* "Air Optix Plus HydraGlyde (3 Pack)" -> { name: "Air Optix Plus HydraGlyde", pack: "3 Pack" } */
export function splitTitle(title) {
  const text = String(title || "").trim();
  const match =
    text.match(/\s*\(\s*(\d+)\s*[- ]?(?:pack|pk|lenses)\s*\)\s*$/i) ||
    text.match(/\s+(\d+)\s*[- ]?(?:pack|pk)\s*$/i);

  if (!match) return { name: text, pack: "" };

  return { name: text.slice(0, match.index).trim(), pack: `${match[1]} Pack` };
}

function guessBrand(title, vendor) {
  const t = norm(title);

  const hit =
    BRANDS.find((b) => names(b, BRAND_ALIASES).some((n) => t.startsWith(n + " ") || t === n)) ||
    BRANDS.find((b) => names(b, BRAND_ALIASES).some((n) => ` ${t} `.includes(` ${n} `)));

  return hit || (norm(vendor) === norm("Bausch + Lomb") ? "Bausch + Lomb" : vendor || "");
}

/* ---------------------------------------------------------
   Prescription options from the product metafield (JSON text).
   Accepts either  {"prescriptionDetails": {...}}  or just  {...}
   Returns null when missing / invalid (page falls back to defaults).
--------------------------------------------------------- */
const strList = (value) =>
  Array.isArray(value) ? value.map((v) => String(v).trim()).filter(Boolean) : [];

const signed = (list, sign) =>
  strList(list).map((v) => (/^[+-]/.test(v) ? v : `${sign}${v}`));

export function parseRx(raw) {
  if (!raw) return null;

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    try {
      data = JSON.parse(`{${raw}}`); // value pasted as  "prescriptionDetails": {...}
    } catch {
      return null;
    }
  }

  const rx = data?.prescriptionDetails || data;
  if (!rx || typeof rx !== "object") return null;

  const power = rx.power || {};

  return {
    powers: {
      plano: power.plano ? String(power.plano) : "0.00",
      minus: signed(power.minus, "-"),
      plus: signed(power.plus, "+"),
    },
    bc: strList(rx.bc),
    dia: strList(rx.dia),
    cyl: strList(rx.cyl),
    axis: strList(rx.axis),
    add: strList(rx.addPower || rx.add),
  };
}

/* Filter metafields (Search & Discovery): custom.shop_by_brand / wear_type / wear_schedule.
   Value can be plain text ("Monthly") or a JSON list (["Monthly"]). Returns the first value. */
function metaValue(list, key) {
  const m = (list || []).find((x) => x && x.key === key && x.value);
  if (!m) return "";
  try {
    const parsed = JSON.parse(m.value);
    if (Array.isArray(parsed)) return String(parsed[0] || "").trim();
    if (typeof parsed === "string") return parsed.trim();
  } catch {}
  return String(m.value).trim();
}

export function mapProduct(node) {
  const tags = node.tags || [];
  const { name, pack } = splitTitle(node.title);
  const haystack = `${node.title} ${tags.join(" ")}`;

  const price = Number(node.priceRange?.minVariantPrice?.amount || 0);
  const compareAt = Number(node.compareAtPriceRange?.minVariantPrice?.amount || 0);

  const images = (node.images?.nodes || []).map((img) => img.url).filter(Boolean);
  const image = node.featuredImage?.url || images[0] || "";

  const manufacturer =
    fromTags(tags, MANUFACTURERS, MANUFACTURER_ALIASES) ||
    MANUFACTURERS.find((m) => names(m, MANUFACTURER_ALIASES).includes(norm(node.vendor))) ||
    node.vendor ||
    "";

  const metaBrand = metaValue(node.filterMeta, "shop_by_brand");
  const metaType = metaValue(node.filterMeta, "wear_type");
  const metaSchedule = metaValue(node.filterMeta, "wear_schedule");

  const lensType =
    metaType ||
    fromTags(tags, LENS_TYPES) ||
    (/toric|astigmatism/i.test(haystack)
      ? "Toric"
      : /multi-?focal/i.test(haystack)
        ? "Multifocal"
        : "Spherical");

  const schedule =
    metaSchedule ||
    fromTags(tags, SCHEDULES) ||
    (SCHEDULE_RULES.find(([, rule]) => rule.test(haystack)) || [""])[0];

  return {
    id: numericId(node.id),
    shopifyId: node.id,
    variantId: node.variants?.nodes?.[0]?.id || "",
    slug: node.handle,
    handle: node.handle,

    name,
    pack,
    brand: metaBrand || fromTags(tags, BRANDS, BRAND_ALIASES) || guessBrand(node.title, node.vendor),
    manufacturer,
    type: lensType,
    replacementSchedule: schedule,
    isColor: /colou?r/i.test(metaType) || /colou?r/i.test(haystack),

    price,
    oldPrice: compareAt > price ? compareAt : null,

    image,
    images,
    description: node.description || "",

    /* prescription dropdown options (from metafield) */
    rx: parseRx((node.metafields || []).find((m) => m && m.value)?.value),

    bestseller: tags.some((t) => /best ?seller/i.test(t)),
    availableForSale: node.availableForSale !== false,
  };
}


/* =========================================================
   SUNGLASSES
   shape    <- custom.frame_shape
   material <- custom.sunglasses_frame_material
   colors   <- product option "Frame color" (simplified to Black, Brown ...)
   category <- collections ("Unisex Sunglasses" -> Unisex ...)
========================================================= */
const COLOR_RULES = [
  ["Black", /black|nero/i],
  ["Brown", /brown/i],
  ["Tortoise", /havana|tortoise|demi/i],
  ["Gold", /gold/i],
  ["Silver", /silver/i],
  ["Grey", /gr[ea]y|gun/i],
  ["Blue", /blue/i],
  ["Green", /green/i],
  ["Red", /\bred\b|ciliegia|cherry|burgundy/i],
  ["Pink", /pink|rose/i],
  ["Purple", /purple|violet/i],
  ["Crystal", /crystal|transparent/i],
];

export function simplifyColors(values) {
  const out = [];
  (values || []).forEach((v) =>
    COLOR_RULES.forEach(([name, rule]) => {
      if (rule.test(v) && !out.includes(name)) out.push(name);
    }),
  );
  return out;
}

const CATEGORY_RULES = [
  ["Unisex", /unisex/i],
  ["Women", /\b(women|woman|ladies|female)\b/i],
  ["Men", /\b(men|man|male)\b/i],
  ["Kids", /\b(kids?|children|junior)\b/i],
];


const SIZE_MAP = {
  "extra small": "XS",
  xs: "XS",
  small: "S",
  s: "S",
  medium: "M",
  m: "M",
  large: "L",
  l: "L",
  "extra large": "XL",
  xl: "XL",
};

export function simplifySizes(values) {
  const out = [];

  (values || []).forEach((value) => {
    const original = String(value || "").trim();
    if (!original) return;

    const normalized = original.toLowerCase();
    const mapped = SIZE_MAP[normalized];

    const size = mapped || original;

    if (!out.includes(size)) {
      out.push(size);
    }
  });

  return out;
}


export function mapSunglass(node) {
  const base = mapProduct(node);
  const meta = node.sunglassesMeta || [];

  const colorOption = (node.options || []).find((o) => /colou?r/i.test(o.name));
  const colorValues = colorOption?.values || [];

  const labels = [
    ...(node.collections?.nodes || []).flatMap((c) => [c.title, c.handle]),
    ...(node.tags || []),
  ].join(" | ");

  /* "Frame For" metafield first, collection names as a backup */
  const category =
    metaValue(meta, "frame_for") ||
    (CATEGORY_RULES.find(([, rule]) => rule.test(labels)) || [""])[0];

  const sizeOption = (node.options || []).find((o) => /size/i.test(o.name));
  const frameSizes = simplifySizes(sizeOption?.values);

  return {
    id: base.id,
    shopifyId: base.shopifyId,
    slug: base.slug,
    handle: base.handle,
    name: node.title,
    brand: node.vendor || "",
    price: base.price,
    oldPrice: base.oldPrice,
    image: base.image,
    images: base.images,
    description: base.description,

    category,
    shape: metaValue(meta, "frame_shape"),
    material: metaValue(meta, "sunglasses_frame_material"),
    colors: simplifyColors(colorValues),
    colorNames: colorValues, // exact Shopify colour names
    frameSize: frameSizes[0] || "",
    frameSizes,

    rating: 0,
    bestseller: base.bestseller,
    isNew: false,
    availableForSale: base.availableForSale,
  };
}


/* =========================================================
   SUNGLASSES DETAIL PAGE (one product, with variants + metaobjects)
========================================================= */
const fieldsOf = (ref) =>
  Object.fromEntries((ref?.fields || []).map((f) => [f.key, f.value]));

const listOf = (value) => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return value ? [String(value)] : [];
  }
};

export function mapSunglassDetail(node) {
  const base = mapSunglass(node);
  const variants = (node.variants?.nodes || []).map((v) => ({
    id: v.id,
    title: v.title,
    available: v.availableForSale !== false,
    price: Number(v.price?.amount || 0),
    oldPrice: Number(v.compareAtPrice?.amount || 0) || null,
    color: (v.selectedOptions || []).find((o) => /colou?r/i.test(o.name))?.value || "",
    size: (v.selectedOptions || []).find((o) => /size/i.test(o.name))?.value || "",
    sizeShort:
      simplifySizes([(v.selectedOptions || []).find((o) => /size/i.test(o.name))?.value || ""])[0] || "",
    image: v.image?.url || "",
  }));

  const images = (node.images?.nodes || []).map((i) => i.url).filter(Boolean);

  /* colours: exact Shopify name + simple group (for the colour dot) + image */
  const colorOption = (node.options || []).find((o) => /colou?r/i.test(o.name));
  const colors = (colorOption?.values || []).map((name) => ({
    name,
    group: simplifyColors([name])[0] || "",
    image: variants.find((v) => v.color === name && v.image)?.image || images[0] || base.image,
  }));

  const sizeOption = (node.options || []).find((o) => /size/i.test(o.name));
  const sizes = simplifySizes(sizeOption?.values);

  const d = fieldsOf(node.glassesDetails?.reference);
  const care = fieldsOf(node.careInstructions?.reference);
  const lens = fieldsOf(node.lensCompat?.reference);

  let faqs = [];
  try {
    const parsed = JSON.parse(node.productFaqs?.value || "[]");
    if (Array.isArray(parsed)) faqs = parsed.filter((f) => f && f.question && f.answer);
  } catch {}

  return {
    ...base,
    images: images.length ? images : base.images,
    descriptionHtml: node.descriptionHtml || "",
    variants,
    colors,
    sizes,

    frameDetails: {
      type: d.frame_type || "",
      shape: d.frame_shape || base.shape,
      material: d.frame_material || base.material,
      gender: d.gender || base.category,
      dimensions: d.frame_dimensions || "",
      lensWidth: d.lens_width_mm || "",
      bridgeWidth: d.bridge_width_mm || "",
      templeLength: d.temple_length_mm || "",
      modelNumber: d.model_number || "",
    },

    faqs,

    care: {
      cleaning: care.cleaning_instructions || "",
      maintenance: care.maintenance_instructions || "",
      storage: care.storage_instructions || "",
    },

    lensCompatibility: {
      prescriptionCompatible: lens.prescription_compatible === "true",
      types: listOf(lens.compatible_lens_types),
      info: lens.lens_information || "",
    },
  };
}