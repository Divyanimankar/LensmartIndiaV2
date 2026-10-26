"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import "../styles/aboutUs.css";

/*
  Scroll-linked sliding doors (SIRF DESKTOP par):
  --p = 0 -> doors band (images beech mein, content chhupa)
  --p = 1 -> doors khule (images side mein, content dikhta hai)

  Mobile / tablet (<= 900px) par koi animation nahi hai:
  layout simple stack hai -> image, text, image.

  OPEN_AT  : section screen ke center ke itna paas ho to poora khula
  CLOSE_AT : section screen ke kinare tak pahunche to poora band
*/
const OPEN_AT = 0.35;
const CLOSE_AT = 0.8;
const MOBILE_MAX_WIDTH = 900;

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function AboutUs() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;

    if (!section || !stage) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let queued = false;
    let focused = false;
    let frame = 0;

    const update = () => {
      queued = false;

      // Mobile / tablet: animation nahi, sab kuch hamesha dikhta hai
      // Motion off: reduced-motion ya jab section ke andar keyboard focus ho
      if (
        window.innerWidth <= MOBILE_MAX_WIDTH ||
        reduceMotion.matches ||
        focused
      ) {
        section.style.setProperty("--p", "1");
        return;
      }

      const vh = window.innerHeight;
      const rect = stage.getBoundingClientRect();

      // 0 = screen ke center mein, 1 = bas screen se bahar
      const distance =
        Math.abs(rect.top + rect.height / 2 - vh / 2) /
        (vh / 2 + rect.height / 2);

      const progress = 1 - smooth(OPEN_AT, CLOSE_AT, distance);

      section.style.setProperty("--p", progress.toFixed(4));
    };

    const request = () => {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(update);
    };

    const onFocusIn = () => {
      focused = true;
      request();
    };

    const onFocusOut = () => {
      focused = false;
      request();
    };

    section.addEventListener("focusin", onFocusIn);
    section.addEventListener("focusout", onFocusOut);
    document.addEventListener("scroll", request, { passive: true, capture: true });
    window.addEventListener("resize", request);
    window.addEventListener("orientationchange", request);
    reduceMotion.addEventListener?.("change", request);

    update();

    return () => {
      cancelAnimationFrame(frame);
      section.removeEventListener("focusin", onFocusIn);
      section.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("scroll", request, true);
      window.removeEventListener("resize", request);
      window.removeEventListener("orientationchange", request);
      reduceMotion.removeEventListener?.("change", request);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="about-section"
      aria-labelledby="about-heading"
    >
      <div ref={stageRef} className="about-stage">

        {/* CENTER CONTENT (mobile par beech me) */}
        <div className="about-center-content">
          <p className="about-eyebrow">ABOUT US</p>

          <h2 id="about-heading" className="about-main-heading">
            CRAFTING BETTER VISION
            <br className="about-br" /> SINCE 2026
          </h2>

          <p className="about-paragraph">
            From precision-crafted lenses to fashion-forward frames,
            we&apos;re here to help you see better, feel confident,
            and express your individuality.
          </p>

          <Link href="/about-us" className="about-read-button">
            READ MORE
          </Link>
        </div>

        {/* LEFT DOOR (mobile par upar wali image) */}
        <div className="about-door about-door-left">
          <img
            src="/images/aboutright.png"
            alt="LensMartIndia sunglasses collection"
            className="about-image"
            loading="lazy"
          />
        </div>

        {/* RIGHT DOOR (mobile par neeche wali image) */}
        <div className="about-door about-door-right">
          <img
            src="/images/aboutleft.png"
            alt="LensMartIndia eyeglasses collection"
            className="about-image"
            loading="lazy"
          />
        </div>

      </div>
    </section>
  );
}
