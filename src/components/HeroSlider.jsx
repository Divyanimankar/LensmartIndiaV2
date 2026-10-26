"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import "../styles/heroSlider.css";

/*
  Hero slides.
  The wording below is the approved copy from the original banner artwork
  (headline, supporting line and button label), now set as live text so it can
  be animated, selected and read by assistive tech. Links are unchanged.
  Imagery: the original campaign photography (cropped from the same files) plus
  real catalogue product cutouts that already ship in /public/images.
*/
const slides = [
  {
    id: 1,
    tone: "sun",
    eyebrow: "Buy sunglasses,",
    title: "See a brighter tomorrow",
    body: "Stylish. Protective. Made for Every You. Explore our latest collection of premium sunglasses.",
    cta: "Shop sunglasses",
    link: "/sunglasses",
    alt: "Buy sunglasses, see a brighter tomorrow. Shop sunglasses",
    photo: "/images/hero-sun-photo.webp",
    photoLq: "/images/hero-sun-photo-lq.webp",
    cutout: "/images/hero-cut-sun.webp",
  },
  {
    id: 2,
    tone: "eye",
    eyebrow: "Eyeglasses collection",
    title: "Your world, clear and refined.",
    body: "Precise optics and contemporary design for every facet of life.",
    cta: "Shop eyeglasses",
    link: "/eyeglasses",
    alt: "See the real you. Shop eyeglasses",
    photo: "/images/hero-eye-photo.webp",
    photoLq: "/images/hero-eye-photo-lq.webp",
    cutout: "/images/hero-cut-eye.webp",
  },
  {
    id: 3,
    tone: "lens",
    eyebrow: "",
    title: "Find your contact lenses",
    body: "From the world's most trusted brands.",
    brands: "/images/hero-lens-brands.webp",
    brandsAlt: "Alcon, Johnson & Johnson, CooperVision, Bausch + Lomb",
    cta: "Shop contact lenses",
    link: "/contact-lenses",
    alt: "Premium contact lenses from the world's most trusted brands. Shop contact lenses",
    photo: "/images/hero-lens-photo.webp",
    photoLq: "/images/hero-lens-photo-lq.webp",
  },
];

const AUTO_PLAY_DELAY = 3000;
const SWIPE_THRESHOLD = 50;
const COUNT = slides.length;

