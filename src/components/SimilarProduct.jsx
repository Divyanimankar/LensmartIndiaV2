"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useAutoAdvance } from "@/lib/motion";
import Link from "next/link";
import LensesProductCard from "./LensesProductCard";
import "../styles/similarProduct.css";

/* =========================================================
   SimilarProduct — a swipeable row of LensesProductCard

   Props
   - title             heading shown above the row
   - products          array of product objects (see LensesProductCard)
   - productType       passed to the card (default "contact-lenses")
   - viewAllHref       (optional) "View all" link in the header
   - viewAllLabel      (optional) text for that link
   - getHref           (optional) (product) => link for the card
   - isWishlisted      (optional) (product) => boolean
   - onWishlistToggle  (optional) (product) => void. Give both this and
                       isWishlisted when the parent owns the wishlist.
   - defaultRating     (optional) rating used when a product has none
   - defaultReviews    (optional) review count used when a product has none
   - className         (optional) extra class on the section

   Accessibility
   - Native scrolling + scroll-snap: swipe, trackpad, wheel and
     touch all work, and it advances by itself every 3 s, and pauses on hover, focus, touch, when off-screen, and for reduced motion.
   - Previous / Next buttons (disabled at the ends) and, when the
     row has focus, Left / Right / Home / End keys.
   - Page dots and an "x–y of n" counter show where you are.
   - Screen readers hear "Showing products 1 to 4 of 8" after each
     scroll, and every slide is labelled "n of total".
   - Smooth scrolling is switched off for people who prefer
     reduced motion.
========================================================= */

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const INITIAL_VIEW = {
  canPrev: false,
  canNext: false,
  first: 1,
  last: 1,
  page: 0,
  pages: 1,
  perPage: 1,
  step: 0,
};

const MAX_DOTS = 8;

