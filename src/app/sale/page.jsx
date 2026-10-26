// import Link from "next/link";
// import SiteLayout from "@/components/SiteLayout";
// import Newsletter from "@/components/Newsletter";
// import ProductGrid from "@/components/ProductGrid";
// import OfferCountdown from "@/components/OfferCountdown";
// import CouponStrip from "@/components/CouponStrip";
// import { products } from "@/data/products";
// import "../../styles/offers.css";

// export const metadata = { title: "Offers" };

// /* same value as the cart / payment pages */
// const FREE_SHIPPING_MIN = 999;

// const rupee = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

// /* ---------- helpers ---------- */

// const discountOf = (product) => {
//   const price = Number(product.price);
//   const old = Number(product.oldPrice);
//   return Number.isFinite(price) && Number.isFinite(old) && old > price
//     ? Math.round(((old - price) / old) * 100)
//     : 0;
// };

// const savingOf = (product) => {
//   const price = Number(product.price);
//   const old = Number(product.oldPrice);
//   return Number.isFinite(price) && Number.isFinite(old) && old > price ? old - price : 0;
// };

// /* ---------- coupons ----------
//    ⚠️ SIRF wahi coupon codes rakho jo tumhare cart / checkout mein sach mein chalte hain.
//    Yahan sirf example diye hain, inhe apne real codes se badal do. */
// const COUPONS = [
//   {
//     value: "10%",
//     unit: "OFF",
//     title: "On your first order",
//     note: "New customers only. Terms apply.",
//     code: "WELCOME10",
//     tone: "pink",
//   },
//   {
//     value: "₹100",
//     unit: "OFF",
//     title: "On orders above ₹1,499",
//     note: "Applies at checkout. Terms apply.",
//     code: "SAVE100",
//     tone: "purple",
//   },
//   {
//     value: "FREE",
//     unit: "SHIPPING",
//     title: `On orders above ${rupee(FREE_SHIPPING_MIN)}`,
//     note: "Applied automatically, no code needed.",
//     code: "AUTO",
//     tone: "teal",
//     auto: true,
//   },
// ];

// /* ---------- discount bands ---------- */

// const BANDS = [
//   {
//     id: "mega",
//     min: 40,
//     max: 100,
//     tone: "pink",
//     tag: "Mega deals",
//     big: "40%+",
//     unit: "OFF",
//     title: "Mega deals: 40% off & above",
//     sub: "Our deepest discounts. These go fast.",
//   },
//   {
//     id: "great",
//     min: 25,
//     max: 39,
//     tone: "purple",
//     tag: "Great deals",
//     big: "25–39%",
//     unit: "OFF",
//     title: "Great deals: 25% to 39% off",
//     sub: "Big savings on trusted lens brands.",
//   },
//   {
//     id: "good",
//     min: 1,
//     max: 24,
//     tone: "teal",
//     tag: "Smart savings",
//     big: "Up to 24%",
//     unit: "OFF",
//     title: "Smart savings: up to 24% off",
//     sub: "Everyday low prices on your regular lenses.",
//   },
// ];

// /* ---------- small icons ---------- */

// const TruckIcon = () => (
//   <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
//     <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
//     <circle cx="7.5" cy="17.5" r="1.8" stroke="currentColor" strokeWidth="1.6" />
//     <circle cx="17.5" cy="17.5" r="1.8" stroke="currentColor" strokeWidth="1.6" />
//   </svg>
// );

// const ShieldIcon = () => (
//   <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
//     <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
//     <path d="M9 12l2.2 2.2L15.5 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// const WalletIcon = () => (
//   <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
//     <rect x="3" y="6" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
//     <path d="M3 10h18M16 14.5h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
//   </svg>
// );

// const CashIcon = () => (
//   <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
//     <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
//     <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" />
//   </svg>
// );

// const ArrowRight = () => (
//   <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
//     <path d="M5 12H19M14 7L19 12L14 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// const BoltIcon = () => (
//   <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
//     <path d="M13 2L4 14h6l-1 8 9-12h-6z" />
//   </svg>
// );

// const BENEFITS = [
//   {
//     Icon: TruckIcon,
//     title: "Free shipping",
//     text: `On every order above ${rupee(FREE_SHIPPING_MIN)}.`,
//   },
//   {
//     Icon: ShieldIcon,
//     title: "100% genuine lenses",
//     text: "Authentic brands, sealed boxes, every time.",
//   },
//   {
//     Icon: WalletIcon,
//     title: "Pay your way",
//     text: "UPI, cards and net banking, all secure.",
//   },
//   {
//     Icon: CashIcon,
//     title: "Cash on delivery",
//     text: "Prefer to pay later? Pay when it arrives.",
//   },
// ];

// const MARQUEE = [
//   "Mega sale is live",
//   `Free shipping above ${rupee(FREE_SHIPPING_MIN)}`,
//   "Genuine contact lenses",
//   "Cash on delivery available",
//   "Prices drop, stock doesn’t last",
// ];

// const STEPS = [
//   { n: "1", title: "Pick your lenses", text: "Choose from the deals above." },
//   { n: "2", title: `Cross ${rupee(FREE_SHIPPING_MIN)}`, text: "Shipping becomes free automatically." },
//   { n: "3", title: "Apply a coupon & pay", text: "UPI, card, net banking or cash on delivery." },
// ];

// /* ---------- page ---------- */

