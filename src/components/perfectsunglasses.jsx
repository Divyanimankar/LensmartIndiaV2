"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import "../styles/perfectsunglasses.css";

const shapes = [
  {
    id: 1,
    name: "RECTANGLE",
    image: "/images/sunRectangle.png",
    link: "/sunglasses/rectangle",
  },
  {
    id: 2,
    name: "CAT EYE",
    image: "/images/sunCatEye.png",
    link: "/sunglasses/cat-eye",
  },
  {
    id: 3,
    name: "AVIATOR",
    image: "/images/sunAviator.png",
    link: "/sunglasses/aviator",
  },
  {
    id: 4,
    name: "GEOMETRIC",
    image: "/images/sunGeometric.png",
    link: "/sunglasses/geometric",
  },
  {
    id: 5,
    name: "ROUND",
    image: "/images/sunRound.png",
    link: "/sunglasses/round",
  },
  {
    id: 6,
    name: "CLUBMASTER",
    image: "/images/sunClubmaster.png",
    link: "/sunglasses/clubmaster",
  },
  {
    id: 7,
    name: "OVAL",
    image: "/images/sunOval.png",
    link: "/sunglasses/oval",
  },
  {
    id: 8,
    name: "SQUARE",
    image: "/images/sunSquare.png",
    link: "/sunglasses/square",
  },
  {
    id: 9,
    name: "WAYFARER",
    image: "/images/sunWayfarer.png",
    link: "/sunglasses/wayfarer",
  },
  {
    id: 10,
    name: "RIMLESS",
    image: "/images/sunRimless.png",
    link: "/sunglasses/rimless",
  },
];

const DOT_COUNT = 5;
const AUTO_PLAY_DELAY = 3000;

