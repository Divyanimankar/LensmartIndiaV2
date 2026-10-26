"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import "../../styles/faqFooter.css";

const faqCategories = [
  {
    id: "eyeglasses",
    icon: "◉",
    title: "Eyeglasses",
    description: "Frames, lenses, fit and care.",
    questions: [
      {
        question: "How do I choose the right eyeglasses?",
        answer:
          "Choose a frame that fits comfortably and suits your face shape. Check the frame width, bridge fit and temple length. For prescription lenses, confirm your current prescription and available lens options.",
      },
      {
        question: "Can I order eyeglasses with my prescription?",
        answer:
          "Prescription options depend on the selected product. Check its product details for available lens powers and follow the prescription instructions provided on the website.",
      },
      {
        question: "How do I find the right frame size?",
        answer:
          "Compare the frame measurements with a pair you already wear comfortably. Check the frame width, bridge size and temple length listed on the product page.",
      },
      {
        question: "How should I clean my eyeglasses?",
        answer:
          "Rinse the lenses with clean water, use a suitable lens-cleaning solution and wipe them with a clean microfiber cloth. Avoid tissues and harsh household cleaners.",
      },
    ],
  },
  {
    id: "sunglasses",
    icon: "☼",
    title: "Sunglasses",
    description: "Style, UV protection and comfort.",
    questions: [
      {
        question: "How do I choose sunglasses for everyday use?",
        answer:
          "Choose a comfortable frame that fits securely and check the product specifications for UV protection and other lens features.",
      },
      {
        question: "What does UV protection mean?",
        answer:
          "UV protection helps shield your eyes from ultraviolet rays. Check the product specifications to confirm the level of protection offered.",
      },
      {
        question: "How do I choose sunglasses for my face shape?",
        answer:
          "Consider your face shape, frame width and personal style. Your sunglasses should sit comfortably on your nose and ears without pinching or slipping.",
      },
      {
        question: "Can I wear sunglasses every day?",
        answer:
          "Yes, sunglasses with suitable UV protection can be worn outdoors during everyday activities. Follow the product guidance for the intended use.",
      },
    ],
  },
  {
    id: "contact-lenses",
    icon: "◎",
    title: "Contact Lenses",
    description: "Comfort, prescriptions and lens care.",
    questions: [
      {
        question: "How do I choose the right contact lenses?",
        answer:
          "Choose lenses based on a prescription and fitting recommended by an eye-care professional. Base curve, diameter, material and replacement schedule can affect fit and comfort.",
      },
      {
        question: "Can I sleep while wearing contact lenses?",
        answer:
          "Do not sleep in contact lenses unless your eye-care professional has specifically approved that lens and wearing schedule. Sleeping in lenses can increase the risk of eye complications.",
      },
      {
        question: "How should I care for contact lenses?",
        answer:
          "Wash and dry your hands before handling lenses. Follow the manufacturer's instructions, use the recommended solution and never use tap water to clean or store contact lenses.",
      },
      {
        question: "Can I use my spectacle prescription for contact lenses?",
        answer:
          "A spectacle prescription is not always the same as a contact lens prescription. Get a contact lens fitting and prescription from an eye-care professional before ordering.",
      },
    ],
  },
  {
    id: "orders-delivery",
    icon: "↗",
    title: "Orders & Delivery",
    description: "Payments, shipping and order support.",
    questions: [
      {
        question: "How can I check my order status?",
        answer:
          "Use the order tracking option on the website or check your order confirmation and shipping messages. Contact customer support if you need help.",
      },
      {
        question: "What payment methods are available?",
        answer:
          "Available payment methods are displayed during checkout. Review the options shown before confirming your order.",
      },
      {
        question: "How can I request a return or refund?",
        answer:
          "Review the website's return and refund policy for eligibility and timelines. Contact support with your order details if you need help.",
      },
      {
        question: "What should I do if my order arrives damaged?",
        answer:
          "Keep the product and packaging, take clear photos of the issue and contact customer support with your order details.",
      },
    ],
  },
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openQuestions, setOpenQuestions] = useState({});

  // Search questions, answers and category names.
  const filteredCategories = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return faqCategories
      .filter(
        (category) =>
          activeCategory === "all" || category.id === activeCategory
      )
      .map((category) => {
        const categoryMatches =
          query && category.title.toLowerCase().includes(query);

        const questions = category.questions.filter((item) => {
          if (!query || categoryMatches) return true;

          return (
            item.question.toLowerCase().includes(query) ||
            item.answer.toLowerCase().includes(query)
          );
        });

        return { ...category, questions };
      })
      .filter((category) => category.questions.length > 0);
  }, [searchTerm, activeCategory]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setActiveCategory("all");
  };

  const clearSearch = () => {
    setSearchTerm("");
    setActiveCategory("all");
  };

  const scrollToCategory = (categoryId) => {
    // Reset filters so the requested section is rendered.
    setSearchTerm("");
    setActiveCategory("all");

    // Wait for React to render all categories before scrolling.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const section = document.getElementById(
          `faqPageCategory-${categoryId}`
        );

        section?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  };

  const toggleQuestion = (questionId) => {
    setOpenQuestions((previous) => ({
      ...previous,
      [questionId]: !previous[questionId],
    }));
  };

  return (
    <div className="faqPage">
      {/* HERO */}
      <section className="faqPageHero">
        <div className="faqPageHeroInner">
          <div className="faqPageHeroContent">
            <span className="faqPageEyebrow">
              HERE TO HELP YOU SEE CLEARLY
            </span>

            <h1>
              Good vision starts
              <br />
              with <span>good answers.</span>
            </h1>

            <p className="faqPageHeroDescription">
              Find answers about eyeglasses, sunglasses, contact lenses,
              orders and everything in between.
            </p>

            {/* <div className="faqPageSearch">
              <span className="faqPageSearchIcon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="10.8" cy="10.8" r="6.8" />
                  <path d="m16 16 4.2 4.2" />
                </svg>
              </span>

              <input
                type="search"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search your question..."
                aria-label="Search FAQs"
              />

              {searchTerm && (
                <button
                  type="button"
                  className="faqPageClearSearch"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <p className="faqPageSearchHint">
              Try: delivery, prescription, sunglasses or lens care.
            </p> */}
          </div>

          {/* RIGHT-SIDE QUICK LINKS */}
          <div className="faqPageHeroPanel">
            <div className="faqPagePanelTop">
              <div>
                <span className="faqPagePanelEyebrow">QUICK HELP</span>
                <h2>What can we help you with?</h2>
              </div>
              <span className="faqPagePanelBadge">?</span>
            </div>

            <p className="faqPagePanelDescription">
              Choose a topic to jump straight to its answers.
            </p>

            <div className="faqPageHeroCategories">
              {faqCategories.map((category) => (
                <button
                  type="button"
                  className="faqPageHeroCategory"
                  key={category.id}
                  onClick={() => scrollToCategory(category.id)}
                >
                  <span className="faqPageHeroCategoryName">
                    <span className="faqPageCategoryIcon">
                      {category.icon}
                    </span>
                    {category.title}
                  </span>
                  <span className="faqPageHeroArrow">↗</span>
                </button>
              ))}
            </div>

            <div className="faqPagePanelFooter">
              <span className="faqPagePanelFooterDot" />
              Need a little more help? We’re here for you.
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY CARDS */}
      <section className="faqPageCategoryOverview">
        <div className="faqPageContainer">
          <div className="faqPageSectionHeading">
            <span className="faqPageEyebrow">EXPLORE TOPICS</span>
            <h2>Find what you’re looking for</h2>
            <p>Browse by category to get clear answers, quickly.</p>
          </div>

          <div className="faqPageCategoryCards">
            {faqCategories.map((category, index) => (
              <button
                type="button"
                className="faqPageCategoryCard"
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
              >
                <span className="faqPageCategoryCardTop">
                  <span className="faqPageCategoryCardIcon">
                    {category.icon}
                  </span>
                  <span className="faqPageCategoryCardNumber">
                    0{index + 1}
                  </span>
                </span>

                <span className="faqPageCategoryCardTitle">
                  {category.title}
                </span>

                <span className="faqPageCategoryCardDescription">
                  {category.description}
                </span>

                <span className="faqPageCategoryCardLink">
                  Explore answers <span>↗</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SEARCH RESULTS + ACCORDIONS */}
      <section className="faqPageQuestions">
        <div className="faqPageContainer">
          <div className="faqPageSectionHeading faqPageQuestionsHeading">
            <span className="faqPageEyebrow">
              YOUR QUESTIONS, ANSWERED
            </span>
            <h2>Frequently asked questions</h2>
            <p>
              Everything you need to know before and after your purchase.
            </p>
          </div>

          {/* <div className="faqPageFilterBar">
            <span className="faqPageFilterLabel">Browse by:</span>

            <div className="faqPageFilterOptions">
              <button
                type="button"
                className={`faqPageFilterButton ${
                  activeCategory === "all" ? "is-active" : ""
                }`}
                onClick={() => setActiveCategory("all")}
              >
                All questions
              </button>

              {faqCategories.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  className={`faqPageFilterButton ${
                    activeCategory === category.id ? "is-active" : ""
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div> */}

          {searchTerm.trim() && (
            <p className="faqPageResultSummary" role="status">
              {filteredCategories.reduce(
                (total, category) => total + category.questions.length,
                0
              )}{" "}
              matching question(s) for “{searchTerm.trim()}”
            </p>
          )}

          {filteredCategories.length > 0 ? (
            <div className="faqPageAccordionGroups">
              {filteredCategories.map((category) => (
                <section
                  className="faqPageCategorySection"
                  id={`faqPageCategory-${category.id}`}
                  key={category.id}
                >
                  <div className="faqPageAccordionCategoryHeading">
                    <div className="faqPageAccordionCategoryIcon">
                      {category.icon}
                    </div>

                    <div>
                      <h3>{category.title}</h3>
                      <p>{category.description}</p>
                    </div>

                    <span className="faqPageQuestionCount">
                      {category.questions.length} QUESTIONS
                    </span>
                  </div>

                  <div className="faqPageAccordionList">
                    {category.questions.map((item, index) => {
                      const questionId = `${category.id}-${item.question}`;
                      const isOpen = Boolean(openQuestions[questionId]);

                      return (
                        <article
                          className={`faqPageAccordionItem ${
                            isOpen ? "is-open" : ""
                          }`}
                          key={questionId}
                        >
                          <button
                            type="button"
                            className="faqPageAccordionTrigger"
                            onClick={() => toggleQuestion(questionId)}
                            aria-expanded={isOpen}
                            aria-controls={`faqPageAnswer-${category.id}-${index}`}
                          >
                            <span className="faqPageQuestionNumber">
                              {String(index + 1).padStart(2, "0")}
                            </span>

                            <span className="faqPageQuestionText">
                              {item.question}
                            </span>

                            <span
                              className="faqPageAccordionIcon"
                              aria-hidden="true"
                            >
                              <span className="faqPageIconHorizontal" />
                              <span className="faqPageIconVertical" />
                            </span>
                          </button>

                          <div
                            className="faqPageAccordionAnswer"
                            id={`faqPageAnswer-${category.id}-${index}`}
                            aria-hidden={!isOpen}
                          >
                            <div className="faqPageAnswerInner">
                              <p>{item.answer}</p>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="faqPageEmptyState">
              <span className="faqPageEmptyIcon">⌕</span>
              <h3>No matching questions found</h3>
              <p>
                Try a different keyword, such as “delivery”, “lenses”
                or “prescription”.
              </p>
              <button
                type="button"
                className="faqPageResetButton"
                onClick={clearSearch}
              >
                Show all questions
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="faqPageContactSection">
        <div className="faqPageContainer">
          <div className="faqPageContactCard">
            <div className="faqPageContactText">
              <span className="faqPageEyebrow">STILL NEED HELP?</span>
              <h2>We’re happy to help.</h2>
              <p>
                Can’t find the answer you need? Get in touch with our team
                for further assistance.
              </p>
            </div>

            <Link href="/contact-us" className="faqPageContactButton">
              Contact Us <span>↗</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}