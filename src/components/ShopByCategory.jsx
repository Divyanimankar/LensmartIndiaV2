"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAutoAdvance } from "@/lib/motion";
import "../styles/shopByCategory.css";

/*
  Card par image dikhti hai.
  Hover karne par neeche category ka naam aata hai.
*/
const categories = [
  { id: 1, title: "Eyeglasses", image: "/images/categoryeyeglasses.png", link: "/eyeglasses" },
  { id: 2, title: "Sunglasses", image: "/images/categorysunglasses.png", link: "/sunglasses" },
  { id: 3, title: "Contact Lens", image: "/images/categorycontactlens.png", link: "/contact-lenses" },
  { id: 4, title: "Special Power", image: "/images/categoryspecialpower.png", link: "/special-power" },
  { id: 5, title: "Computer Glasses", image: "/images/categorycomputerglasses.png", link: "/computer-glasses" },
  { id: 6, title: "Smart Glasses", image: "/images/categorysmartglasses.png", link: "/smart-glasses" },
];

export default function ShopByCategory() {
  const sliderRef = useRef(null);
  const sectionRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const max = slider.scrollWidth - slider.clientWidth;
    setCanPrev(slider.scrollLeft > 4);
    setCanNext(slider.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows]);

  /* ek click = ek card */
  const scrollByCard = useCallback((direction) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const card = slider.querySelector(".shop-category-card");
    if (!card) return;

    const gap = parseFloat(getComputedStyle(slider).columnGap) || 0;
    const step = card.getBoundingClientRect().width + gap;

    slider.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  /* auto-advance: one card every 3 s, wrapping back to the start */
  const advance = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const atEnd = slider.scrollLeft >= slider.scrollWidth - slider.clientWidth - 4;
    if (atEnd) slider.scrollTo({ left: 0, behavior: "smooth" });
    else scrollByCard(1);
  }, [scrollByCard]);
  useAutoAdvance(sectionRef, advance);

  return (
    <section className="shop-category-section" ref={sectionRef}>
      <div className="shop-category-container">

        {/* HEADING + ARROWS */}
        <div className="shop-category-header">
          <h2 className="shop-category-heading">SHOP BY CATEGORY</h2>

          <div className="category-arrows">
            <button
              type="button"
              className="category-arrow"
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              aria-label="Previous categories"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
            </button>

            <button
              type="button"
              className="category-arrow"
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              aria-label="Next categories"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* SLIDER */}
        <div
          ref={sliderRef}
          className="shop-category-slider"
          onScroll={updateArrows}
        >
          {categories.map((category) => (
            <Link
              href={category.link}
              className="shop-category-card"
              key={category.id}
              aria-label={`Shop ${category.title}`}
              draggable="false"
            >
              <img
                src={category.image}
                alt={category.title}
                className="shop-category-image"
                loading="lazy"
                draggable="false"
              />

              <div className="shop-category-name-overlay">
                <h3 className="shop-category-name">{category.title}</h3>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
