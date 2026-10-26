"use client";

import { useState } from "react";
import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import "../../styles/registerpage.css";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!acceptedTerms) {
      alert("Please accept the Terms of Use and Privacy Policy.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    console.log("Register Data:", formData);

    // Registration API can be connected here later
  };

  return (
    <SiteLayout>
      <div className="register-page">
        <section className="register-section">
          <div className="register-card">

            {/* LOGO */}
            <div className="register-logo">
              <Link href="/">
                <img
                  src="/images/logo.png"
                  alt="LensMartIndia"
                />
              </Link>
            </div>

            {/* HEADING */}
            <h1>Create an account</h1>

            <p className="register-subtitle">
              Create your LensMartIndia account to get started.
            </p>

            {/* REGISTER FORM */}
            <form
              className="register-form"
              onSubmit={handleSubmit}
            >

              {/* FULL NAME */}
              <div className="register-input-group">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="register-input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="register-input-group register-password-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24">
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />
                      <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5.5 0 9 5 9 5a15.4 15.4 0 0 1-3 3.5" />
                      <path d="M6.6 6.6C4.4 8 3 10 3 10s3.5 5 9 5a9.8 9.8 0 0 0 3-.5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24">
                      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>
                  )}
                </button>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="register-input-group register-password-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <svg viewBox="0 0 24 24">
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />
                      <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5.5 0 9 5 9 5a15.4 15.4 0 0 1-3 3.5" />
                      <path d="M6.6 6.6C4.4 8 3 10 3 10s3.5 5 9 5a9.8 9.8 0 0 0 3-.5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24">
                      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>
                  )}
                </button>
              </div>

              {/* TERMS CHECKBOX */}
              <label className="register-terms-wrapper">
                <input
                  type="checkbox"
                  className="register-terms-checkbox"
                  checked={acceptedTerms}
                  onChange={(e) =>
                    setAcceptedTerms(e.target.checked)
                  }
                  required
                />

                <span className="register-custom-checkbox">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M5 12.5l4.2 4.2L19 7" />
                  </svg>
                </span>

                <span className="register-terms">
                  By creating an account, you agree to our{" "}
                  <Link
                    href=""
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms of Use
                  </Link>
                  {" "}and{" "}
                  <Link
                    href=""
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              {/* CREATE ACCOUNT */}
              <button
                type="submit"
                className="register-submit-btn"
              >
                Create Account
              </button>
            </form>

            {/* DIVIDER */}
            <div className="register-divider">
              <span></span>
              <p>or</p>
              <span></span>
            </div>

            {/* SOCIAL SIGN UP */}
            <div className="register-social-buttons">

              {/* GOOGLE */}
              <button
                type="button"
                className="register-social-btn"
              >
                <svg
                  className="register-google-icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.91h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.37Z"
                  />

                  <path
                    fill="#34A853"
                    d="M12 22c2.7 0 4.97-.9 6.62-2.4l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.05v2.59A10 10 0 0 0 12 22Z"
                  />

                  <path
                    fill="#FBBC05"
                    d="M6.39 13.92A6 6 0 0 1 6.08 12c0-.67.12-1.32.31-1.92V7.49H3.05A10 10 0 0 0 2 12c0 1.61.39 3.14 1.05 4.51l3.34-2.59Z"
                  />

                  <path
                    fill="#EA4335"
                    d="M12 5.95c1.47 0 2.79.51 3.83 1.5l2.87-2.87C16.96 2.96 14.7 2 12 2a10 10 0 0 0-8.95 5.49l3.34 2.59C7.18 7.71 9.39 5.95 12 5.95Z"
                  />
                </svg>

                <span>Sign up with Google</span>
              </button>

              {/* APPLE */}
              <button
                type="button"
                className="register-social-btn"
              >
                <svg
                  className="register-apple-icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.79 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.1v-.01ZM12.03 7.25C11.88 5.02 13.69 3.18 15.77 3c.29 2.58-2.34 4.5-3.74 4.25Z"
                  />
                </svg>

                <span>Sign up with Apple</span>
              </button>
            </div>

            {/* LOGIN LINK */}
            <div className="register-login-link">
              <span>Already have an account?</span>

              <Link href="/my-account">
                Log in
              </Link>
            </div>

          </div>
        </section>
      </div>
    </SiteLayout>
  );
}