
import { allProducts } from "../data/allProducts";
import { eyeglassesProducts } from "../data/eyeglassesProducts";
import { sunglassesProducts } from "../data/sunglassesProducts";

const SITE_URL = (
  process.env.SITE_URL || "https://lensmartindia.com"
).replace(/\/+$/, "");

const staticPages = [
  "",
  "/about-us",
  "/contact-us",
  "/eyeglasses",
  "/sunglasses",
  "/contact-lenses",
  "/sale",
  "/blog",
];

function makeUrl(path) {
  return `${SITE_URL}${path}`;
}

function productUrls(products, category) {
  return products.map((product) => ({
    url: makeUrl(`/${category}/${product.id}`),
    changeFrequency: "weekly",
    priority: 0.7,
  }));
}

export default function sitemap() {
  const pages = staticPages.map((path) => ({
    url: makeUrl(path),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  return [
    ...pages,
    ...productUrls(allProducts, "contact-lenses"),
    ...productUrls(eyeglassesProducts, "eyeglasses"),
    ...productUrls(sunglassesProducts, "sunglasses"),
  ];
}
