"use client";

import React, { useState } from "react";
import SiteLayout from "@/components/SiteLayout";
import "../../styles/howToOrder.css";

const orderSteps = [
  {
    number: "01",
    tag: "CHOOSE",
    title: "Find your lenses",
    description:
      "Explore our collection and choose contact lenses that suit your needs.",
    details: [
      "Daily and monthly lenses",
      "Coloured contact lenses",
      "Explore trusted brands",
    ],
    icon: "⌕",
  },
  {
    number: "02",
    tag: "SELECT",
    title: "Choose your prescription",
    description:
      "Use your current contact lens prescription to select the correct power for each eye.",
    details: [
      "Select left eye power",
      "Select right eye power",
      "Check pack size and quantity",
    ],
    icon: "◉",
  },
  {
    number: "03",
    tag: "REVIEW",
    title: "Review your order",
    description:
      "Check your selected lenses, prescription details, quantities and order total.",
    details: [
      "Verify lens type and power",
      "Review available discounts",
      "Confirm your order total",
    ],
    icon: "▤",
  },
  {
    number: "04",
    tag: "PAY",
    title: "Complete checkout",
    description:
      "Enter your delivery information and choose a payment method available at checkout.",
    details: [
      "Enter your delivery address",
      "Choose an available payment method",
      "Confirm your order",
    ],
    icon: "→",
  },
  {
    number: "05",
    tag: "RECEIVE",
    title: "Your lenses are on the way",
    description:
      "Follow your order confirmation and shipping updates until your lenses arrive.",
    details: [
      "Receive order confirmation",
      "Check shipping updates",
      "Receive your lenses",
    ],
    icon: "✓",
  },
];

const orderJourney = [
  {
    label: "Choose",
    title: "Find your lenses",
    description:
      "Explore daily, monthly and coloured contact lenses to find the right product for your needs.",
    action: "Explore lenses",
    href: "/all-products",
  },
  {
    label: "Select",
    title: "Select your prescription",
    description:
      "Choose the correct power for each eye using your current contact lens prescription.",
    action: "Prescription guide",
    href: "/prescription-guide",
  },
  {
    label: "Review",
    title: "Review your selection",
    description:
      "Check the lens type, power, pack size and quantity before continuing.",
    action: "View cart",
    href: "/cart",
  },
  {
    label: "Pay",
    title: "Complete your checkout",
    description:
      "Enter your delivery address and select a payment option offered by the store.",
    action: "Continue to checkout",
    href: "/checkout",
  },
  {
    label: "Receive",
    title: "Track your delivery",
    description:
      "Look for your order confirmation and follow the shipping updates provided for your order.",
    action: "View my account",
    href: "/my-account",
  },
];

const faqs = [
  {
    question: "Do I need a prescription to order contact lenses?",
    answer:
      "You should have a current, suitable contact lens prescription before ordering. Contact lens prescriptions can differ from glasses prescriptions and may include additional fitting details.",
  },
  {
    question: "How do I select the correct power for each eye?",
    answer:
      "Use your contact lens prescription to select the power for your right and left eyes separately. If you are unsure about SPH, CYL, AXIS or other values, consult your eye care professional before ordering.",
  },
  {
    question: "Can I change my order after placing it?",
    answer:
      "Changes depend on the current status of your order. Contact customer support as soon as possible to ask whether an update is possible.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Check your order confirmation and shipping updates. If tracking details are unavailable, contact customer support for assistance.",
  },
  {
    question: "What if I selected the wrong lens power?",
    answer:
      "Contact customer support promptly. Do not use lenses with an incorrect or uncertain prescription. Any exchange or return depends on the applicable store policy.",
  },
];

