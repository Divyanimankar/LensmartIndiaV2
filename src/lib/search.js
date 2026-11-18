/* =========================================================
   Search — Shopify ke teeno product types me dhoondta hai
   (Eyeglasses, Sunglasses, Contact Lenses).
   Suggestions (navbar dropdown) aur /search page dono yahi use karte hain.
========================================================= */

import {
  getContactLensProducts,
  getEyeglassesProducts,
  getSunglassesProducts,
} from "@/lib/shopify-products";

const norm = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9+&]+/g, " ")
    .trim();

const sized = (url, width = 400) =>
  url && url.includes("cdn.shopify.com")
    ? `${url}${url.includes("?") ? "&" : "?"}width=${width}`
    : url;

export const TYPES = {
  eyeglasses: { label: "Eyeglasses", path: "eyeglasses" },
  sunglasses: { label: "Sunglasses", path: "sunglasses" },
  "contact-lenses": { label: "Contact Lenses", path: "contact-lenses" },
};

function toItem(product, type) {
  const meta = TYPES[type];

  const words =
    type === "contact-lenses"
      ? [
          product.name,
          product.pack,
          product.brand,
          product.manufacturer,
          product.type,
          product.replacementSchedule,
          "contact lenses lens",
        ]
      : [
          product.name,
          product.brand,
          product.shape,
          product.material,
          product.category,
          type === "sunglasses" ? "sunglasses shades" : "eyeglasses glasses frames spectacles",
        ];

  const text = norm(words.join(" "));

  /* LensesProductCard ko jo fields chahiye (sirf zaroori, halka) */
  const card = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    manufacturer: product.manufacturer,
    category: product.category,
    badge: product.badge,
    image: product.image || product.images?.[0] || product.colors?.[0]?.image || "",
    price: Number(product.price || 0),
    oldPrice: Number(product.oldPrice || 0),
    pack: product.pack,
    shape: product.shape,
    material: product.material,
    frameSize: product.frameSize,
    colors: Array.isArray(product.colors) ? product.colors : undefined,
    type: product.type,
    replacementSchedule: product.replacementSchedule,
    isColor: product.isColor,
    bestseller: product.bestseller,
  };

  return {
    card,
    key: `${type}-${product.slug}`,
    type,
    kind: meta.label,
    href: `/${meta.path}/${product.slug}`,
    name: product.name || "",
    pack: product.pack || "",
    brand: product.brand || "",
    image: product.image || "",
    price: Number(product.price || 0),
    oldPrice: Number(product.oldPrice || 0),
    text,
    nameText: norm(product.name),
    brandText: norm(product.brand),
  };
}

/* 5 minute memory copy, taaki har akshar par Shopify ko call na jaye */
let memo = { at: 0, items: null, pending: null };
const TTL = 5 * 60 * 1000;

async function getIndex() {
  if (memo.items && Date.now() - memo.at < TTL) return memo.items;
  if (memo.pending) return memo.pending;

  memo.pending = (async () => {
    const [eyes, suns, lenses] = await Promise.all([
      getEyeglassesProducts().catch(() => []),
      getSunglassesProducts().catch(() => []),
      getContactLensProducts().catch(() => []),
    ]);

    const items = [
      ...eyes.map((p) => toItem(p, "eyeglasses")),
      ...suns.map((p) => toItem(p, "sunglasses")),
      ...lenses.map((p) => toItem(p, "contact-lenses")),
    ];

    memo = { at: Date.now(), items, pending: null };
    return items;
  })().catch((error) => {
    memo.pending = null;
    throw error;
  });

  return memo.pending;
}

function score(item, words, joined) {
  /* har shabd milna chahiye. "rayban" aur "ray ban" dono chalenge */
  const squashed = item.text.replace(/ /g, "");
  const ok =
    words.every((w) => item.text.includes(w)) || squashed.includes(joined);
  if (!ok) return 0;

  let points = 1;
  if (item.nameText.startsWith(words[0])) points += 4;
  if (item.brandText.startsWith(words[0])) points += 3;
  if (words.every((w) => item.nameText.includes(w))) points += 2;
  if (words.every((w) => item.brandText.includes(w))) points += 2;
  return points;
}

/* -> { results: [...], counts: { all, eyeglasses, sunglasses, contact-lenses } } */
export async function searchProducts(query, { type = "all", limit = 60 } = {}) {
  const words = norm(query).split(" ").filter(Boolean);
  const empty = { results: [], counts: { all: 0, eyeglasses: 0, sunglasses: 0, "contact-lenses": 0 } };
  if (!words.length) return empty;

  const joined = words.join("");
  const index = await getIndex();

  const matched = index
    .map((item) => ({ item, points: score(item, words, joined) }))
    .filter((entry) => entry.points > 0)
    .sort((a, b) => b.points - a.points || a.item.name.localeCompare(b.item.name))
    .map((entry) => entry.item);

  const counts = { ...empty.counts, all: matched.length };
  matched.forEach((item) => {
    counts[item.type] += 1;
  });

  const picked = type === "all" ? matched : matched.filter((item) => item.type === type);

  const results = picked.slice(0, limit).map(({ text, nameText, brandText, ...rest }) => ({
    ...rest,
    image: sized(rest.image, 400),
  }));

  return { results, counts };
}