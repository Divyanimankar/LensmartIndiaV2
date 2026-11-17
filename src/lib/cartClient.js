/* =========================================================
   Cart client — browser se /api/cart (Shopify cart) ko call karta hai.

   Asli cart Shopify me hai. localStorage "lensmartCart" sirf
   ek COPY (cache) hai, taaki Navbar / purane components ki
   cart count turant dikhe.
========================================================= */

const CACHE_KEY = "lensmartCart";

/* ek ke baad ek requests (double-click par cart na bigde) */
let queue = Promise.resolve();

const enqueue = (task) => {
  const run = queue.then(task);
  queue = run.catch(() => {});
  return run;
};

const writeCache = (items) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(items));
  } catch {
    /* private mode etc. — ignore */
  }
  window.dispatchEvent(new Event("cartUpdated"));
};

export const getCachedCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(CACHE_KEY)) || [];
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

async function call(action, payload = {}) {
  const response = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    cache: "no-store",
    body: JSON.stringify({ action, ...payload }),
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    /* ignore */
  }

  if (!response.ok) {
    throw new Error(data.error || "Cart error. Please try again.");
  }

  if (Array.isArray(data.items)) writeCache(data.items);

  return data;
}

/* Shopify se latest cart lao */
export const refreshCart = () => enqueue(() => call("get"));

/* product add karo -> { items, addedKey } */
export const addToCart = (item) => enqueue(() => call("add", { item }));

/* boxes / quantity badlo (side: "right" | "left" | "all") */
export const updateBoxes = (key, side, quantity) =>
  enqueue(() => call("update", { key, side, quantity }));

/* poora product cart se hatao */
export const removeCartItem = (key) =>
  enqueue(() => call("remove", { key }));

/* logout ke baad: is browser ka cart saaf (Shopify me cart safe rehta hai) */
export const clearLocalCart = () => enqueue(() => call("clear"));

/* Shopify checkout ka link lao */
export const getCheckoutUrl = async () => {
  const data = await refreshCart();
  if (!data.items?.length) throw new Error("Your cart is empty.");
  if (!data.checkoutUrl) throw new Error("Could not start checkout. Please try again.");
  return data.checkoutUrl;
};

/* Colour + size ke hisaab se sahi Shopify variant chuno
   (exact match -> sirf colour match -> pehla variant) */
export const pickVariantId = (product, color, size) => {
  const variants = product?.variants || [];
  if (!variants.length) return product?.variantId || "";

  const sameColor = (v) => !color || !v.color || v.color === color;
  const sameSize = (v) =>
    !size || !v.size || v.sizeShort === size || v.size === size;

  const best =
    variants.find((v) => sameColor(v) && sameSize(v) && v.available) ||
    variants.find((v) => sameColor(v) && sameSize(v)) ||
    variants.find((v) => sameColor(v)) ||
    variants[0];

  return best?.id || "";
};