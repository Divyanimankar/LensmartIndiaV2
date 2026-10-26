"use client";

import { useEffect, useState } from "react";
import { useBump, useStoredCount, useStoredUnits } from "@/lib/motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "../styles/navbar.css";
import { createSlug } from "@/lib/slug";
import { LENS_TYPES } from "@/lib/lensTypes";

/* =========================================================
   STORE CONFIG
========================================================= */

const QUICK_LINKS = [
  { label: "Aviator sunglasses", href: "/sunglasses/shape/aviator" },
  { label: "Blue light glasses", href: "/eyeglasses/need/blue-light" },
  { label: "Ray-Ban", href: "/sunglasses/brand/ray-ban" },
  { label: "Reading glasses", href: "/eyeglasses/need/readers" },
  { label: "New arrivals", href: "/eyeglasses/new-arrivals" },
];

const sharedShapes = [
  { label: "Square" },
  { label: "Rectangle" },
  { label: "Round" },
  { label: "Oval" },
  { label: "Cat-Eye" },
  { label: "Geometric" },
  { label: "Aviator" },
];

const eyeglassesColumns = [
  {
    title: "Shop by category",
    group: "category",
    param: "category",
    links: [
      { label: "All Eyeglasses", href: "/eyeglasses", strong: true },
      { label: "Women" },
      { label: "Men" },
      { label: "Kids" },
      { label: "New Arrivals", slug: "new-arrivals", badge: "New" },
      { label: "Bestsellers", badge: "Hot" },
    ],
  },
  {
    title: "Shop by Types",
    group: "type",
    param: "type",
    links: [
      { label: "Computer / Blue Light", slug: "blue-light", badge: "Popular" },
      { label: "Single Vision" },
      { label: "Progressive / Multifocal", slug: "progressives" },
      { label: "Reading Glasses", slug: "readers" },
      { label: "Anti-Fatigue" },
      { label: "Light Responsive" },
      { label: "Zero Power", slug: "non-prescription" },
    ],
  },
  {
    title: "Shop by shape",
    group: "shape",
    param: "shape",
    links: sharedShapes,
  },
  {
    title: "Shop by brand",
    group: "brand",
    param: "brand",
    links: [
      { label: "Sferoflex" },
      { label: "Foster Grant" },
      { label: "Alain Mikli" },
      { label: "Oliver Peoples" },
      { label: "Persol" },
      { label: "Vogue Eyewear" },
      { label: "Shop All Brands", href: "/eyeglasses", cta: true },
    ],
  },
];

const sunglassesColumns = [
  {
    title: "Shop by category",
    group: "category",
    param: "type",
    links: [
      { label: "All Sunglasses", href: "/sunglasses", strong: true },
      { label: "Women" },
      { label: "Men" },
      { label: "Sport" },
      { label: "New Arrivals", slug: "new-arrivals", badge: "New" },
      { label: "Bestsellers", badge: "Hot" },
    ],
  },
  {
    title: "Shop by Types",
    group: "lens",
    param: "type",
    links: [
      { label: "Polarized", badge: "Popular" },
      { label: "Performance Polarized" },
      { label: "Tinted" },
      { label: "Prescription (Power)", slug: "prescription" },
      { label: "Progressives" },
      { label: "Zero Power", slug: "non-prescription" },
    ],
  },
  {
    title: "Shop by shape",
    group: "shape",
    param: "shape",
    links: [...sharedShapes, { label: "Wayfarer" }],
  },
  {
    title: "Shop by brand",
    group: "brand",
    param: "brand",
    links: [
      { label: "Ray-Ban", badge: "Popular" },
      { label: "Oakley" },
      { label: "Arnette" },
      { label: "Costa" },
      { label: "Bliz" },
      { label: "Native Eyewear" },
      { label: "Shop All Brands", href: "/sunglasses", cta: true },
    ],
  },
];

/* =========================================================
   CONTACT LENS LINKS
   - Lens type  -> filter on /all-products (query string)
   - Brand      -> /brands/[slug]
   - Manufacturer -> /manufacturer/[slug]
========================================================= */

const CONTACT_PAGE = "/all-products";

const contactHref = (param, value) =>
  `${CONTACT_PAGE}?${param}=${encodeURIComponent(value)}#products`;

const brandHref = (name) => `/brands/${createSlug(name)}`;
const manufacturerHref = (name) => `/manufacturer/${createSlug(name)}`;
const lensTypeHref = (slug) => `/lens-type/${slug}`;

