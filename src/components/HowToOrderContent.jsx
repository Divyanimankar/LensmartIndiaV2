"use client";

import React, { useState } from "react";

/* Design-only extras that stay in code */
const STEP_ICONS = ["⌕", "◉", "▤", "→", "✓"];

/* The hero's mini "ordering journey" widget (navigation, not page copy) */
const orderJourney = [
  { label: "Choose" },
  { label: "Select" },
  { label: "Review" },
  { label: "Pay" },
  { label: "Receive" },
];

/* "Line one\nLine two" -> Line one<br/>Line two */
function Lines({ text }) {
  const lines = String(text || "").split("\n");
  return lines.map((line, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </React.Fragment>
  ));
}

/* "Heading" + highlighted accent text on the same line */
function Heading({ title, accent }) {
  return (
    <>
      <Lines text={title} />
      {accent ? (
        <>
          {" "}
          <span>{accent}</span>
        </>
      ) : null}
    </>
  );
}

export default function HowToOrderContent({ content }) {
  const { hero, process, guide, reminder, help, cta } = content;
  const steps = guide.steps;
  const faqs = help.faqs;

  const [openFaq, setOpenFaq] = useState(0);
  const [activeOrderStep, setActiveOrderStep] = useState(0);

  const selectStep = (index) => {
    setActiveOrderStep(
      Math.max(0, Math.min(index, orderJourney.length - 1))
    );
  };

  return (
    <div className="hto-page">
      {/* ================= HERO ================= */}
      <section className="hto-hero">
        <div className="hto-hero-content">
          <span className="hto-eyebrow">
            <span className="hto-eyebrow-dot" />
            {hero.eyebrow}
          </span>

          <h1>
            <Lines text={hero.heading} />
            <br />
            <span>{hero.highlight}</span>
          </h1>

          <p className="hto-hero-description">{hero.body}</p>

          <div className="hto-hero-actions">
            <a className="hto-primary-btn" href={hero.buttonUrl}>
              {hero.buttonText} <span>↗</span>
            </a>
            <a className="hto-text-link" href="#hto-steps">
              See how it works <span>↓</span>
            </a>
          </div>

          <div className="hto-trust-row">
            {hero.list.map((item) => (
              <span key={item}>
                <b>✓</b> {item}
              </span>
            ))}
          </div>
        </div>

        <div className="hto-hero-visual">
          <div className="hto-visual-top">
            <div>
              <span className="hto-mini-label">YOUR ORDER, MADE SIMPLE</span>
              <h2 className="hto-visual-heading">From selection to delivery.</h2>
            </div>

            <span className="hto-visual-count">
              {String(activeOrderStep + 1).padStart(2, "0")} — 05
            </span>
          </div>

          <div className="hto-product-scene">
            <div className="hto-scene-glow" />

            <div className="hto-scene-label hto-scene-label-top">
              <span className="hto-label-icon">✓</span>
              <div>
                <strong>Choose your lenses</strong>
                <small>Find your perfect fit</small>
              </div>
            </div>

            <img
              className="hto-contact-lens-image"
              src="/images/slider2.png"
              alt="Contact lenses and lens packaging"
            />

            <div className="hto-scene-label hto-scene-label-bottom">
              <span className="hto-label-icon">↗</span>
              <div>
                <strong>Delivered to you</strong>
                <small>Shop from the comfort of home</small>
              </div>
            </div>
          </div>

          <div className="hto-order-progress">
            <div className="hto-progress-heading">
              <span>Your ordering journey</span>
              <span>
                STEP {String(activeOrderStep + 1).padStart(2, "0")} / 05
              </span>
            </div>

            <div
              className="hto-progress-track"
              role="progressbar"
              aria-label="Order journey progress"
              aria-valuemin={1}
              aria-valuemax={5}
              aria-valuenow={activeOrderStep + 1}
            >
              <span
                className="hto-progress-fill"
                style={{
                  width: `${((activeOrderStep + 1) / orderJourney.length) * 100}%`,
                }}
              />
            </div>

            <div className="hto-progress-steps">
              {orderJourney.map((step, index) => (
                <button
                  type="button"
                  key={step.label}
                  className={`hto-progress-step ${
                    activeOrderStep === index ? "active" : ""
                  } ${index < activeOrderStep ? "completed" : ""}`}
                  onClick={() => selectStep(index)}
                  aria-pressed={activeOrderStep === index}
                  aria-label={`Step ${index + 1}: ${step.label}`}
                >
                  <i>{index < activeOrderStep ? "✓" : index + 1}</i>
                  <span>{step.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= OVERVIEW ================= */}
      <section className="hto-overview">
        <div className="hto-overview-intro">
          <span className="hto-section-kicker">{process.eyebrow}</span>
          <h2>
            <Heading title={process.heading} accent={process.highlight} />
          </h2>
        </div>

        <div className="hto-overview-items">
          {steps.map((step, index) => {
            const number = String(index + 1).padStart(2, "0");
            return (
              <a
                href={`#hto-step-${index + 1}`}
                className="hto-overview-item"
                key={number}
              >
                <span className="hto-overview-number">{number}</span>
                <span className="hto-overview-title">{step.title}</span>
                <span className="hto-overview-arrow">↗</span>
              </a>
            );
          })}
        </div>
      </section>

      {/* ================= STEPS ================= */}
      <section className="hto-steps-section" id="hto-steps">
        <div className="hto-section-heading">
          <div>
            <span className="hto-section-kicker">{guide.eyebrow}</span>
            <h2>
              <Heading title={guide.heading} accent={guide.highlight} />
            </h2>
          </div>
          <p>{guide.body}</p>
        </div>

        <div className="hto-steps-list">
          {steps.map((step, index) => {
            const number = String(index + 1).padStart(2, "0");
            return (
              <article
                className="hto-step-card"
                id={`hto-step-${index + 1}`}
                key={number}
              >
                <div className="hto-step-number">
                  <span>{number}</span>
                  {index !== steps.length - 1 && (
                    <span className="hto-step-line" />
                  )}
                </div>

                <div className="hto-step-content">
                  <span className="hto-step-tag">{step.tag}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>

                  <ul className="hto-step-details">
                    {step.details.map((detail) => (
                      <li key={detail}>
                        <span className="hto-check">✓</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`hto-step-icon hto-icon-${index + 1}`}>
                  <span>{STEP_ICONS[index % STEP_ICONS.length]}</span>
                  <small>STEP {number}</small>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ================= PRESCRIPTION REMINDER ================= */}
      <section className="hto-prescription">
        <div className="hto-prescription-symbol">i</div>

        <div className="hto-prescription-copy">
          <span className="hto-section-kicker">{reminder.eyebrow}</span>
          <h2>
            <Heading title={reminder.heading} accent={reminder.highlight} />
          </h2>
          <p>{reminder.body}</p>
          <a href={reminder.buttonUrl} className="hto-prescription-link">
            {reminder.buttonText} <span>↗</span>
          </a>
        </div>

        <div className="hto-prescription-decoration" aria-hidden="true">
          <span>SPH</span>
          <span>CYL</span>
          <span>AXIS</span>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="hto-faq-section">
        <div className="hto-faq-intro">
          <span className="hto-section-kicker">{help.eyebrow}</span>
          <h2>
            <Lines text={help.heading} />
            <br />
            <span>{help.highlight}</span>
          </h2>
          <p>{help.body}</p>
          <a href={help.buttonUrl} className="hto-faq-contact">
            {help.buttonText} <span>↗</span>
          </a>
        </div>

        <div className="hto-faq-list">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;

            return (
              <div
                className={`hto-faq-item ${isOpen ? "is-open" : ""}`}
                key={faq.question}
              >
                <button
                  className="hto-faq-question"
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className="hto-faq-toggle">{isOpen ? "−" : "+"}</span>
                </button>

                <div
                  className="hto-faq-answer"
                  aria-hidden={!isOpen}
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="hto-faq-answer-inner">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="hto-bottom-cta">
        <div>
          <span className="hto-section-kicker">{cta.eyebrow}</span>
          <h2>
            <Heading title={cta.heading} accent={cta.highlight} />
          </h2>
          <p>{cta.body}</p>
        </div>

        <a href={cta.buttonUrl} className="hto-cta-btn">
          {cta.buttonText} <span>↗</span>
        </a>
      </section>
    </div>
  );
}