// export default function Page() {
//   const list = Array.isArray(products) ? products : [];

//   /* products that really have a discount, biggest saving first */
//   const deals = list
//     .filter((product) => discountOf(product) > 0)
//     .sort((a, b) => discountOf(b) - discountOf(a));

//   const source = deals.length ? deals : list;

//   /* group products by discount band (empty bands are skipped) */
//   let groups = deals.length
//     ? BANDS.map((band) => ({
//         ...band,
//         items: deals.filter((product) => {
//           const d = discountOf(product);
//           return d >= band.min && d <= band.max;
//         }),
//       })).filter((group) => group.items.length > 0)
//     : list.length
//     ? [
//         {
//           id: "all",
//           tone: "teal",
//           tag: "All products",
//           big: "Best",
//           unit: "PRICES",
//           title: "Shop all products",
//           sub: "Great lenses at great prices.",
//           items: list,
//         },
//       ]
//     : [];

//   const maxDiscount = deals.length ? discountOf(deals[0]) : 20;
//   const maxSaving = list.reduce((max, product) => Math.max(max, savingOf(product)), 0);
//   const dealCount = source.length;

//   return (
//     <SiteLayout>
//       <div className="lmo-page">
//         {/* ================= HERO ================= */}
//         <section className="lmo-hero">
//           <span className="lmo-blob lmo-blob-a" aria-hidden="true" />
//           <span className="lmo-blob lmo-blob-b" aria-hidden="true" />
//           <span className="lmo-blob lmo-blob-c" aria-hidden="true" />

//           <div className="lmo-hero-inner">
//             <div className="lmo-hero-copy">
//               <span className="lmo-pill">
//                 <span className="lmo-dot" aria-hidden="true" />
//                 Mega sale is live
//               </span>

//               <h1>
//                 Mega savings on the lenses <em>you love</em>
//               </h1>

//               <p>
//                 Special prices on selected contact lens brands, plus free shipping on orders above{" "}
//                 {rupee(FREE_SHIPPING_MIN)}.
//               </p>

//               <div className="lmo-timer-block">
//                 <small>Today’s deals end in</small>
//                 <OfferCountdown />
//               </div>

//               <div className="lmo-hero-actions">
//                 <a href="#coupons" className="lmo-btn lmo-btn-solid">
//                   Grab coupons
//                   <ArrowRight />
//                 </a>
//                 <Link href="/all-products" className="lmo-btn lmo-btn-ghost">
//                   Browse all products
//                 </Link>
//               </div>
//             </div>

//             <div className="lmo-hero-visual" aria-hidden="true">
//               <div className="lmo-ring" />
//               <div className="lmo-badge">
//                 <small>UP TO</small>
//                 <strong>
//                   {maxDiscount}
//                   <span>%</span>
//                 </strong>
//                 <small>OFF</small>
//               </div>

//               <span className="lmo-chip lmo-chip-1">Free shipping {rupee(FREE_SHIPPING_MIN)}+</span>
//               <span className="lmo-chip lmo-chip-2">Genuine brands</span>
//               <span className="lmo-chip lmo-chip-3">COD available</span>
//             </div>
//           </div>

//           {/* ---- stats ---- */}
//           <div className="lmo-hero-stats">
//             <div>
//               <strong>{dealCount}</strong>
//               <span>Products on offer</span>
//             </div>
//             <div>
//               <strong>{maxDiscount}%</strong>
//               <span>Maximum discount</span>
//             </div>
//             {maxSaving > 0 && (
//               <div>
//                 <strong>{rupee(maxSaving)}</strong>
//                 <span>Biggest saving on one product</span>
//               </div>
//             )}
//           </div>
//         </section>

//         {/* ================= MARQUEE ================= */}
//         <div className="lmo-marquee" aria-hidden="true">
//           <div className="lmo-marquee-track">
//             {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((text, index) => (
//               <span key={index}>
//                 <i />
//                 {text}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* ================= SHOP BY DISCOUNT ================= */}
//         {groups.length > 0 && (
//           <section className="lmo-section">
//             <div className="lmo-container">
//               <div className="lmo-head">
//                 <span className="lmo-eyebrow">Shop by discount</span>
//                 <h2>Pick your saving</h2>
//                 <p>Tap a deal zone to jump straight to those products.</p>
//               </div>

//               <div className="lmo-tiles">
//                 {groups.map((group) => (
//                   <a
//                     key={group.id}
//                     href={`#band-${group.id}`}
//                     className={`lmo-tile lmo-tone-${group.tone}`}
//                   >
//                     <small>{group.tag}</small>
//                     <strong>
//                       {group.big}
//                       <span>{group.unit}</span>
//                     </strong>
//                     <em>
//                       {group.items.length} product{group.items.length === 1 ? "" : "s"}
//                       <ArrowRight />
//                     </em>
//                   </a>
//                 ))}
//               </div>
//             </div>
//           </section>
//         )}

//         {/* ================= COUPONS ================= */}
//         <section className="lmo-section lmo-section-tint" id="coupons">
//           <div className="lmo-container">
//             <div className="lmo-head">
//               <span className="lmo-eyebrow">Coupons & offers</span>
//               <h2>Copy a code, save more</h2>
//               <p>Tap “Copy”, then paste the code at checkout.</p>
//             </div>

//             <CouponStrip coupons={COUPONS} />
//           </div>
//         </section>