const contactLensBrands = [
  "Acuvue",
  "Air Optix",
  "Aspire",
  "Biofinity",
  "Biomedics",
  "Biotrue",
  "Clariti",
  "Dailies",
  "FreshLook",
  "Iconnect",
  "Lacelle",
  "MyDay",
  "Optima",
  "Precision1",
  "Proclear",
  "PureVision",
  "SofLens",
  "Ultra",
];

const popularContactBrands = ["Acuvue", "Air Optix", "Biofinity"];

// const contactLensTypes = [
//   { label: "Daily", param: "schedule", value: "Daily Disposable" },
//   { label: "Weekly", param: "schedule", value: "Weekly Disposable" },
//   { label: "Monthly", param: "schedule", value: "Monthly Disposable" },
//   { label: "Multifocal/Presbyopia", param: "lensType", value: "Multifocal" },
//   { label: "Toric/Astigmatism", param: "lensType", value: "Toric" },
//   { label: "Color", param: "lensType", value: "Color" },
// ];

const contactLensTypes = LENS_TYPES;


const manufacturers = [
  "Alcon",
  "Bausch + Lomb",
  "CooperVision",
  "Johnson & Johnson",
];

/* =========================================================
   HELPERS
========================================================= */

const getHref = (base, group, link) => {
  if (link.href) return link.href;
  const slug = link.slug || createSlug(link.label);
  return group ? `${base}/${group}/${slug}` : `${base}/${slug}`;
};

// const resolveLinks = (base, column) =>
//   column.links.map((link) => ({
//     ...link,
//     href: link.href
//       ? link.href
//       : column.param
//         ? `${base}?${column.param}=${encodeURIComponent(link.value || link.label)}`
//         : getHref(base, column.group, link),
//   }));


const resolveLinks = (base, column) =>
  column.links.map((link) => ({
    ...link,
    href: getHref(base, column.group, link),
  }));

  
const toContactLinks = (list, hrefFn, popular = []) =>
  list.map((label) => ({
    label,
    href: hrefFn(label),
    badge: popular.includes(label) ? "Popular" : undefined,
  }));

/* =========================================================
   ICONS
========================================================= */

