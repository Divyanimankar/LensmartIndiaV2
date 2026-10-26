// "use client";

// import SiteLayout from "@/components/SiteLayout";
// import Newsletter from "@/components/Newsletter";
// import Faq from "@/components/Faq";
// import "../../styles/contactuspage.css";

// export default function ContactUsPage() {
//   return (
//     <SiteLayout>
//       <div className="contact-page">

//         {/* =========================================
//             CONTACT US IMAGE BANNER
//         ========================================= */}

//         <section className="contact-banner">
//           <img
//             src="/images/contactusbanner.png"
//             alt="Contact LensMartIndia"
//             className="contact-banner-image"
//           />
//         </section>


//         {/* =========================================
//             MESSAGE + FORM SECTION
//         ========================================= */}

//         <section className="contact-main-section">

//           <div className="contact-container contact-main-grid">

//             {/* =====================================
//                 LEFT CONTENT
//             ===================================== */}

//             <div className="contact-left-content">

//               <span className="contact-label">
//                 GET IN TOUCH
//               </span>

//               <h1>SEND US A MESSAGE</h1>

//               <p>
//                 Have a question about our products, your order or shopping with
//                 LensMartIndia? Fill out the form and our team will be happy to
//                 assist you.
//               </p>


//               {/* HELP POINTS */}

//               <div className="contact-help-points">

//                 <div className="contact-help-item">
//                   <span className="contact-check">
//                     ✓
//                   </span>

//                   <p>
//                     Help with product information
//                   </p>
//                 </div>


//                 <div className="contact-help-item">
//                   <span className="contact-check">
//                     ✓
//                   </span>

//                   <p>
//                     Help with order-related questions
//                   </p>
//                 </div>


//                 <div className="contact-help-item">
//                   <span className="contact-check">
//                     ✓
//                   </span>

//                   <p>
//                     General customer support
//                   </p>
//                 </div>

//               </div>

//             </div>


//             {/* =====================================
//                 RIGHT FORM
//             ===================================== */}

//             <div className="contact-form-card">

//               <form
//                 className="contact-form"
//                 onSubmit={(e) => e.preventDefault()}
//               >

//                 {/* FULL NAME */}

//                 <div className="contact-field contact-full-field">

//                   <label htmlFor="name">
//                     Full Name
//                   </label>

//                   <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     placeholder="e.g. Rahul Sharma"
//                     autoComplete="name"
//                     required
//                   />

//                 </div>


//                 {/* EMAIL */}

//                 <div className="contact-field">

//                   <label htmlFor="email">
//                     Email Address
//                   </label>

//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     placeholder="e.g. name@example.com"
//                     autoComplete="email"
//                     required
//                   />

//                 </div>


//                 {/* PHONE */}

//                 <div className="contact-field">

//                   <label htmlFor="phone">
//                     Phone Number
//                   </label>

//                   <input
//                     type="tel"
//                     id="phone"
//                     name="phone"
//                     placeholder="e.g. +91 98765 43210"
//                     autoComplete="tel"
//                   />

//                 </div>


//                 {/* =================================
//                     SUBJECT / TOPIC DROPDOWN
//                 ================================= */}

//                 <div className="contact-field contact-full-field">

//                   <label htmlFor="subject">
//                     How can we help?
//                   </label>

//                   <div className="contact-select-wrapper">

//                     <select
//                       id="subject"
//                       name="subject"
//                       defaultValue=""
//                       required
//                     >

//                       <option
//                         value=""
//                         disabled
//                       >
//                         Select a topic
//                       </option>

//                       <option value="order">
//                         Order Status & Tracking
//                       </option>

//                       <option value="product">
//                         Product Information
//                       </option>

//                       <option value="delivery">
//                         Delivery Question
//                       </option>

//                       <option value="return">
//                         Return / Replacement Question
//                       </option>

//                       <option value="other">
//                         Other
//                       </option>

//                     </select>


//                     {/* CUSTOM DROPDOWN ARROW */}

//                     <span
//                       className="contact-select-arrow"
//                       aria-hidden="true"
//                     >

//                       <svg viewBox="0 0 24 24">
//                         <path d="m6 9 6 6 6-6" />
//                       </svg>

