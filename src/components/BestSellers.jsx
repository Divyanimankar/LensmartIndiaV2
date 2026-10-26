"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import "../styles/BestSellers.css";
const AUTO_PLAY_DELAY = 3000;
const TOTAL_DOTS = 5;



const WISHLIST_KEY = "lensmartWishlist";

const readWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch {
    return [];
  }
};

/*
  Ye wahi products hain jo /eyeglasses/[id] detail page me hain.
  `id` detail page ki id se EXACT match karni chahiye, tabhi
  "View product" sahi product ka page kholega:  /eyeglasses/{id}

  gender  : "men" | "women"  (tabs ke liye)
  colors  : detail page ke hi colour values
*/
const productData = [
  { id: 2, category: "eyeglasses", gender: "women", brand: "RAY-BAN", name: "Premium Round Eyeglasses", image: "/images/eyeglass2.png", rating: 4.6, reviews: 320, shape: "Round", material: "Metal", frameSize: "M", price: 1499, oldPrice: 1999, colors: ["#795548", "#222222", "#c8a951"] },
  { id: 4, category: "eyeglasses", gender: "women", brand: "LENS MART", name: "Elegant Cat-Eye Eyeglasses", image: "/images/eyeglass4.png", rating: 4.8, reviews: 175, shape: "Cat-Eye", material: "Acetate", frameSize: "S", price: 1599, oldPrice: 2199, colors: ["#8b5e3c", "#222222", "#795548"] },
  { id: 7, category: "eyeglasses", gender: "men", brand: "LENS MART", name: "Geometric Metal Eyeglasses", image: "/images/eyeglass7.png", rating: 4.6, reviews: 209, shape: "Geometric", material: "Metal", frameSize: "M", price: 1699, oldPrice: 2299, colors: ["#c8a951", "#b7b7b7", "#222222"] },
  { id: 9, category: "eyeglasses", gender: "women", brand: "VOGUE", name: "Minimal Round Eyeglasses", image: "/images/eyeglass9.png", rating: 4.7, reviews: 164, shape: "Round", material: "Titanium", frameSize: "S", price: 1899, oldPrice: 2599, colors: ["#c8a951", "#222222", "#b7b7b7"] },
  { id: 1, category: "eyeglasses", gender: "men", brand: "VOGUE", name: "Classic Rectangle Eyeglasses", image: "/images/eyeglass1.png", rating: 4.8, reviews: 95, shape: "Rectangle", material: "Acetate", frameSize: "M", price: 1299, oldPrice: 1799, colors: ["#222222", "#795548", "#8b5e3c"] },
  { id: 3, category: "eyeglasses", gender: "men", brand: "VOGUE", name: "Modern Square Eyeglasses", image: "/images/eyeglass3.png", rating: 4.7, reviews: 122, shape: "Square", material: "TR90", frameSize: "L", price: 1199, oldPrice: 1699, colors: ["#222222", "#315c9e", "#b7b7b7"] },
  { id: 6, category: "eyeglasses", gender: "women", brand: "VOGUE", name: "Crystal Oval Eyeglasses", image: "/images/eyeglass6.png", rating: 4.7, reviews: 141, shape: "Oval", material: "Acetate", frameSize: "M", price: 1399, oldPrice: 1899, colors: ["#eeeeee", "#795548", "#222222"] },
  { id: 8, category: "eyeglasses", gender: "men", brand: "RAY-BAN", name: "Classic Aviator Eyeglasses", image: "/images/eyeglass8.png", rating: 4.8, reviews: 118, shape: "Aviator", material: "Metal", frameSize: "L", price: 1799, oldPrice: 2499, colors: ["#b7b7b7", "#c8a951", "#222222"] },
];

const SIZE_LABEL = { XS: "Extra Small", S: "Small", M: "Medium", L: "Large", XL: "Extra Large" };
const money = (v) => `₹${Number(v).toLocaleString("en-IN")}`;

const products = productData.map(p => {
  const saving = Math.max(p.oldPrice - p.price, 0);
  return {
    ...p,
    priceText: money(p.price),
    oldPriceText: money(p.oldPrice),
    saving,
    savingText: money(saving),
    percent: p.oldPrice ? Math.round(saving / p.oldPrice * 100) : 0,
    sizeText: SIZE_LABEL[p.frameSize] || p.frameSize,
    // -> /eyeglasses/2  (detail page)
    link: `/${p.category}/${p.id}`,
  };
});
const Chevron = ({ left = false }) => <svg viewBox="0 0 24 24" aria-hidden="true"><path d={left ? "M15 5 8 12l7 7" : "m9 5 7 7-7 7"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* Wishlist heart: same outline shape always, red fill when active (see CSS) */
const HeartIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
  </svg>
);