function HowToOrder() {
  const [openFaq, setOpenFaq] = useState(0);
  const [activeOrderStep, setActiveOrderStep] = useState(0);

  const activeJourney = orderJourney[activeOrderStep];

  const selectStep = (index) => {
    setActiveOrderStep(
      Math.max(0, Math.min(index, orderJourney.length - 1))
    );
  };

  return (
    <SiteLayout>
      <div className="hto-page">
        <section className="hto-hero">
          <div className="hto-hero-content">
            <span className="hto-eyebrow">
              <span className="hto-eyebrow-dot" />
              A SIMPLE WAY TO SHOP
            </span>

            <h1>
              Your perfect lenses.
              <br />
              <span>Just a few steps away.</span>
            </h1>

            <p className="hto-hero-description">
              Shopping for contact lenses should feel easy. Follow our simple
              guide to find your lenses, select your prescription and place
              your order with confidence.
            </p>

            <div className="hto-hero-actions">
              <a className="hto-primary-btn" href="/all-products">
                Explore lenses <span>↗</span>
              </a>
              <a className="hto-text-link" href="#hto-steps">
                See how it works <span>↓</span>
              </a>
            </div>

            <div className="hto-trust-row">
              <span><b>✓</b> Easy ordering</span>
              <span><b>✓</b> Prescription guidance</span>
              <span><b>✓</b> Convenient checkout</span>
            </div>
          </div>

          <div className="hto-hero-visual">
            <div className="hto-visual-top">
              <div>
                <span className="hto-mini-label">
                  YOUR ORDER, MADE SIMPLE
                </span>
                <h2 className="hto-visual-heading">
                  From selection to delivery.
                </h2>
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

              {/* <div className="hto-active-step-info" aria-live="polite">
                <span className="hto-active-step-number">
                  STEP {String(activeOrderStep + 1).padStart(2, "0")}
                </span>

                <h3>{activeJourney.title}</h3>
                <p>{activeJourney.description}</p>

                <div className="hto-step-info-footer">
                  <a
                    href={activeJourney.href}
                    className="hto-step-action"
                  >
                    {activeJourney.action}
                    <span>↗</span>
                  </a>

                  <div className="hto-step-navigation">
                    <button
                      type="button"
                      onClick={() => selectStep(activeOrderStep - 1)}
                      disabled={activeOrderStep === 0}
                      aria-label="Previous step"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => selectStep(activeOrderStep + 1)}
                      disabled={activeOrderStep === orderJourney.length - 1}
                      aria-label="Next step"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </section>

        <section className="hto-overview">
          <div className="hto-overview-intro">
            <span className="hto-section-kicker">THE PROCESS</span>
            <h2>Five steps. <span>That's it.</span></h2>
          </div>

          <div className="hto-overview-items">
            {orderSteps.map((step, index) => (
              <a
                href={`#hto-step-${index + 1}`}
                className="hto-overview-item"
                key={step.number}
              >
                <span className="hto-overview-number">{step.number}</span>
                <span className="hto-overview-title">{step.title}</span>
                <span className="hto-overview-arrow">↗</span>
              </a>
            ))}
          </div>
        </section>

        <section className="hto-steps-section" id="hto-steps">
          <div className="hto-section-heading">
            <div>
              <span className="hto-section-kicker">
                YOUR GUIDE TO ORDERING
              </span>
              <h2>From browsing to <span>delivery.</span></h2>
            </div>
            <p>Everything you need to know, clearly explained at every step.</p>
          </div>

          <div className="hto-steps-list">
            {orderSteps.map((step, index) => (
              <article
                className="hto-step-card"
                id={`hto-step-${index + 1}`}
                key={step.number}
              >
                <div className="hto-step-number">
                  <span>{step.number}</span>
                  {index !== orderSteps.length - 1 && (
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
                  <span>{step.icon}</span>
                  <small>STEP {step.number}</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="hto-prescription">
          <div className="hto-prescription-symbol">i</div>

          <div className="hto-prescription-copy">
            <span className="hto-section-kicker">A QUICK REMINDER</span>
            <h2>Your prescription matters.</h2>
            <p>
              Always use a current contact lens prescription and confirm the
              lens type, power and fitting details before checkout. A glasses
              prescription may not be suitable for contact lenses.
            </p>
            <a href="/prescription-guide" className="hto-prescription-link">
              Read our Prescription Guide <span>↗</span>
            </a>
          </div>

          <div className="hto-prescription-decoration" aria-hidden="true">
            <span>SPH</span>
            <span>CYL</span>
            <span>AXIS</span>
          </div>
        </section>

        <section className="hto-faq-section">
          <div className="hto-faq-intro">
            <span className="hto-section-kicker">NEED A LITTLE HELP?</span>
            <h2>
              Good to know.
              <br />
              <span>Before you order.</span>
            </h2>
            <p>Have a question about your order? Find a quick answer below.</p>
            <a href="/contact-us" className="hto-faq-contact">
              Contact our team <span>↗</span>
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
                    <span className="hto-faq-toggle">
                      {isOpen ? "−" : "+"}
                    </span>
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

        <section className="hto-bottom-cta">
          <div>
            <span className="hto-section-kicker">READY WHEN YOU ARE</span>
            <h2>Your next pair starts <span>here.</span></h2>
            <p>Find the lenses that fit your needs and get started.</p>
          </div>

          <a href="/all-products" className="hto-cta-btn">
            Shop contact lenses <span>↗</span>
          </a>
        </section>
      </div>
    </SiteLayout>
  );
}

export default HowToOrder;