/* Splits a line into masked words so each can rise on its own. */
function Words({ text, start = 0 }) {
  return text.split(" ").map((word, i) => (
    <span className="hero-w" key={`${word}-${i}`}>
      <span className="hero-wi" style={{ "--i": start + i }}>
        {word}
        {i < text.split(" ").length - 1 ? " " : ""}
      </span>
    </span>
  ));
}

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [dir, setDir] = useState(1);

  const touchRef = useRef({ x: 0, y: 0 });
  const sectionRef = useRef(null);
  const rafRef = useRef(0);

  /* reduced motion: autoplay off, no pointer/scroll depth */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (e) => setReduceMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const goTo = useCallback(
    (index) => {
      const target = ((index % COUNT) + COUNT) % COUNT;
      setDir(target >= active ? 1 : -1);
      setActive(target);
    },
    [active]
  );
  const next = useCallback(() => {
    setDir(1);
    setActive((i) => (i + 1) % COUNT);
  }, []);
  const prev = useCallback(() => {
    setDir(-1);
    setActive((i) => (i - 1 + COUNT) % COUNT);
  }, []);

  useEffect(() => {
    if (isPaused || userPaused || reduceMotion) return;
    const timer = setTimeout(next, AUTO_PLAY_DELAY);
    return () => clearTimeout(timer);
  }, [active, isPaused, userPaused, reduceMotion, next]);

  /* ---------- depth: pointer + scroll, written as CSS variables ----------
     Only transforms read these variables. Updates are batched in rAF, the
     scroll listener only runs while the hero is on screen, and nothing runs
     for reduced-motion users or touch-only devices (for pointer). */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reduceMotion) return;

    let visible = true;
    const set = (k, v) => el.style.setProperty(k, v);

    const onScroll = () => {
      if (!visible || rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const h = el.offsetHeight || 1;
        const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / h));
        set("--sy", p.toFixed(3));
      });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) onScroll();
      },
      { threshold: 0 }
    );
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    let pRaf = 0;
    const onMove = (e) => {
      if (pRaf) return;
      const { clientX, clientY } = e;
      pRaf = requestAnimationFrame(() => {
        pRaf = 0;
        const r = el.getBoundingClientRect();
        set("--px", (((clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        set("--py", (((clientY - r.top) / r.height) * 2 - 1).toFixed(3));
      });
    };
    const onLeave = () => {
      set("--px", "0");
      set("--py", "0");
    };
    if (fine.matches) {
      el.addEventListener("pointermove", onMove, { passive: true });
      el.addEventListener("pointerleave", onLeave);
    }

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(pRaf);
      rafRef.current = 0;
    };
  }, [reduceMotion]);

  /* swipe */
  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
    setIsPaused(true);
  };
  const handleTouchEnd = (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? next() : prev();
    }
    setIsPaused(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  const staticProgress = isPaused || userPaused || reduceMotion;

  return (
    <section
      ref={sectionRef}
      className="hero-slider"
      aria-roledescription="carousel"
      aria-label="Featured offers"
      onKeyDown={handleKeyDown}
      style={{ "--hero-delay": `${AUTO_PLAY_DELAY}ms`, "--dir": dir }}
    >
      <div
        className="hero-slider-stage"
        aria-live={staticProgress ? "polite" : "off"}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => setIsPaused(false)}
      >
        {slides.map((slide, index) => {
          const isActive = index === active;
          const priority = index === 0;
          const titleWords = slide.title.split(" ").length;

          return (
            <article
              key={slide.id}
              className={`hero-slide ${isActive ? "is-active" : ""}`}
              data-tone={slide.tone}
              inert={!isActive}
              aria-hidden={!isActive}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${COUNT}`}
            >
              {/* ---- background atmosphere ---- */}
              <div className="hero-bg" aria-hidden="true">
                <span className="hero-depth hero-depth--far">
                  <span className="hero-rings">
                    <i />
                    <i />
                    <i />
                  </span>
                </span>
              </div>

              {/* ---- copy (live text) ---- */}
              <div className="hero-copy">
                {slide.eyebrow && (
                  <p className="hero-eyebrow">
                    <span className="hero-eyebrow-i">{slide.eyebrow}</span>
                  </p>
                )}
                <h1 className="hero-title" aria-label={slide.title}>
                  <span aria-hidden="true">
                    <Words text={slide.title} start={1} />
                  </span>
                </h1>
                <p className="hero-body" style={{ "--i": titleWords + 2 }}>
                  {slide.body}
                </p>
                {slide.brands && (
                  <img
                    className="hero-brands"
                    src={slide.brands}
                    alt={slide.brandsAlt}
                    width="1009"
                    height="89"
                    loading={priority ? "eager" : "lazy"}
                    decoding="async"
                    draggable="false"
                  />
                )}
                <Link
                  href={slide.link}
                  className="hero-button"
                  style={{ "--i": titleWords + 3 }}
                  draggable="false"
                >
                  <span className="hero-button-label">{slide.cta}</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="hero-button-arrow">
                    <path d="M4 12h15M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>

              {/* ---- visual composition ---- */}
              <div className="hero-visual" aria-hidden="true">
                <span className="hero-depth hero-depth--mid">
                  <span className="hero-frame">
                    <img
                      className="hero-photo"
                      src={slide.photo}
                      alt=""
                      loading={priority ? "eager" : "lazy"}
                      fetchPriority={priority ? "high" : "auto"}
                      decoding="async"
                      draggable="false"
                    />
                    {/* tiny blurred twin fades away: a focus-pull, opacity only */}
                    <img className="hero-focus" src={slide.photoLq} alt="" draggable="false" />
                    <span className="hero-glint" />
                  </span>
                  <span className="hero-rim" />
                </span>
                {slide.cutout && (
                  <span className="hero-depth hero-depth--near">
                    <img
                      className="hero-cutout"
                      src={slide.cutout}
                      alt=""
                      loading={priority ? "eager" : "lazy"}
                      decoding="async"
                      draggable="false"
                    />
                  </span>
                )}
              </div>
            </article>
          );
        })}

        {/* <button type="button" className="hero-arrow hero-prev" onClick={prev} aria-label="Previous slide">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button type="button" className="hero-arrow hero-next" onClick={next} aria-label="Next slide">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button> */}


<button
  type="button"
  className="hero-arrow hero-prev"
  onClick={prev}
  aria-label="Previous slide"
>
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M15 5l-7 7 7 7" />
  </svg>
</button>

<button
  type="button"
  className="hero-arrow hero-next"
  onClick={next}
  aria-label="Next slide"
>
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 5l7 7-7 7" />
  </svg>
</button>
        <div className="hero-dots" role="tablist" aria-label="Choose slide">
          {slides.map((slide, index) => {
            const isActive = active === index;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`hero-dot ${isActive ? "active" : ""} ${isActive && staticProgress ? "is-static" : ""}`}
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              >
                {isActive && (
                  <span
                    key={`${active}-${staticProgress}`}
                    className="hero-dot-fill"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>

        {!reduceMotion && (
          <button
            type="button"
            className="hero-pause"
            onClick={() => setUserPaused((v) => !v)}
            aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
          >
            {userPaused ? (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>
            )}
          </button>
        )}

        <div className="hero-counter" aria-hidden="true">
          <span>{String(active + 1).padStart(2, "0")}</span>
          <i />
          <span>{String(COUNT).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}
