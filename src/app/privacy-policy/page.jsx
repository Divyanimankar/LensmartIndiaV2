"use client";

import SiteLayout from "@/components/SiteLayout";
import "../../styles/privacypolicy.css";

const LAST_UPDATED = "19 October 2026";
const SUPPORT_EMAIL = "support@lensmartindia.com";
const PRIVACY_EMAIL = "privacy@lensmartindia.com";
const SUPPORT_PHONE = "+91 98765 43210";

const policySections = [
  {
    title: "1. Who We Are",
    paragraphs: [
      "LensMartIndia operates this website and explains through this Privacy Policy how we collect, use, store and protect your personal information when you browse our website or purchase our products.",
      "By using our website, creating an account or placing an order, you acknowledge that you have read this Privacy Policy."
    ]
  },
  {
    title: "2. Information We Collect",
    paragraphs: [
      "We may collect your name, email address, phone number, billing address, delivery address and account details when you use our website.",
      "We may also collect order history, payment status, refund details and prescription information where required for your purchase.",
      "Basic technical information, including your IP address, browser type, device information, cookies and website usage, may also be collected."
    ]
  },
  {
    title: "3. How We Use Your Information",
    paragraphs: [
      "We use your information to process orders, arrange deliveries, manage your account, verify prescriptions where required and provide customer support.",
      "Your information may also be used to process returns and refunds, prevent fraud, improve website performance and meet legal obligations.",
      "We may send promotional emails or offers where permitted. You can opt out of marketing communications at any time."
    ]
  },
  {
    title: "4. Consent and Lawful Use",
    paragraphs: [
      "We process personal information with your consent or where otherwise permitted by applicable law, including when information is needed to fulfil your order or comply with legal requirements.",
      "You may withdraw your consent where applicable. Withdrawal does not affect processing already carried out lawfully, and some services may require certain information to function."
    ]
  },
  {
    title: "5. Sharing Your Information",
    paragraphs: [
      "We may share necessary information with courier companies, payment gateways, technology providers and customer support partners to provide our services.",
      "We may disclose information when required by law, a court order or a lawful request from a public authority.",
      "We do not sell your personal information. Information shared with service providers should be limited to what is needed for their services."
    ]
  },
  {
    title: "6. Cookies",
    paragraphs: [
      "Cookies help our website remember your preferences, maintain your shopping cart, understand website usage and improve security.",
      "You can manage or delete cookies through your browser settings. Disabling certain cookies may affect website functionality."
    ]
  },
  {
    title: "7. Data Retention",
    paragraphs: [
      "We retain personal information only for as long as necessary to provide our services, fulfil the purposes described in this policy, meet legal and accounting requirements, and resolve disputes.",
      "When information is no longer required, we take appropriate steps to delete or anonymise it, subject to applicable legal requirements."
    ]
  },
  {
    title: "8. Data Security",
    paragraphs: [
      "We use reasonable technical and organisational measures to protect your personal information against unauthorised access, loss, misuse or disclosure.",
      "However, no online system can guarantee complete security. Please keep your account credentials confidential and contact us if you notice suspicious activity."
    ]
  },
  {
    title: "9. Your Rights and Choices",
    paragraphs: [
      "Subject to applicable law, you may request access to your personal information, correction of inaccurate details, deletion of information or withdrawal of consent.",
      "You may also unsubscribe from marketing communications and raise a grievance regarding the handling of your personal information.",
      `To make a privacy request, contact us at ${PRIVACY_EMAIL}. We may verify your identity before processing your request.`
    ]
  },
  {
    title: "10. Children's Privacy",
    paragraphs: [
      "Our website is intended for adults. We do not knowingly collect children's personal information without the consent of a parent or legal guardian where required by law.",
      "If you believe a child has provided personal information without the required consent, please contact us so we can take appropriate action."
    ]
  },
  {
    title: "11. Third-Party Links",
    paragraphs: [
      "Our website may contain links to third-party websites or services. We are not responsible for their content, security or privacy practices.",
      "Please review the privacy policies of third-party websites before sharing your personal information with them."
    ]
  },
  {
    title: "12. Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time to reflect changes in our services or applicable laws.",
      "The latest revision date will be displayed at the top of this page. We encourage you to review this policy periodically."
    ]
  },
  {
    title: "13. Contact Us",
    paragraphs: [
      "If you have any questions about this Privacy Policy, your personal information or a privacy-related request, please contact us using the details below."
    ]
  }
];

export default function PrivacyPolicy() {
  return (
    <SiteLayout>
      <div className="privacy-page">
        <section className="privacy-hero">
          <div className="privacy-container">
            <p className="privacy-label">LENSMARTINDIA</p>

            <h1>Privacy Policy</h1>

            <p className="privacy-intro">
              Your privacy matters to us. Learn how we collect, use and
              protect your personal information when you use our website.
            </p>

            <p className="privacy-updated">
              Last updated: {LAST_UPDATED}
            </p>
          </div>
        </section>

        <section className="privacy-content">
          <div className="privacy-container">
            {policySections.map((section, index) => (
              <article
                className="privacy-article"
                key={section.title}
              >
                <h2>{section.title}</h2>

                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex}>{paragraph}</p>
                ))}

                {index === policySections.length - 1 && (
                  <div className="privacy-contact-details">
                    <p>
                      <strong>Email:</strong>{" "}
                      <a href={`mailto:${PRIVACY_EMAIL}`}>
                        {PRIVACY_EMAIL}
                      </a>
                    </p>

                    <p>
                      <strong>Support:</strong>{" "}
                      <a href={`mailto:${SUPPORT_EMAIL}`}>
                        {SUPPORT_EMAIL}
                      </a>
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      <a href="tel:+919876543210">
                        {SUPPORT_PHONE}
                      </a>
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}