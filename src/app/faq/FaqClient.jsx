"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import "../../styles/faqFooter.css";

export default function FaqClient({ content }) {
  const { hero, topics, contact, categories: faqCategories } = content;
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
  }, [searchTerm, activeCategory, faqCategories]);

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
            <span className="faqPageEyebrow">{hero.eyebrow}</span>

            <h1>
              {hero.titleLines.map((line, index) => (
                <React.Fragment key={line}>
                  {line}
                  {index < hero.titleLines.length - 1 && <br />}
                </React.Fragment>
              ))}{" "}
              <span>{hero.accent}</span>
            </h1>

            <p className="faqPageHeroDescription">{hero.text}</p>

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
            <span className="faqPageEyebrow">{topics.eyebrow}</span>
            <h2>{topics.title}</h2>
            <p>{topics.text}</p>
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
              <span className="faqPageEyebrow">{contact.eyebrow}</span>
              <h2>{contact.title}</h2>
              <p>{contact.text}</p>
            </div>

            <Link href="/contact-us" className="faqPageContactButton">
              {contact.buttonLabel} <span>↗</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}