//         {/* ================= DEAL BANDS ================= */}
//         {groups.map((group) => (
//           <section
//             key={group.id}
//             id={`band-${group.id}`}
//             className={`lmo-section lmo-band lmo-tone-${group.tone}`}
//           >
//             <div className="lmo-container">
//               <div className="lmo-band-head">
//                 <div className="lmo-band-copy">
//                   <span className="lmo-band-tag">
//                     <BoltIcon />
//                     {group.tag}
//                   </span>
//                   <h2>{group.title}</h2>
//                   <p>{group.sub}</p>
//                 </div>

//                 <div className="lmo-band-count">
//                   <strong>{group.items.length}</strong>
//                   <span>product{group.items.length === 1 ? "" : "s"}</span>
//                 </div>
//               </div>

//               <ProductGrid products={group.items} />
//             </div>
//           </section>
//         ))}

//         {/* ================= BENEFITS ================= */}
//         <section className="lmo-section">
//           <div className="lmo-container">
//             <div className="lmo-benefits">
//               {BENEFITS.map(({ Icon, title, text }) => (
//                 <div className="lmo-benefit" key={title}>
//                   <span className="lmo-benefit-icon">
//                     <Icon />
//                   </span>
//                   <div>
//                     <h3>{title}</h3>
//                     <p>{text}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ================= HOW TO SAVE MORE ================= */}
//         <section className="lmo-section lmo-section-tight">
//           <div className="lmo-container">
//             <div className="lmo-save">
//               <div className="lmo-save-copy">
//                 <span className="lmo-eyebrow lmo-eyebrow-light">Smart shopping</span>
//                 <h2>Three steps to save even more</h2>
//                 <p>
//                   Combine a discounted price, a coupon and free shipping, and you keep more in your
//                   pocket.
//                 </p>
//               </div>

//               <ol className="lmo-steps">
//                 {STEPS.map((step) => (
//                   <li key={step.n}>
//                     <span>{step.n}</span>
//                     <div>
//                       <h3>{step.title}</h3>
//                       <p>{step.text}</p>
//                     </div>
//                   </li>
//                 ))}
//               </ol>
//             </div>
//           </div>
//         </section>

//         {/* ================= CTA ================= */}
//         <section className="lmo-section">
//           <div className="lmo-container">
//             <div className="lmo-cta">
//               <div>
//                 <h2>Didn’t find your brand?</h2>
//                 <p>Explore our full range of contact lenses, sunglasses and eyeglasses.</p>
//               </div>
//               <Link href="/all-products" className="lmo-btn lmo-btn-solid">
//                 View all products
//                 <ArrowRight />
//               </Link>
//             </div>
//           </div>
//         </section>

//         <Newsletter />
//       </div>
//     </SiteLayout>
//   );
// }




"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../../styles/offers.css";

if (typeof window !== "undefined") {

  gsap.registerPlugin(ScrollTrigger);

}

/* ------------------------------------------------------------------ */

/*  DATA (sample content: update prices, codes and dates per campaign) */

/* ------------------------------------------------------------------ */

const SALE_ENDS = "2026-10-31T23:59:59+05:30";

const SLIDE_MS = 3000;

const IMG = {

  frames:

    "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1200&q=88",

  sun: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=88",

  lenses:

    "/images/slider2.png",

};

/* The three hero slides (01 / 02 / 03) */

const SLIDES = [

  {

    id: "eyeglasses",

    category: "Eyeglasses",

    kicker: "EVERYDAY ICONS",

    lines: ["Frames you’ll", "love."],

    offer: "Buy 1 Get 1 FREE",

    offerNote: "On eyeglasses with anti-glare lenses",

    image: IMG.frames,

    alt: "Classic eyeglass frames",

    link: "/eyeglasses",

  },

  {

    id: "sunglasses",

    category: "Sunglasses",

    kicker: "SUN-SEEKER PICKS",

    lines: ["Own the", "sunshine."],

    offer: "Flat 35% OFF",

    offerNote: "On polarised sunglasses with UV400",

    image: IMG.sun,

    alt: "Premium sunglasses",

    link: "/sunglasses",

  },

  {

    id: "contact-lenses",

    category: "Contact Lenses",

    kicker: "CLEAR-VISION CLUB",

    lines: ["Comfort in", "focus."],

    offer: "Buy 2 Get 1 FREE",

    offerNote: "On daily disposable contact lenses",

    image: IMG.lenses,

    alt: "Contact lens essentials",

    link: "/all-products",

  },

];

const CATEGORIES = [

  {

    id: "eyeglasses",

    number: "01",

    name: "Eyeglasses",

    note: "Your everyday icon.",

    description: "Frames that bring your personal style into focus.",

    image: IMG.frames,

    link: "/eyeglasses",

  },

  {

    id: "sunglasses",

    number: "02",

    name: "Sunglasses",

    note: "Own the sunshine.",

    description: "Statement shades made for brighter days.",

    image: IMG.sun,

    link: "/sunglasses",

  },

  {

    id: "contact-lenses",

    number: "03",

    name: "Contact Lenses",

    note: "Freedom in every blink.",

    description: "Find daily, monthly and coloured lens options.",

    image: IMG.lenses,

    link: "/all-products",

  },

];