export default function BestSellers() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [paused, setPaused] = useState(false);
  const sliderRef = useRef(null);
  const timerRef = useRef(null);
  const filtered = useMemo(() => activeTab === "all" ? products : products.filter(p => p.gender === activeTab), [activeTab]);
  const loopProducts = useMemo(() => filtered.length ? [...filtered, ...filtered, ...filtered] : [], [filtered]);
  
  
  
  const loadWishlist = useCallback(() => {
  setWishlist(
    readWishlist()
      .filter((item) => item.productType === "eyeglasses")
      .map((item) => Number(item.id)),
  );
}, []);

useEffect(() => {
  loadWishlist();
  window.addEventListener("wishlistUpdated", loadWishlist);
  window.addEventListener("storage", loadWishlist);
  return () => {
    window.removeEventListener("wishlistUpdated", loadWishlist);
    window.removeEventListener("storage", loadWishlist);
  };
}, [loadWishlist]);



  
  const stepSize = useCallback(() => {
    const slider = sliderRef.current, card = slider?.querySelector(".bestseller-card");
    if (!slider || !card) return 0;
    const style = getComputedStyle(slider);
    return card.getBoundingClientRect().width + (parseFloat(style.columnGap || style.gap || "0") || 0);
  }, []);
  const jumpMiddle = useCallback((index = 0) => {
    const slider = sliderRef.current, step = stepSize();
    if (!slider || !step || !filtered.length) return;
    const behavior = slider.style.scrollBehavior;
    slider.style.scrollBehavior = "auto";
    slider.scrollLeft = (filtered.length + index) * step;
    requestAnimationFrame(() => { if (slider) slider.style.scrollBehavior = behavior || ""; });
  }, [filtered.length, stepSize]);
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => { setActiveIndex(0); jumpMiddle(0); }));
    return () => cancelAnimationFrame(id);
  }, [activeTab, jumpMiddle]);
  const next = useCallback(() => { const s = stepSize(); if (sliderRef.current && s) sliderRef.current.scrollBy({ left: s, behavior: "smooth" }); }, [stepSize]);
  const previous = useCallback(() => { const s = stepSize(); if (sliderRef.current && s) sliderRef.current.scrollBy({ left: -s, behavior: "smooth" }); }, [stepSize]);
  const correctLoop = useCallback(() => {
    const slider = sliderRef.current, s = stepSize(), count = filtered.length;
    if (!slider || !s || !count) return;
    const index = Math.round(slider.scrollLeft / s);
    const target = index < count ? count + ((index % count) + count) % count : index >= count * 2 ? count + index % count : null;
    if (target !== null) { slider.style.scrollBehavior = "auto"; slider.scrollLeft = target * s; requestAnimationFrame(() => { if (slider) slider.style.scrollBehavior = ""; }); }
  }, [filtered.length, stepSize]);
  const onScroll = useCallback(() => {
    const slider = sliderRef.current, s = stepSize(), count = filtered.length;
    if (!slider || !s || !count) return;
    const raw = Math.round(slider.scrollLeft / s);
    setActiveIndex(((raw % count) + count) % count);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(correctLoop, 250);
  }, [filtered.length, stepSize, correctLoop]);
  useEffect(() => {
    if (paused || filtered.length < 2) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(next, AUTO_PLAY_DELAY);
    return () => clearInterval(id);
  }, [paused, filtered.length, next]);
  useEffect(() => {
    const resize = () => { clearTimeout(timerRef.current); timerRef.current = setTimeout(() => jumpMiddle(activeIndex), 100); };
    window.addEventListener("resize", resize);
    return () => { window.removeEventListener("resize", resize); clearTimeout(timerRef.current); };
  }, [activeIndex, jumpMiddle]);
  const activeDot = filtered.length <= 1 ? 0 : Math.round(activeIndex * (TOTAL_DOTS - 1) / (filtered.length - 1));
  const goDot = (dot) => {
    const slider = sliderRef.current, s = stepSize(), count = filtered.length;
    if (!slider || !s || !count) return;
    const target = count <= 1 ? 0 : Math.round(dot * (count - 1) / (TOTAL_DOTS - 1));
    const raw = Math.round(slider.scrollLeft / s), current = ((raw % count) + count) % count;
    let delta = target - current;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    if (delta) slider.scrollTo({ left: (raw + delta) * s, behavior: "smooth" });
  };
  // const toggleWishlist = id => setWishlist(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
 
