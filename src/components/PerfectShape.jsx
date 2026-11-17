import PerfectShapeClient from "./PerfectShapeClient";
import {
  getEyeglassesProducts,
  getSunglassesProducts,
} from "@/lib/shopify-products";

/* Perfect Shape section — shapes ab Shopify products se banti hain.
   Har shape ke liye us shape ka pehla product (image ke saath) chuna jata hai. */

const SHAPE_ORDER = [
  "Rectangle",
  "Cat-Eye",
  "Aviator",
  "Geometric",
  "Round",
  "Oval",
  "Square",
];

/* "Cat Eye", "cat-eye", "CATEYE" sab ek hi mane jayein */
const keyOf = (text) => String(text || "").toLowerCase().replace(/[^a-z0-9]/g, "");

const slugOf = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/* Shopify image ko halka karo (WebGL texture ke liye 600px kaafi) */
const smallImage = (url) => {
  const src = String(url || "").trim();
  if (!src) return "";
  if (!/cdn\.shopify\.com/.test(src)) return src;
  return `${src}${src.includes("?") ? "&" : "?"}width=600`;
};

const buildShapes = (products, category) => {
  const withImage = products.filter((item) => item.shape && item.image);

  /* pehle tay order wali shapes, phir baaki (Shopify me jo bhi aur ho) */
  const names = [];
  SHAPE_ORDER.forEach((name) => {
    if (withImage.some((item) => keyOf(item.shape) === keyOf(name))) names.push(name);
  });

  withImage.forEach((item) => {
    if (!names.some((name) => keyOf(name) === keyOf(item.shape))) {
      names.push(item.shape.trim());
    }
  });

  return names.map((name) => {
    const product = withImage.find((item) => keyOf(item.shape) === keyOf(name));
    const slug = slugOf(name);

    return {
      id: product.id,
      name: name.toUpperCase(),
      slug,
      image: smallImage(product.image),
      productName: product.name,
      brand: product.brand,
      link: `/${category}/shape/${slug}`,
    };
  });
};

export default async function PerfectShape() {
  const [eyeglasses, sunglasses] = await Promise.all([
    getEyeglassesProducts().catch(() => []),
    getSunglassesProducts().catch(() => []),
  ]);

  const shapesData = {
    eyeglasses: buildShapes(eyeglasses, "eyeglasses"),
    sunglasses: buildShapes(sunglasses, "sunglasses"),
  };

  /* dono me koi shape nahi mili to section hi mat dikhao */
  if (!shapesData.eyeglasses.length && !shapesData.sunglasses.length) return null;

  return <PerfectShapeClient shapesData={shapesData} />;
}