const DEALS = [

  {

    id: 1,

    category: "Eyeglasses",

    eyebrow: "THE EVERYDAY EDIT",

    title: "A fresh frame for every you",

    description:

      "Pick any two frames with anti-glare, scratch-resistant lenses. The second pair is on us.",

    oldPrice: 3998,

    price: 1999,

    discount: "BOGO",

    code: "SEE2",

    image: IMG.frames,

    tag: "BESTSELLER",

    theme: "deal-card--mint",

    validTill: "2026-10-24T23:59:59+05:30",

  },

  {

    id: 2,

    category: "Eyeglasses",

    eyebrow: "SCREEN CARE",

    title: "Blue-cut for long screen days",

    description:

      "Reduce eye strain from laptop and phone. Lightweight frames, zero power also available.",

    oldPrice: 1999,

    price: 1199,

    discount: "40% OFF",

    code: "BLUE40",

    image: IMG.frames,

    tag: "SCREEN CARE",

    theme: "deal-card--mint",

    validTill: "2026-10-31T23:59:59+05:30",

  },

  {

    id: 3,

    category: "Sunglasses",

    eyebrow: "SUN-SEEKER PICKS",

    title: "Shades with main-character energy",

    description:

      "Cut glare on the road and by the water. UV400 protection with a scratch-resistant coating.",

    oldPrice: 2999,

    price: 1949,

    discount: "35% OFF",

    code: "POLAR35",

    image: IMG.sun,

    tag: "TRENDING",

    theme: "deal-card--peach",

    validTill: "2026-10-21T23:59:59+05:30",

  },

  {

    id: 4,

    category: "Sunglasses",

    eyebrow: "COMBO DEAL",

    title: "Aviator + Wayfarer, 2 for ₹2,499",

    description:

      "Two classic styles in one order, with a hard case and microfibre cloth for each pair.",

    oldPrice: 4998,

    price: 2499,

    discount: "50% OFF",

    code: "SUN2",

    image: IMG.sun,

    tag: "COMBO",

    theme: "deal-card--peach",

    validTill: "2026-10-28T23:59:59+05:30",

  },

  {

    id: 5,

    category: "Contact Lenses",

    eyebrow: "CLEAR-VISION CLUB",

    title: "Buy 2 boxes, get the third free",

    description:

      "Daily disposable lenses from top brands. More comfort, less fuss, one simple deal.",

    oldPrice: 2997,

    price: 1998,

    discount: "33% OFF",

    code: "DAILY3",

    image: IMG.lenses,

    tag: "LENS PICKS",

    theme: "deal-card--lilac",

    validTill: "2026-10-19T23:59:59+05:30",

  },

  {

    id: 6,

    category: "Contact Lenses",

    eyebrow: "SIX MONTHS, SORTED",

    title: "Monthly lenses, 6 month pack",

    description:

      "A full 6 months of supply in one order, with a free lens case and 120ml solution.",

    oldPrice: 4500,

    price: 2699,

    discount: "40% OFF",

    code: "MONTHLY40",

    image: IMG.lenses,

    tag: "BEST VALUE",

    theme: "deal-card--lilac",

    validTill: "2026-10-22T23:59:59+05:30",

  },

];

const BENEFITS = [

  { icon: "✳", title: "Find your fit", text: "Explore styles and lens options for your everyday needs." },

  { icon: "↗", title: "Easy to explore", text: "Shop three focused collections without the clutter." },

  { icon: "♡", title: "Made for your routine", text: "From desk days to sunny weekends, find your next favourite." },

];

const FAQS = [

  {

    q: "How do I use a sale coupon?",

    a: "Press “Reveal code” on an offer, copy the code and enter it at checkout. Check the final cart total before placing your order.",

  },

  {

    q: "Do all products have the same discount?",

    a: "No. Discounts and eligibility can vary by product and category. The product page and checkout show the final applicable price.",

  },

  {

    q: "Can I use contact lenses without a prescription?",

    a: "Choose contact lenses according to advice from your eye-care professional and follow the prescription and care instructions provided.",

  },

];

/* Terms & Conditions – edit so it matches your real policy. */

const TERMS = [

  "Each offer is valid until the date shown on its card, or while stock lasts, whichever is earlier.",

  "Only one coupon code can be applied per order. Codes cannot be combined with each other or with any other offer.",

  "A discount applies only to the products named in that offer. Prices are in Indian Rupees (₹) and may change without notice.",

  "“Up to 50% OFF” is the highest discount on selected products. Other products carry the discount shown on their offer.",

  "Prescription eyeglasses and sunglasses are made to order and cannot be returned once lens cutting has started.",

  "Sealed, unopened boxes of contact lenses can be returned within 7 days of delivery. Opened or used lenses cannot be returned.",

  "Contact lenses are medical devices. Please consult your eye doctor before use and follow the care instructions given to you.",

  "LensMartIndia may change or withdraw any offer or code at any time, and may cancel orders in case of misuse or pricing errors.",

];

const DAY_MS = 24 * 60 * 60 * 1000;

const rupees = (n) => "₹" + n.toLocaleString("en-IN");

const dateLabel = (iso) =>

  new Date(iso).toLocaleDateString("en-IN", {

    day: "numeric",

    month: "short",

    year: "numeric",

    timeZone: "Asia/Kolkata",

  });

const pad2 = (n) => String(n).padStart(2, "0");

/* ------------------------------------------------------------------ */

/*  Small pieces                                                       */

/* ------------------------------------------------------------------ */

