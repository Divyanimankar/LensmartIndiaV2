import Link from "next/link";
import "../styles/brandSlider.css";

const brands = [
  {
    name: "Air Optix",
    image: "/images/air-optix.png",
    href: "/brands/air-optix",
  },
  {
    name: "Dailies",
    image: "/images/dailies.png",
    href: "/brands/dailies",
  },
  {
    name: "Freshlook",
    image: "/images/freshlook.png",
    href: "/brands/freshlook",
  },
  {
    name: "Precision1",
    image: "/images/precision1.png",
    href: "/brands/precision1",
  },

  // {
  //   name: "Aspire",
  //   image: "/images/aspire.png",
  //   href: "/brands/aspire",
  // },

  {
    name: "Biofinity",
    image: "/images/biofinity.png",
    href: "/brands/biofinity",
  },
  {
    name: "Biomedics",
    image: "/images/biomedics.png",
    href: "/brands/biomedics",
  },
  {
    name: "MyDay",
    image: "/images/myday.png",
    href: "/brands/myday",
  },
  {
    name: "Proclear",
    image: "/images/proclear.png",
    href: "/brands/proclear",
  },
  {
    name: "Biotrue",
    image: "/images/biotrue.png",
    href: "/brands/biotrue",
  },

  // {
  //   name: "Iconnect",
  //   image: "/images/iconnect.png",
  //   href: "/brands/iconnect",
  // },

  // {
  //   name: "Lacelle",
  //   image: "/images/lacelle.png",
  //   href: "/brands/lacelle",
  // },

  {
    name: "PureVision",
    image: "/images/purevision.png",
    href: "/brands/purevision",
  },
  {
    name: "Soflens",
    image: "/images/soflens.png",
    href: "/brands/soflens",
  },
  {
    name: "Ultra",
    image: "/images/ultra.png",
    href: "/brands/ultra",
  },
  {
    name: "Acuvue",
    image: "/images/acuvue.png",
    href: "/brands/acuvue",
  },
];

export default function BrandSlider() {
  return (
    <section className="brand-section">

      <div className="brand-section-heading">
        
        <h2>BRANDS WE CARRY</h2>
      </div>

      <div className="brand-slider">

        <div className="brand-slider-track">

          {/* FIRST SET */}

          {brands.map((brand) => (
            <Link
              href={brand.href}
              className="brand-slide"
              key={brand.name}
            >
              <div className="brand-logo-box">

                <img
                  src={brand.image}
                  alt={brand.name}
                  className="brand-logo"
                />

              </div>
            </Link>
          ))}


          {/* DUPLICATE SET FOR INFINITE SLIDER */}

          {brands.map((brand) => (
            <Link
              href={brand.href}
              className="brand-slide"
              key={`${brand.name}-duplicate`}
              aria-hidden="true"
              tabIndex={-1}
            >
              <div className="brand-logo-box">

                <img
                  src={brand.image}
                  alt=""
                  className="brand-logo"
                />

              </div>
            </Link>
          ))}

        </div>

      </div>

    </section>
  );
}