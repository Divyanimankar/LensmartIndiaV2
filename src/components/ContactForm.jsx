"use client";

/* The form stays a client component. All its labels are functional
   (inputs, validation), so they live in code rather than in Shopify. */

const TOPICS = [
  { value: "order", label: "Order Status & Tracking" },
  { value: "product", label: "Product Information" },
  { value: "delivery", label: "Delivery Question" },
  { value: "return", label: "Return / Replacement" },
  { value: "other", label: "Other" },
];

export default function ContactForm() {
  return (
    <div className="contact-form-card">

      <div className="contact-form-head">
        <h3>Write to us</h3>
        <p>Fields marked with * are required.</p>
      </div>

      <form className="contact-form" onSubmit={(e) => e.preventDefault()}>

        {/* FULL NAME */}
        <div className="contact-field contact-full-field">
          <label htmlFor="name">Full Name *</label>
          <div className="contact-input">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g. Rahul Sharma"
              autoComplete="name"
              required
            />
          </div>
        </div>

        {/* EMAIL */}
        <div className="contact-field">
          <label htmlFor="email">Email Address *</label>
          <div className="contact-input">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="name@example.com"
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* PHONE */}
        <div className="contact-field">
          <label htmlFor="phone">Phone Number</label>
          <div className="contact-input">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="7" y="2.5" width="10" height="19" rx="2" />
              <path d="M11 18.5h2" />
            </svg>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="+91 98765 43210"
              autoComplete="tel"
            />
          </div>
        </div>

        {/* TOPIC CHIPS */}
        <fieldset className="contact-field contact-full-field contact-topics">
          <legend>How can we help? *</legend>

          <div className="contact-chip-row">
            {TOPICS.map((t, i) => (
              <label className="contact-chip" key={t.value}>
                <input
                  type="radio"
                  name="subject"
                  value={t.value}
                  required={i === 0}
                />
                <span>{t.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* MESSAGE */}
        <div className="contact-field contact-full-field">
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            rows="6"
            placeholder="Please describe your question..."
            required
          ></textarea>
        </div>

        {/* SEND BUTTON */}
        <button type="submit" className="contact-submit-button">
          <span>SEND MESSAGE</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </button>

      </form>
    </div>
  );
}