//  const toggleWishlist = id => setWishlist(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
 

 const toggleWishlist = (p) => {
  try {
    const saved = readWishlist();

    const matches = (item) =>
      Number(item.id) === Number(p.id) && item.productType === "eyeglasses";

    const updated = saved.some(matches)
      ? saved.filter((item) => !matches(item))
      : [
          ...saved,
          {
            id: p.id,
            productType: "eyeglasses",
            category: "Eyeglasses",
            name: p.name,
            brand: p.brand,
            image: p.image,
            price: Number(p.price),
            oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
            rating: p.rating,
            reviews: p.reviews,
            shape: p.shape,
            material: p.material,
            frameSize: p.frameSize,
            link: p.link, // /eyeglasses/{id}
          },
        ];

    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlistUpdated"));
  } catch (error) {
    console.error("Wishlist error:", error);
  }
};


 return <section className="bestseller-section">
    <div className="bestseller-container">
      <h2 className="bestseller-heading">OUR BESTSELLERS</h2>
      <div className="bestseller-tabs">
        {["all", "men", "women"].map(tab => <button key={tab} type="button" className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>{tab === "all" ? "All" : tab === "men" ? "Men" : "Women"}</button>)}
      </div>
      <div className="bestseller-slider-wrapper" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={() => setPaused(true)} onTouchEnd={() => setPaused(false)} onTouchCancel={() => setPaused(false)}>
        <button type="button" className="bestseller-slider-arrow bestseller-prev" onClick={previous} aria-label="Previous product"><Chevron left /></button>
        <div className="bestseller-slider" ref={sliderRef} onScroll={onScroll}>
          {loopProducts.map((p, i) => {
            const saved = wishlist.includes(p.id);
            return <article className="bestseller-card" key={`${p.id}-${i}`}>
              {p.percent > 0 && (
                <span className="bestseller-discount" aria-label={`${p.percent} percent off`}>
                  <b className="discount-number">{p.percent}</b>
                  <span className="discount-unit"><i>%</i><em>OFF</em></span>
                </span>
              )}
              <div className="bestseller-image-wrapper">
                <Link href={p.link} className="bestseller-image-link" aria-label={`View ${p.name}`}><img src={p.image} alt={p.name} className="bestseller-image" loading="lazy" /></Link>
                <button type="button" className={`bestseller-wishlist ${saved ? "active" : ""}`} onClick={() => toggleWishlist(p)} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={saved}><HeartIcon /></button>
                <span className="bestseller-size">{p.sizeText}</span>
              </div>
              <div className="bestseller-info">
                <div className="bestseller-brand-row"><p className="bestseller-brand">{p.brand}</p><span className="bestseller-original">100% original</span></div>
                <Link href={p.link} className="bestseller-product-name">{p.name}</Link>
                <p className="bestseller-type">{p.shape} <span>·</span> <span className="bestseller-material">{p.material}</span></p>
                <div className="bestseller-rating"><span className="rating-star">★</span><strong>{p.rating.toFixed(1)}</strong><span className="review-count">({p.reviews})</span></div>
                <div className="bestseller-bottom">
                  <div className="bestseller-price"><span className="current-price">{p.priceText}</span><span className="old-price">{p.oldPriceText}</span></div>
                  <div className="bestseller-colors" aria-label="Available colours">{p.colors?.map((color, ci) => <span key={ci} className={`product-color ${ci === 0 ? "selected" : ""}`} style={{ backgroundColor: color }} />)}</div>
                </div>
                {p.saving > 0 && <div className="bestseller-saving">Save {p.savingText}</div>}
                <Link href={p.link} className="bestseller-view-btn">View product</Link>
              </div>
            </article>;
          })}
        </div>
        <button type="button" className="bestseller-slider-arrow bestseller-next" onClick={next} aria-label="Next product"><Chevron /></button>
      </div>
      <div className="bestseller-pagination"><div className="bestseller-dots">{Array.from({ length: TOTAL_DOTS }).map((_, i) => <button key={i} type="button" className={`bestseller-dot ${activeDot === i ? "active" : ""}`} onClick={() => goDot(i)} aria-label={`Go to slide ${i + 1}`} aria-current={activeDot === i ? "true" : undefined} />)}</div></div>
    </div>
  </section>;
}
