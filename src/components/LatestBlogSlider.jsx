"use client";

import { useEffect, useRef, useState } from "react";
import { useAutoAdvance } from "@/lib/motion";
import Link from "next/link";
import "../styles/latestBlog.css";

const blogs = [
  {
    id: 1,
    image: "/images/blog1.png",
    category: "LENS CARE",
    date: "08 Sep 2026",
    title: "The Best Ways to Keep Your Contact Lenses Clean",
    description:
      "Simple everyday habits that help keep your contact lenses clean, comfortable, and safe to wear.",
    link: "/blog/contact-lens-care-guide",
  },

  {
    id: 2,
    image: "/images/blog2.png",
    category: "BUYING GUIDE",
    date: "05 Sep 2026",
    title: "How to Choose the Right Contact Lens Brand",
    description:
      "Learn what to consider when choosing the right contact lens brand for your vision and lifestyle.",
    link: "/blog/choose-contact-lens-brand",
  },

  {
    id: 3,
    image: "/images/blog3.png",
    category: "EYE HEALTH",
    date: "01 Sep 2026",
    title: "Common Contact Lens Mistakes You Should Avoid",
    description:
      "Avoid these common contact lens mistakes to improve everyday comfort and support healthy lens wear.",
    link: "/blog/contact-lens-mistakes",
  },

  {
    id: 4,
    image: "/images/blog4.png",
    category: "LENS GUIDE",
    date: "28 Aug 2026",
    title: "How Often Should You Replace Your Contact Lenses?",
    description:
      "Understand the difference between daily, weekly, and monthly replacement schedules.",
    link: "/blog/contact-lens-replacement-guide",
  },

  {
    id: 5,
    image: "/images/blog5.png",
    category: "DAILY LENSES",
    date: "24 Aug 2026",
    title: "Why Daily Disposable Lenses Are So Convenient",
    description:
      "Discover why daily disposable lenses are a popular choice for comfort, hygiene, and convenience.",
    link: "/blog/daily-disposable-lenses",
  },

  {
    id: 6,
    image: "/images/blog6.png",
    category: "TIPS",
    date: "20 Aug 2026",
    title: "Contact Lens Tips for First-Time Wearers",
    description:
      "A simple beginner-friendly guide to wearing, removing, and caring for your first contact lenses.",
    link: "/blog/contact-lens-tips-beginners",
  },
];

export default function LatestBlogSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef(null);
  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth <= 600) {
        setCardsPerView(1);
      } else if (window.innerWidth <= 950) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCardsPerView();

    window.addEventListener("resize", updateCardsPerView);

    return () => {
      window.removeEventListener("resize", updateCardsPerView);
    };
  }, []);

  const maxIndex = Math.max(0, blogs.length - cardsPerView);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [currentIndex, maxIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev >= maxIndex ? 0 : prev + 1
    );
  };

  const previousSlide = () => {
    setCurrentIndex((prev) =>
      prev <= 0 ? maxIndex : prev - 1
    );
  };

  useAutoAdvance(sectionRef, nextSlide);

  return (
    <section className="latest-blog-section" ref={sectionRef}>
      <div className="latest-blog-container">

        {/* ================= HEADER ================= */}

        <div className="latest-blog-header">

          <div className="latest-blog-heading-wrapper">
            <h2 className="latest-blog-title">
              Latest Blog Posts
            </h2>
          </div>

          <div className="latest-blog-header-right">
            <Link
              href="/blog"
              className="latest-blog-view-all"
            >
              View All Blogs

              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M5 12h13" />
                <path d="M14 7l5 5-5 5" />
              </svg>
            </Link>
          </div>

        </div>


        {/* ================= SLIDER ================= */}

        <div className="latest-blog-slider">

          <div className="latest-blog-window">

            <div
              className="latest-blog-track"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / cardsPerView)
                }%)`,
              }}
            >
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="latest-blog-card-wrapper"
                  style={{
                    flex: `0 0 ${100 / cardsPerView}%`,
                  }}
                >

                  <article className="latest-blog-card">

                    {/* IMAGE */}

                    <Link
                      href={blog.link}
                      className="latest-blog-image"
                    >
                      <img
                        src={blog.image}
                        alt={blog.title}
                      />

                      <span className="latest-blog-category">
                        {blog.category}
                      </span>
                    </Link>


                    {/* CONTENT */}

                    <div className="latest-blog-content">

                      <span className="latest-blog-date">
                        {blog.date}
                      </span>

                      <h3>
                        <Link href={blog.link}>
                          {blog.title}
                        </Link>
                      </h3>

                      <p>
                        {blog.description}
                      </p>


                      {/* READ ARTICLE */}

                      <Link
                        href={blog.link}
                        className="latest-blog-read-more"
                      >
                        <span className="latest-blog-read-text">
                          Read Article
                        </span>

                        <span className="latest-blog-read-icon">

                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path d="M7 12h9" />
                            <path d="M13 8l4 4-4 4" />
                          </svg>

                        </span>
                      </Link>

                    </div>

                  </article>

                </div>
              ))}
            </div>

          </div>


          {/* ================= LEFT ARROW ================= */}

          <button
            type="button"
            className="latest-blog-nav latest-blog-prev"
            onClick={previousSlide}
            aria-label="Previous blog posts"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>


          {/* ================= RIGHT ARROW ================= */}

          <button
            type="button"
            className="latest-blog-nav latest-blog-next"
            onClick={nextSlide}
            aria-label="Next blog posts"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>

        </div>


        {/* ================= DOTS ================= */}

        <div className="latest-blog-dots">

          {Array.from({
            length: maxIndex + 1,
          }).map((_, index) => (
            <button
              key={index}
              type="button"
              className={`latest-blog-dot ${
                currentIndex === index ? "active" : ""
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to blog group ${index + 1}`}
            />
          ))}

        </div>

      </div>
    </section>
  );
}