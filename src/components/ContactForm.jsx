
"use client";

import { useState, useEffect } from "react";

const TOPICS = [
  { value: "order", label: "Order Status & Tracking" },
  { value: "product", label: "Product Information" },
  { value: "delivery", label: "Delivery Question" },
  { value: "return", label: "Return / Replacement" },
  { value: "other", label: "Other" },
];

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  // Success button will remain visible for 5 seconds
  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [success]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading || success) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      setLoading(true);
      setStatus({ type: "", message: "" });

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to send message."
        );
      }

      // Reset form after successful submission
      form.reset();

      // Show success text inside the button
      setSuccess(true);

    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="contact-form-card">

      <div className="contact-form-head">
        <h3>Write to us</h3>
        <p>Fields marked with * are required.</p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>

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
              maxLength={100}
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
              maxLength={254}
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
              maxLength={25}
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
            maxLength={5000}
            placeholder="Please describe your question..."
            required
          ></textarea>
        </div>

        {/* ERROR MESSAGE ONLY */}
        {status.type === "error" && status.message && (
          <p
            role="alert"
            aria-live="polite"
            style={{
              color: "#dc2626",
              fontSize: "14px",
              margin: "0",
            }}
          >
            {status.message}
          </p>
        )}

        {/* SEND BUTTON */}
        <button
  type="submit"
  className={`contact-submit-button ${success ? "contact-submit-success" : ""}`}
  disabled={loading || success}
  aria-live="polite"
>
  <span>
    {loading
      ? "SENDING..."
      : success
      ? "SEND SUCCESSFULLY !"
      : "SEND MESSAGE"}
  </span>

  {!loading && !success && (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )}
</button>

      </form>
    </div>
  );
}
