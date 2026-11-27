"use client";

import React, { useRef, useState } from "react";
import SiteLayout from "@/components/SiteLayout";
import "../../styles/prescriptionGuide.css";

const faqs = [
  {
    question: "Can I use my glasses prescription for contact lenses?",
    answer:
      "Not always. Contact lenses sit directly on your eyes, so their power and fit may differ from your glasses prescription. Use a valid contact lens prescription from your eye care professional.",
  },
  {
    question: "How recent should my prescription be?",
    answer:
      "Follow the validity period recommended by your eye care professional and applicable local requirements. If your prescription has expired, arrange an eye examination before ordering.",
  },
  {
    question: "What if my prescription does not include CYL or AXIS?",
    answer:
      "These fields may be blank when astigmatism correction is not required. Enter only the values specified on your prescription and do not guess missing information.",
  },
  {
    question: "Can I order contact lenses without a prescription?",
    answer:
      "For prescription contact lenses, use a valid contact lens prescription and consult your eye care professional to confirm the correct lens power and fit.",
  },
];

/* Ye example numbers Shopify me nahi hain, isliye yahin rakhe hain (step ke order me) */
const STEP_VALUES = [
  [
    ["SPH", "-2.00"],
    ["CYL", "-0.75"],
    ["AXIS", "180°"],
  ],
  [
    ["SPH", "-2.00"],
    ["POWER", "Sphere"],
    ["SIGN", "Minus (-)"],
  ],
  [
    ["CYL", "-0.75"],
    ["AXIS", "180°"],
    ["TYPE", "Correction"],
  ],
  [
    ["POWER", "Verify"],
    ["BRAND", "Confirm"],
    ["FIT", "Check"],
  ],
];