export default function SimilarProduct({
  title = "You may also like",
  products = [],
  productType = "contact-lenses",
  viewAllHref,
  viewAllLabel = "View all",
  getHref,
  isWishlisted,
  onWishlistToggle,
  defaultRating,
  defaultReviews,
  className = "",
}) {
  const headingId = useId();
  const viewportId = useId();
  const viewportRef = useRef(null);
  const announceTimer = useRef(null);

  const [view, setView] = useState(INITIAL_VIEW);
  const [announcement, setAnnouncement] = useState("");

  const total = products.length;

  /* ---------- measure what is on screen ---------- */

  const measure = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return null;

    const slides = el.querySelectorAll("[data-slide]");
    if (!slides.length) return null;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const left = el.scrollLeft;

    const slideWidth = slides[0].offsetWidth;
    const step =
      slides.length > 1
        ? slides[1].offsetLeft - slides[0].offsetLeft
        : slideWidth;
    const gap = Math.max(0, step - slideWidth);

    const perPage = Math.max(
      1,
      Math.floor((el.clientWidth + gap) / (step || 1) + 0.05),
    );

    const canPrev = left > 2;
    const canNext = left < maxScroll - 2;

    const pages = maxScroll <= 2 ? 1 : Math.ceil(slides.length / perPage);

    const page = !canNext
      ? pages - 1
      : Math.min(
          pages - 1,
          Math.max(0, Math.round(left / (perPage * (step || 1)))),
        );

    /* slides that are mostly visible */
    const box = el.getBoundingClientRect();
    let first = -1;
    let last = -1;

    slides.forEach((slide, index) => {
      const rect = slide.getBoundingClientRect();
      const visible =
        Math.min(rect.right, box.right) - Math.max(rect.left, box.left);

      if (visible >= rect.width * 0.6) {
        if (first < 0) first = index;
        last = index;
      }
    });

    if (first < 0) {
      first = 0;
      last = 0;
    }

    return {
      canPrev,
      canNext,
      first: first + 1,
      last: last + 1,
      page,
      pages,
      perPage,
      step,
    };
  }, []);

  const update = useCallback(() => {
    const next = measure();
    if (!next) return;

    setView((previous) =>
      Object.keys(next).every((key) => previous[key] === next[key])
        ? previous
        : next,
    );
  }, [measure]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return undefined;

    let frame = 0;

    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          update();
        });
      }

      /* tell screen readers once scrolling has settled */
      clearTimeout(announceTimer.current);

      announceTimer.current = setTimeout(() => {
        const next = measure();
        if (!next) return;

        setAnnouncement(
          next.first === next.last
            ? `Showing product ${next.first} of ${total}`
            : `Showing products ${next.first} to ${next.last} of ${total}`,
        );
      }, 250);
    };

    el.addEventListener("scroll", onScroll, { passive: true });

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => update())
        : null;

    observer?.observe(el);
    update();

    return () => {
      el.removeEventListener("scroll", onScroll);
      observer?.disconnect();
      cancelAnimationFrame(frame);
      clearTimeout(announceTimer.current);
    };
  }, [update, measure, total]);

  /* ---------- movement ---------- */

  const scrollToLeft = (left) => {
    viewportRef.current?.scrollTo({
      left,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  const goBy = (direction) => {
    const el = viewportRef.current;
    const next = measure();
    if (!el || !next) return;

    scrollToLeft(el.scrollLeft + direction * next.perPage * next.step);
  };

  const goToPage = (index) => {
    const next = measure();
    if (!next) return;

    scrollToLeft(index * next.perPage * next.step);
  };

  const onKeyDown = (event) => {
    /* only when the row itself has focus, not a link or button inside it */
    if (event.target !== event.currentTarget) return;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goBy(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goBy(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      scrollToLeft(0);
    } else if (event.key === "End") {
      event.preventDefault();
      scrollToLeft(event.currentTarget.scrollWidth);
    }
  };

  /* auto-advance one page every 3 s, wrapping back to the first */
  const rootRef = useRef(null);
  const advance = () => {
    const el = viewportRef.current;
    if (!el) return;
    const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4;
    if (atEnd) scrollToLeft(0);
    else goBy(1);
  };
  useAutoAdvance(rootRef, advance);

  /* ---------- render ---------- */

  if (!total) return null;

  const withDefaults = (product) => ({
    ...product,
    rating: product.rating ?? defaultRating,
    reviews: product.reviews ?? product.reviewCount ?? defaultReviews,
  });

  const showArrows = view.pages > 1;
  const showDots = view.pages > 1 && view.pages <= MAX_DOTS;

  const countText =
    view.first === view.last
      ? `${view.first} of ${total}`
      : `${view.first}–${view.last} of ${total}`;

  return (
    <section
      ref={rootRef}
      className={`pc ${className}`.trim()}
      aria-roledescription="carousel"
      aria-labelledby={headingId}
    >
      <div className="pc-inner">
        {/* HEADER */}

        <div className="pc-header">
          <h2 className="pc-title" id={headingId}>
            {title}
          </h2>

          <div className="pc-actions">
            {viewAllHref && (
              <Link className="pc-viewall" href={viewAllHref}>
                {viewAllLabel} <span aria-hidden="true">→</span>
              </Link>
            )}

            {showArrows && (
              <div className="pc-arrows">
                <button
                  type="button"
                  className="pc-arrow"
                  onClick={() => goBy(-1)}
                  disabled={!view.canPrev}
                  aria-controls={viewportId}
                  aria-label="Previous products"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M15 5l-7 7 7 7" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="pc-arrow"
                  onClick={() => goBy(1)}
                  disabled={!view.canNext}
                  aria-controls={viewportId}
                  aria-label="Next products"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SCROLLING ROW */}

        <div
          className="pc-viewport"
          id={viewportId}
          ref={viewportRef}
          role="group"
          tabIndex={0}
          aria-label={`${title}. Use the left and right arrow keys to scroll.`}
          onKeyDown={onKeyDown}
        >
          <ul className="pc-track" role="list">
            {products.map((product, index) => (
              <li
                className="pc-slide"
                key={product.id ?? index}
                data-slide
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${total}`}
              >
                <LensesProductCard
                  product={withDefaults(product)}
                  productType={productType}
                  href={getHref ? getHref(product) : undefined}
                  isWishlisted={
                    isWishlisted ? Boolean(isWishlisted(product)) : false
                  }
                  onWishlistToggle={onWishlistToggle}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* POSITION: counter + dots */}

        {showArrows && (
          <div className="pc-footer">
            <p className="pc-count" aria-hidden="true">
              {countText}
            </p>

            {showDots && (
              <div
                className="pc-dots"
                role="group"
                aria-label="Choose a set of products"
              >
                {Array.from({ length: view.pages }, (_, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`pc-dot${index === view.page ? " is-active" : ""}`}
                    onClick={() => goToPage(index)}
                    aria-label={`Page ${index + 1} of ${view.pages}`}
                    aria-current={index === view.page ? "true" : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* SCREEN READER ANNOUNCEMENTS */}

        <p className="pc-sr" role="status" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>
      </div>
    </section>
  );
}