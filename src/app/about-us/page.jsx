import SiteLayout from "@/components/SiteLayout";
import Newsletter from "@/components/Newsletter";
import "../../styles/aboutuspage.css";

// export const metadata = {
//   title: "About Us | LensMartIndia",
//   description:
//     "Learn about LensMartIndia and our commitment to a simple, transparent and convenient eyewear shopping experience.",
// };

export const metadata = {
  title: "About Us",
  description:
    "Learn about LensMartIndia and our commitment to a simple, transparent and convenient eyewear shopping experience.",
  alternates: {
    canonical: "/about-us",
  },
  openGraph: {
    title: "About Us",
    description:
      "Learn about LensMartIndia and explore contact lenses, eyeglasses and sunglasses through a convenient online shopping experience.",
    url: "https://lensmartindia.com/about-us",
    type: "website",
  },
};



const PRIORITIES = [
  {
    text: "Clear and useful product information",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </>
    ),
  },
  {
    text: "Simple and transparent pricing",
    icon: (
      <>
        <path d="M3 12V4h8l10 10-8 8L3 12Z" />
        <circle cx="7.5" cy="8.5" r="1" />
      </>
    ),
  },
  {
    text: "Convenient online ordering",
    icon: (
      <>
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
        <path d="M2 3h3l2.5 12h11L21 7H6" />
      </>
    ),
  },
  {
    text: "Easy product browsing",
    icon: (
      <>
        <path d="M7 4v16M17 4v16" />
        <path d="m3 8 4-4 4 4M13 16l4 4 4-4" />
      </>
    ),
  },
  {
    text: "Helpful customer support",
    icon: (
      <>
        <path d="M4 13v-2a8 8 0 0 1 16 0v2" />
        <path d="M4 13h3v6H4zM17 13h3v6h-3z" />
        <path d="M17 19c0 1-1 2-3 2h-2" />
      </>
    ),
  },
];

export default function AboutUsPage() {
  return (
    <SiteLayout>
      <div className="updatedAbout-Page">

        {/* BANNER */}
        <section className="updatedAbout-Banner">
          <img
            src="/images/aboutusbannerNew.jpg"
            alt="Eyeglasses, sunglasses and contact lenses at LensMartIndia"
            className="updatedAbout-Banner-Image"
          />
        </section>


        {/* INTRO */}
        <section className="updatedAbout-Intro">
          <div className="updatedAbout-Container updatedAbout-Intro-Inner">

            <span className="updatedAbout-Label">
              <i /> ABOUT LENSMARTINDIA <i />
            </span>

            <h1>
              <span>See the world clearly</span>
              <em>with LensMartIndia</em>
            </h1>

            <div className="updatedAbout-Heading-Line" aria-hidden="true">
              <i />
            </div>

            <p className="updatedAbout-Lead">
              At LensMartIndia, we believe eyewear shopping should be simple,
              comfortable and convenient. We make it easy for you to explore
              eyeglasses, sunglasses and contact lenses through one clean
              online shopping experience.
            </p>

            {/* <div className="updatedAbout-Two-Col">
              <p>
                Our goal is to make buying eyewear easier by providing clear
                product information, simple navigation and a carefully
                organized range of products for different needs and
                preferences.
              </p>

              <p>
                From everyday eyeglasses and sunglasses to contact lenses, we
                focus on creating an easy-to-use destination where customers
                can explore and compare their options with confidence.
              </p>
            </div> */}

          </div>
        </section>

 {/* VISION & MISSION */}
        <section className="updatedAbout-Values-Section">
          <div className="updatedAbout-Container">
            <div className="updatedAbout-Vm-Panel">

              <article className="updatedAbout-Vm-Col">
                <div className="updatedAbout-Vm-Top">
                  <div className="updatedAbout-Vm-Icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <span className="updatedAbout-Vm-Num">01</span>
                </div>

                <h2>Our Vision</h2>
                <span className="updatedAbout-Vm-Rule" aria-hidden="true" />

                <p>
                  To create a simple and dependable online destination where
                  customers can conveniently discover eyewear and contact
                  lens options for their everyday needs.
                </p>
              </article>

              <article className="updatedAbout-Vm-Col">
                <div className="updatedAbout-Vm-Top">
                  <div className="updatedAbout-Vm-Icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <circle cx="12" cy="12" r="5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <path d="m15 9 5-5" />
                    </svg>
                  </div>
                  <span className="updatedAbout-Vm-Num">02</span>
                </div>

                <h2>Our Mission</h2>
                <span className="updatedAbout-Vm-Rule" aria-hidden="true" />

                <p>
                  To make eyewear shopping easier through clear information,
                  convenient browsing, transparent choices and a
                  customer-focused online experience.
                </p>
              </article>

            </div>
          </div>
        </section>

        

        {/* CUSTOMER FOCUS */}
        <section className="updatedAbout-Focus">
          <span className="updatedAbout-Focus-Ring" aria-hidden="true" />

          <div className="updatedAbout-Container">

            <div className="updatedAbout-Focus-Head">
              <span className="updatedAbout-Label">OUR PROMISE</span>
              <h2>
                Your Shopping Experience <em>Comes First</em>
              </h2>
              <p>At LensMartIndia, we are focused on:</p>
            </div>

            <ul className="updatedAbout-Focus-Grid">
              {PRIORITIES.map((item, i) => (
                <li className="updatedAbout-Focus-Card" key={item.text}>
                  <span className="updatedAbout-Focus-Num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="updatedAbout-Focus-Icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      {item.icon}
                    </svg>
                  </span>

                  <strong>{item.text}</strong>

                  <span className="updatedAbout-Focus-Bar" aria-hidden="true" />
                </li>
              ))}
            </ul>

          </div>
        </section>


        {/* VISION & MISSION */}
        {/* <section className="updatedAbout-Values-Section">
          <div className="updatedAbout-Container">
            <div className="updatedAbout-Vm-Panel">

              <article className="updatedAbout-Vm-Col">
                <div className="updatedAbout-Vm-Top">
                  <div className="updatedAbout-Vm-Icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <span className="updatedAbout-Vm-Num">01</span>
                </div>

                <h2>Our Vision</h2>
                <span className="updatedAbout-Vm-Rule" aria-hidden="true" />

                <p>
                  To create a simple and dependable online destination where
                  customers can conveniently discover eyewear and contact
                  lens options for their everyday needs.
                </p>
              </article>

              <article className="updatedAbout-Vm-Col">
                <div className="updatedAbout-Vm-Top">
                  <div className="updatedAbout-Vm-Icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <circle cx="12" cy="12" r="5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <path d="m15 9 5-5" />
                    </svg>
                  </div>
                  <span className="updatedAbout-Vm-Num">02</span>
                </div>

                <h2>Our Mission</h2>
                <span className="updatedAbout-Vm-Rule" aria-hidden="true" />

                <p>
                  To make eyewear shopping easier through clear information,
                  convenient browsing, transparent choices and a
                  customer-focused online experience.
                </p>
              </article>

            </div>
          </div>
        </section> */}

      </div>
    </SiteLayout>
  );
}