function ArrowIcon({ diagonal = false, flip = false }) {

  return (

    <svg

      viewBox="0 0 24 24"

      aria-hidden="true"

      className="sale-arrow-icon"

      style={flip ? { transform: "scaleX(-1)" } : undefined}

    >

      {diagonal ? (

        <path d="M7 17 17 7M8 7h9v9" />

      ) : (

        <path d="M4 12h15m-6-6 6 6-6 6" />

      )}

    </svg>

  );

}

function SaleCountdown() {

  const [left, setLeft] = useState(null);

  useEffect(() => {

    const end = new Date(SALE_ENDS).getTime();

    const tick = () => setLeft(Math.max(0, end - Date.now()));

    tick();

    const id = setInterval(tick, 1000);

    return () => clearInterval(id);

  }, []);

  const ms = left ?? 0;

  const parts = [

    ["Days", Math.floor(ms / DAY_MS)],

    ["Hrs", Math.floor((ms % DAY_MS) / 3600000)],

    ["Min", Math.floor((ms % 3600000) / 60000)],

    ["Sec", Math.floor((ms % 60000) / 1000)],

  ];

  if (left === 0) {

    return <p className="sale-countdown__ended">The sale has ended. New offers are coming soon.</p>;

  }

  return (

    <div className="sale-countdown" aria-label="Time left in the sale">

      <span className="sale-countdown__label">Sale ends in</span>

      <div className="sale-countdown__boxes">

        {parts.map(([label, value]) => (

          <div key={label}>

            <strong>{left === null ? "--" : pad2(value)}</strong>

            <small>{label}</small>

          </div>

        ))}

      </div>

    </div>

  );

}

/* ------------------------------------------------------------------ */

/*  Page                                                               */

/* ------------------------------------------------------------------ */

