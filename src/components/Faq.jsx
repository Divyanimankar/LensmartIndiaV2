"use client";

import { useState } from "react";
import "../styles/faq.css";

const faqData = [
  {
    question: "What is your return policy?",
    answer:
      "We offer returns or exchanges according to our return policy. Items should be unused and returned with their original packaging.",
  },
  {
    question: "How do I choose the right contact lenses?",
    answer:
  "Choose contact lenses based on your prescription, lifestyle, wearing schedule, and comfort. An eye-care professional can help you find the right type and fit for your eyes."
    // answer:
    //   "You can explore frames by shape, style, size, and category to find an option that suits your preferences.",
  },
  {
    question: "How can I order contact lenses?",
    answer:
      "Choose your preferred contact lens product, select the required specifications, and add it to your cart.",
  },
  {
    question: "What if I receive a damaged product?",
    answer:
      "Please contact our customer support team with your order details and product information for assistance.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can contact our customer support team through the contact information available on our Contact Us page.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">

        {/* LEFT IMAGE */}
        <div className="faq-image-box">
          <img
            src="/images/faqimage.png"
            alt="Customer exploring eyewear online"
            className="faq-image"
          />
        </div>

        {/* RIGHT FAQ CARD */}
        <div className="faq-card">

          <h2 className="faq-heading">
            Do you have questions?
          </h2>

          <div className="faq-list">
            {faqData.map((item, index) => {
              const isOpen = activeIndex === index;

              return (
                <div
                  className={`faq-item ${isOpen ? "active" : ""}`}
                  key={index}
                >
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.question}</span>

                    <svg
                      className="faq-arrow"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  <div className="faq-answer-wrapper">
                    <div className="faq-answer-inner">
                      <p className="faq-answer">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}