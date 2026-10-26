"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/* ==========================================================================
   MotionProvider
   ----------------------------------------------------------------------------
   A tiny, dependency-free motion layer for the whole storefront.

   1. Scroll reveals     – IntersectionObserver adds `data-lm-rv` (hidden state)
                           to below-the-fold elements and `data-lm-in` when they
                           enter. Above-the-fold content is NEVER hidden, so
                           LCP and first paint are untouched.
   2. Header state       – sets data-lm-scrolled on <html> (compact header).
   3. Restrained parallax– ±4% of an element's height, transform only.
   4. Route feedback     – thin progress bar on internal link clicks + a short
                           fade/translate of the page when the route changes.
                           Routing itself is untouched (Next.js still owns it).

   Everything is skipped for users who prefer reduced motion, and every piece
   fails open (content stays visible) if anything here throws.
========================================================================== */

/* [selector, variant, stagger?] — existing class names only. */
const REVEALS = [
  /* headings & intros */
  [".shop-category-header", "up"],
  [".bestseller-heading", "up"],
  [".bestseller-tabs", "up"],
  [".perfect-shape-heading", "up"],
  [".ps-tabs", "up"],
  [".exclusive-deals-header", "up"],
  [".updatedbestseller-heading", "up"],
  [".updatedbestseller-tabs", "up"],
  [".brand-section-heading", "up"],
  [".brand-slider__title", "up"],
  [".tc-left", "up"],
  [".tc-container .tc-slide:first-child", "fade"],
  [".faq-card", "up"],
  [".latest-blog-header", "up"],
  [".before-after-heading", "up"],
  [".sectionTitle", "up"],
  [".home-section-title", "up"],
  [".catalog-hero-inner", "up"],
  /* section "stages" — each family enters from its own direction */
  [".bestseller-slider-wrapper", "scale"],
  [".perfect-shape-slider-wrapper", "scale"],
  [".exclusive-slider-wrapper", "right"],
  [".updatedbestseller-panel", "left"],
  [".brand-slider", "fade"],
  [".before-after-container", "wipe"],
  [".latest-blog-window", "right"],
  [".faq-image-box", "left"],
  /* grouped content */
  [".feature-card", "up", true],
  [".shop-category-card", "clip", true],
  [".footer-column", "up", true],
  [".footer-brand", "up"],
  [".pg-item", "up", true],
  [".all-products-empty", "up"],
  [".pc-header", "up"],
  [".pc-slide", "up", true],
  [".cart-page-title", "up"],
];

/* Never hide these: they must be instantly usable. */
const SKIP =
  "[data-lm-skip], .main-header, .announcement-bar, .hero-slider, .mobile-navigation, " +
  ".clp-cart-drawer, .clp-cart-overlay, .pf-drawer, .pf-overlay, .discount-overlay, " +
  ".discount-popup, .sd-menu, .mega-menu";

/* Parallax targets: full-bleed photography clipped by an overflow:hidden frame
   (never product shots or anything containing text). */
const PARALLAX = ".faq-image-box .faq-image";

const reducedQuery = "(prefers-reduced-motion: reduce)";

