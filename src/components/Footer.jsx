"use client";

import { useState } from "react";

import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

import Link from "next/link";
import "../styles/footer.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Footer() {
  const [email, setEmail] = useState("");

  // "idle" | "loading" | "success" | "error"
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (event) => {
    event.preventDefault();

    const cleanEmail = email.trim();

    if (!EMAIL_PATTERN.test(cleanEmail)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      /*
        TODO: apni API yahan connect karo, e.g.

        const res = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail }),
        });

        if (!res.ok) throw new Error("Failed");
      */

      await new Promise((resolve) => setTimeout(resolve, 600));

      setStatus("success");
      setMessage("Thanks for subscribing!");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">

        {/* ===============================
            TOP ROW
            1. Logo + About + Social
            2. Contact
            3. Subscribe (compact)
        =============================== */}
        <div className="footer-top">

          {/* BRAND */}
          <div className="footer-brand">

            <Link href="/" className="footer-logo-link">
              <img
                src="/images/white_logo.png"
                alt="LensMartIndia"
                className="footer-logo"
              />
            </Link>

            <p className="footer-description">
              Eyeglasses, sunglasses, contact lenses and
              eyewear essentials in one place.
            </p>

            <div className="footer-socials">
              <a
                href="#"
                className="social-link"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="social-link"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="social-link"
                aria-label="Pinterest"
              >
                <FaPinterestP />
              </a>
            </div>

          </div>


          {/* CONTACT */}
          <div className="footer-contact">

            <h4 className="footer-small-heading">
              NEED HELP?
            </h4>

            <a
              href="tel:+919876543210"
              className="footer-contact-item"
            >
              <FaPhoneAlt />

              <span>+91 98765 43210</span>
            </a>

            <a
              href="mailto:support@lensmartindia.com"
              className="footer-contact-item"
            >
              <FaEnvelope />

              <span>support@lensmartindia.com</span>
            </a>

            <p className="footer-working-hours">
              Mon - Sat | 9:00 AM - 7:00 PM
            </p>

          </div>


          {/* SUBSCRIBE (chhota) */}
          <div className="footer-newsletter">

            <h4 className="footer-small-heading">
              SUBSCRIBE
            </h4>

            <p className="newsletter-subtitle">
              Get offers and eye care tips in your inbox.
            </p>

            <form
              className="newsletter-form"
              onSubmit={handleSubscribe}
              noValidate
            >
              <div className="newsletter-field">
                <input
                  type="email"
                  name="email"
                  className="newsletter-input"
                  placeholder="Your email address"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);

                    if (status !== "idle" && status !== "loading") {
                      setStatus("idle");
                      setMessage("");
                    }
                  }}
                  autoComplete="email"
                  aria-label="Email address"
                  aria-invalid={status === "error"}
                  disabled={status === "loading"}
                />

                <button
                  type="submit"
                  className="newsletter-button"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "..." : "Subscribe"}
                </button>
              </div>

              <p
                className={`newsletter-message ${status}`}
                role="status"
                aria-live="polite"
              >
                {message}
              </p>
            </form>

          </div>

        </div>


        {/* ===============================
            DIVIDER
        =============================== */}
        <div className="footer-divider"></div>


        {/* ===============================
            LINKS
        =============================== */}
        <div className="footer-grid">

          {/* SHOP */}
          <div className="footer-column">
            <h3 className="footer-heading">SHOP</h3>

            <ul className="footer-links">
              <li>
                <Link href="eyeglasses">Eyeglasses</Link>
              </li>

              <li>
                <Link href="sunglasses">Sunglasses</Link>
              </li>

              <li>
                <Link href="all-products">Contact Lenses</Link>
              </li>

              <li>
                <Link href="">Solutions</Link>
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div className="footer-column">
            <h3 className="footer-heading">COMPANY</h3>

            <ul className="footer-links">
              <li>
                <Link href="about-us">About Us</Link>
              </li>

              <li>
                <Link href="/contact-us">Contact Us</Link>
              </li>

              <li>
                <Link href="/sale">Sale</Link>
              </li>

              <li>
                <Link href="blog">Blogs</Link>
              </li>
            </ul>
          </div>

          {/* CONTACT LENSES */}
          {/* <div className="footer-column">
            <h3 className="footer-heading">CONTACT LENSES</h3>

            <ul className="footer-links">
              <li>
                <Link href="daily-lenses">Daily Lenses</Link>
              </li>

              <li>
                <Link href="weekly-lenses">Weekly Lenses</Link>
              </li>

              <li>
                <Link href="monthly-lenses">Monthly Lenses</Link>
              </li>

              <li>
                <Link href="toric-lenses">
                  Toric / Astigmatism
                </Link>
              </li>

              <li>
                <Link href="multifocal-lenses">
                  Multifocal / Presbyopia
                </Link>
              </li>

              <li>
                <Link href="color-lenses">Color Lenses</Link>
              </li>

              <li>
                <Link href="all-products">
                  All contact lenses
                </Link>
              </li>
            </ul>
          </div> */}


          {/* CONTACT LENSES */}
<div className="footer-column">
  <h3 className="footer-heading">CONTACT LENSES</h3>

  <ul className="footer-links">
    <li>
      <Link href="/lens-type/daily">Daily Lenses</Link>
    </li>

    <li>
      <Link href="/lens-type/weekly">Weekly Lenses</Link>
    </li>

    <li>
      <Link href="/lens-type/monthly">Monthly Lenses</Link>
    </li>

    <li>
      <Link href="/lens-type/toric">Toric / Astigmatism</Link>
    </li>

    <li>
      <Link href="/lens-type/multifocal">Multifocal / Presbyopia</Link>
    </li>

    <li>
      <Link href="/lens-type/color">Color Lenses</Link>
    </li>

    {/* <li>
      <Link href="/all-products">All contact lenses</Link>
    </li> */}
  </ul>
</div>


          {/* HELP */}
          <div className="footer-column">
            <h3 className="footer-heading">HELP</h3>

            <ul className="footer-links">
              <li>
                <Link href="how-to-order">How to order</Link>
              </li>

              <li>
                <Link href="/prescription-guide">Prescription guide</Link>
              </li>

              <li>
                <Link href="/faq">FAQs</Link>
              </li>

              <li>
                <Link href="/shipping-delivery">Shipping &amp; Delivery</Link>
              </li>

              <li>
                <Link href="/return-refund">Return &amp; Refund</Link>
              </li>
            </ul>
          </div>


          

        </div>


        {/* ===============================
            BOTTOM
        =============================== */}
        <div className="footer-bottom">

          <p className="footer-copyright">
            © 2026 LensMartIndia. All rights reserved.
          </p>

          <div className="footer-policy-links">
            <Link href="/privacy-policy">
              Privacy Policy
            </Link>

            <span>|</span>

            <Link href="/terms-conditions">
              Terms &amp; Conditions
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
}
