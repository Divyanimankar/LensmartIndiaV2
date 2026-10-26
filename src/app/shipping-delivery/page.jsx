"use client";

import { useState } from "react";
import "../../styles/shipping.css";

const trackSteps = [
  { label: "Confirmed", state: "done" },
  { label: "Packed", state: "done" },
  { label: "Shipped", state: "current" },
  { label: "Delivered", state: "pending" },
];

const deliverySteps = [
  {
    number: "01",
    icon: "✓",
    title: "Order confirmed",
    text: "Your order is received and confirmation details are shared.",
  },
  {
    number: "02",
    icon: "□",
    title: "Packed with care",
    text: "Your products are checked and carefully packed for shipping.",
  },
  {
    number: "03",
    icon: "↗",
    title: "On its way",
    text: "Your order is handed over to the delivery partner.",
  },
  {
    number: "04",
    icon: "⌂",
    title: "Delivered to you",
    text: "Your order arrives at your selected delivery address.",
  },
];

const benefits = [
  {
    icon: "◎",
    title: "Delivery across India",
    text: "Delivery availability depends on your PIN code.",
  },
  {
    icon: "◇",
    title: "Careful packaging",
    text: "Products are packed to help protect them in transit.",
  },
  {
    icon: "↗",
    title: "Order tracking",
    text: "Use your tracking details to follow your shipment.",
  },
  {
    icon: "♡",
    title: "Here to help",
    text: "Our support team can assist with delivery queries.",
  },
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

export default function ShippingDelivery() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="shipping-page">
      {/* HERO */}
      <section className="shipping-hero">
        <div className="shipping-hero-inner">
          <div className="shipping-hero-copy">
            <span className="shipping-eyebrow">DELIVERY, MADE SIMPLE</span>

            <h1>
              Shipping &amp;
              <br />
              <span>Delivery.</span>
            </h1>

            <p>
              From our store to your doorstep, we make every delivery
              simple, secure and easy to follow.
            </p>

            <a href="#delivery-process" className="shipping-primary-btn">
              How delivery works <span>↗</span>
            </a>

            <div className="shipping-hero-points">
              <div>
                <span className="shipping-mini-icon">✓</span>
                <span>Careful packaging</span>
              </div>
              <div>
                <span className="shipping-mini-icon">↗</span>
                <span>Tracking updates</span>
              </div>
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
          <span className="shipping-eyebrow">THE JOURNEY</span>
          <h2>
            From click <span>to doorstep.</span>
          </h2>
          <p>Here is what happens after you place your order.</p>
        </div>

        <div className="shipping-steps">
          {deliverySteps.map((step) => (
            <article className="shipping-step" key={step.number}>
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
            <span className="shipping-eyebrow">THE LITTLE DETAILS</span>
            <h2>
              Good products. <span>Handled with care.</span>
            </h2>
            <p>
              We want your shopping experience to feel easy from checkout to
              delivery.
            </p>
          </div>

          <div className="shipping-benefit-grid">
            {benefits.map((benefit) => (
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
            <span className="shipping-eyebrow">PLAN AHEAD</span>
            <h2>
              When will it <span>arrive?</span>
            </h2>
            <p>
              Your estimated delivery date is the best guide for your specific
              order.
            </p>
          </div>

          <div className="shipping-timeline-note">
            <span>i</span>
            <p>
              Delivery estimates vary by PIN code, product availability, order
              processing and courier service. Please refer to the estimate
              displayed at checkout.
            </p>
          </div>

          <div className="shipping-timeline-bottom">
            <span className="shipping-timeline-dot" />
            <p>
              Orders are processed according to product availability and the
              applicable dispatch schedule.
            </p>
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
          <div className="shipping-support-symbol">↗</div>

          <div className="shipping-support-copy">
            <span className="shipping-eyebrow">WE'RE HERE TO HELP</span>
            <h2>Something about your delivery?</h2>
            <p>
              Tell us what you need help with. We're happy to help you find the
              next step.
            </p>
          </div>

          <a
            href="/contact-us"
            className="shipping-support-btn"
          >
            Contact support <span>↗</span>
          </a>
        </div>
      </section>
    </div>
  );
}