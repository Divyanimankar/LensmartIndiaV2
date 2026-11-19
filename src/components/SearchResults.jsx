"use client";

import { useEffect, useState } from "react";
import LensesProductCard from "@/components/LensesProductCard";

const KEY = "lensmartWishlist";

const readList = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY)) || [];
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

const LABELS = {
  eyeglasses: "Eyeglasses",
  sunglasses: "Sunglasses",
  "contact-lenses": "Contact Lenses",
};

/* Search results — wahi LensesProductCard jo baaki pages par hai */
export default function SearchResults({ results }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const sync = () => setWishlist(readList());
    sync();
    window.addEventListener("wishlistUpdated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("wishlistUpdated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const same = (entry, item) =>
    Number(entry.id) === Number(item.card.id) && entry.productType === item.type;

  const toggle = (item) => {
    const list = readList();
    const exists = list.some((entry) => same(entry, item));

    const updated = exists
      ? list.filter((entry) => !same(entry, item))
      : [
          ...list,
          {
            id: Number(item.card.id),
            productType: item.type,
            brand: item.brand,
            name: item.name,
            pack: item.pack,
            category: LABELS[item.type],
            image: item.card.image,
            price: item.price,
            oldPrice: item.oldPrice,
            link: item.href,
          },
        ];

    try {
      localStorage.setItem(KEY, JSON.stringify(updated));
    } catch {}
    setWishlist(updated);
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  return (
    <div className="search-results">
      {results.map((item) => (
        <LensesProductCard
          key={item.key}
          product={{
            ...item.card,
            rating: item.card.rating ?? 4.8,
            reviews: item.card.reviews ?? 95,
          }}
          productType={item.type}
          href={item.href}
          isWishlisted={wishlist.some((entry) => same(entry, item))}
          onWishlistToggle={() => toggle(item)}
        />
      ))}
    </div>
  );
}