//                     </span>

//                   </div>

//                 </div>


//                 {/* MESSAGE */}

//                 <div className="contact-field contact-full-field">

//                   <label htmlFor="message">
//                     Message
//                   </label>

//                   <textarea
//                     id="message"
//                     name="message"
//                     rows="6"
//                     placeholder="Please describe your question..."
//                     required
//                   ></textarea>

//                 </div>


//                 {/* SEND BUTTON */}

//                 <button
//                   type="submit"
//                   className="contact-submit-button"
//                 >
//                   SEND MESSAGE
//                 </button>

//               </form>

//             </div>

//           </div>

//         </section>


//         {/* =========================================
//             CONTACT CARDS
//         ========================================= */}

//         <section className="contact-details-section">

//           <div className="contact-container contact-details-grid">


//             {/* =====================================
//                 EMAIL CARD
//             ===================================== */}

//             <article className="contact-detail-card">

//               <div className="contact-detail-icon">

//                 <svg
//                   viewBox="0 0 24 24"
//                   aria-hidden="true"
//                 >

//                   <rect
//                     x="3"
//                     y="5"
//                     width="18"
//                     height="14"
//                     rx="2"
//                   />

//                   <path d="m3 7 9 6 9-6" />

//                 </svg>

//               </div>

//               <span>
//                 EMAIL US
//               </span>

//               <h2>
//                 Customer Support
//               </h2>

//               <a href="mailto:support@lensmartindia.com">
//                 support@lensmartindia.com
//               </a>

//               <p>
//                 Send us your questions and our team will assist you.
//               </p>

//             </article>


//             {/* =====================================
//                 SUPPORT CARD
//             ===================================== */}

//             <article className="contact-detail-card">

//               <div className="contact-detail-icon">

//                 <svg
//                   viewBox="0 0 24 24"
//                   aria-hidden="true"
//                 >

//                   <path d="M4 13v-2a8 8 0 0 1 16 0v2" />

//                   <path d="M4 13h3v6H4z" />

//                   <path d="M17 13h3v6h-3z" />

//                   <path d="M17 19c0 1-1 2-3 2h-2" />

//                 </svg>

//               </div>

//               <span>
//                 CUSTOMER SUPPORT
//               </span>

//               <h2>
//                 We're Here to Help
//               </h2>

//               <p>
//                 Contact us for product, order and general shopping questions.
//               </p>

//             </article>


//             {/* =====================================
//                 DELIVERY CARD
//             ===================================== */}

//             <article className="contact-detail-card">

//               <div className="contact-detail-icon">

//                 <svg
//                   viewBox="0 0 24 24"
//                   aria-hidden="true"
//                 >

//                   <path d="M3 7h11v9H3z" />

//                   <path d="M14 10h4l3 3v3h-7z" />

//                   <circle
//                     cx="7"
//                     cy="18"
//                     r="2"
//                   />

//                   <circle
//                     cx="18"
//                     cy="18"
//                     r="2"
//                   />

//                 </svg>

//               </div>

//               <span>
//                 DELIVERY
//               </span>

//               <h2>
//                 Order Assistance
//               </h2>

//               <p>
//                 Have a delivery or order-related question? Send us a message
//                 and our team will help.
//               </p>

//             </article>

//           </div>

//         </section>


//         {/* =========================================
//             FAQ
//         ========================================= */}

//         <Faq />


        

//       </div>
//     </SiteLayout>
//   );
// }



"use client";

import SiteLayout from "@/components/SiteLayout";
import Newsletter from "@/components/Newsletter";
import Faq from "@/components/Faq";
import "../../styles/contactuspage.css";

const TOPICS = [
  { value: "order", label: "Order Status & Tracking" },
  { value: "product", label: "Product Information" },
  { value: "delivery", label: "Delivery Question" },
  { value: "return", label: "Return / Replacement" },
  { value: "other", label: "Other" },
];

