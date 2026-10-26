"use client";

import { useState } from "react";
import "../styles/beforeAfter.css";

export default function BeforeAfter() {
  const [position, setPosition] = useState(50);

  const handleSliderChange = (e) => {
    setPosition(Number(e.target.value));
  };

  const ComparisonText = ({ blurred = false }) => (
    <div
      className={`comparison-content ${
        blurred ? "comparison-content-blurred" : ""
      }`}
    >
      <p className="comparison-small-heading">
        SEE THE DIFFERENCE
      </p>

      <h3 className="comparison-heading">
        EXPERIENCE A CLEARER VIEW
      </h3>

      <p className="comparison-description">
        Drag the slider to compare the difference between
        blurred and clear vision.
      </p>
    </div>
  );

  return (
    <section className="before-after-section">

      {/* SECTION HEADING */}

      <div className="before-after-heading">
        <h2 className="before-after-title">
          BEFORE & AFTER
        </h2>

        <p className="before-after-subtitle">
          Slide to see the difference between blurred and clear vision.
        </p>
      </div>


      {/* COMPARISON */}

      <div
        className="before-after-container"
        style={{
          "--position": `${position}%`,
        }}
      >

        {/* =====================================
            AFTER
            FULL BACKGROUND
            RIGHT SIDE
        ====================================== */}

        <div className="comparison-image-layer comparison-after">

          <img
            src="/images/aftervision.png"
            alt="Clear vision"
            className="comparison-image"
          />

          <div className="comparison-overlay" />

          <span className="comparison-label after-label">
            AFTER
          </span>

          <ComparisonText />

        </div>


        {/* =====================================
            BEFORE
            LEFT SIDE
            THIS LAYER CHANGES WIDTH
        ====================================== */}

        <div className="comparison-before-wrapper">

          <div className="comparison-image-layer comparison-before">

            <img
              src="/images/beforevision.png"
              alt="Blurred vision"
              className="comparison-image"
            />

            <div className="comparison-overlay" />

            <span className="comparison-label before-label">
              BEFORE
            </span>

            <ComparisonText blurred />

          </div>

        </div>


        {/* =====================================
            DIVIDER
        ====================================== */}

        <div className="comparison-divider">

          <div className="comparison-handle">

            <svg
              className="handle-icon"
              viewBox="0 0 28 18"
              aria-hidden="true"
            >
              <path d="M10 3L4 9L10 15" />
              <path d="M18 3L24 9L18 15" />
            </svg>

          </div>

        </div>


        {/* =====================================
            RANGE
        ====================================== */}

        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={handleSliderChange}
          className="comparison-range"
          aria-label="Compare before and after vision"
        />

      </div>

    </section>
  );
}