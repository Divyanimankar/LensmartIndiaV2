"use client";

import "../styles/featureSection.css";

const features = [
  {
    id: 1,
    title: "Fast Shipping",
    description: "We offer premium shipping on all orders.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M27 4L10 26H23L20 44L38 19H25L27 4Z" />
      </svg>
    ),
    className: "shipping-icon",
  },
  {
    id: 2,
    title: "We Customize",
    description:
      "Experience personalized eyewear solutions. Contact us by phone or WhatsApp.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="17" />
        <path d="M24 13V24L32 29" />
      </svg>
    ),
    className: "customize-icon",
  },
  {
    id: 3,
    title: "100% Secure Payments",
    description:
      "Enjoy safe and secure payments on our website and official WhatsApp channel.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="6" y="10" width="36" height="28" rx="3" />
        <path d="M6 19H42" />
      </svg>
    ),
    className: "payment-icon",
  },
  {
    id: 4,
    title: "Ready to Help",
    description:
      "Our support team is available via phone, email, and WhatsApp during business hours.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M9 10H39A3 3 0 0 1 42 13V32A3 3 0 0 1 39 35H19L8 43V13A3 3 0 0 1 9 10Z" />
      </svg>
    ),
    className: "support-icon",
  },
];

export default function FeatureSection() {
  return (
    <section className="feature-section" aria-label="Our services">
      <div className="feature-container">
        {features.map((feature) => (
          <article className="feature-card" key={feature.id}>
            <div className={`feature-icon ${feature.className}`}>
              {feature.icon}
            </div>

            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}