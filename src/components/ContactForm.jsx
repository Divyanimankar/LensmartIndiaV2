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
  const [phone, setPhone] = useState("");

  // type: "" | "success" | "error"
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  // "Message sent successfully!" 2 second baad apne aap hat jaye
  useEffect(() => {
    if (status.type !== "success") return;

    const timer = setTimeout(() => {
      setStatus({ type: "", message: "" });
    }, 2000);

    return () => clearTimeout(timer);
  }, [status]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: phone,
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    // Phone optional hai, par agar daala hai to exactly 10 digits hone chahiye
    if (phone && phone.length !== 10) {
      setStatus({
        type: "error",
        message: "Please enter a valid 10-digit mobile number.",
      });
      return;
    }

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
        throw new Error(result.message || "Unable to send message.");
      }

      // Form reset
      form.reset();
      setPhone("");

      // Button ke neeche success message (2 second ke liye)
      setStatus({
        type: "success",
        message: "Message sent successfully!",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong. Please try again.",
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
              placeholder="98765 43210"
              autoComplete="tel-national"
              inputMode="numeric"
              maxLength={10}
              pattern="[0-9]{10}"
              title="Enter a 10-digit mobile number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
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

        {/* SEND BUTTON (hamesha same rehta hai) */}
        <button
          type="submit"
          className="contact-submit-button"
          disabled={loading}
        >
          <span>{loading ? "SENDING..." : "SEND MESSAGE"}</span>

          {!loading && (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          )}
        </button>

        {/* SUCCESS / ERROR MESSAGE (button ke neeche, newsletter jaisa) */}
        <p
          className={`contact-form-message ${status.type}`}
          role="status"
          aria-live="polite"
        >
          {status.message}
        </p>

      </form>
    </div>
  );
}