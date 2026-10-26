"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Newsletter from "../../components/Newsletter";

import "../../styles/blog.css";


const POSTS = [
  {
    "slug": "colored-lenses-guide-2025",
    "title": "The 2025 Colored Lenses Guide: Finding a Shade That Reads Natural",
    "excerpt": "Tinted lenses have moved far beyond costume nights. Here's how our fitters pick shades, base curves and diameters that look like “you, but brighter”.",
    "body": "The biggest mistake first-time color wearers make is picking a shade in a photo and expecting it to look the same in daylight. Pigment density, pupil size and your natural iris all interact with light, so what reads as soft honey on camera can look flat under the sun. Always try a shade in the daylight before committing to a full box.\n\nWhen you shop with us, we start from your natural eye tone and move no more than one shade away for a “natural” look, or two for an obvious change. Hazel eyes flatter in honey and umber; brown eyes pop with green and grey blends; blue eyes can go dramatic with slate or violet without any effort.\n\nCosmetic and prescribed tinted lenses are made differently. Our entire color line is oxygen-permeable silicone hydrogel with a 14.2 mm total diameter, and every pair ships with a 30-day comfort guarantee — because a tint you have to tolerate isn't a tint you'll actually wear.",
    "category": "Color Lenses",
    "author": "Dr. Aisha Verma",
    "role": "O.D., Lens Fitting Specialist",
    "publishedAt": "2025-06-25",
    "imageUrl": "https://images.pexels.com/photos/5843363/pexels-photo-5843363.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "imageAlt": "A young woman carefully applying a contact lens at the mirror",
    "tags": [
      "Color Lenses",
      "Styling",
      "Fit Guide"
    ],
    "featured": true,
    "readMinutes": 8
  },
  {
    "slug": "how-often-replace-contact-lenses",
    "title": "How Often Should You Really Replace Your Contact Lenses?",
    "excerpt": "Daily, bi-weekly, monthly — what the replacement schedule actually means for your corneas, and why “a couple of extra days” quietly costs you clarity.",
    "body": "A replacement schedule is not a marketing trick — it is a corrosion limit. Every time a lens sits on the eye it collects tears, proteins, lipids and, if you're unlucky, protein from the outside air. Over days that film gets thicker, and no amount of rubbing removes it completely.\n\nMonthly wearers who stretch to 45 days are usually trading a few rupees against oxygen transmission: studies consistently show old lenses pass measurably less oxygen, and a hypoxic cornea is a dry, irritated, infection-prone cornea. The “I never had a problem before” lens is the lens that ends the streak.\n\nA simple rule from our clinic: tear in the box date the day you opened the box. Daily disposables go in the bin at night; bi-weekly pairs at day 14; monthlies at day 30, even if they look fine. They rarely look fine — that's the point.",
    "category": "Lens Care",
    "author": "Dr. Kabir Mehta",
    "role": "FACO, Cornea Specialist",
    "publishedAt": "2026-01-18",
    "imageUrl": "https://images.pexels.com/photos/36569539/pexels-photo-36569539.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "imageAlt": "Contact lenses, case and prescription form laid out on a desk",
    "tags": [
      "Safety",
      "Hygiene",
      "Schedules"
    ],
    "featured": false,
    "readMinutes": 6
  },
  {
    "slug": "toric-lenses-explained",
    "title": "Toric Lenses Explained: Sharper, Steadier Vision for Astigmatism",
    "excerpt": "If glasses are the only way you've ever seen properly, toric contacts are a cheat code. How they stay stable and what to expect in week one.",
    "body": "Astigmatism means the cornea curves more in one direction than another, so a normal spherical lens gives you a slightly smeared image at every distance. A toric lens has two powers — one for each meridian — which is why it has to sit at exactly the right angle to work.\n\nModern torics stay put with two subtle tricks: a thin lens periphery that rests on the eye like a skirt, plus small prism-ballast weights at the bottom edge. Between the two, most wearers report the lens “settling in” within 30 to 60 seconds, and a small rotational drift over the day is completely normal.\n\nExpect a slightly longer fitting than a standard prescription. We check your axis in at least two positions, trial both lenses in each eye, and re-check rotation at day seven. Most astigmatic wearers tell us week one feels strange and month one feels like glasses — but without the fog, the frames, or the tunnel at the edges.",
    "category": "Lens Types",
    "author": "Dr. Aisha Verma",
    "role": "O.D., Lens Fitting Specialist",
    "publishedAt": "2025-11-02",
    "imageUrl": "https://images.pexels.com/photos/6749727/pexels-photo-6749727.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "imageAlt": "An optometrist fitting a trial frame during an eye examination",
    "tags": [
      "Astigmatism",
      "Fitting",
      "First-Timers"
    ],
    "featured": false,
    "readMinutes": 7
  },
  {
    "slug": "daily-biweekly-monthly-schedule",
    "title": "Daily, Bi-Weekly & Monthly: Which Schedule Fits Your Lifestyle?",
    "excerpt": "The right replacement schedule depends on your routine, your tear film and your budget — in that order. Here's our clinic's honest breakdown.",
    "body": "Daily disposables are the gold standard for hygiene: zero cleaning, zero cases in your bag, a fresh pair every morning. The trade-off is price and plastic, and they suit travelers, sports people, and anyone who has ever fallen asleep with a lens in.\n\nBi-weekly wearers get half the lenses and the same oxygen budget per day, provided they actually swap at day 14. Monthly lenses are the value pick and are the right call for diligent wearers with stable tear production — but only if you're disciplined about overnight soaks.\n\nOur rule of thumb: if you work night shifts, do sports, or travel weekly, go daily. If your hands are careful and your routine is steady, monthly saves 40% of the cost without a drop in safety. In between, bi-weekly is the quiet compromise that most of our repeat customers actually end up on.",
    "category": "Lens Types",
    "author": "Priya Nair",
    "role": "Contact Lens Specialist",
    "publishedAt": "2025-09-14",
    "imageUrl": "https://images.pexels.com/photos/5842855/pexels-photo-5842855.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "imageAlt": "Flat lay of contact lens packs, a case and eyeglasses on a white surface",
    "tags": [
      "Buying Guide",
      "Schedules",
      "Value"
    ],
    "featured": false,
    "readMinutes": 5
  },
  {
    "slug": "dry-eyes-contact-hacks",
    "title": "Dry Eyes While Wearing Contacts? 7 Comfort Hacks That Actually Work",
    "excerpt": "End-of-day grittiness is the #1 reason people give up on contacts. Most of it is fixable without changing your whole prescription.",
    "body": "Contacts don't cause dry eyes on their own — they amplify a tear film that was already borderline. If your eyes are tired by 4 pm with or without lenses, the first fix is the tears, not the lenses: blink consciously, take 20-20-20 breaks from screens, and raise your monitor so your eyes look slightly down.\n\nOn the lens side, the single biggest upgrade is moving from hydrogel to a high-oxygen silicone hydrogel at 55% or higher water content — counterintuitively, a medium-water lens often feels moister all day than a 70% water lens, which drinks from your surface to stay wet.\n\nFinally, respect the wear time. A “16-hour comfort” lens worn through a 12-hour shift is not a comfort lens, it's a countdown. Add a preservative-free lubricant before and after screen-heavy blocks, and if day three of a new pair still hurts, that's a fitting conversation, not a patience test.",
    "category": "Eye Health",
    "author": "Dr. Elena Rodrigues",
    "role": "O.D., Dry Eye Clinic",
    "publishedAt": "2025-12-09",
    "imageUrl": "https://images.pexels.com/photos/2453727/pexels-photo-2453727.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "imageAlt": "Close-up macro photograph of a woman's eye and lashes",
    "tags": [
      "Comfort",
      "Dry Eye",
      "Silicone Hydrogel"
    ],
    "featured": false,
    "readMinutes": 6
  },
  {
    "slug": "clean-and-store-lenses-right",
    "title": "Torn, Smudged or Stuck? The Right Way to Clean and Store Your Lenses",
    "excerpt": "The case is the one piece of your routine that 9 out of 10 wearers do wrong. A two-minute protocol our clinic uses with every patient.",
    "body": "Rinse the lenses in fresh multipurpose solution the moment you take them out — not at the sink after dinner, not “later”. Overnight, debris left on the lens surface hardens into the material, and that's the permanent smudge that no cleaning ever fully removes.\n\nThen rub. Rub-rinse for 15 seconds each side sounds aggressive, but it is the only step that actually knocks protein off. Tap-tap in a dry palm for 10 seconds dries the lenses to a consistent moisture, and only then do they go into a case topped with fresh solution — never worn-out, never topped-up solution. Top-up solution is the most common cause of Acanthamoara and bacterial keratitis we see in clinic, full stop.\n\nRetire the case every three months and let it air-dry upside down between uses. If a lens tears, folds wonkily, or feels like it has a pebble on day one of a new pair, bin it and call us — most of our brands cover a first-week fit replacement free.",
    "category": "Lens Care",
    "author": "Priya Nair",
    "role": "Contact Lens Specialist",
    "publishedAt": "2025-10-21",
    "imageUrl": "https://images.pexels.com/photos/5842844/pexels-photo-5842844.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "imageAlt": "Hands holding a contact lens and care accessories on a white background",
    "tags": [
      "Hygiene",
      "Cleaning",
      "Safety"
    ],
    "featured": false,
    "readMinutes": 6
  },
  {
    "slug": "hydrogel-vs-silicone-hydrogel",
    "title": "Hydrogel vs. Silicone Hydrogel: Why Oxygen Is Everything",
    "excerpt": "Your cornea breathes through your lenses, day and night. What the %O2K number means for comfort, safety and how long you can safely wear them.",
    "body": "The cornea gets almost all of its oxygen from the air while you sleep and from the tear film while you're awake — and your lens is a filter in between. Oxygen permeability, or Dk, measures how much gets through. Older hydrogel lenses pass a fraction of what modern silicone hydrogel does.\n\nThat gap matters most at the edges of acceptable wear. A lens with low Dk can be perfectly comfortable for 6 hours and quietly stress the cornea by 10. A high-Dk silicone hydrogel (Dk/t of 150+) keeps the same eye comfortable and safe for 14 to 16 hours, which is why we now fit most of our patients on them.\n\nThe trade-offs are real: silicone hydrogel is stiffer, some wearers feel the first hour differently, and a few eyes with very low tear production prefer a mid-water hydrogel. Neither material is “better” in the abstract — the better lens is the one your eye can keep on, comfortably, for a full day. That's what a proper trial set is for.",
    "category": "Lens Types",
    "author": "Dr. Kabir Mehta",
    "role": "FACO, Cornea Specialist",
    "publishedAt": "2025-08-07",
    "imageUrl": "https://images.pexels.com/photos/29263648/pexels-photo-29263648.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "imageAlt": "Macro shot of a human eye with blue and brown iris patterns",
    "tags": [
      "Materials",
      "Oxygen",
      "Science"
    ],
    "featured": false,
    "readMinutes": 7
  },
  {
    "slug": "first-time-wearer-7-day-guide",
    "title": "First-Time Wearer? A Calm 7-Day Guide to Your First Lens",
    "excerpt": "Nerves are normal; pain is not. A day-by-day routine that turns “I can't do this” into a two-second habit by the second week.",
    "body": "Day one is a practice day, not a life day. Wash hands, dry with a lint-free towel, and just hold the lens on your index finger in the mirror — look at it, check it's bowl-shaped and not folded inside out. The concave-side-up trick: if the edges flare outward like a bowl, it's correct.\n\nDays two to four, insert with a shorter blink than you think. Open wide with your other hand, place the lens, close and look right-down-left-down, then blink slowly. It will feel like there's a massive object in your eye for the first 20 minutes — that sensation fades, the lens doesn't. If it still stings after 15 minutes of blinking with lubricant, take it out and rest; do not push through pain.\n\nDays five to seven are about rhythm. In the morning with your coffee, out at night before the phone. If you skip a day, don't double up the next. Most first-time wearers tell us the fear peaks at day two and is basically gone by day ten — the eye adapts faster than the confidence does.",
    "category": "New Wearers",
    "author": "Dr. Aisha Verma",
    "role": "O.D., Lens Fitting Specialist",
    "publishedAt": "2026-01-05",
    "imageUrl": "https://images.pexels.com/photos/34430733/pexels-photo-34430733.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "imageAlt": "Close-up of a human eye with a detailed brown iris",
    "tags": [
      "First-Timers",
      "Routine",
      "Guide"
    ],
    "featured": false,
    "readMinutes": 8
  },
  {
    "slug": "saline-vs-multipurpose-solution",
    "title": "Saline vs. Multipurpose Solution: What Your Lenses Actually Need",
    "excerpt": "One rinses, one cleans, one does nothing except make you feel productive. What each bottle is for — and the tap water rule nobody follows.",
    "body": "Multipurpose solution is the only bottle doing real work: it kills microbes, removes protein, and rehydrates the lens. Saline is a sterile rinse — it cleans nothing, which is exactly why it's the recommended second-rinse before insertion, not a replacement for multipurpose.\n\nThe dangerous shortcut is tap water. It sounds fine because it's water, but it carries Acanthamoeba and other organisms that saline and multipurpose don't, and a lens rinsed under the tap is a delivery system straight to your cornea. If a lens gets under the tap, soak it in fresh multipurpose for the full recommended time and bin it if you're at all unsure.\n\nAnd the expiry matters: opened solution lasts 3 months or until the bottle is empty, whichever comes first. Keep a dated sticker on the cap — it's the single cheapest insurance in the entire contact lens habit.",
    "category": "Lens Care",
    "author": "Dr. Elena Rodrigues",
    "role": "O.D., Dry Eye Clinic",
    "publishedAt": "2025-07-19",
    "imageUrl": "https://images.pexels.com/photos/5843446/pexels-photo-5843446.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "imageAlt": "Eyeglasses and contact lens supplies arranged on a blue table",
    "tags": [
      "Care Products",
      "Safety",
      "Hygiene"
    ],
    "featured": false,
    "readMinutes": 5
  },
  {
    "slug": "colorful-lenses-eye-safety",
    "title": "Colorful Lenses & Eye Safety: What Ophthalmologists Want You to Know",
    "excerpt": "Trendy tints from the mall kiosk versus prescribed color contacts — the difference is on a lab certificate, not on the box art.",
    "body": "A cosmetic “fashion” lens without a prescription is a fit you cannot see: it has a base curve chosen for an average eye, a water content chosen for a lab, and zero oxygen guarantee. Wear it over a cornea that's actually 0.3 mm different in diameter and you've built a wicking machine for inflammation.\n\nPrescribed color contacts are fitted the same way as clear ones — diameter, base curve, trial lens, wear review — with the tint added on top of a safe, high-oxygen platform. The color layer is laminated between the two surfaces of the lens, so it cannot flake into the eye, and reputable brands publish oxygen, water and diameter data for every shade.\n\nIf a kiosk pair gives you one uncomfortable evening, that's an irritation, and irritation is a signal. Recurrent redness, tearing after wear, or light sensitivity means stop and get fitted — the good news is that a proper color fit is usually just a consultation and a trial set away.",
    "category": "Color Lenses",
    "author": "Dr. Kabir Mehta",
    "role": "FACO, Cornea Specialist",
    "publishedAt": "2025-05-11",
    "imageUrl": "https://images.pexels.com/photos/33975157/pexels-photo-33975157.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "imageAlt": "Detailed macro shot of a vibrant blue human eye",
    "tags": [
      "Color Lenses",
      "Safety",
      "Cosmetics"
    ],
    "featured": false,
    "readMinutes": 6
  },
  {
    "slug": "scleral-lenses-irregular-corneas",
    "title": "Scleral Lenses: The Quiet Game-Changer for Irregular Corneas",
    "excerpt": "For keratoconus, dry eye and post-surgical eyes, sclerals vault over the problem entirely. Why patients call them “the lens that changed my life”.",
    "body": "A scleral lens is a large, gas-permeable shell that skips the uneven cornea and rests on the smooth tissue around it — the sclera — holding a tiny reservoir of sterile saline between itself and the eye. The result is an optical surface of the lens itself, completely independent of the cornea's shape.\n\nFor keratoconus patients, that usually means seeing better with sclerals than they did with their best glasses, and wearing them all day. For severe dry eye, the saline reservoir does the work of dozens of artificial tears at once, which is why many patients describe the first hour as “is something wrong, this feels too good”.\n\nFitting is more involved — topography, a trial set, a follow-up to check the landing zone — but the comfort and vision gains are hard to overstate. If soft lenses have always felt like a compromise for you, this is the conversation to have at your next review.",
    "category": "Eye Health",
    "author": "Dr. Elena Rodrigues",
    "role": "O.D., Dry Eye Clinic",
    "publishedAt": "2025-04-03",
    "imageUrl": "https://images.pexels.com/photos/25226007/pexels-photo-25226007.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "imageAlt": "Extreme close-up of a green eye showing intricate iris patterns",
    "tags": [
      "Keratoconus",
      "Specialty",
      "Comfort"
    ],
    "featured": false,
    "readMinutes": 7
  },
  {
    "slug": "reading-your-prescription-decoded",
    "title": "Reading Your Prescription: Power, Base Curve and Diameter Decoded",
    "excerpt": "SPH, CYL, AXIS, BC, DIA — six numbers on your slip and three of them don't even exist in glasses land. A plain-English walkthrough.",
    "body": "The part you share with glasses: Sphere (SPH) is your main power — minus corrects nearsightedness, plus farsightedness. Cylinder (CYL) and Axis (AX) appear only if you have astigmatism; together they tell the toric lens how much extra power to add and at what angle.\n\nThen the lens-only numbers. Base Curve (BC) is how sharply the lens bends — roughly matching the curvature of your cornea so it centres and moves with you. Diameter (DIA) is the overall width in millimetres, usually 14.0 to 14.6 for a standard soft lens, which is also why a “one size” fashion lens is a gamble.\n\nWater content and oxygen permeability (Dk) finish the picture: they describe the material, not you, which is why two prescriptions can look identical and feel nothing alike. When you order from us, our team matches all six to the exact platform in stock — send a photo of the slip and we'll do the translation before anything ships.",
    "category": "New Wearers",
    "author": "Priya Nair",
    "role": "Contact Lens Specialist",
    "publishedAt": "2026-02-01",
    "imageUrl": "https://images.pexels.com/photos/3846022/pexels-photo-3846022.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "imageAlt": "Ophthalmologist adjusting a measuring device during a vision test",
    "tags": [
      "Prescriptions",
      "Basics",
      "Glossary"
    ],
    "featured": false,
    "readMinutes": 5
  }
];

