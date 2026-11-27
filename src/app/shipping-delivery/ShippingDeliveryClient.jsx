"use client";

import { useState } from "react";
import "../../styles/shipping.css";

const trackSteps = [
  { label: "Confirmed", state: "done" },
  { label: "Packed", state: "done" },
  { label: "Shipped", state: "current" },
  { label: "Delivered", state: "pending" },
];

const deliveryFaqs = [
  {
    question: "How can I track my order?",
    answer:
      "Once tracking details are available, use the tracking link or order tracking facility provided by LensMartIndia to check your shipment status.",
  },
  {
    question: "How long will my order take to arrive?",
    answer:
      "Delivery time depends on your PIN code, product availability, order processing and courier service. Check the estimated delivery date shown at checkout or in your order details.",
  },
  {
    question: "Can I change my delivery address?",
    answer:
      "Please contact our support team as soon as possible. Address changes may not be possible once an order has been dispatched.",
  },
  {
    question: "What happens if I am unavailable at delivery?",
    answer:
      "The delivery partner may attempt delivery again according to its delivery policy. Check your tracking updates or contact support for assistance.",
  },
  {
    question: "What if my order is delayed?",
    answer:
      "Check your latest tracking status first. If the shipment has not moved or the expected delivery date has passed, contact our support team with your order number.",
  },
  {
    question: "Do you deliver on weekends and holidays?",
    answer:
      "Weekend and public holiday deliveries depend on the courier partner and your delivery location.",
  },
];

