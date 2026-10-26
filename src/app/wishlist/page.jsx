"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import ProductGrid from "../../components/ProductGrid";
import "../../styles/wishlistpage.css";

const WISHLIST_KEY = "lensmartWishlist";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadWishlist = useCallback(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(WISHLIST_KEY));
      // setWishlist(Array.isArray(saved) ? saved : []);

      const clean = Array.isArray(saved)
  ? saved.filter(
      (item, index, arr) =>
        item &&
        item.id !== undefined &&
        item.name &&
        arr.findIndex(
          (x) => x.id === item.id && x.productType === item.productType,
        ) === index,
    )
  : [];
// setWishlist(clean);
setWishlist([...clean].reverse());
    } catch {
      setWishlist([]);
    }
    setIsLoaded(true);
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


    // page khulte hi hamesha top se dikhe
useEffect(() => {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}, []);



  if (!isLoaded) return null;


  return (
    <SiteLayout>
      <div className="wishlist-page">
        <section className="wishlist-section">
          <div className="wishlist-container">
            {wishlist.length > 0 ? (
              <>
                <div className="wishlist-top-row">
                  <p className="wishlist-count">
                    {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"}
                  </p>

                  <Link href="/eyeglasses" className="wishlist-continue-shopping">
                    Continue Shopping
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>

                {/* same card + same heart toggle as collection pages */}
                <ProductGrid products={wishlist} />
              </>
            ) : (
              <div className="wishlist-empty">
                <div className="wishlist-empty-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
                  </svg>
                </div>
                <h2>Your wishlist is empty</h2>
                <p>Save your favourite products here and come back to them anytime.</p>
                <Link href="/" className="wishlist-shop-btn">
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}