export default function PrescriptionGuideClient({ content }) {
  const { hero, basics, decode, byo, ready } = content;
  const guideSteps = content.steps.map((step, index) => ({
    ...step,
    values: STEP_VALUES[index] || [],
  }));

  const [openFaq, setOpenFaq] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const currentStep = guideSteps[activeStep];

  const goToStep = (step) => {
    setActiveStep((step + guideSteps.length) % guideSteps.length);
  };

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (event) => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    // Ignore short movements and vertical page scrolling.
    if (
      Math.abs(deltaX) < 45 ||
      Math.abs(deltaX) <= Math.abs(deltaY) * 1.15
    ) {
      return;
    }

    if (deltaX < 0) {
      goToStep(activeStep + 1);
    } else {
      goToStep(activeStep - 1);
    }
  };

  return (
    <SiteLayout>
      <div className="prescription-guide">
        {/* HERO SECTION */}
        <section className="pg-hero">
          <div className="pg-container pg-hero-grid">
            <div className="pg-hero-content">
              <span className="pg-eyebrow">
                {hero.eyebrow}
              </span>

              <h1>
                {hero.title}
                <br />
                <span>{hero.accent}</span>
              </h1>

              <p>{hero.text}</p>

              <a href="#understanding" className="pg-button">
                {hero.buttonLabel} <span aria-hidden="true">↗</span>
              </a>
            </div>

            {/* INTERACTIVE SWIPE GUIDE */}
            <div className="pg-hero-visual">
              <div className="pg-visual-top">
                <span>YOUR EYE CARE GUIDE</span>
                <span aria-live="polite">
                  {String(activeStep + 1).padStart(2, "0")} /{" "}
                  {String(guideSteps.length).padStart(2, "0")}
                </span>
              </div>

              {/* <div
                className="pg-progress-track"
                role="progressbar"
                aria-label="Prescription guide progress"
                aria-valuemin={1}
                aria-valuemax={guideSteps.length}
                aria-valuenow={activeStep + 1}
              >
                <span
                  className="pg-progress-fill"
                  style={{
                    width: `${((activeStep + 1) / guideSteps.length) * 100}%`,
                  }}
                />
              </div> */}

              <div
                className="pg-prescription-card"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={() => {
                  touchStartX.current = 0;
                  touchStartY.current = 0;
                }}
              >
                <div className="pg-card-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="9"
                      y="5"
                      width="30"
                      height="38"
                      rx="5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                    <path
                      d="M16 16H32M16 23H32M16 30H26"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <span className="pg-card-label">{currentStep.label}</span>
                <h2>{currentStep.title}</h2>
                <p>{currentStep.description}</p>

                <div className="pg-mini-table">
                  {currentStep.values.map(([label, value]) => (
                    <React.Fragment key={label}>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </React.Fragment>
                  ))}
                </div>

                <p className="pg-example-note">{currentStep.note}</p>

                <div className="pg-guide-controls">
                  <button
                    type="button"
                    className="pg-guide-arrow"
                    onClick={() => goToStep(activeStep - 1)}
                    aria-label="Previous guide step"
                  >
                    <span aria-hidden="true">&#8592;</span>
                  </button>

                  <div className="pg-guide-dots" aria-label="Choose guide step">
                    {guideSteps.map((step, index) => (
                      <button
                        type="button"
                        key={step.label}
                        className={`pg-guide-dot ${
                          activeStep === index ? "active" : ""
                        }`}
                        onClick={() => setActiveStep(index)}
                        aria-label={`Go to step ${index + 1}: ${step.label}`}
                        aria-current={activeStep === index ? "step" : undefined}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    className="pg-guide-arrow"
                    onClick={() => goToStep(activeStep + 1)}
                    aria-label="Next guide step"
                  >
                    <span aria-hidden="true">&#8594;</span>
                  </button>
                </div>
              </div>

              <div className="pg-visual-footer">
                <span>Clear information.</span>
                <span>Confident choices.</span>
              </div>
            </div>
          </div>
        </section>

        {/* INTRO SECTION */}
        <section className="pg-intro" id="understanding">
          <div className="pg-container pg-intro-grid">
            <div>
              <span className="pg-eyebrow">{basics.eyebrow}</span>
              <h2>{basics.title}</h2>
            </div>

            <div className="pg-intro-copy">
              {basics.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
                  </div>
        </section>

        {/* PRESCRIPTION FIELDS */}
        <section className="pg-fields">
          <div className="pg-container">
            <div className="pg-section-heading">
              <div>
                <span className="pg-eyebrow">{decode.eyebrow}</span>
                <h2>{decode.title}</h2>
              </div>
              <p>{decode.text}</p>
            </div>

            <div className="pg-fields-grid">
              {decode.fields.map((field) => (
                <article className="pg-field-card" key={field.number + field.title}>
                  <span className="pg-field-number">{field.number}</span>
                  <h3>{field.title}</h3>
                  <p>{field.description}</p>
                </article>
              ))}
            </div>

            <div className="pg-note">
              <span className="pg-note-icon" aria-hidden="true">i</span>
              <p>
                <strong>Important:</strong> {decode.note}
              </p>
            </div>
          </div>
        </section>

        {/* GLASSES VS CONTACT LENSES */}
        <section className="pg-comparison">
          <div className="pg-container pg-comparison-grid">
            <div className="pg-comparison-copy">
              <span className="pg-eyebrow">{byo.eyebrow}</span>
              <h2>{byo.title}</h2>
              {byo.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>

            <div className="pg-checklist">
              <h3>{byo.checklistTitle}</h3>
              {byo.items.map((item, index) => (
                <div className="pg-check-item" key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{item}</p>
                  <span className="pg-check-mark" aria-hidden="true">✓</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ORDER GUIDE */}
        <section className="pg-upload">
          <div className="pg-container">
            <div className="pg-upload-card">
              <div className="pg-upload-content">
                <span className="pg-eyebrow">{ready.eyebrow}</span>
                <h2>{ready.title}</h2>
                <p>{ready.text}</p>
              </div>

              <div className="pg-upload-steps">
                {ready.steps.map((text, index) => (
                  <div key={text}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="pg-faq">
          <div className="pg-container pg-faq-grid">
            <div className="pg-faq-heading">
              <span className="pg-eyebrow">GOOD TO KNOW</span>
              <h2>Quick questions.</h2>
              <p>A few helpful answers before you choose your lenses.</p>
            </div>

            <div className="pg-faq-list">
              {faqs.map((faq, index) => (
                <div
                  className={`pg-faq-item ${
                    openFaq === index ? "is-open" : ""
                  }`}
                  key={faq.question}
                >
                  <button
                    type="button"
                    className="pg-faq-question"
                    aria-expanded={openFaq === index}
                    onClick={() =>
                      setOpenFaq(openFaq === index ? null : index)
                    }
                  >
                    <span>{faq.question}</span>
                    <span className="pg-faq-toggle" aria-hidden="true">
                      {openFaq === index ? "−" : "+"}
                    </span>
                  </button>

                  <div className="pg-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}