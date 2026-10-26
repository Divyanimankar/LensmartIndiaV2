"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAutoAdvance } from "@/lib/motion";
import "../styles/testimonial.css";


const testimonials = [
  {
    text: "The delivery is fast, next-day in Mumbai. The prescription verification was completely online and verified by their optometrists in 10 mins. Exceptional service!",
    name: "Rohan Malhotra",
    role: "Contact lens customer, Mumbai",
  },
  {
    text: "The frame fit perfectly even though I ordered online. The lenses are crisp, and the anti-glare coating really helps during long hours on the laptop.",
    name: "Sneha Kulkarni",
    role: "Eyeglasses customer, Pune",
  },
  {
    text: "These polarised sunglasses cut the glare on my daily highway commute. They feel light, look sharp, and arrived in a sturdy case.",
    name: "Arjun Mehta",
    role: "Sunglasses customer, Bengaluru",
  },
  {
    text: "I had a very smooth shopping experience. The lenses were genuine, well packed, and delivered quickly. I will definitely order again.",
    name: "Priya Sharma",
    role: "Contact lens customer, Delhi",
  },
  {
    text: "They checked my prescription details carefully and confirmed with me before making the lenses. The final pair matched exactly what I needed.",
    name: "Neha Iyer",
    role: "Eyeglasses customer, Chennai",
  },
  {
    text: "Great range of styles at fair prices. I picked aviators, and the UV protection and build quality feel premium for what I paid.",
    name: "Karan Singh",
    role: "Sunglasses customer, Jaipur",
  },
  {
    text: "The website was easy to use and I found my preferred contact lenses at a good price. Customer support was also very helpful.",
    name: "Amit Verma",
    role: "Contact lens customer, Hyderabad",
  },
  {
    text: "I ordered progressive lenses for my father. The team explained every option patiently, and he got used to them within a few days.",
    name: "Vikram Nair",
    role: "Eyeglasses customer, Kochi",
  },
  {
    text: "Monthly lenses here cost less than my local store, and they arrived sealed with a fresh expiry date. Reordering takes two minutes.",
    name: "Ananya Desai",
    role: "Contact lens customer, Ahmedabad",
  },
  {
    text: "I bought a pair as a gift and the packaging was lovely. My brother has not taken them off since, and he keeps getting compliments.",
    name: "Meera Joshi",
    role: "Sunglasses customer, Nagpur",
  },
];

const total = testimonials.length;

const initials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

export default function TestimonialCommunity() {
  const [current, setCurrent] = useState(0);

  const slideRefs = useRef([]);
  const currentRef = useRef(0);
  const busy = useRef(false);
  const dragStartX = useRef(null);
  const sectionRef = useRef(null);

  const reduced = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const goTo = (next, direction) => {
    const target = ((next % total) + total) % total;
    if (busy.current || target === currentRef.current) return;

    const dir = direction ?? (target > currentRef.current ? 1 : -1);

    const fromEl = slideRefs.current[currentRef.current];
    const toEl = slideRefs.current[target];

    busy.current = true;
    currentRef.current = target;
    setCurrent(target);

    if (reduced()) {
      gsap.set(fromEl, { autoAlpha: 0 });
      gsap.set(toEl, { autoAlpha: 1 });
      busy.current = false;
      return;
    }

    const fromWords = fromEl.querySelectorAll(".tc-word");
    const fromRest = fromEl.querySelectorAll(".tc-quote-mark, .tc-author");
    const toWords = toEl.querySelectorAll(".tc-word");
    const toMark = toEl.querySelector(".tc-quote-mark");
    const toAuthor = toEl.querySelector(".tc-author");

    gsap
      .timeline({ onComplete: () => (busy.current = false) })
      // old review: words slip out through their masks
      .to(fromWords, {
        yPercent: -110 * dir,
        duration: 0.35,
        ease: "power2.in",
      })
      .to(
        fromRest,
        { opacity: 0, duration: 0.3, ease: "power1.in" },
        0
      )
      .set(fromEl, { autoAlpha: 0 })
      .set(fromWords, { yPercent: 0 })
      .set(fromRest, { opacity: 1 })
      .set(toEl, { autoAlpha: 1 })
      // new review: words rise in
      .fromTo(
        toWords,
        { yPercent: 110 * dir },
        { yPercent: 0, duration: 0.7, stagger: 0.01, ease: "power3.out" }
      )
      .fromTo(
        toMark,
        {
          opacity: 0,
          scale: 0.5,
          rotation: -12 * dir,
          transformOrigin: "left bottom",
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.6,
          ease: "back.out(2)",
        },
        "<"
      )
      .fromTo(
        toAuthor,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "<0.25"
      );
  };

  useEffect(() => {
    slideRefs.current.forEach((el, i) => {
      if (el) gsap.set(el, { autoAlpha: i === 0 ? 1 : 0 });
    });

    return () => {
      gsap.killTweensOf(slideRefs.current);
      slideRefs.current.forEach((el) => {
        if (el) gsap.killTweensOf(el.querySelectorAll("*"));
      });
    };
  }, []);

  // Quotes are text people need to read, so this one waits 5 s (the other
  // carousels use 3 s). Pauses on hover / focus / touch like the rest.
  useAutoAdvance(sectionRef, () => goTo(currentRef.current + 1, 1), {
    delay: 5000,
  });

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") goTo(currentRef.current - 1, -1);
    if (e.key === "ArrowRight") goTo(currentRef.current + 1, 1);
  };

  const handlePointerDown = (e) => {
    dragStartX.current = e.clientX;
  };

  const handlePointerUp = (e) => {
    if (dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(dx) > 50) {
      const dir = dx < 0 ? 1 : -1;
      goTo(currentRef.current + dir, dir);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="tc-section"
      onKeyDown={handleKeyDown}
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
    >
      <div className="tc-container">
        {/* LEFT: heading + arrows */}
        <div className="tc-left">
          <div className="tc-head">
            <h2 className="tc-title">
              Loved by our <strong>customers.</strong>
            </h2>
            <p className="tc-sub">
              Here&apos;s what people had to say about our eyeglasses,
              sunglasses and contact lenses.
            </p>
          </div>

          <div className="tc-arrows">
            <button
              type="button"
              className="tc-arrow"
              onClick={() => goTo(currentRef.current - 1, -1)}
              aria-label="Previous testimonial"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
            </button>

            <button
              type="button"
              className="tc-arrow"
              onClick={() => goTo(currentRef.current + 1, 1)}
              aria-label="Next testimonial"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* RIGHT: quotes */}
        <div
          className="tc-track"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          {testimonials.map((item, i) => (
            <figure
              key={item.name}
              className="tc-slide"
              ref={(el) => (slideRefs.current[i] = el)}
              aria-hidden={i !== current}
            >
              <span className="tc-quote-mark" aria-hidden="true">
                &ldquo;
              </span>

              <blockquote className="tc-quote">
                {`${item.text}\u201D`.split(" ").map((word, w) => (
                  <span key={w}>
                    <span className="tc-word-mask">
                      <span className="tc-word">{word}</span>
                    </span>{" "}
                  </span>
                ))}
              </blockquote>

              <figcaption className="tc-author">
                <span className="tc-avatar" aria-hidden="true">
                  {initials(item.name)}
                </span>
                <span className="tc-author-info">
                  <span className="tc-name">{item.name}</span>
                  <span className="tc-role">{item.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <p className="tc-live" aria-live="polite">
        Testimonial {current + 1} of {total}
      </p>
    </section>
  );
}