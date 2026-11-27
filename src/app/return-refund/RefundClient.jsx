"use client";
import React, { useState } from "react";
import "../../styles/Refund.css";

const trackSteps = [
  { label: "Requested", state: "done" },
  { label: "Verified", state: "done" },
  { label: "Approved", state: "current" },
  { label: "Refunded", state: "pending" },
];

const faqs = [
  {
    question: "How do I request a return?",
    answer:
      "Contact our support team with your order number, product details and reason for return. Our team will guide you through the process.",
  },
  {
    question: "How long does a refund take?",
    answer:
      "Refund timelines depend on the payment method and return approval. We will share the applicable timeline once your request is approved.",
  },
  {
    question: "Can I return opened contact lenses?",
    answer:
      "For hygiene and safety reasons, opened contact lenses may not be eligible for return. Please contact support if your product arrived damaged or defective.",
  },
  {
    question: "What if I receive a damaged product?",
    answer:
      "Please contact our support team as soon as possible with your order details and clear photos of the damaged product and packaging.",
  },
  {
    question: "Will shipping charges be refunded?",
    answer:
      "Shipping charges and refund eligibility depend on the applicable policy and reason for return. Our support team can confirm the details for your order.",
  },
];

export default function RefundClient({ content }) {
  const { hero, process: flow, eligibility, money, help } = content;
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="refund-page">
      {/* Hero */}
      <section className="refund-hero">
        <div className="refund-hero-inner">
          <div className="refund-hero-copy">
            <span className="refund-eyebrow">{hero.eyebrow}</span>

            <h1>
              {hero.title}
              <br />
              <span>{hero.accent}</span>
            </h1>

            <p>{hero.text}</p>

            <a className="refund-primary-btn" href="#return-process">
              {hero.buttonLabel} <span>↗</span>
            </a>

            <div className="refund-hero-note">
              <span className="refund-note-dot" />
              {hero.note}
            </div>
          </div>

          {/* Hero visual: return tracker */}
          <div className="refund-hero-visual">
            <div className="refund-visual-circle" />
            <div className="refund-orbit refund-orbit-one" />
            <div className="refund-orbit refund-orbit-two" />

            <div className="refund-track-card">
              <div className="refund-track-head">
                <span className="refund-track-item" aria-hidden="true">
                  <svg
                    viewBox="0 0 320 150"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g
                      stroke="#164e4c"
                      strokeWidth="11"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    >
                      <path d="M15 42 L6 29" />
                      <path d="M305 42 L314 29" />
                      <path d="M17 45 Q14 35 30 34 L119 35 Q132 37 132 51 L124 101 Q121 123 96 123 L47 123 Q24 121 20 98 Z" />
                      <path d="M188 51 Q188 37 201 35 L290 34 Q306 35 303 45 L300 98 Q296 121 273 123 L224 123 Q199 123 196 101 Z" />
                      <path d="M132 52 Q160 35 188 52" />
                    </g>
                  </svg>
                </span>

                <div className="refund-track-title">
                  <span className="refund-track-label">RETURN REQUEST</span>
                  <strong>Track every step</strong>
                </div>

                <span className="refund-track-status">
                  <i aria-hidden="true" />
                  Approved
                </span>
              </div>

              <ol className="refund-track-steps">
                {trackSteps.map((step, index) => (
                  <li
                    key={step.label}
                    className={`refund-track-step is-${step.state}`}
                    style={{ "--i": index }}
                  >
                    <span className="refund-track-dot">
                      {step.state === "done" ? "✓" : ""}
                    </span>
                    <span className="refund-track-name">{step.label}</span>
                  </li>
                ))}
              </ol>

              <div className="refund-track-foot">
                <span className="refund-track-foot-icon" aria-hidden="true">
                  ₹
                </span>
                <p>
                  Refund method and timeline are shared once your
                  return is approved.
                </p>
              </div>
            </div>

            <div className="refund-chip refund-chip-top">
              <span className="refund-chip-dot" />
              PREPAID &amp; COD
            </div>

            <div className="refund-chip refund-chip-bottom">
              <span className="refund-chip-icon">↗</span>
              <div>
                <strong>Damaged or wrong item?</strong>
                <small>Contact support with photos</small>
              </div>
            </div>
          </div>
        </div>

        <div className="refund-hero-bottom">
          {hero.strip.map((item, index) => (
            <React.Fragment key={item}>
              {index > 0 && <span className="refund-bottom-line" />}
              <span>{item}</span>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Return process */}
      <section
        className="refund-process section-wrap"
        id="return-process"
      >
        <div className="refund-section-heading">
          <span className="refund-eyebrow">{flow.eyebrow}</span>
          <h2>
            {flow.title} <span>{flow.accent}</span>
          </h2>
          <p>{flow.text}</p>
        </div>

        <div className="refund-steps-grid">
          {flow.steps.map((step) => (
            <article className="refund-step" key={step.number + step.title}>
              <div className="refund-step-top">
                <span className="refund-step-icon">{step.icon}</span>
                <span className="refund-step-number">
                  {step.number}
                </span>
              </div>

              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Eligibility */}
      <section className="refund-eligibility">
        <div className="section-wrap">
          <div className="refund-section-heading refund-eligibility-heading">
            <span className="refund-eyebrow">{eligibility.eyebrow}</span>
            <h2>
              {eligibility.title} <span>{eligibility.accent}</span>
            </h2>
            <p>{eligibility.text}</p>
          </div>

          <div className="refund-eligibility-grid">
            {eligibility.cards.map((card, index) => (
              <article
                className={`refund-eligibility-card ${
                  index === 1 ? "refund-card-restricted" : ""
                }`}
                key={card.title}
              >
                <div className="refund-card-heading">
                  <span className="refund-status-icon">{card.icon}</span>
                  <h3>{card.title}</h3>
                </div>

                <ul>
                  {card.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <p className="refund-card-footnote">{card.footnote}</p>
              </article>
            ))}
          </div>

          <p className="refund-policy-disclaimer">{eligibility.disclaimer}</p>
        </div>
      </section>

      {/* Refund details */}
      <section className="refund-payment section-wrap">
        <div className="refund-payment-copy">
          <span className="refund-eyebrow">{money.eyebrow}</span>
          <h2>
            {money.title}
            <br />
            <span>{money.accent}</span>
          </h2>
          <p>{money.text}</p>
          <a
            className="refund-text-link"
            href="/contact-us"
          >
            {money.linkText} <span>{money.linkLabel}</span>
          </a>
        </div>

        <div className="refund-payment-details">
          {money.rows.map((row) => (
            <article className="refund-payment-row" key={row.title}>
              <span className="refund-payment-icon">{row.icon}</span>
              <div>
                <h3>{row.title}</h3>
                <p>{row.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="refund-faq">
        <div className="section-wrap refund-faq-layout">
          <div className="refund-faq-intro">
            <span className="refund-eyebrow">GOOD TO KNOW</span>
            <h2>
              Quick <span>questions.</span>
            </h2>
            <p>
              Still unsure about something? Start here, or reach
              out to our support team.
            </p>
            <a
              className="refund-text-link"
              href="/contact-us"
            >
              Contact support <span>↗</span>
            </a>
          </div>

          <div className="refund-faq-list">
            {faqs.map((faq, index) => (
              <article
                className={`refund-faq-item ${
                  openFaq === index ? "is-open" : ""
                }`}
                key={faq.question}
              >
                <button
                  type="button"
                  className="refund-faq-question"
                  aria-expanded={openFaq === index}
                  onClick={() =>
                    setOpenFaq(openFaq === index ? -1 : index)
                  }
                >
                  <span>{faq.question}</span>
                  <span className="refund-faq-toggle">
                    {openFaq === index ? "−" : "+"}
                  </span>
                </button>

                <div
                  className="refund-faq-answer"
                  aria-hidden={openFaq !== index}
                >
                  <div>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Support banner */}
      <section className="refund-support section-wrap">
        <div className="refund-support-inner">
          <div>
            <span className="refund-eyebrow">{help.eyebrow}</span>
            <h2>{help.title}</h2>
            <p>{help.text}</p>
          </div>

          <a
            className="refund-support-btn"
            href={help.buttonUrl}
          >
            {help.buttonLabel} <span>↗</span>
          </a>
        </div>
      </section>
    </div>
  );
}