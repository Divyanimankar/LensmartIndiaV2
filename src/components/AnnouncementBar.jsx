"use client";

import { useState } from "react";
import "../styles/announcement-bar.css";

export default function AnnouncementBar() {
  const [showBar, setShowBar] = useState(true);

  if (!showBar) return null;

  const announcements = [
    {
      text: "Complimentary shipping on orders over ₹999",
      type: "shipping",
    },
    {
      text: "Get ₹100 OFF on your first order",
      type: "offer",
    },
    {
      text: "100% Genuine Contact Lenses",
      type: "genuine",
    },
    {
      text: "Secure Payments & Easy Checkout",
      type: "secure",
    },
  ];

  const AnnouncementIcon = ({ type }) => {
    switch (type) {
      case "shipping":
        return (
          <span className="announcement-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 6H14V16H3V6Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M14 10H18L21 13V16H14V10Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle
                cx="7"
                cy="18"
                r="2"
                stroke="currentColor"
                strokeWidth="1.7"
              />

              <circle
                cx="18"
                cy="18"
                r="2"
                stroke="currentColor"
                strokeWidth="1.7"
              />
            </svg>
          </span>
        );

      case "offer":
        return (
          <span className="announcement-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="4"
                y="9"
                width="16"
                height="11"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.7"
              />

              <path
                d="M12 9V20"
                stroke="currentColor"
                strokeWidth="1.7"
              />

              <path
                d="M3 6H21V10H3V6Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />

              <path
                d="M12 6C10.8 3.3 7 2.8 7 4.7C7 6 8.8 6.5 12 6.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />

              <path
                d="M12 6C13.2 3.3 17 2.8 17 4.7C17 6 15.2 6.5 12 6.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </span>
        );

      case "genuine":
        return (
          <span className="announcement-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 2.5L15 4L18.3 3.9L19.2 7.1L21.5 9.5L19.9 12.4L20.1 15.7L17 16.8L14.7 19.2L12 17.4L9.3 19.2L7 16.8L3.9 15.7L4.1 12.4L2.5 9.5L4.8 7.1L5.7 3.9L9 4L12 2.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />

              <path
                d="M8.4 11.5L10.7 13.8L15.7 8.8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        );

      case "secure":
        return (
          <span className="announcement-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="4"
                y="10"
                width="16"
                height="11"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.7"
              />

              <path
                d="M7.5 10V7.5C7.5 5.01 9.51 3 12 3C14.49 3 16.5 5.01 16.5 7.5V10"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />

              <circle
                cx="12"
                cy="15"
                r="1.3"
                fill="currentColor"
              />
            </svg>
          </span>
        );

      default:
        return null;
    }
  };

  const renderAnnouncements = (setName) =>
    announcements.map((item, index) => (
      <div
        className="announcement-item"
        key={`${setName}-${index}`}
      >
        <AnnouncementIcon type={item.type} />

        <span className="announcement-text">
          {item.text}
        </span>
      </div>
    ));

  return (
    <div className="announcement-bar">
      <div className="announcement-slider">
        <div className="announcement-track">
          {/* First Set */}
          <div className="announcement-set">
            {renderAnnouncements("first")}
          </div>

          {/* Duplicate Set For Infinite Scroll */}
          <div
            className="announcement-set"
            aria-hidden="true"
          >
            {renderAnnouncements("second")}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="announcement-close"
        onClick={() => setShowBar(false)}
        aria-label="Close announcement bar"
      >
        ×
      </button>
    </div>
  );
}