import { cache } from "react";
import { getContactLensProducts } from "@/lib/shopify-products";
import { LENS_TYPES, findLensType } from "./lensTypes";

/* Shopify products, ek request me cache hote hain */
export const getCatalogProducts = cache(async () => getContactLensProducts());

/* "precision1", "precision-1", "Precision 1" -> same key */
const keyOf = (v) => String(v ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

/* URL slug ke alternate naam (Shopify mein naam thoda alag likha ho to) */
const SLUG_ALIASES = {
  precision1: ["precision"],
};

const acceptedKeys = (slug) => {
  const key = keyOf(slug);
  return [key, ...(SLUG_ALIASES[key] || [])];
};

/* pure helpers: products list ko argument me lete hain (sync, client me bhi chalenge) */

export const filterProductsFor = (products, type, slug) => {
  if (type === "lens-type") {
    const lensType = findLensType(slug);
    return lensType ? products.filter(lensType.match) : [];
  }
  const accepted = acceptedKeys(slug);
  return products.filter((p) => accepted.includes(keyOf(p[type])));
};

export const displayNameFor = (products, type, slug) => {
  if (type === "lens-type") return findLensType(slug)?.title ?? null;
  return filterProductsFor(products, type, slug)[0]?.[type] ?? null;
};

export const namesFor = (products, type) => {
  if (type === "lens-type") return LENS_TYPES.map((t) => t.title);
  return [...new Set(products.map((p) => p[type]).filter(Boolean))];
};

/* async versions, server pages ke liye */
export const getProductsFor = async (type, slug) =>
  filterProductsFor(await getCatalogProducts(), type, slug);

export const getDisplayName = async (type, slug) =>
  displayNameFor(await getCatalogProducts(), type, slug);

export const getAllNames = async (type) =>
  namesFor(await getCatalogProducts(), type);