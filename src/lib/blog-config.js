// Blog settings that used to live in data/blogData.js. Client-safe (no env, no server code).
// Edit the hrefs/text below to match your store.

export const POSTS_PER_PAGE = 9;

// Tabs shown on the blog list page, in order.
export const FILTER_GROUPS = ["Eyeglasses", "Sunglasses", "Contact Lenses"];

const normalize = (t) => String(t).toLowerCase().replace(/[\s_-]+/g, " ").trim();

// An article belongs to a tab when it has a Shopify tag with the same name as that tab:
// "eyeglasses", "sunglasses" or "contact lenses" (case-insensitive).
// The first matching tag wins. No matching tag -> the article only shows under "All".
export function detectGroup(tags = []) {
  for (const tag of tags) {
    const hit = FILTER_GROUPS.find((g) => normalize(g) === normalize(tag));
    if (hit) return hit;
  }
  return null;
}

// "Call to action" box at the bottom of each article, per group.
const CTAS = {
  Eyeglasses: {
    text: "Found your style? Browse our eyeglasses collection.",
    label: "Shop Eyeglasses",
    href: "/eyeglasses",
  },
  Sunglasses: {
    text: "Ready for the sun? Explore our sunglasses collection.",
    label: "Shop Sunglasses",
    href: "/sunglasses",
  },
  "Contact Lenses": {
    text: "Need a fresh pair? Browse our contact lenses.",
    label: "Shop Contact Lenses",
    href: "/contact-lenses",
  },
};
const DEFAULT_CTA = {
  text: "Explore our full range of eyewear and contact lenses.",
  label: "Shop Now",
  href: "/eyeglasses",
};

export function getCta(group) {
  return CTAS[group] || DEFAULT_CTA;
}