export default function ShippingDeliveryClient({ content }) {
  const { hero, journey, details, ahead, help } = content;
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="shipping-page">
      {/* HERO */}
      <section className="shipping-hero">
        <div className="shipping-hero-inner">
          <div className="shipping-hero-copy">
            <span className="shipping-eyebrow">{hero.eyebrow}</span>

            <h1>
              {hero.title}
              <br />
              <span>{hero.accent}</span>
            </h1>

            <p>{hero.text}</p>

            <a href={hero.buttonUrl} className="shipping-primary-btn">
              {hero.buttonLabel} <span>↗</span>
            </a>

            <div className="shipping-hero-points">
              {hero.points.map((point, index) => (
                <div key={point}>
                  <span className="shipping-mini-icon">
                    {index === 0 ? "✓" : "↗"}
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual: order tracker */}
          <div className="shipping-hero-art">
            <div className="shipping-art-circle" />
            <div className="shipping-art-ring" />

            <div className="shipping-track-card">
              <div className="shipping-track-head">
                <span className="shipping-track-label">TRACK YOUR ORDER</span>
                <span className="shipping-track-status">
                  <i aria-hidden="true" />
                  In transit
                </span>
              </div>

              <ol className="shipping-track-steps">
                {trackSteps.map((step, index) => (
                  <li
                    key={step.label}
                    className={`shipping-track-step is-${step.state}`}
                    style={{ "--i": index }}
                  >
                    <span className="shipping-track-dot">
                      {step.state === "done" ? "✓" : ""}
                    </span>
                    <span className="shipping-track-name">{step.label}</span>
                  </li>
                ))}
              </ol>

              <div className="shipping-track-foot">
                <svg
                  viewBox="0 0 100 65"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12 H57 V46 H5 Z"
                    fill="#d9ece5"
                    stroke="#1b6b6a"
                    strokeWidth="3"
                  />
                  <path
                    d="M57 25 H75 L92 40 V46 H57 Z"
                    fill="#edf6f2"
                    stroke="#1b6b6a"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  <path d="M65 29 H74 L83 39 H65 Z" fill="#a7d4c5" />
                  <circle cx="23" cy="48" r="8" fill="#fff" stroke="#1b6b6a" strokeWidth="4" />
                  <circle cx="75" cy="48" r="8" fill="#fff" stroke="#1b6b6a" strokeWidth="4" />
                </svg>
                <p>Updates from our delivery partner appear here once your order ships.</p>
              </div>
            </div>

            <div className="shipping-chip shipping-chip-top">
              <span className="shipping-pin-dot" />
              YOUR DOORSTEP
            </div>

            <div className="shipping-chip shipping-chip-bottom">
              <span className="shipping-chip-icon">◎</span>
              <div>
                <strong>Delivery across India</strong>
                <small>Based on your PIN code</small>
              </div>
            </div>
          </div>
        </div>

        <div className="shipping-hero-strip">
          <span>THOUGHTFUL PACKAGING</span>
          <span className="shipping-strip-line" />
          <span>DELIVERY UPDATES</span>
          <span className="shipping-strip-line" />
          <span>SUPPORT WHEN YOU NEED IT</span>
        </div>
      </section>

      {/* DELIVERY PROCESS */}
      <section
        className="shipping-process shipping-container"
        id="delivery-process"
      >
        <div className="shipping-heading">
          <span className="shipping-eyebrow">{journey.eyebrow}</span>
          <h2>
            {journey.title} <span>{journey.accent}</span>
          </h2>
          <p>{journey.text}</p>
        </div>

        <div className="shipping-steps">
          {journey.steps.map((step) => (
            <article className="shipping-step" key={step.number + step.title}>
              <div className="shipping-step-top">
                <span className="shipping-step-icon">{step.icon}</span>
                <span className="shipping-step-number">{step.number}</span>
              </div>

              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="shipping-benefits">
        <div className="shipping-container">
          <div className="shipping-heading">
            <span className="shipping-eyebrow">{details.eyebrow}</span>
            <h2>
              {details.title} <span>{details.accent}</span>
            </h2>
            <p>{details.text}</p>
          </div>

          <div className="shipping-benefit-grid">
            {details.cards.map((benefit) => (
              <article className="shipping-benefit-card" key={benefit.title}>
                <span className="shipping-benefit-icon">{benefit.icon}</span>
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* DELIVERY ESTIMATES */}
      <section className="shipping-timeline shipping-container">
        <div className="shipping-timeline-inner">
          <div className="shipping-timeline-heading">
            <span className="shipping-eyebrow">{ahead.eyebrow}</span>
            <h2>
              {ahead.title} <span>{ahead.accent}</span>
            </h2>
            <p>{ahead.text}</p>
          </div>

          <div className="shipping-timeline-note">
            <span>i</span>
            <p>{ahead.note}</p>
          </div>

          <div className="shipping-timeline-bottom">
            <span className="shipping-timeline-dot" />
            <p>{ahead.bottom}</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="shipping-faq">
        <div className="shipping-container shipping-faq-layout">
          <div className="shipping-faq-intro">
            <span className="shipping-eyebrow">NEED A QUICK ANSWER?</span>
            <h2>
              Delivery, <span>explained.</span>
            </h2>
            <p>
              A few helpful answers to make your order journey a little easier.
            </p>

            <a
              href="/contact-us"
              className="shipping-text-link"
            >
              Ask our support team <span>↗</span>
            </a>
          </div>

          <div className="shipping-faq-list">
            {deliveryFaqs.map((faq, index) => (
              <article
                className={`shipping-faq-item ${
                  openFaq === index ? "is-open" : ""
                }`}
                key={faq.question}
              >
                <button
                  type="button"
                  className="shipping-faq-question"
                  aria-expanded={openFaq === index}
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                >
                  <span>{faq.question}</span>
                  <span className="shipping-faq-toggle">
                    {openFaq === index ? "−" : "+"}
                  </span>
                </button>

                <div
                  className="shipping-faq-answer"
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

      {/* SUPPORT */}
      <section className="shipping-support shipping-container">
        <div className="shipping-support-inner">
          <div className="shipping-support-symbol">{help.icon}</div>

          <div className="shipping-support-copy">
            <span className="shipping-eyebrow">{help.eyebrow}</span>
            <h2>{help.title}</h2>
            <p>{help.text}</p>
          </div>

          <a
            href="/contact-us"
            className="shipping-support-btn"
          >
            {help.buttonLabel} <span>↗</span>
          </a>
        </div>
      </section>
    </div>
  );
}