export default function ContactUsPage() {
  return (
    <SiteLayout>
      <div className="contact-page">

        {/* =========================================
            HERO (banner image + overlay + title)
        ========================================= */}

        <section className="contact-hero">
          <img
            // src="/images/contactusbanner.png"
             src="/images/contactusbannerNew.png"
            
            alt=""
            aria-hidden="true"
            className="contact-hero-image"
          />
          <div className="contact-hero-overlay" />
          <span className="contact-hero-orb orb-one" aria-hidden="true" />
          <span className="contact-hero-orb orb-two" aria-hidden="true" />

          <div className="contact-container contact-hero-content">
            <span className="contact-pill">
              <i /> CONTACT LENSMARTINDIA
            </span>

            <h1>
              Let&apos;s talk.
              <em> We&apos;re happy to help.</em>
            </h1>

            <p>
              Questions about a product, your order or delivery? Send us a
              message and our team will get back to you.
            </p>
          </div>
        </section>


        {/* =========================================
            FLOATING QUICK CONTACT CARDS
        ========================================= */}

        <section className="contact-quick">
          <div className="contact-container contact-quick-grid">

            <a
              href="mailto:support@lensmartindia.com"
              className="contact-quick-card"
            >
              <div className="contact-quick-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </div>
              <div className="contact-quick-text">
                <span>EMAIL US</span>
                <strong>support@lensmartindia.com</strong>
                <p>Send us your questions and our team will assist you.</p>
              </div>
              <span className="contact-quick-go" aria-hidden="true">→</span>
            </a>

            <div className="contact-quick-card">
              <div className="contact-quick-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 13v-2a8 8 0 0 1 16 0v2" />
                  <path d="M4 13h3v6H4z" />
                  <path d="M17 13h3v6h-3z" />
                  <path d="M17 19c0 1-1 2-3 2h-2" />
                </svg>
              </div>
              <div className="contact-quick-text">
                <span>CUSTOMER SUPPORT</span>
                <strong>We&apos;re Here to Help</strong>
                <p>Product, order and general shopping questions.</p>
              </div>
            </div>

            <div className="contact-quick-card">
              <div className="contact-quick-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 7h11v9H3z" />
                  <path d="M14 10h4l3 3v3h-7z" />
                  <circle cx="7" cy="18" r="2" />
                  <circle cx="18" cy="18" r="2" />
                </svg>
              </div>
              <div className="contact-quick-text">
                <span>DELIVERY</span>
                <strong>Order Assistance</strong>
                <p>Delivery or order-related question? We&apos;ll help.</p>
              </div>
            </div>

          </div>
        </section>


        {/* =========================================
            MESSAGE + FORM
        ========================================= */}

        <section className="contact-main-section">
          <div className="contact-container contact-main-grid">

            {/* ---------- LEFT: info panel ---------- */}

            <aside className="contact-left-content">
              {/* <span className="contact-glow" aria-hidden="true" />
              <span className="contact-ring" aria-hidden="true" /> */}

              <span className="contact-label">GET IN TOUCH</span>

              <h2>Send us a message</h2>

              <p>
                Have a question about our products, your order or shopping
                with LensMartIndia? Fill out the form and our team will be
                happy to assist you.
              </p>

              <ul className="contact-help-points">
                {[
                  "Help with product information",
                  "Help with order-related questions",
                  "General customer support",
                ].map((text) => (
                  <li className="contact-help-item" key={text}>
                    <span className="contact-check">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m5 12.5 4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>

              <a
                href="mailto:support@lensmartindia.com"
                className="contact-left-mail"
              >
                support@lensmartindia.com
              </a>
            </aside>


            {/* ---------- RIGHT: form ---------- */}

            <div className="contact-form-card">

              <div className="contact-form-head">
                <h3>Write to us</h3>
                <p>Fields marked with * are required.</p>
              </div>

              <form
                className="contact-form"
                onSubmit={(e) => e.preventDefault()}
              >

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
                    placeholder="Please describe your question..."
                    required
                  ></textarea>
                </div>

                {/* SEND BUTTON */}
                <button type="submit" className="contact-submit-button">
                  <span>SEND MESSAGE</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </button>

              </form>
            </div>

          </div>
        </section>


        {/* =========================================
            FAQ
        ========================================= */}

        <Faq />

      </div>
    </SiteLayout>
  );
}