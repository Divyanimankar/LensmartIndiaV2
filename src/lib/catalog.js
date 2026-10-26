import { allProducts } from "@/data/allProducts";
import { createSlug } from "./slug";
import { LENS_TYPES, findLensType } from "./lensTypes";

// type = "brand" | "manufacturer" | "lens-type"
export const getProductsFor = (type, slug) => {
  if (type === "lens-type") {
    const lensType = findLensType(slug);
    return lensType ? allProducts.filter(lensType.match) : [];
  }
  return allProducts.filter((p) => createSlug(p[type]) === slug);
};

export const getDisplayName = (type, slug) => {
  if (type === "lens-type") return findLensType(slug)?.title ?? null;
  return getProductsFor(type, slug)[0]?.[type] ?? null;
};

export const getAllNames = (type) => {
  if (type === "lens-type") return LENS_TYPES.map((t) => t.title);
  return [...new Set(allProducts.map((p) => p[type]).filter(Boolean))];
};