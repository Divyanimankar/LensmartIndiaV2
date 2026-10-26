"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAnimatedClose } from "@/lib/motion";
import "../styles/DiscountPopup.css";

/* ---- Easy settings ---- */
const COUPON_CODE = "WELCOME10";
const SHOW_DELAY_MS = 500;
const SHOW_ONCE_PER_SESSION = false; // true = ek session mein sirf ek baar dikhega
const STORAGE_KEY = "lm_discount_popup_seen";

// Apni product image (transparent PNG/WebP best rehti hai) yahan lagao,
// jaise "/images/popup-glasses.png". Khali chhodoge to neeche wala glasses drawing dikhega.
const PRODUCT_IMAGE = "";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function GlassesArt() {
  return (
    <svg viewBox="0 0 420 240" className="discount-art" aria-hidden="true">
      <defs>
        <linearGradient id="discount-lens" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a8f8d" />
          <stop offset="1" stopColor="#0d3a39" />
        </linearGradient>
      </defs>
      <ellipse cx="210" cy="218" rx="130" ry="9" fill="rgba(16,40,44,0.14)" />
      <g transform="rotate(-8 210 110)">
        <path d="M30 70 L8 58" stroke="#10282c" strokeWidth="12" strokeLinecap="round" />
        <path d="M390 70 L412 58" stroke="#10282c" strokeWidth="12" strokeLinecap="round" />
        <rect x="28" y="52" width="164" height="112" rx="44" fill="url(#discount-lens)" stroke="#10282c" strokeWidth="14" />
        <rect x="228" y="52" width="164" height="112" rx="44" fill="url(#discount-lens)" stroke="#10282c" strokeWidth="14" />
        <path d="M192 88 Q210 70 228 88" fill="none" stroke="#10282c" strokeWidth="12" strokeLinecap="round" />
        <path d="M62 140 L108 76" stroke="#fff" strokeOpacity="0.35" strokeWidth="10" strokeLinecap="round" />
        <path d="M262 140 L308 76" stroke="#fff" strokeOpacity="0.35" strokeWidth="10" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function DiscountPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);

  const wrapRef = useRef(null);
  const closeRef = useRef(null);
  const copyTimer = useRef(null);

  const [closing, requestClose] = useAnimatedClose(() => setIsOpen(false));

  const closePopup = useCallback(() => {
    requestClose();
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  }, [requestClose]);

  // Show on load
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {}
    if (SHOW_ONCE_PER_SESSION && seen) return;

    const timer = setTimeout(() => setIsOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // Esc, focus trap, scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const wrap = wrapRef.current;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closePopup();
        return;
      }
      if (event.key !== "Tab" || !wrap) return;

      const items = wrap.querySelectorAll("button, input");
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [isOpen, closePopup]);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!EMAIL_RE.test(email.trim())) {
      setError("Enter a valid email address, like name@example.com.");
      return;
    }

    setError("");
    // TODO: yahan email ko apne backend / newsletter list mein save karo
    setSubscribed(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(COUPON_CODE);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`discount-overlay ${closing ? "is-closing" : ""}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closePopup();
      }}
    >
      <div
        ref={wrapRef}
        className={`discount-wrap ${closing ? "is-closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="discount-title"
      >
        <button
          ref={closeRef}
          className="discount-close"
          onClick={closePopup}
          aria-label="Close discount popup"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </button>

        <section className="discount-popup">
          <div className="discount-bg" aria-hidden="true" />

          <div className="discount-content" aria-live="polite">
            <h2
              id="discount-title"
              className="discount-headline"
              aria-label="Sign up now and get 10% off"
            >
              <span className="dh-lead" aria-hidden="true">
                <span>Sign up now</span>
                <span>&amp; get</span>
              </span>
              <span className="dh-ten" aria-hidden="true">
                10
              </span>
              <span className="dh-tail" aria-hidden="true">
                <span>%</span>
                <span>off</span>
              </span>
            </h2>

            {!subscribed ? (
              <>
                <p className="discount-description">
                  Get weekly updates on the newest offers, eyewear tips and
                  lens guides right in your mailbox.
                </p>

                <form className="discount-form" onSubmit={handleSubmit} noValidate>
                  <label className="discount-sr-only" htmlFor="discount-email">
                    Email address
                  </label>
                  <input
                    id="discount-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    aria-invalid={!!error}
                    aria-describedby={error ? "discount-error" : undefined}
                  />
                  <button type="submit">Get my code</button>
                </form>

                {error && (
                  <p id="discount-error" className="discount-error" role="alert">
                    {error}
                  </p>
                )}

                <p className="discount-privacy">
                  Your email is safe with us. No spam.
                </p>

                <button
                  type="button"
                  className="discount-no-thanks"
                  onClick={closePopup}
                >
                  No thanks
                </button>
              </>
            ) : (
              <div className="discount-success">
                <p className="discount-thanks">
                  <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                    <circle cx="12" cy="12" r="11" fill="#1b6b6a" />
                    <path
                      d="M7 12.5l3.2 3.2L17 8.8"
                      stroke="#fff"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                  Thanks for subscribing!
                </p>

                <p className="discount-description">
                  Use this code at checkout to save 10% on your first order.
                </p>

                <div className="discount-code">
                  <strong>{COUPON_CODE}</strong>
                  <button type="button" onClick={handleCopy}>
                    {copied ? "Copied" : "Copy code"}
                  </button>
                </div>

                <button
                  type="button"
                  className="discount-done"
                  onClick={closePopup}
                >
                  Start shopping
                </button>
              </div>
            )}
          </div>

          <div className="discount-product" aria-hidden="true">
            <div className="discount-art-wrap">
              {PRODUCT_IMAGE ? (
                <img src={PRODUCT_IMAGE} alt="" className="discount-art-img" />
              ) : (
                <GlassesArt />
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}