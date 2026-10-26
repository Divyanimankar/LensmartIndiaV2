"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "../styles/scrollToTop.css";

export default function ScrollToTop() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const scrollerRef = useRef(null); // agar page kisi wrapper div ke andar scroll hota ho

  useEffect(() => {
    setMounted(true);

    const getPageY = () =>
      Math.max(
        window.scrollY || 0,
        window.pageYOffset || 0,
        document.documentElement.scrollTop || 0,
        document.body.scrollTop || 0
      );

    const onScroll = (e) => {
      const t = e && e.target;
      const isInnerElement =
        t &&
        t.nodeType === 1 &&
        t !== document.documentElement &&
        t !== document.body;

      if (isInnerElement) {
        // koi wrapper/div scroll ho raha hai (jaise main, #__next, custom container)
        if (t.scrollTop > 0) scrollerRef.current = t;
        if (t === scrollerRef.current) setVisible(t.scrollTop > 200);
        return; // horizontal sliders/carousels ko ignore karte hain
      }

      setVisible(getPageY() > 200);
    };

    onScroll();
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll);

    return () => {
      document.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrollToTop = () => {
    const opts = { top: 0, behavior: "smooth" };
    window.scrollTo(opts);
    document.documentElement.scrollTo?.(opts);
    document.body.scrollTo?.(opts);
    scrollerRef.current?.scrollTo?.(opts);
  };

  if (!mounted) return null;

  return createPortal(
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      tabIndex={visible ? 0 : -1}
      className={`scrollTopBtn${visible ? " isVisible" : ""}`}
    >
      <svg
        className="scrollTopIcon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 15l6-6 6 6" />
      </svg>
    </button>,
    document.body
  );
}