export default function MotionProvider() {
  const pathname = usePathname();
  const firstPath = useRef(true);
  const apiRef = useRef({ scan: () => {}, finishProgress: () => {} });

  /* ---------- one-time setup ---------- */
  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia(reducedQuery);

    let io = null;
    let mo = null;
    let rafScan = 0;
    let rafScroll = 0;
    let progressTimer = 0;
    const seen = new WeakSet();
    const parallaxEls = new Set();

    /* ---- header compaction (works even with reduced motion: it's static) ---- */
    const updateScrollState = () => {
      rafScroll = 0;
      const y = window.scrollY || window.pageYOffset || 0;
      const next = y > 12 ? "1" : "0";
      if (root.dataset.lmScrolled !== next) root.dataset.lmScrolled = next;
      if (!mq.matches) updateParallax();
    };
    const onScroll = () => {
      if (!rafScroll) rafScroll = requestAnimationFrame(updateScrollState);
    };

    function updateParallax() {
      if (!parallaxEls.size) return;
      const vh = window.innerHeight || 800;
      parallaxEls.forEach((el) => {
        const frame = el.parentElement;
        if (!frame) return;
        const r = frame.getBoundingClientRect();
        if (r.bottom < -80 || r.top > vh + 80) return;
        const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / vh));
        el.style.setProperty("--lm-py", `${(-p * r.height * 0.04).toFixed(1)}px`);
      });
    }

    /* ---- reveal observer ---- */
    const onIntersect = (entries) => {
      const hits = entries
        .filter((e) => e.isIntersecting)
        .sort(
          (a, b) =>
            a.boundingClientRect.top - b.boundingClientRect.top ||
            a.boundingClientRect.left - b.boundingClientRect.left
        );
      hits.forEach((entry, i) => {
        const el = entry.target;
        const wantsStagger = el.dataset.lmStagger === "1";
        el.style.setProperty("--lm-d", `${wantsStagger ? Math.min(i, 6) * 70 : 0}ms`);
        el.setAttribute("data-lm-in", "");
        io.unobserve(el);
      });
    };

    const scan = () => {
      rafScan = 0;
      if (!io || mq.matches) return;
      const vh = window.innerHeight || 800;

      for (const [selector, variant, stagger] of REVEALS) {
        document.querySelectorAll(selector).forEach((el) => {
          if (seen.has(el)) return;
          seen.add(el);
          if (el.closest(SKIP)) return;
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) return; /* display:none etc. */
          if (r.top < vh * 0.96) return; /* already on screen (or above): leave visible */
          el.setAttribute("data-lm-rv", variant);
          if (stagger) el.dataset.lmStagger = "1";
          io.observe(el);
        });
      }

      document.querySelectorAll(PARALLAX).forEach((el) => {
        if (el.hasAttribute("data-lm-parallax")) return;
        el.setAttribute("data-lm-parallax", "");
        parallaxEls.add(el);
      });
      updateParallax();
    };

    const queueScan = () => {
      if (!rafScan) rafScan = requestAnimationFrame(scan);
    };

    /* ---- route progress bar ---- */
    const bar = document.createElement("div");
    bar.className = "lm-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);

    const startProgress = () => {
      window.clearTimeout(progressTimer);
      bar.classList.remove("is-done");
      /* restart animation */
      bar.classList.remove("is-active");
      void bar.offsetWidth;
      bar.classList.add("is-active");
      progressTimer = window.setTimeout(finishProgress, 9000);
    };
    const finishProgress = () => {
      window.clearTimeout(progressTimer);
      if (!bar.classList.contains("is-active")) return;
      bar.classList.add("is-done");
      progressTimer = window.setTimeout(() => {
        bar.classList.remove("is-active", "is-done");
      }, 320);
    };

    const onClick = (e) => {
      if (mq.matches) return;
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest && e.target.closest("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      let url;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      startProgress();
    };

    apiRef.current = { scan: queueScan, finishProgress };

    const enable = () => {
      if (io) return;
      // root.classList.add("lm-motion");
      io = new IntersectionObserver(onIntersect, {
        rootMargin: "0px 0px -6% 0px",
        threshold: 0.06,
      });
      // mo = new MutationObserver(queueScan);
      // mo.observe(document.body, { childList: true, subtree: true });
      document.addEventListener("click", onClick, true);
      queueScan();
    };

    const disable = () => {
      root.classList.remove("lm-motion");
      document.removeEventListener("click", onClick, true);
      if (io) io.disconnect();
      if (mo) mo.disconnect();
      io = null;
      mo = null;
      /* reveal anything that was waiting */
      document.querySelectorAll("[data-lm-rv]:not([data-lm-in])").forEach((el) => el.setAttribute("data-lm-in", ""));
    };

    const onMotionPref = () => (mq.matches ? disable() : enable());

    updateScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    if (mq.addEventListener) mq.addEventListener("change", onMotionPref);
    if (!mq.matches) enable();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (mq.removeEventListener) mq.removeEventListener("change", onMotionPref);
      disable();
      cancelAnimationFrame(rafScan);
      cancelAnimationFrame(rafScroll);
      window.clearTimeout(progressTimer);
      bar.remove();
    };
  }, []);

  /* ---------- on every route change ---------- */
  useEffect(() => {
    apiRef.current.finishProgress();
    apiRef.current.scan();

    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    const mq = window.matchMedia(reducedQuery);
    if (mq.matches) return;

    const main = document.getElementById("main-content");
    if (main && typeof main.animate === "function") {
      /* opacity only: a transform here would re-parent position:fixed children mid-animation */
      main.animate([{ opacity: 0.25 }, { opacity: 1 }], {
        duration: 320,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      });
    }
  }, [pathname]);

  return null;
}
