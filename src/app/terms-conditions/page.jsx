"use client";

import SiteLayout from "@/components/SiteLayout";
import "../../styles/termsandconditions.css";

const LAST_UPDATED = "19 October 2026";
const SUPPORT_PHONE = "+91 98765 43210";
const SUPPORT_EMAIL = "support@lensmartindia.com";

const sections = [
  {
    title: "1. Introduction",
    paragraphs: [
      "Welcome to LensMartIndia. These Terms & Conditions govern your use of our website, products, and services.",
      "By browsing our website, creating an account, or placing an order, you agree to these terms. If you do not agree, please discontinue using the website.",
    ],
  },
  {
    title: "2. Eligibility & Account",
    paragraphs: [
      "Please provide accurate and complete information when creating an account or placing an order.",
      "You are responsible for keeping your login details secure. Please notify us if you suspect unauthorized access to your account.",
    ],
  },
  {
    title: "3. Products & Information",
    paragraphs: [
      "We aim to display accurate product descriptions, images, prices, availability, and specifications. Product appearance or packaging may vary slightly from the images shown.",
      "Prices, product details, and availability may change. Please check the product page and checkout details before placing your order.",
    ],
  },
  {
    title: "4. Orders & Payments",
    paragraphs: [
      "Placing an order is a request to purchase the selected products. Orders may be subject to verification and product availability.",
      "Applicable prices, taxes, delivery charges, discounts, and available payment methods will be shown during checkout. Please verify your order details before payment.",
      "Order cancellations, payment reversals, and refunds will be handled according to the applicable published policies and law.",
    ],
  },
  {
    title: "5. Shipping & Delivery",
    paragraphs: [
      "Orders will be delivered to the address provided during checkout. Delivery estimates, shipping charges, and service availability will be communicated where applicable.",
      "Delivery may be delayed due to courier operations, weather, public holidays, incorrect address details, or other circumstances beyond our reasonable control.",
      "Please contact our support team if your order is delayed or tracking information is unavailable.",
    ],
  },
  {
    title: "6. Returns & Refunds",
    paragraphs: [
      "Returns, exchanges, cancellations, and refunds depend on the product, its condition, and the reason for the request.",
      "Certain contact lens and eyewear products may be subject to hygiene or safety restrictions. Please review our applicable Return & Refund Policy before placing an order.",
      "Nothing in these terms limits consumer rights that cannot legally be excluded.",
    ],
  },
  {
    title: "7. Contact Lens Safety",
    paragraphs: [
      "Contact lenses must be used responsibly and according to the product instructions and advice of a qualified eye-care professional.",
      "Where a prescription is required, please ensure it is valid and appropriate for the lenses you purchase.",
      "Our website information is not a substitute for professional medical advice, a fitting, or an eye examination.",
      "Do not exceed the recommended wearing period, share lenses with others, or use damaged or contaminated lenses. If you experience eye pain, redness, irritation, or changes in vision, remove your lenses and consult an eye-care professional.",
    ],
  },
  {
    title: "8. User Responsibilities",
    paragraphs: [
      "You agree to use our website lawfully and provide accurate information.",
      "You must not misuse the website, attempt unauthorized access, submit fraudulent orders, interfere with website operations, upload malicious code, or copy protected content without permission.",
    ],
  },
  {
    title: "9. Intellectual Property",
    paragraphs: [
      "Website text, graphics, logos, layouts, design elements, and other content may be protected by intellectual property laws.",
      "You may use the website for personal and lawful shopping purposes. You may not reproduce, distribute, or commercially use protected content without permission.",
      "Third-party product names and trademarks belong to their respective owners.",
    ],
  },
  {
    title: "10. Privacy & Security",
    paragraphs: [
      "We handle personal information according to our Privacy Policy and applicable law. Information may be used to process orders, arrange deliveries, provide customer support, and meet legal obligations.",
      "Please read our Privacy Policy to understand how your personal information is collected, used, and protected.",
    ],
  },
  {
    title: "11. Limitation of Liability",
    paragraphs: [
      "To the extent permitted by applicable law, LensMartIndia is not responsible for indirect losses arising from temporary website unavailability, third-party service interruptions, or misuse of products contrary to their instructions.",
      "Nothing in these terms excludes liability where such exclusion is prohibited by law or removes consumer rights that must be preserved.",
    ],
  },
  {
    title: "12. Changes to These Terms",
    paragraphs: [
      "We may update these Terms & Conditions to reflect changes in our services, business practices, or legal requirements.",
      "Updated terms will be published on this page with a revised date. Please review this page periodically.",
    ],
  },
];

export default function TermsAndConditions() {
  return (
    <SiteLayout>
      <div className="terms-page">
        <section className="terms-hero">
          <div className="terms-container">
            <p className="terms-eyebrow">LENSMARTINDIA</p>
            <h1>Terms & Conditions</h1>
            <p>
              Please read these terms before using our website or
              placing an order.
            </p>
            <span className="terms-updated">
              Last updated: {LAST_UPDATED}
            </span>
          </div>
        </section>

        <section className="terms-content">
          <div className="terms-container">
            {sections.map((section) => (
              <article
                className="terms-section"
                key={section.title}
              >
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </article>
            ))}

            <article className="terms-section">
              <h2>13. Contact Us</h2>
              <p>
                If you have any questions about these Terms & Conditions,
                an order, or a product, please contact our support team.
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${SUPPORT_EMAIL}`}>
                  {SUPPORT_EMAIL}
                </a>
              </p>
              <p>
                <strong>Phone: </strong>
                <a href="tel:+919876543210">{SUPPORT_PHONE}</a>
              </p>
              <p>
                <strong>Website: </strong>
                <a href="/contact-us">Contact Us</a>
              </p>
            </article>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}