export default function Offer() {

  const pageRef = useRef(null);

  const swipeX = useRef(null);

  const firstFilterRun = useRef(true);

  const [activeFilter, setActiveFilter] = useState("All");

  const [revealed, setRevealed] = useState([]);

  const [copiedCode, setCopiedCode] = useState("");

  const [openFaq, setOpenFaq] = useState(0);

  const [termsOpen, setTermsOpen] = useState(false);

  // hero slider

  const [active, setActive] = useState(0);

  const [paused, setPaused] = useState(false);

  const [canAuto, setCanAuto] = useState(false);

  const [now, setNow] = useState(null);

  const goTo = (i) => setActive((i + SLIDES.length) % SLIDES.length);

  const next = () => setActive((a) => (a + 1) % SLIDES.length);

  const prev = () => setActive((a) => (a - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {

    setCanAuto(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    setNow(Date.now());

    const id = setInterval(() => setNow(Date.now()), 30000);

    return () => clearInterval(id);

  }, []);

  const slide = SLIDES[active];

  const nextSlide = SLIDES[(active + 1) % SLIDES.length];

  const visibleDeals = useMemo(

    () =>

      activeFilter === "All"

        ? DEALS

        : DEALS.filter((deal) => deal.category === activeFilter),

    [activeFilter]

  );

  const isExpired = (deal) => now !== null && new Date(deal.validTill).getTime() <= now;

  const copyCode = async (code) => {

    try {

      await navigator.clipboard.writeText(code);

    } catch {

      /* clipboard can be blocked; the code is still visible on the card */

    }

    setCopiedCode(code);

    window.setTimeout(() => setCopiedCode(""), 1800);

  };

  const onSwipeEnd = (e) => {

    if (swipeX.current === null) return;

    const dx = e.clientX - swipeX.current;

    swipeX.current = null;

    if (Math.abs(dx) > 45) (dx < 0 ? next : prev)();

  };

  /* Page animations */

  useEffect(() => {

    if (!pageRef.current) return;

    const ctx = gsap.context(() => {

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) return;

      gsap.from(

        ".sale-hero__eyebrow, .sale-hero__title, .sale-hero__copy, .sale-hero__actions, .sale-countdown, .sale-hero__proof",

        { y: 28, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.1 }

      );

      gsap.from(".sale-hero__visual", {

        x: 50,

        rotate: 3,

        opacity: 0,

        duration: 1,

        ease: "power3.out",

        delay: 0.25,

        clearProps: "transform,opacity",

      });

      gsap.to(".sale-orbit", { rotate: 360, duration: 30, repeat: -1, ease: "none" });

      gsap.to(".sale-sticker", {

        rotate: 8,

        y: -9,

        duration: 2.4,

        repeat: -1,

        yoyo: true,

        ease: "sine.inOut",

      });

      gsap.utils.toArray(".sale-reveal").forEach((element) => {

        gsap.from(element, {

          y: 38,

          opacity: 0,

          duration: 0.75,

          ease: "power3.out",

          scrollTrigger: { trigger: element, start: "top 88%", once: true },

        });

      });

    }, pageRef);

    return () => ctx.revert();

  }, []);

  /* Deal cards come in when the filter changes */

  useEffect(() => {

    if (firstFilterRun.current) {

      firstFilterRun.current = false;

      return;

    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = pageRef.current?.querySelectorAll(".sale-deal-card");

    if (!cards || !cards.length) return;

    const t = gsap.fromTo(

      cards,

      { y: 26, opacity: 0 },

      { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: "power3.out", clearProps: "transform,opacity" }

    );

    return () => t.kill();

  }, [activeFilter]);

  return (

    <div className="sale-page" id="top" ref={pageRef}>

      {/* <div className="sale-topline">

        <span className="sale-topline__spark">✳</span>

        <p>THE LENS MART EDIT — A LITTLE MORE YOU, FOR LESS</p>

        <span className="sale-topline__spark">✳</span>

      </div> */}

      {/* 1. Hero with a working 3-slide showcase */}

      <section className="sale-hero" aria-labelledby="sale-hero-title">

        <div className="sale-hero__content">

          <span className="sale-hero__eyebrow">

            <span className="sale-live-dot" /> THE BIG VISION SALE

          </span>

          <h1 className="sale-hero__title" id="sale-hero-title">

            Good taste.

            <br />

            <em>Great vision.</em>

            <br />

            Better prices.

          </h1>

          <p className="sale-hero__copy">

            Your next everyday frames, statement shades and contact lens

            essentials are waiting. Find your kind of clear.

          </p>

          <div className="sale-hero__actions">

            <a className="sale-button sale-button--dark" href="#sale-deals">

              Explore the sale <ArrowIcon />

            </a>

            <a className="sale-text-link" href="#sale-categories">

              Shop categories <ArrowIcon diagonal />

            </a>

          </div>

          <SaleCountdown />

          <div className="sale-hero__proof">

            <span className="sale-proof__avatars" aria-hidden="true">

              <i>👓</i>

              <i>☀</i>

              <i>◉</i>

            </span>

            <span>Three ways to see things differently.</span>

          </div>

        </div>

        <div

          className={`sale-hero__visual ${paused ? "is-paused" : ""}`}

          aria-roledescription="carousel"

          aria-label="Sale showcase"

          onMouseEnter={() => setPaused(true)}

          onMouseLeave={() => setPaused(false)}

          onFocus={() => setPaused(true)}

          onBlur={() => setPaused(false)}

        >

          <div className="sale-hero__visual-glow" aria-hidden="true" />

          <div className="sale-orbit" aria-hidden="true">

            <i className="sale-orbit__dot sale-orbit__dot--one" />

            <i className="sale-orbit__dot sale-orbit__dot--two" />

          </div>

          <div

            className="sale-hero__image-wrap"

            onPointerDown={(e) => {

              swipeX.current = e.clientX;

            }}

            onPointerUp={onSwipeEnd}

            onPointerCancel={() => {

              swipeX.current = null;

            }}

          >

            {SLIDES.map((s, i) => (

              <div

                key={s.id}

                className={`sale-slide ${i === active ? "is-active" : ""}`}

                role="group"

                aria-roledescription="slide"

                aria-label={`${i + 1} of ${SLIDES.length}: ${s.category}`}

                aria-hidden={i !== active}

              >

                <img src={s.image} alt={s.alt} draggable="false" loading={i === 0 ? "eager" : "lazy"} />

                <div className="sale-hero__image-shade" />

                <div className="sale-hero__image-label">

                  <span>{s.kicker}</span>

                  <strong>

                    {s.lines[0]}

                    <br />

                    {s.lines[1]}

                  </strong>

                </div>

              </div>

            ))}

            {/* <div className="sale-hero__arrows">

              <button type="button" onClick={prev} aria-label="Previous slide">

                <ArrowIcon flip />

              </button>

              <button type="button" onClick={next} aria-label="Next slide">

                <ArrowIcon />

              </button>

            </div> */}

          </div>

          {/* Current offer */}

          <a

            href={slide.link}

            key={`offer-${slide.id}`}

            className="sale-hero__float-card sale-hero__float-card--top sale-swap"

          >

            <img src={slide.image} alt="" />

            <span>

              <small>NOW SHOWING</small>

              <strong>{slide.offer}</strong>

            </span>

          </a>

          {/* Next slide preview (click to jump) */}

          <button

            type="button"

            key={`next-${nextSlide.id}`}

            className="sale-hero__float-card sale-hero__float-card--bottom sale-swap"

            onClick={next}

            aria-label={`Show ${nextSlide.category}`}

          >

            <img src={nextSlide.image} alt="" />

            <span>

              <small>UP NEXT</small>

              <strong>{nextSlide.category}</strong>

            </span>

          </button>

          <div className="sale-sticker">

            <span>THE BIG</span>

            <strong>

              SALE

              <br />

              EDIT

            </strong>

            <small>UP TO 50% OFF*</small>

          </div>

          {/* Caption: three clickable tabs + counter (01 / 02 / 03) */}

          <div className="sale-hero__caption">

            <div className="sale-caption__tabs" role="tablist" aria-label="Choose a slide">

              {SLIDES.map((s, i) => (

                <button

                  key={s.id}

                  type="button"

                  role="tab"

                  aria-selected={i === active}

                  className={i === active ? "is-active" : ""}

                  onClick={() => goTo(i)}

                >

                  {s.category}

                  <span className="sale-progress" aria-hidden="true">

                    {i === active && canAuto && (

                      <span

                        key={`bar-${active}`}

                        className="sale-progress__bar"

                        style={{ animationDuration: `${SLIDE_MS}ms` }}

                        onAnimationEnd={next}

                      />

                    )}

                    {i === active && !canAuto && <span className="sale-progress__bar is-static" />}

                  </span>

                </button>

              ))}

            </div>

            <span className="sale-caption__count" aria-live="polite">

              <b>{pad2(active + 1)}</b> / {pad2(SLIDES.length)}

            </span>

          </div>

        </div>

        <span className="sale-hero__side-note">LOOK GOOD. SEE MORE.</span>

      </section>

      {/* Scrolling ticker */}

      <div className="sale-marquee" aria-label="Sale highlights">

        <div className="sale-marquee__track">

          {Array.from({ length: 2 }).map((_, index) => (

            <div className="sale-marquee__group" key={index} aria-hidden={index === 1}>

              <span>BUY 1 GET 1 EYEGLASSES</span><b>✳</b>

              <span>FLAT 35% OFF SUNGLASSES</span><b>✳</b>

              <span>BUY 2 GET 1 DAILY LENSES</span><b>✳</b>

              <span>FREE DELIVERY ABOVE ₹499</span><b>✳</b>

              <span>100% GENUINE PRODUCTS</span><b>✳</b>

            </div>

          ))}

        </div>

      </div>

      {/* 2. Shop by category */}

      <section className="sale-section sale-categories sale-reveal" id="sale-categories">

        <div className="sale-section__heading">

          <div>

            <span className="sale-kicker">YOUR NEXT FAVOURITE</span>

            <h2>

              Three moods.

              <br />

              <em>One good sale.</em>

            </h2>

          </div>

          <p>Start with what you need, stay for what you love.</p>

        </div>

        <div className="sale-category-grid">

          {CATEGORIES.map((category) => {

            const count = DEALS.filter((d) => d.category === category.name).length;

            return (

              <a

                className="sale-category"

                href={category.link}

                key={category.id}

              >

                <img src={category.image} alt={category.name} loading="lazy" />

                <span className="sale-category__number">{category.number}</span>

                <span className="sale-category__count">{count} offers live</span>

                <div className="sale-category__content">

                  <span>{category.note}</span>

                  <h3>{category.name}</h3>

                  <p>{category.description}</p>

                  <span className="sale-category__link">

                    Shop the edit <ArrowIcon />

                  </span>

                </div>

                <span className="sale-category__arrow">

                  <ArrowIcon diagonal />

                </span>

              </a>

            );

          })}

        </div>

      </section>

      {/* 3. Deals */}

      <section className="sale-deals sale-reveal" id="sale-deals">

        <div className="sale-section sale-deals__inner">

          <div className="sale-section__heading sale-section__heading--deals">

            <div>

              <span className="sale-kicker">THE GOOD-STUFF LIST</span>

              <h2>

                Deals worth

                <br />

                <em>a second look.</em>

              </h2>

            </div>

            <p>Pick a category, reveal the code and apply it at checkout.</p>

          </div>

          <div className="sale-filter" role="group" aria-label="Filter sale deals">

            {["All", "Eyeglasses", "Sunglasses", "Contact Lenses"].map((filter) => (

              <button

                type="button"

                key={filter}

                className={activeFilter === filter ? "is-active" : ""}

                aria-pressed={activeFilter === filter}

                onClick={() => setActiveFilter(filter)}

              >

                {filter}

                <small>

                  {filter === "All"

                    ? DEALS.length

                    : DEALS.filter((d) => d.category === filter).length}

                </small>

              </button>

            ))}

          </div>

          <div className="sale-deals__grid">

            {visibleDeals.map((deal, index) => {

              const expired = isExpired(deal);

              const shown = revealed.includes(deal.id);

              const save = deal.oldPrice - deal.price;

              return (

                <article

                  className={`sale-deal-card ${deal.theme} ${expired ? "is-expired" : ""}`}

                  key={deal.id}

                >

                  <div className="sale-deal-card__image">

                    <img src={deal.image} alt={deal.category} loading="lazy" />

                    <span className="sale-deal-card__tag">{deal.tag}</span>

                    <span className="sale-deal-card__index">0{index + 1}</span>

                    <span className="sale-deal-card__big">{deal.discount}</span>

                  </div>

                  <div className="sale-deal-card__body">

                    <span className="sale-kicker">{deal.eyebrow}</span>

                    <h3>{deal.title}</h3>

                    <p>{deal.description}</p>

                    <div className="sale-deal-card__pricing">

                      <strong>{rupees(deal.price)}</strong>

                      <del>{rupees(deal.oldPrice)}</del>

                      <span>SAVE {rupees(save)}</span>

                    </div>

                    {expired ? (

                      <div className="sale-coupon is-ended">

                        <span>

                          <small>OFFER ENDED</small>

                          <strong>Expired</strong>

                        </span>

                      </div>

                    ) : shown ? (

                      <button

                        type="button"

                        className="sale-coupon is-open"

                        onClick={() => copyCode(deal.code)}

                        aria-label={`Copy coupon ${deal.code}`}

                      >

                        <span>

                          <small>USE CODE</small>

                          <strong>{deal.code}</strong>

                        </span>

                        <span className="sale-coupon__action">

                          {copiedCode === deal.code ? "COPIED ✓" : "COPY CODE"}

                          <ArrowIcon diagonal />

                        </span>

                      </button>

                    ) : (

                      <button

                        type="button"

                        className="sale-coupon is-locked"

                        onClick={() => setRevealed((r) => [...r, deal.id])}

                      >

                        <span>

                          <small>COUPON</small>

                          <strong aria-hidden="true">••••••</strong>

                        </span>

                        <span className="sale-coupon__action">

                          REVEAL CODE <ArrowIcon diagonal />

                        </span>

                      </button>

                    )}

                    <div className="sale-deal-card__meta">

                      <span>{expired ? "Offer expired" : `Valid till ${dateLabel(deal.validTill)}`}</span>

                      <a href="#sale-terms" onClick={() => setTermsOpen(true)}>

                        T&amp;C apply

                      </a>

                    </div>

                    <a

                      className="sale-deal-card__link"

                      href={CATEGORIES.find((c) => c.name === deal.category)?.link || "#sale-categories"}

                    >

                      Shop this offer <ArrowIcon />

                    </a>

                  </div>

                </article>

              );

            })}

          </div>

          <p className="sale-disclaimer">

            *Prices, discounts and coupon codes are sample campaign content. Confirm them against your live catalogue before publishing.

          </p>

        </div>

      </section>

      {/* 4. Promo strip */}

      <section className="sale-promo sale-reveal">

        <div className="sale-promo__circle sale-promo__circle--one" />

        <div className="sale-promo__circle sale-promo__circle--two" />

        <div className="sale-promo__content">

          <span className="sale-kicker">A LITTLE EXTRA SOMETHING</span>

          <h2>

            Make room for

            <br />

            <em>a new perspective.</em>

          </h2>

          <p>From your 9-to-5 frames to your out-of-office shades, your next look starts here.</p>

          <a className="sale-button sale-button--light" href="#sale-categories">

            Find your next pair <ArrowIcon />

          </a>

        </div>

        <div className="sale-promo__art">
          <img
            className="sale-promo__product-image"
            src="/images/slider2.png"
            alt="Contact lens product boxes from leading lens brands"
            loading="lazy"
          />
        </div>

        <span className="sale-promo__vertical">LENS MART INDIA · SEE YOURSELF</span>

      </section>

      {/* 5. Benefits */}

      <section className="sale-section sale-benefits sale-reveal">

        <div className="sale-section__heading">

          <div>

            <span className="sale-kicker">THE LENS MART DIFFERENCE</span>

            <h2>

              Good choices.

              <br />

              <em>Clear reasons.</em>

            </h2>

          </div>

          <p>Shopping for your eyes should feel easy from first click to final choice.</p>

        </div>

        <div className="sale-benefit-grid">

          {BENEFITS.map((benefit, index) => (

            <article className="sale-benefit" key={benefit.title}>

              <div className="sale-benefit__top">

                <span>{benefit.icon}</span>

                <small>0{index + 1}</small>

              </div>

              <h3>{benefit.title}</h3>

              <p>{benefit.text}</p>

            </article>

          ))}

        </div>

      </section>

      {/* 6. Steps + FAQ */}

      <section className="sale-bottom sale-reveal">

        <div className="sale-bottom__steps">

          <span className="sale-kicker">NO COMPLICATED STUFF</span>

          <h2>

            Three steps to

            <br />

            <em>your next look.</em>

          </h2>

          <div className="sale-mini-step">

            <span>01</span>

            <div>

              <h3>Explore</h3>

              <p>Choose your category and find a deal you love.</p>

            </div>

          </div>

          <div className="sale-mini-step">

            <span>02</span>

            <div>

              <h3>Reveal</h3>

              <p>Press “Reveal code” and copy the coupon on an eligible offer.</p>

            </div>

          </div>

          <div className="sale-mini-step">

            <span>03</span>

            <div>

              <h3>Checkout</h3>

              <p>Apply the code and review your final order total.</p>

            </div>

          </div>

        </div>

        <div className="sale-faq">

          <span className="sale-kicker">GOOD TO KNOW</span>

          <h2>Quick questions.</h2>

          {FAQS.map((faq, index) => (

            <div className={`sale-faq__item ${openFaq === index ? "is-open" : ""}`} key={faq.q}>

              <button

                type="button"

                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}

                aria-expanded={openFaq === index}

              >

                <span>{faq.q}</span>

                <span className="sale-faq__icon" aria-hidden="true">{openFaq === index ? "−" : "+"}</span>

              </button>

              <div className="sale-faq__answer" aria-hidden={openFaq !== index}>

                <div className="sale-faq__answer-inner">

                  <p>{faq.a}</p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* 7. Terms & Conditions */}

      <section className="sale-terms" id="sale-terms">

        <button

          type="button"

          className="sale-terms__toggle"

          onClick={() => setTermsOpen((v) => !v)}

          aria-expanded={termsOpen}

          aria-controls="sale-terms-body"

        >

          <span>Terms &amp; Conditions</span>

          <b>{termsOpen ? "−" : "+"}</b>

        </button>

        <div className={`sale-terms__body ${termsOpen ? "is-open" : ""}`} id="sale-terms-body">

          <ol>

            {TERMS.map((t) => (

              <li key={t}>{t}</li>

            ))}

          </ol>

        </div>

      </section>

      {/* <footer className="sale-footer">

        <span>© {new Date().getFullYear()} LensMartIndia</span>

        <span>Find your fit. See your world.</span>

        <a href="#top">Back to top ↑</a>

      </footer> */}

      <div className={`sale-copy-toast ${copiedCode ? "is-visible" : ""}`} role="status" aria-live="polite">

        {copiedCode ? `Coupon ${copiedCode} copied` : ""}

      </div>

    </div>

  );

}
