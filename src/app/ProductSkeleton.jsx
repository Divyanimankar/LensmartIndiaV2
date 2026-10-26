"use client";

import "./ProductSkeleton.css";

export default function ProductSkeleton({ count = 4 }) {
  return (
    <div className="lens-skeleton-grid" aria-label="Loading products">
      {Array.from({ length: count }).map((_, index) => (
        <div className="lens-skeleton-card" key={index}>
          <div className="lens-skeleton-image" />

          <div className="lens-skeleton-line lens-skeleton-title" />

          <div className="lens-skeleton-line lens-skeleton-short" />

          <div className="lens-skeleton-line lens-skeleton-price" />
        </div>
      ))}
    </div>
  );
}