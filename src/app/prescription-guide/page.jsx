 "use client";

import React, { useRef, useState } from "react";
import SiteLayout from "@/components/SiteLayout";
import "../../styles/prescriptionGuide.css";

const prescriptionFields = [
  {
    number: "01",
    title: "SPH (Sphere)",
    description:
      "Shows the lens power needed to correct nearsightedness or farsightedness. A minus sign (-) usually indicates nearsightedness, while a plus sign (+) indicates farsightedness.",
  },
  {
    number: "02",
    title: "CYL (Cylinder)",
    description:
      "Indicates the amount of correction required for astigmatism. This field may be blank if you do not have astigmatism.",
  },
  {
    number: "03",
    title: "AXIS",
    description:
      "A number between 1 and 180 degrees that specifies the orientation of astigmatism correction. It is generally used when CYL is present.",
  },
  {
    number: "04",
    title: "ADD",
    description:
      "Shows the additional magnifying power needed for near vision. It is commonly found on multifocal or presbyopia prescriptions.",
  },
];

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

const guideSteps = [
  {
    label: "PRESCRIPTION BASICS",
    title: "Know your numbers.",
    description:
      "Understand the important values that describe your vision correction.",
    values: [
      ["SPH", "-2.00"],
      ["CYL", "-0.75"],
      ["AXIS", "180°"],
    ],
    note: "Illustrative example only, not a prescription.",
  },
  {
    label: "UNDERSTAND SPH",
    title: "Your lens power.",
    description:
      "SPH indicates the power used to correct nearsightedness or farsightedness.",
    values: [
      ["SPH", "-2.00"],
      ["POWER", "Sphere"],
      ["SIGN", "Minus (-)"],
    ],
    note: "Always follow the values on your prescription.",
  },
  {
    label: "ASTIGMATISM",
    title: "CYL and Axis.",
    description:
      "CYL and Axis describe the amount and orientation of astigmatism correction.",
    values: [
      ["CYL", "-0.75"],
      ["AXIS", "180°"],
      ["TYPE", "Correction"],
    ],
    note: "These values are examples only.",
  },
  {
    label: "BEFORE YOU ORDER",
    title: "Check your details.",
    description:
      "Confirm your contact lens prescription and lens specifications before ordering.",
    values: [
      ["POWER", "Verify"],
      ["BRAND", "Confirm"],
      ["FIT", "Check"],
    ],
    note: "Consult your eye care professional if unsure.",
  },
];

export default function PrescriptionGuide() {
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
                LENS MART INDIA / CUSTOMER GUIDE
              </span>

              <h1>
                Your prescription,
                <br />
                <span>made simple.</span>
              </h1>

              <p>
                Understand your eye prescription, learn what each value
                means, and feel more confident when choosing your contact
                lenses.
              </p>

              <a href="#understanding" className="pg-button">
                Explore the guide <span aria-hidden="true">↗</span>
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
              <span className="pg-eyebrow">01 / THE BASICS</span>
              <h2>
                First, understand
                <br />
                your prescription.
              </h2>
            </div>

            <div className="pg-intro-copy">
              <p>
                An eye prescription records the measurements recommended
                by your eye care professional to correct your vision. For
                contact lenses, the prescription may also include lens
                brand, base curve and diameter.
              </p>
              <p>
                These details help determine which lenses are suitable for
                your eyes. Your glasses prescription alone may not provide
                everything needed to order contact lenses safely.
              </p>
            </div>
          </div>
        </section>

        {/* PRESCRIPTION FIELDS */}
        <section className="pg-fields">
          <div className="pg-container">
            <div className="pg-section-heading">
              <div>
                <span className="pg-eyebrow">02 / DECODE THE DETAILS</span>
                <h2>What do the numbers mean?</h2>
              </div>
              <p>
                Here are the common abbreviations you may see on an eye
                prescription.
              </p>
            </div>

            <div className="pg-fields-grid">
              {prescriptionFields.map((field) => (
                <article className="pg-field-card" key={field.number}>
                  <span className="pg-field-number">{field.number}</span>
                  <h3>{field.title}</h3>
                  <p>{field.description}</p>
                </article>
              ))}
            </div>

            <div className="pg-note">
              <span className="pg-note-icon" aria-hidden="true">i</span>
              <p>
                <strong>Important:</strong> Prescription formats vary. Do
                not interpret, convert or guess values yourself. Ask your
                eye care professional if anything is unclear.
              </p>
            </div>
          </div>
        </section>

        {/* GLASSES VS CONTACT LENSES */}
        <section className="pg-comparison">
          <div className="pg-container pg-comparison-grid">
            <div className="pg-comparison-copy">
              <span className="pg-eyebrow">03 / BEFORE YOU ORDER</span>
              <h2>
                Glasses prescription
                <br />
                or contact lens prescription?
              </h2>
              <p>
                They are not always interchangeable. Contact lenses rest
                on your eye, so their measurements and power can differ
                from glasses.
              </p>
              <p>
                Always follow a current contact lens prescription and the
                fitting advice provided by your eye care professional.
              </p>
            </div>

            <div className="pg-checklist">
              <h3>Before placing your order</h3>
              {[
                "Check that your prescription is current.",
                "Confirm the prescribed lens brand and type.",
                "Match the specified power for each eye.",
                "Verify base curve and diameter where applicable.",
                "Ask your eye care professional about missing values.",
              ].map((item, index) => (
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
                <span className="pg-eyebrow">04 / READY TO SHOP?</span>
                <h2>Keep your prescription handy.</h2>
                <p>
                  Keep a copy of your valid prescription nearby while
                  shopping. Check your lens details carefully before
                  proceeding with your order.
                </p>
              </div>

              <div className="pg-upload-steps">
                <div>
                  <span>01</span>
                  <p>Locate your current contact lens prescription.</p>
                </div>
                <div>
                  <span>02</span>
                  <p>Review the power and lens specifications.</p>
                </div>
                <div>
                  <span>03</span>
                  <p>Confirm the details before checkout.</p>
                </div>
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
