
const SITE_URL = (
  process.env.SITE_URL || "https://lensmartindia.com"
).replace(/\/+$/, "");

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/cart",
        "/checkout",
        "/payment",
        "/my-account",
        "/account",
        "/api/",
        "/search",
        "/wishlist",
        "/register",
        "/create-account",
        "/confirmation",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
