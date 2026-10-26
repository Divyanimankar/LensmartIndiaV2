"use client";

import { useState } from "react";
import "../styles/newsletter.css";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      setMessageType("error");
      return;
    }

    setMessage("Thank you for subscribing!");
    setMessageType("success");
    setEmail("");
  };

  return (
    <section className="newsLetterHro">
      <div className="newsLetterContent">

        {/* HEADING */}
        <h2>READY TO GET STARTED?</h2>

        {/* DESCRIPTION */}
        <p>
          Subscribe to receive the latest eyewear trends, new arrivals,
          special offers and updates from LensMartIndia.
        </p>

        {/* NEWSLETTER FORM */}
        <form
          className="newsLetterForm"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);

              if (message) {
                setMessage("");
                setMessageType("");
              }
            }}
            placeholder="Enter your email address"
            aria-label="Email address"
          />

          <button type="submit">
            Subscribe
          </button>
        </form>

        {/* MESSAGE */}
        {message && (
          <p
            className={`newsletterMessage ${messageType}`}
            role="status"
          >
            {message}
          </p>
        )}

      </div>
    </section>
  );
}