const ChevronDown = () => (
  <svg className="nav-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M6 9L12 15L18 9"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRight = () => (
  <svg className="menu-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 12H19M14 7L19 12L14 17"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M16 16L21 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M5 21C5 17.1 8.1 14 12 14C15.9 14 19 17.1 19 21"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M20.8 4.6C18.8 2.6 15.5 2.6 13.5 4.6L12 6.1L10.5 4.6C8.5 2.6 5.2 2.6 3.2 4.6C1.1 6.7 1.1 10 3.2 12L12 20.8L20.8 12C22.9 10 22.9 6.7 20.8 4.6Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M3 4H5L7 16H18L21 8H6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="20" r="1.2" fill="currentColor" />
    <circle cx="18" cy="20" r="1.2" fill="currentColor" />
  </svg>
);

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const SaleLogo = () => <span className="sale-logo" role="img" aria-label="Sale" />;

/* =========================================================
   SMALL SHARED PIECES
========================================================= */

function Badge({ text }) {
  if (!text) return null;
  return <span className={`menu-badge menu-badge-${createSlug(text)}`}>{text}</span>;
}

/* =========================================================
   DESKTOP STANDARD MEGA MENU
========================================================= */

function StandardMegaMenu({ base, columns, feature }) {
  return (
    <div className="mega-menu">
      <div className="premium-mega-layout">
        <div className="mega-navigation-area">
          <div className="mega-columns">
            {columns.map((column) => (
              <div className="premium-menu-column" key={column.title}>
                <p className="premium-menu-title">{column.title}</p>
                {resolveLinks(base, column).map((link) => (
                  <Link
                    href={link.href}
                    key={link.label}
                    className={[
                      link.strong ? "menu-link-strong" : "",
                      link.cta ? "menu-cta-link" : "",
                    ].filter(Boolean).join(" ")}
                  >
                    {link.label}
                    <Badge text={link.badge} />
                    {link.cta && <ArrowRight />}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <Link href={feature.href} className="mega-feature-card">
          <img src={feature.image} alt={feature.label} loading="lazy" />
          <div className="mega-feature-overlay">
            <span className="feature-small">{feature.label}</span>
            <h3>{feature.title}</h3>
            <span className="feature-button">
              {feature.button}
              <ArrowRight />
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

/* =========================================================
   DESKTOP CONTACT LENS MEGA MENU
========================================================= */

function ContactLensMegaMenu() {
  const [brandSearch, setBrandSearch] = useState("");

  const filteredBrands = contactLensBrands.filter((brand) =>
    brand.toLowerCase().includes(brandSearch.trim().toLowerCase())
  );

  return (
    <div className="mega-menu">
      <div className="contact-premium-layout">
        <div className="contact-brand-section">
          <h3>Shop by brand</h3>
          <div className="brand-search-box">
            <SearchIcon />
            <input
              type="search"
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              placeholder="Find your brand"
              aria-label="Find a contact lens brand"
            />
          </div>

          <div className="brand-scroll-area">
            {filteredBrands.length === 0 && (
              <p className="brand-empty">No brand found. Try another name.</p>
            )}
            {filteredBrands.map((brand) => (
              <Link href={brandHref(brand)} key={brand}>
                <span>
                  {brand}
                  <Badge text={popularContactBrands.includes(brand) ? "Popular" : ""} />
                </span>
                <ArrowRight />
              </Link>
            ))}
          </div>
        </div>

        <div className="contact-standard-column">
          <h3>Lens type</h3>
          <div className="contact-link-list">
            {/* {contactLensTypes.map((type) => (
              <Link href={contactHref(type.param, type.value)} key={type.label}>
                {type.label}
              </Link>
            ))} */}

            {contactLensTypes.map((type) => (
  <Link href={lensTypeHref(type.slug)} key={type.slug}>
    {type.label}
  </Link>
))}

          </div>
        </div>

        <div className="contact-standard-column">
          <h3>Manufacturer</h3>
          <div className="contact-link-list">
            {manufacturers.map((manufacturer) => (
              <Link href={manufacturerHref(manufacturer)} key={manufacturer}>
                {manufacturer}
              </Link>
            ))}
          </div>
        </div>

        <Link href={CONTACT_PAGE} className="contact-feature-card">
          <img src="/images/contactlens.png" alt="Contact lenses" loading="lazy" />
          <div className="contact-feature-content">
            <span>Contact lenses</span>
            <h3>
              Clear vision.
              <br />
              Everyday comfort.
            </h3>
            <div className="feature-button">
              Shop now
              <ArrowRight />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

/* =========================================================
   MOBILE ACCORDIONS
========================================================= */

function MobileAccordion({
  title,
  children,
  activeMenu,
  setActiveMenu,
  active = false,
}) {
  const isOpen = activeMenu === title;

  return (
    <div className={`mobile-accordion ${isOpen ? "mobile-accordion-open" : ""} ${active ? "mobile-current-section" : ""}`}>
      <button
        type="button"
        className="mobile-accordion-button"
        onClick={() => setActiveMenu(isOpen ? null : title)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDown />
      </button>
      {isOpen && <div className="mobile-accordion-content">{children}</div>}
    </div>
  );
}

function MobileSubAccordion({ title, links, scroll = false, onNavigate }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`mobile-sub-accordion ${open ? "mobile-sub-accordion-open" : ""}`}>
      <button
        type="button"
        className="mobile-sub-accordion-button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className="mobile-sub-toggle" />
      </button>

      {open && (
        <div className={scroll ? "mobile-brand-scroll" : "mobile-sub-content"}>
          {links.map((link) => (
            <Link href={link.href} key={link.label} onClick={onNavigate}>
              <span>
                {link.label}
                <Badge text={link.badge} />
              </span>
              <ArrowRight />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileCategoryMenu({ base, columns, onNavigate }) {
  const [primary, ...rest] = columns;

  return (
    <div className="mobile-category-menu">
      <div className="mobile-primary-links">
        {resolveLinks(base, primary).map((link) => (
          <Link href={link.href} key={link.label} onClick={onNavigate}>
            <span>
              {link.label}
              <Badge text={link.badge} />
            </span>
            <ArrowRight />
          </Link>
        ))}
      </div>

      {rest.map((column) => (
        <MobileSubAccordion
          key={column.title}
          title={column.title}
          links={resolveLinks(base, column)}
          scroll={column.group === "brand"}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}

function MobileContactLensMenu({ onNavigate }) {
  return (
    <div className="mobile-category-menu">
      <div className="mobile-primary-links">
        <Link href={CONTACT_PAGE} onClick={onNavigate}>
          <span>All Contact Lenses</span>
          <ArrowRight />
        </Link>
      </div>

      <MobileSubAccordion
        title="Shop by brand"
        links={toContactLinks(contactLensBrands, brandHref, popularContactBrands)}
        scroll
        onNavigate={onNavigate}
      />

      <MobileSubAccordion
        title="Shop by lens type"
        // links={contactLensTypes.map((type) => ({
        //   label: type.label,
        //   href: contactHref(type.param, type.value),
        // }))}

        links={contactLensTypes.map((type) => ({
  label: type.label,
  href: lensTypeHref(type.slug),
}))}

        onNavigate={onNavigate}
      />

      <MobileSubAccordion
        title="Shop by manufacturer"
        links={toContactLinks(manufacturers, manufacturerHref)}
        onNavigate={onNavigate}
      />
    </div>
  );
}

/* =========================================================
   WISHLIST COUNT
========================================================= */

function useWishlistCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => {
      try {
        const saved = JSON.parse(localStorage.getItem("lensmartWishlist"));
        const valid = Array.isArray(saved)
          ? saved.filter((item) => item && item.id !== undefined)
          : [];
        setCount(valid.length);
      } catch {
        setCount(0);
      }
    };

    update();
    window.addEventListener("wishlistUpdated", update);
    window.addEventListener("storage", update);

    return () => {
      window.removeEventListener("wishlistUpdated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return count;
}

/* =========================================================
   MAIN NAVBAR
========================================================= */

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const wishlistCount = useWishlistCount();
  const cartCount = useStoredCount("lensmartCart", "cartUpdated");
  const wishBump = useBump(wishlistCount);
  const cartUnits = useStoredUnits("lensmartCart", "cartUpdated");
  const cartBump = useBump(cartUnits);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileMenu, setActiveMobileMenu] = useState(null);
  const [desktopSearch, setDesktopSearch] = useState("");
  const [mobileSearch, setMobileSearch] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMobileMenu(null);
    setShowMobileSearch(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setMobileMenuOpen(false);
      setActiveMobileMenu(null);
      setShowMobileSearch(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const isEyeglassesActive =
    pathname === "/eyeglasses" || pathname.startsWith("/eyeglasses/");
  const isSunglassesActive =
    pathname === "/sunglasses" || pathname.startsWith("/sunglasses/");
  const isContactLensActive =
    pathname === "/all-products" ||
    pathname.startsWith("/all-products/") ||
    pathname.startsWith("/contact-lenses/") ||
    pathname.startsWith("/brands/") ||
    pathname.startsWith("/lens-type/") ||
    pathname.startsWith("/manufacturer/");
    
  const isOffersActive = pathname === "/sale" || pathname.startsWith("/sale/");
  const isAboutActive = pathname === "/about-us" || pathname.startsWith("/about-us/");
  const isContactActive = pathname === "/contact-us" || pathname.startsWith("/contact-us/");
  const isAccountActive =
    pathname === "/my-account" ||
    pathname.startsWith("/my-account/") ||
    pathname === "/register";
  const isWishlistActive = pathname === "/wishlist" || pathname.startsWith("/wishlist/");
  const isCartActive = pathname === "/cart" || pathname.startsWith("/cart/");

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setActiveMobileMenu(null);
  };

  const goToSearch = (query) => {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    router.push(`/search?q=${encodeURIComponent(cleanQuery)}`);
    closeMobileMenu();
    setShowMobileSearch(false);
  };

  const handleDesktopSearch = (event) => {
    event.preventDefault();
    goToSearch(desktopSearch);
  };

  const handleMobileSearch = (event) => {
    event.preventDefault();
    goToSearch(mobileSearch);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((previous) => {
      const next = !previous;
      if (next) {
        setShowMobileSearch(false);
      } else {
        setActiveMobileMenu(null);
      }
      return next;
    });
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch((previous) => {
      const next = !previous;
      if (next) {
        setMobileMenuOpen(false);
        setActiveMobileMenu(null);
      }
      return next;
    });
  };

  const handleDesktopCategoryClick = (event) => {
    const menuItem = event.currentTarget.closest(".mega-menu-parent");
    if (menuItem) menuItem.blur?.();
  };

  const renderDesktopCategory = ({ href, label, active, children }) => (
    <div className={`nav-menu-item mega-menu-parent ${active ? "nav-item-active" : ""}`}>
      <div className="main-nav-link">
        <Link
          href={href}
          className="main-nav-category-link"
          onClick={handleDesktopCategoryClick}
        >
          {label}
        </Link>
        <span className="nav-dropdown-icon">
          <ChevronDown />
        </span>
      </div>
      {children}
    </div>
  );

  return (
    <>
      <header className="main-header">
        <div className="navbar-container">
          <button
            type="button"
            className="mobile-menu-button"
            onClick={toggleMobileMenu}
            aria-label="Navigation menu"
            aria-controls="mobile-navigation"
            aria-expanded={mobileMenuOpen}
          >
            <MenuIcon />
          </button>

          <Link href="/" className="navbar-logo" onClick={closeMobileMenu}>
            <img src="/images/logo.png" alt="LensMartIndia" />
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav
            className="desktop-navigation"
            onClickCapture={(event) => {
              /* picking a link closes the open mega menu straight away; it
                 stays closed until the pointer leaves it, so it never
                 lingers over the page that is loading. */
              const link = event.target.closest?.("a");
              const parent = link?.closest(".mega-menu-parent");
              if (parent) {
                parent.setAttribute("data-menu-closed", "true");
                link.blur?.();
              }
            }}
            onMouseOut={(event) => {
              const parent = event.target.closest?.(".mega-menu-parent");
              if (
                parent?.hasAttribute("data-menu-closed") &&
                !parent.contains(event.relatedTarget)
              ) {
                parent.removeAttribute("data-menu-closed");
              }
            }}
          >
            {renderDesktopCategory({
              href: "/eyeglasses",
              label: "EYEGLASSES",
              active: isEyeglassesActive,
              children: (
                <StandardMegaMenu
                  base="/eyeglasses"
                  columns={eyeglassesColumns}
                  feature={{
                    image: "/images/eyeglasses.png",
                    label: "New collection",
                    title: <>Frames made<br />for every look</>,
                    button: "Shop eyeglasses",
                    href: "/eyeglasses",
                  }}
                />
              ),
            })}

            {renderDesktopCategory({
              href: "/sunglasses",
              label: "SUNGLASSES",
              active: isSunglassesActive,
              children: (
                <StandardMegaMenu
                  base="/sunglasses"
                  columns={sunglassesColumns}
                  feature={{
                    image: "/images/sunglasses.png",
                    label: "Sun collection",
                    title: <>Find your<br />perfect shade</>,
                    button: "Shop sunglasses",
                    href: "/sunglasses",
                  }}
                />
              ),
            })}

            {renderDesktopCategory({
              href: CONTACT_PAGE,
              label: "CONTACT LENS",
              active: isContactLensActive,
              children: <ContactLensMegaMenu />,
            })}

            <div className={`nav-menu-item ${isOffersActive ? "nav-item-active" : ""}`}>
              <Link href="/sale" className="main-nav-link simple-link sale-nav-link" aria-label="Sale">
                <SaleLogo />
              </Link>
            </div>

            <div className={`nav-menu-item ${isAboutActive ? "nav-item-active" : ""}`}>
              <Link href="/about-us" className="main-nav-link simple-link">ABOUT US</Link>
            </div>

            <div className={`nav-menu-item ${isContactActive ? "nav-item-active" : ""}`}>
              <Link href="/contact-us" className="main-nav-link simple-link">CONTACT US</Link>
            </div>
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="navbar-actions">
            <div className="navbar-search-wrap">
              <form className="navbar-search" onSubmit={handleDesktopSearch}>
                <SearchIcon />
                <input
                  type="search"
                  value={desktopSearch}
                  onChange={(event) => setDesktopSearch(event.target.value)}
                  placeholder="Search brands, frames, power..."
                  aria-label="Search products"
                />
              </form>
            </div>

            <Link href="/my-account" className={`navbar-action-icon ${isAccountActive ? "action-active" : ""}`} aria-label="My Account">
              <UserIcon />
            </Link>

            <Link
              href="/wishlist"
              className={`navbar-action-icon ${isWishlistActive ? "action-active" : ""}`}
              aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ""}`}
            >
              <HeartIcon />
              {wishlistCount > 0 && (
                <span className="wishlist-badge" key={wishBump}>
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className={`navbar-action-icon ${isCartActive ? "action-active" : ""}`}
              aria-label={`Cart${cartCount ? `, ${cartCount} items` : ""}`}
              data-bumped={cartBump ? "true" : undefined}
            >
              <CartIcon key={`icon-${cartBump}`} />
              {cartCount > 0 && (
                <span className="wishlist-badge cart-badge" key={`badge-${cartBump}`}>
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* MOBILE ACTIONS */}
          <div className="mobile-header-actions">
            <button
              type="button"
              className={`mobile-header-icon ${showMobileSearch ? "action-active" : ""}`}
              onClick={toggleMobileSearch}
              aria-label="Search"
            >
              {showMobileSearch ? <CloseIcon /> : <SearchIcon />}
            </button>
            <Link href="/my-account" className={`mobile-header-icon ${isAccountActive ? "action-active" : ""}`} onClick={closeMobileMenu} aria-label="My Account">
              <UserIcon />
            </Link>

            <Link
              href="/wishlist"
              className={`mobile-header-icon ${isWishlistActive ? "action-active" : ""}`}
              onClick={closeMobileMenu}
              aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ""}`}
            >
              <HeartIcon />
              {wishlistCount > 0 && (
                <span className="wishlist-badge" key={wishBump}>
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className={`mobile-header-icon ${isCartActive ? "action-active" : ""}`}
              onClick={closeMobileMenu}
              aria-label={`Cart${cartCount ? `, ${cartCount} items` : ""}`}
              data-bumped={cartBump ? "true" : undefined}
            >
              <CartIcon key={`icon-${cartBump}`} />
              {cartCount > 0 && (
                <span className="wishlist-badge cart-badge" key={`badge-${cartBump}`}>
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {showMobileSearch && (
          <div className="mobile-header-search-wrapper">
            <form className="mobile-header-search" onSubmit={handleMobileSearch}>
              <SearchIcon />
              <input
                type="search"
                value={mobileSearch}
                onChange={(event) => setMobileSearch(event.target.value)}
                placeholder="Search brands, frames, power..."
                aria-label="Search products"
                autoFocus
              />
              <button type="submit" className="mobile-header-search-submit" aria-label="Submit search">
                <SearchIcon />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* MOBILE DRAWER */}
      <nav
        id="mobile-navigation"
        className={`mobile-navigation ${mobileMenuOpen ? "mobile-navigation-open" : ""}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobile-drawer-header">
          <div className="mobile-drawer-title">MENU</div>
          <button type="button" className="mobile-drawer-close" onClick={closeMobileMenu} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>

        <div className="mobile-menu-content">
          <MobileAccordion
            title="EYEGLASSES"
            activeMenu={activeMobileMenu}
            setActiveMenu={setActiveMobileMenu}
            active={isEyeglassesActive}
          >
            <MobileCategoryMenu base="/eyeglasses" columns={eyeglassesColumns} onNavigate={closeMobileMenu} />
          </MobileAccordion>

          <MobileAccordion
            title="SUNGLASSES"
            activeMenu={activeMobileMenu}
            setActiveMenu={setActiveMobileMenu}
            active={isSunglassesActive}
          >
            <MobileCategoryMenu base="/sunglasses" columns={sunglassesColumns} onNavigate={closeMobileMenu} />
          </MobileAccordion>

          <MobileAccordion
            title="CONTACT LENS"
            activeMenu={activeMobileMenu}
            setActiveMenu={setActiveMobileMenu}
            active={isContactLensActive}
          >
            <MobileContactLensMenu onNavigate={closeMobileMenu} />
          </MobileAccordion>

          <Link
            href="/sale"
            className={`mobile-simple-link mobile-sale-link ${isOffersActive ? "mobile-current-link" : ""}`}
            onClick={closeMobileMenu}
            aria-label="Sale"
          >
            <SaleLogo />
          </Link>

          <Link
            href="/about-us"
            className={`mobile-simple-link ${isAboutActive ? "mobile-current-link" : ""}`}
            onClick={closeMobileMenu}
          >
            ABOUT US
          </Link>

          <Link
            href="/contact-us"
            className={`mobile-simple-link ${isContactActive ? "mobile-current-link" : ""}`}
            onClick={closeMobileMenu}
          >
            CONTACT US
          </Link>
        </div>
      </nav>

      {mobileMenuOpen && (
        <button
          type="button"
          className="mobile-menu-overlay"
          onClick={closeMobileMenu}
          aria-label="Close menu"
        />
      )}
    </>
  );
}