const POSTS_PER_PAGE = 9;
const CATEGORY_ORDER = ["Lens Care", "Lens Types", "Color Lenses", "Eye Health", "New Wearers"];

const svgProps = (size, strokeWidth = 2) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
});

const SearchIcon = ({ size = 16 }) => (
  <svg {...svgProps(size)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);
const CalendarIcon = ({ size = 14 }) => (
  <svg {...svgProps(size)}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </svg>
);
const ClockIcon = ({ size = 14 }) => (
  <svg {...svgProps(size)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
const CloseIcon = ({ size = 16, strokeWidth = 2.2 }) => (
  <svg {...svgProps(size, strokeWidth)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
const ArrowRightIcon = ({ size = 14 }) => (
  <svg {...svgProps(size, 2.2)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const ArrowUpRightIcon = ({ size = 19 }) => (
  <svg {...svgProps(size, 2.2)}>
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);
const SparkIcon = ({ size = 13 }) => (
  <svg {...svgProps(size, 2.4)}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M17.7 6.3l-2.5 2.5M8.8 15.2l-2.5 2.5" />
  </svg>
);
const ChevronLeftIcon = ({ size = 16 }) => (
  <svg {...svgProps(size, 2.4)}>
    <path d="m15 6-6 6 6 6" />
  </svg>
);
const ChevronRightIcon = ({ size = 16 }) => (
  <svg {...svgProps(size, 2.4)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

/* ------------------------------------------------------------
   Helpers
   ------------------------------------------------------------ */
function formatDate(iso) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function initials(name) {
  const clean = name.replace(/^(Dr\.|O\.D\.|OD|FACO|B\.Opt)[,\s]*/i, "").trim();
  return clean
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

function Avatar({ name, size = 28 }) {
  return (
    <span className="blog-avatar" style={{ width: size, height: size, fontSize: size * 0.36 }} aria-hidden="true">
      {initials(name)}
    </span>
  );
}

/* Page numbers with "…" jab pages zyada ho jayein */
function getPageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push("…");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < total - 1) items.push("…");
  items.push(total);
  return items;
}

/* ------------------------------------------------------------
   Component
   ------------------------------------------------------------ */
export default function Blog() {
  const [activeCat, setActiveCat] = useState("All");
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [openPost, setOpenPost] = useState(null);
  const controlsRef = useRef(null);

  // Newest first
  const sortedPosts = useMemo(
    () => [...POSTS].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1)),
    []
  );

  // Hero (featured) alag; baaki sab grid mein
  const featured = useMemo(() => sortedPosts.find((p) => p.featured) ?? null, [sortedPosts]);
  const gridSource = useMemo(() => sortedPosts.filter((p) => !p.featured), [sortedPosts]);

  const categories = useMemo(() => {
    const names = [...new Set(sortedPosts.map((p) => p.category))];
    const ordered = CATEGORY_ORDER.filter((c) => names.includes(c)).concat(
      names.filter((c) => !CATEGORY_ORDER.includes(c))
    );
    return ordered.map((name) => ({
      name,
      count: sortedPosts.filter((p) => p.category === name).length,
    }));
  }, [sortedPosts]);

  // Search debounce
  useEffect(() => {
    const t = setTimeout(() => setQuery(input.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [input]);

  // Filter / search badalne par page 1 par wapas
  useEffect(() => {
    setPage(1);
  }, [activeCat, query]);

  const matchesFilters = (p) => {
    const inCat = activeCat === "All" || p.category === activeCat;
    const inSearch =
      query === "" ||
      p.title.toLowerCase().includes(query) ||
      p.excerpt.toLowerCase().includes(query) ||
      p.tags.some((t) => t.toLowerCase().includes(query));
    return inCat && inSearch;
  };

  const filtered = useMemo(
    () => gridSource.filter(matchesFilters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gridSource, activeCat, query]
  );
  // Hero hamesha dikhta hai — category/search se hide nahi hota
  const showFeatured = featured !== null;

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = filtered.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    setPage(p);
    controlsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Modal: scroll lock + Esc se close
  useEffect(() => {
    if (!openPost) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setOpenPost(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [openPost]);

  return (
    <section className="blog-page">
      <div className="blog-wrap">
        {/* Header */}
        <div className="blog-head">
          <span className="blog-badge">
            <SparkIcon size={13} />
            Read Our Journal
          </span>
          <h1 className="blog-title">Browse Our Resources</h1>
          <p className="blog-sub">
            Expert fit guides, honest lens-care routines and eye-health advice from our optometrists. For real
            eyes, real days, zero guesswork.
          </p>
        </div>

        {/* Hero / featured story */}
        {showFeatured && (
          <button type="button" className="blog-featured" onClick={() => setOpenPost(featured)}>
            <span className="blog-featured-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={featured.imageUrl} alt={featured.imageAlt} />
              <span className="blog-featured-veil" />
              <span className="blog-featured-arrow" aria-hidden="true">
                <ArrowUpRightIcon size={19} />
              </span>
              <span className="blog-featured-body">
                <span className="blog-featured-tags">
                  {featured.tags.slice(0, 3).map((tg) => (
                    <span key={tg} className="blog-chip-glass">
                      {tg}
                    </span>
                  ))}
                </span>
                <span className="blog-featured-title">{featured.title}</span>
                <span className="blog-featured-excerpt">{featured.excerpt}</span>
                <span className="blog-featured-meta">
                  <Avatar name={featured.author} size={34} />
                  <span className="blog-featured-author">
                    <strong>{featured.author}</strong>
                    <em>{featured.role}</em>
                  </span>
                  <span className="blog-dot blog-dot-light" aria-hidden="true" />
                  <span className="blog-featured-date">
                    <CalendarIcon size={14} />
                    {formatDate(featured.publishedAt)}
                  </span>
                  <span className="blog-dot blog-dot-light" aria-hidden="true" />
                  <span className="blog-featured-date">
                    <ClockIcon size={13} />
                    {featured.readMinutes} min read
                  </span>
                </span>
              </span>
            </span>
          </button>
        )}

        {/* Category tabs + search */}
        <div className="blog-controls" ref={controlsRef}>
          <div className="blog-tabs" role="tablist" aria-label="Blog categories">
            <button
              type="button"
              role="tab"
              aria-selected={activeCat === "All"}
              className={`blog-tab ${activeCat === "All" ? "is-active" : ""}`}
              onClick={() => setActiveCat("All")}
            >
              All <span className="blog-tab-count">{sortedPosts.length}</span>
            </button>
            {categories.map((c) => (
              <button
                key={c.name}
                type="button"
                role="tab"
                aria-selected={activeCat === c.name}
                className={`blog-tab ${activeCat === c.name ? "is-active" : ""}`}
                onClick={() => setActiveCat(c.name)}
              >
                {c.name} <span className="blog-tab-count">{c.count}</span>
              </button>
            ))}
          </div>

          <label className="blog-search">
            <SearchIcon size={15} />
            <input
              type="text"
              placeholder="Search the journal…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Search the journal"
            />
            {input && (
              <button type="button" className="blog-search-clear" onClick={() => setInput("")} aria-label="Clear search">
                <CloseIcon size={12} strokeWidth={2.6} />
              </button>
            )}
          </label>
        </div>

        {/* Grid (9 per page) */}
        {pagePosts.length === 0 ? (
          <div className="blog-empty">
            <p className="blog-empty-title">No articles found</p>
            <p>Try a different category or search term.</p>
            <button
              type="button"
              className="blog-btn"
              onClick={() => {
                setActiveCat("All");
                setInput("");
              }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="blog-grid" key={`${activeCat}-${query}-${currentPage}`}>
            {pagePosts.map((post, i) => (
              <article key={post.slug} className="blog-card" style={{ animationDelay: `${i * 50}ms` }}>
                <button
                  type="button"
                  className="blog-card-media"
                  onClick={() => setOpenPost(post)}
                  aria-label={`Read: ${post.title}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.imageUrl} alt={post.imageAlt} loading="lazy" />
                </button>
                <div className="blog-card-copy">
                  <span className="blog-card-cat">{post.category}</span>
                  <h3 className="blog-card-title">
                    <button type="button" onClick={() => setOpenPost(post)} title={post.title}>
                      {post.title}
                    </button>
                  </h3>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                  <div className="blog-card-meta">
                    <Avatar name={post.author} size={26} />
                    <span className="blog-card-author">{post.author}</span>
                    <span className="blog-dot" aria-hidden="true" />
                    <span className="blog-card-date">
                      <CalendarIcon size={13} />
                      {formatDate(post.publishedAt)}
                    </span>
                  </div>
                  <button type="button" className="blog-card-link" onClick={() => setOpenPost(post)}>
                    Read details <ArrowRightIcon size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <nav className="blog-pagination" aria-label="Blog pagination">
            <button
              type="button"
              className="blog-page-btn blog-page-nav"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeftIcon /> <span>Prev</span>
            </button>

            <div className="blog-page-list">
              {getPageItems(currentPage, totalPages).map((item, idx) =>
                item === "…" ? (
                  <span key={`dots-${idx}`} className="blog-page-dots">
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    className={`blog-page-btn ${item === currentPage ? "is-active" : ""}`}
                    onClick={() => goToPage(item)}
                    aria-label={`Page ${item}`}
                    aria-current={item === currentPage ? "page" : undefined}
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              className="blog-page-btn blog-page-nav"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <span>Next</span> <ChevronRightIcon />
            </button>
          </nav>
        )}

        {/* {filtered.length > 0 && (
          <p className="blog-footnote">
            Showing <strong>{startIndex + 1}–{startIndex + pagePosts.length}</strong> of{" "}
            <strong>{filtered.length}</strong> articles
          </p>
        )} */}
      </div>

      {/* Details popup */}
      {openPost && (
        <div
          className="blog-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={openPost.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenPost(null);
          }}
        >
          <div className="blog-modal">
            <div className="blog-modal-hero">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={openPost.imageUrl} alt={openPost.imageAlt} />
              <span className="blog-modal-veil" />
              <button type="button" className="blog-modal-close" onClick={() => setOpenPost(null)} aria-label="Close article">
                <CloseIcon size={17} />
              </button>
              <div className="blog-modal-hero-text">
                <span className="blog-chip blog-chip-solid">{openPost.category}</span>
                <h2>{openPost.title}</h2>
              </div>
            </div>

            <div className="blog-modal-scroll">
              <div className="blog-modal-meta">
                <Avatar name={openPost.author} size={34} />
                <span className="blog-modal-author">
                  <strong>{openPost.author}</strong>
                  <em>{openPost.role}</em>
                </span>
                <span className="blog-dot" aria-hidden="true" />
                <span className="blog-modal-date">
                  <CalendarIcon size={14} />
                  {formatDate(openPost.publishedAt)}
                </span>
                <span className="blog-dot" aria-hidden="true" />
                <span className="blog-modal-date">
                  <ClockIcon size={13} />
                  {openPost.readMinutes} min read
                </span>
              </div>

              {openPost.body.split("\n\n").map((para, i) => (
                <p key={i} className="blog-modal-para">
                  {para}
                </p>
              ))}

              <div className="blog-modal-tags">
                {openPost.tags.map((t) => (
                  <span key={t} className="blog-chip">
                    {t}
                  </span>
                ))}
              </div>

              <div className="blog-modal-cta">
                <p>Need a hand with your fit or prescription?</p>
                <a href="/all-products" className="blog-btn" onClick={() => setOpenPost(null)}>
                  Browse lens collection <ArrowRightIcon size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <Newsletter /> */}
    </section>
  );
}