export default function PerfectShape() {
  const sliderRef = useRef(null);
  const scrollTimerRef = useRef(null);
  const activeIndexRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  /*
    3 copies:

    1...10 | 1...10 | 1...10

    Slider starts from middle copy.

    Isliye:
    9 -> 10 -> 1 -> 2

    continuous dikhega.
  */
  const sliderShapes = [
    ...shapes,
    ...shapes,
    ...shapes,
  ];

  /* ==========================================
     GET ONE ITEM STEP
  ========================================== */

  const getItemStep = useCallback(() => {
    const slider = sliderRef.current;

    if (!slider) return 0;

    const firstItem = slider.querySelector(".shape-item");

    if (!firstItem) return 0;

    const itemWidth =
      firstItem.getBoundingClientRect().width;

    const sliderStyle =
      window.getComputedStyle(slider);

    const gap =
      parseFloat(
        sliderStyle.columnGap ||
        sliderStyle.gap ||
        "0"
      ) || 0;

    return itemWidth + gap;
  }, []);

  /* ==========================================
     SILENT JUMP
     NO REVERSE ANIMATION
  ========================================== */

  const silentJump = useCallback((left) => {
    const slider = sliderRef.current;

    if (!slider) return;

    const oldBehavior = slider.style.scrollBehavior;
    const oldSnap = slider.style.scrollSnapType;

    slider.style.scrollBehavior = "auto";
    slider.style.scrollSnapType = "none";

    slider.scrollLeft = left;

    // Force browser to apply position immediately
    slider.getBoundingClientRect();

    slider.style.scrollBehavior = oldBehavior;
    slider.style.scrollSnapType = oldSnap;
  }, []);

  /* ==========================================
     MOVE TO MIDDLE COPY
  ========================================== */

  const moveToMiddle = useCallback(
    (realIndex = 0) => {
      const slider = sliderRef.current;

      if (!slider) return;

      const step = getItemStep();

      if (!step) return;

      const middleIndex =
        shapes.length + realIndex;

      silentJump(middleIndex * step);
    },
    [getItemStep, silentJump]
  );

  /* ==========================================
     INITIAL POSITION
  ========================================== */

  useEffect(() => {
    const timer = setTimeout(() => {
      moveToMiddle(0);
    }, 100);

    return () => clearTimeout(timer);
  }, [moveToMiddle]);

  /* ==========================================
     UPDATE ACTIVE INDEX
  ========================================== */

  const updateActiveIndex = useCallback(
    (index) => {
      const normalized =
        ((index % shapes.length) + shapes.length) %
        shapes.length;

      activeIndexRef.current = normalized;
      setActiveIndex(normalized);
    },
    []
  );

  /* ==========================================
     CHECK INFINITE LOOP
  ========================================== */

  const checkInfiniteLoop = useCallback(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    const step = getItemStep();

    if (!step) return;

    const total = shapes.length;

    const absoluteIndex = Math.round(
      slider.scrollLeft / step
    );

    const realIndex =
      ((absoluteIndex % total) + total) % total;

    /*
      First copy me pahunch gaye:
      same item ko middle copy me silently move karo.
    */
    if (absoluteIndex < total) {
      silentJump(
        (total + realIndex) * step
      );
      return;
    }

    /*
      Third copy me pahunch gaye:
      same item ko middle copy me silently move karo.
    */
    if (absoluteIndex >= total * 2) {
      silentJump(
        (total + realIndex) * step
      );
    }
  }, [getItemStep, silentJump]);

  /* ==========================================
     SCROLL HANDLER
  ========================================== */

  const handleScroll = useCallback(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    const step = getItemStep();

    if (!step) return;

    const absoluteIndex = Math.round(
      slider.scrollLeft / step
    );

    const realIndex =
      ((absoluteIndex % shapes.length) +
        shapes.length) %
      shapes.length;

    updateActiveIndex(realIndex);

    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }

    scrollTimerRef.current = setTimeout(() => {
      checkInfiniteLoop();
    }, 250);
  }, [
    getItemStep,
    updateActiveIndex,
    checkInfiniteLoop,
  ]);

  /* ==========================================
     NEXT
     ONE ITEM AT A TIME
  ========================================== */

  const handleNext = useCallback(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    const step = getItemStep();

    if (!step) return;

    slider.scrollBy({
      left: step,
      behavior: "smooth",
    });
  }, [getItemStep]);

  /* ==========================================
     PREVIOUS
     ONE ITEM AT A TIME
  ========================================== */

  const handlePrevious = useCallback(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    const step = getItemStep();

    if (!step) return;

    slider.scrollBy({
      left: -step,
      behavior: "smooth",
    });
  }, [getItemStep]);

  /* ==========================================
     AUTO PLAY
  ========================================== */

  useEffect(() => {
    if (isPaused) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = setInterval(() => {
      handleNext();
    }, AUTO_PLAY_DELAY);

    return () => clearInterval(interval);
  }, [isPaused, handleNext]);

  /* ==========================================
     RESIZE
  ========================================== */

  useEffect(() => {
    const handleResize = () => {
      moveToMiddle(activeIndexRef.current);
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [moveToMiddle]);

  /* ==========================================
     DOT CLICK
  ========================================== */

  const goToDot = useCallback(
    (dotIndex) => {
      const slider = sliderRef.current;

      if (!slider) return;

      const step = getItemStep();

      if (!step) return;

      /*
        5 dots for 10 products:

        Dot 1 -> item 1
        Dot 2 -> item 3
        Dot 3 -> item 5
        Dot 4 -> item 7
        Dot 5 -> item 9
      */

      const targetRealIndex =
        dotIndex * 2;

      const targetAbsoluteIndex =
        shapes.length + targetRealIndex;

      slider.scrollTo({
        left: targetAbsoluteIndex * step,
        behavior: "smooth",
      });
    },
    [getItemStep]
  );

  /* ==========================================
     ACTIVE DOT
  ========================================== */

  const activeDot = Math.min(
    DOT_COUNT - 1,
    Math.floor(activeIndex / 2)
  );

  /* ==========================================
     CLEANUP
  ========================================== */

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  return (
    <section className="perfect-shape-section">
      <div className="perfect-shape-container">

        {/* HEADING */}

        <h2 className="perfect-shape-heading">
          PERFECT SHAPE -{" "}
          <span>SUNGLASSES</span>
        </h2>


        {/* SLIDER */}

        <div
          className="perfect-shape-slider-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onTouchCancel={() => setIsPaused(false)}
        >

          {/* PREVIOUS */}

          <button
            type="button"
            className="shape-arrow shape-prev"
            onClick={handlePrevious}
            aria-label="Previous sunglasses shape"
          >
            ‹
          </button>


          {/* ITEMS */}

          <div
            ref={sliderRef}
            className="perfect-shape-slider"
            onScroll={handleScroll}
          >
            {sliderShapes.map(
              (shape, index) => (
                <Link
                  key={`${shape.id}-${index}`}
                  href={shape.link}
                  className="shape-item"
                  aria-label={`Shop ${shape.name} sunglasses`}
                >
                  <div className="shape-image-circle">
                    <img
                      src={shape.image}
                      alt={`${shape.name} sunglasses`}
                      className="shape-image"
                      loading="lazy"
                      draggable="false"
                    />
                  </div>

                  <h3 className="shape-name">
                    {shape.name}
                  </h3>
                </Link>
              )
            )}
          </div>


          {/* NEXT */}

          <button
            type="button"
            className="shape-arrow shape-next"
            onClick={handleNext}
            aria-label="Next sunglasses shape"
          >
            ›
          </button>

        </div>


        {/* EXACTLY 5 DOTS */}

        <div className="perfect-shape-dots">
          {Array.from({
            length: DOT_COUNT,
          }).map((_, index) => (
            <button
              key={index}
              type="button"
              className={`perfect-shape-dot ${
                activeDot === index
                  ? "active"
                  : ""
              }`}
              onClick={() => goToDot(index)}
              aria-label={`Go to sunglasses group ${
                index + 1
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}