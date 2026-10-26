"use client";

import { useCallback, useEffect, useState } from "react";
import LensesProductCard, { resolveType } from "./LensesProductCard";
import "../styles/product-grid.css";

/* =========================================================
   ProductGrid — the one grid every collection page uses.

   Layout:  desktop 3 per row · tablet 2 per row · mobile 1 per row
   (set in styles/product-grid.css)

   Usage
     <ProductGrid products={items} productType="sunglasses" />

   Props
   - products        array of product objects (required)
   - productType     "sunglasses" | "eyeglasses" | "contact-lenses" |
                     "contact-lens-solution" (aliases work too).
                     If omitted, each product's own productType is used.
   - basePath        (optional) product page prefix, e.g. "/sunglasses".
                     Link = `${basePath}/${product.id}`
   - getHref         (optional) function(product) -> link. Wins over basePath
   - wishlistType    (optional) value saved as productType in the wishlist
   - defaultRating   (optional) rating used when a product has none
   - defaultReviews  (optional) review count used when a product has none
   - onAddToCart     (optional) passed to the card (solutions only)
   - emptyState      (optional) node shown when there are no products

   The grid owns the wishlist (localStorage "lensmartWishlist"),
   so collection pages no longer need any wishlist code.
========================================================= */

const WISHLIST_KEY = "lensmartWishlist";

/* Per-type defaults: edit basePath / wishlistType here if your routes differ */
const TYPE_META = {
  sunglasses: {
    basePath: "/sunglasses",
    wishlistType: "sunglasses",
    category: "Sunglasses",
  },
  eyeglasses: {
    basePath: "/eyeglasses",
    wishlistType: "eyeglasses",
    category: "Eyeglasses",
  },
  "contact-lenses": {
    basePath: "/contact-lenses",
    wishlistType: "contact-lens",
    category: "Contact Lens",
  },
  "contact-lens-solution": {
    basePath: "/contact-lens-solutions",
    wishlistType: "contact-lens-solution",
    category: "Contact Lens Solution",
  },
};

const keyOf = (type, id) => `${type}:${id}`;

const readWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch {
    return [];
  }
};

export default function ProductGrid({
  products = [],
  productType,
  basePath,
  getHref,
  wishlistType,
  defaultRating,
  defaultReviews,
  onAddToCart,
  emptyState,
}) {
  const [wishlistKeys, setWishlistKeys] = useState([]);

  /* ==========================================
     LOAD + KEEP WISHLIST IN SYNC
     (header, wishlist page, other tabs)
  ========================================== */

  const loadWishlist = useCallback(() => {
    setWishlistKeys(
      readWishlist().map((item) => keyOf(item.productType, item.id)),
    );
  }, []);

  useEffect(() => {
    loadWishlist();

    window.addEventListener("wishlistUpdated", loadWishlist);
    window.addEventListener("storage", loadWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", loadWishlist);
      window.removeEventListener("storage", loadWishlist);
    };
  }, [loadWishlist]);

  /* ==========================================
     HELPERS (per product, so mixed grids work)
  ========================================== */

  const metaFor = (product) => {
    const type = resolveType(productType || product.productType);
    const meta = TYPE_META[type];

    return {
      type,
      category: meta.category,
      wishlistType: wishlistType || meta.wishlistType,
      href: getHref
        ? getHref(product)
        : `${basePath || meta.basePath}/${product.id}`,
    };
  };

  /* ==========================================
     WISHLIST TOGGLE
  ========================================== */

  const toggleWishlist = (product) => {
    try {
      const meta = metaFor(product);
      const saved = readWishlist();

      const matches = (item) =>
        item.id === product.id && item.productType === meta.wishlistType;

      let updated;

      if (saved.some(matches)) {
        updated = saved.filter((item) => !matches(item));
      } else {
        const price = product.price ?? product.salePrice ?? 0;
        const oldPrice = product.oldPrice ?? product.originalPrice ?? null;

        updated = [
          ...saved,
          {
             ...product,     
            id: product.id,
            productType: meta.wishlistType,
            name: product.name,
            category: meta.category,
            brand: product.brand || "",
            manufacturer: product.manufacturer || "",
            type: product.type || "",
            pack: product.pack || "",
            image: product.image,
            price: Number(price),
            oldPrice:
              oldPrice !== null && oldPrice !== undefined && oldPrice !== ""
                ? Number(oldPrice)
                : null,
            link: meta.href,
          },
        ];
      }

      localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));

      // also refreshes this grid through loadWishlist
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  /* ==========================================
     EMPTY STATE
  ========================================== */

  if (!products || products.length === 0) {
    return emptyState || <p className="pg-empty">No products found.</p>;
  }

  /* ==========================================
     GRID
  ========================================== */

  return (
    <ul className="pg-grid">
      {products.map((product) => {
        const meta = metaFor(product);

        return (
          <li key={keyOf(meta.type, product.id)} className="pg-item">
            <LensesProductCard
              product={{
                ...product,
                rating: product.rating ?? defaultRating,
                reviews: product.reviews ?? defaultReviews,
              }}
              productType={meta.type}
              href={meta.href}
              isWishlisted={wishlistKeys.includes(
                keyOf(meta.wishlistType, product.id),
              )}
              onWishlistToggle={toggleWishlist}
              onAddToCart={onAddToCart}
            />
          </li>
        );
      })}
    </ul>
  );
}
