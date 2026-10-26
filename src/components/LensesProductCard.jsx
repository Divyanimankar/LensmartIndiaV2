"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import "../styles/lenses-product-card.css";

/* =========================================================
   LensesProductCard — one card for all four product types

     productType="sunglasses"
     productType="eyeglasses"
     productType="contact-lenses"          (default, as before)
     productType="contact-lens-solution"   (alias: "solution")

   Props
   - product            product object (see "Product fields" below)
   - productType        one of the types above
   - href               (optional) link for title + button.
                        Falls back to /products/<slug>
   - isWishlisted       (optional) heart state, used with onWishlistToggle
   - onWishlistToggle   (optional) if given, the parent owns the wishlist
                        logic and the card just calls onWishlistToggle(product).
                        If omitted, the card manages the "wishlist"
                        localStorage list itself, as before.
   - selectedColor      (optional) colour name chosen by the parent
   - onColorChange      (optional) called as onColorChange(product, colorName).
                        If omitted, the card keeps the choice itself.
   - onAddToCart        (optional, solutions only) turns the button into
                        "Add to cart" and calls onAddToCart(product)

   Product fields (all optional unless noted)
   - common      name*, brand / manufacturer, image*, price / salePrice,
                 oldPrice / originalPrice, rating, reviews, bestseller, slug
   - sunglasses  shape, material, frameSize (XS/S/M/L/XL), colors
   - eyeglasses  shape, material, frameSize, colors
   - lenses      type ("Spherical" | "Toric" | "Multifocal"),
                 replacementSchedule ("Daily Disposable" | "Weekly ..." | "Monthly ..."),
                 isColor (colour lenses)
   - solution    volume (or size), solutionType (or type)
   - colors      ["Black", "Gold"]  or  [{ name, hex, image }]
   - images      { Black: "/img/black.png" } — image shown per colour
========================================================= */

/* ---------- Per-type settings ---------- */

const TYPE_ALIASES = {
  sunglass: "sunglasses",
  glasses: "eyeglasses",
  eyeglass: "eyeglasses",
  frames: "eyeglasses",
  lenses: "contact-lenses",
  "contact-lens": "contact-lenses",
  solution: "contact-lens-solution",
  solutions: "contact-lens-solution",
  "lens-solution": "contact-lens-solution",
  "contact-lens-solutions": "contact-lens-solution",
};

const TYPE_CONFIG = {
  sunglasses: {
    hasColors: true,
    hasFrameSize: true,
    cta: "View product",
  },
  eyeglasses: {
    hasColors: true,
    hasFrameSize: true,
    cta: "View product",
  },
  "contact-lenses": {
    hasColors: false,
    hasFrameSize: false,
    cta: "Choose your power",
  },
  "contact-lens-solution": {
    hasColors: false,
    hasFrameSize: false,
    cta: "View product",
    cartCta: "Add to cart",
  },
};

export const resolveType = (value) => {
  const key = String(value || "contact-lenses").toLowerCase();
  const type = TYPE_ALIASES[key] || key;
  return TYPE_CONFIG[type] ? type : "contact-lenses";
};

/* ---------- Helpers ---------- */

/* Contact lens type: Spherical / Toric / Multifocal.
   Read from product.type (or product.powerType). If neither holds one of
   these, it is worked out from the name (Toric / Astigmatism = Toric). */
const POWER_TYPES = ["Spherical", "Toric", "Multifocal"];

const matchPower = (value) =>
  POWER_TYPES.find(
    (t) => t.toLowerCase() === String(value || "").toLowerCase(),
  );

const getPowerType = (product) => {
  const direct = matchPower(product.powerType) || matchPower(product.type);
  if (direct) return direct;

  const text = `${product.name || ""} ${product.type || ""} ${
    product.lensType || ""
  }`.toLowerCase();

  if (text.includes("multifocal")) return "Multifocal";
  if (text.includes("toric") || text.includes("astigmatism")) return "Toric";
  return "Spherical";
};

/* Indian rupee formatting, e.g. 1415.63 -> ₹1,415.63 */
const inr = (n, max = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: max,
  }).format(n);

/* Whole rupees show no decimals (₹1,299); paise do (₹1,415.63) */
const money = (n) => inr(n, Number.isInteger(n) ? 0 : 2);

const COLOR_MAP = {
  black: "#222222",
  brown: "#795548",
  tortoise: "#8b5e3c",
  crystal: "#eeeeee",
  clear: "#eeeeee",
  gold: "#c8a951",
  silver: "#b7b7b7",
  grey: "#8f9498",
  gray: "#8f9498",
  blue: "#315c9e",
  green: "#2f6b4a",
  red: "#b3262d",
  pink: "#d9a79a",
  rose: "#d9a79a",
  purple: "#6b4a8a",
  white: "#ffffff",
  navy: "#1f2f57",
  transparent: "#eeeeee",
};

const SIZE_LABELS = {
  XS: "Extra Small",
  S: "Small",
  M: "Medium",
  L: "Large",
  XL: "Extra Large",
};

const normalizeColors = (colors, images) =>
  (Array.isArray(colors) ? colors : []).map((color) => {
    const item = typeof color === "string" ? { name: color } : { ...color };

    return {
      name: item.name,
      hex: item.hex || COLOR_MAP[String(item.name).toLowerCase()] || "#333333",
      image: item.image || images?.[item.name] || "",
    };
  });

const imageSrc = (image) => {
  if (typeof image === "string") return image;
  if (image?.src) return image.src;
  return "";
};

/* ---------- Card ---------- */

export default function LensesProductCard({
  product,
  productType,
  href: hrefProp,
  isWishlisted: wishlistedProp = false,
  onWishlistToggle,
  selectedColor: selectedColorProp,
  onColorChange,
  onAddToCart,
}) {
  const type = resolveType(productType || product.productType);
  const config = TYPE_CONFIG[type];

  const controlled = typeof onWishlistToggle === "function";

  const [ownWishlisted, setOwnWishlisted] = useState(false);
  const [heartPop, setHeartPop] = useState(false);
  const isWishlisted = controlled ? wishlistedProp : ownWishlisted;

  /* ==========================================
     COLOURS (sunglasses + eyeglasses)
  ========================================== */

  const colors = config.hasColors
    ? normalizeColors(product.colors, product.images)
    : [];

  const [ownColor, setOwnColor] = useState(colors[0]?.name);
  const activeColorName = selectedColorProp ?? ownColor ?? colors[0]?.name;
  const activeColor =
    colors.find((color) => color.name === activeColorName) || colors[0];

  const handleColor = (e, color) => {
    e.preventDefault();
    e.stopPropagation();

    setOwnColor(color.name);

    if (typeof onColorChange === "function") {
      onColorChange(product, color.name);
    }
  };

  /* ==========================================
     CHECK WISHLIST ON LOAD
  ========================================== */

  useEffect(() => {
    if (controlled) return;

    try {
      const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

      setOwnWishlisted(savedWishlist.some((item) => item.id === product.id));
    } catch {
      setOwnWishlisted(false);
    }
  }, [product.id, controlled]);

  /* ==========================================
     WISHLIST
  ========================================== */

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setHeartPop(true);

    if (controlled) {
      onWishlistToggle(product);
      return;
    }

    let wishlist = [];

    try {
      wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    } catch {
      wishlist = [];
    }

    const exists = wishlist.some((item) => item.id === product.id);

    if (exists) {
      wishlist = wishlist.filter((item) => item.id !== product.id);
      setOwnWishlisted(false);
    } else {
      wishlist.push({
        id: product.id,
        productType: type,
        name: product.name,
        manufacturer: product.manufacturer,
        brand: product.brand,
        pack: product.pack,
        price: product.price,
        oldPrice: product.oldPrice,
        image: imageSrc(product.image),
        slug: product.slug || "",
      });
      setOwnWishlisted(true);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  /* ==========================================
     PRICE HELPERS
  ========================================== */

  const price = Number(product.price ?? product.salePrice ?? 0);
  const oldPrice = Number(product.oldPrice ?? product.originalPrice ?? 0);
  const hasPrice = price > 0;
  const onSale = hasPrice && oldPrice > price;
  const offPercent = onSale ? Math.round((1 - price / oldPrice) * 100) : 0;

  /* ==========================================
     TEXT
  ========================================== */

  const href = hrefProp || (product.slug ? `/products/${product.slug}` : "#");

  const brand = product.manufacturer || product.brand;
  const lensType = product.lensType || product.type;

  /* line under the title, built from parts joined with " · ".
     plain = muted text, otherwise bold + coloured (see the lm-meta rules in the CSS) */
  const metaParts = [];

  const addPart = (text, className, plain = false) => {
    if (text) metaParts.push({ text, className, plain });
  };

  if (type === "sunglasses") {
    addPart(product.shape, "", true);
    addPart(product.material || "UV400");
  } else if (type === "eyeglasses") {
    addPart(product.shape, "", true);
    addPart(product.material);
  } else if (type === "contact-lens-solution") {
    addPart(product.volume || product.size, "", true);
    addPart(product.solutionType || lensType);
  } else {
    /* contact lenses:  Color · Replacement schedule · Lens type */
    const schedule = product.replacementSchedule || product.schedule;
    const powerType = getPowerType(product);

    addPart(product.isColor ? "Color" : "", "lm-tag--color");
    addPart(schedule, "lm-tag--schedule");

    /* older data without a schedule: show the old type word (Daily, Monthly ...) */
    if (!schedule && !matchPower(product.type)) addPart(lensType);

    addPart(powerType, `lm-power lm-power--${powerType.toLowerCase()}`);
  }

  const frameSizeLabel = config.hasFrameSize
    ? SIZE_LABELS[product.frameSize] || product.frameSize
    : "";

  const showCart =
    type === "contact-lens-solution" && typeof onAddToCart === "function";

  const imgSrc = imageSrc(activeColor?.image || product.image);

  return (
    <article className="lm-card" data-type={type}>
      {/* DISCOUNT TAG (wraps the card's top-left edge) */}
      {onSale && (
        <span className="lm-off" role="img" aria-label={`${offPercent}% off`}>
          <span className="lm-off-body">
            <b className="lm-off-num">{offPercent}</b>
            <span className="lm-off-unit" aria-hidden="true">
              <i>%</i>
              <i>OFF</i>
            </span>
          </span>
        </span>
      )}

      {/* =====================================
          PRODUCT IMAGE AREA
      ====================================== */}

      <div className="lm-media">
        {/* WISHLIST (top-right) */}
        <button
          type="button"
          className={`lm-heart${heartPop ? " is-pop" : ""}`}
          onClick={handleWishlist}
          onAnimationEnd={() => setHeartPop(false)}
          aria-pressed={isWishlisted}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart aria-hidden="true" />
        </button>

        <div className="lm-img">
          {imgSrc && (
            <Image
              key={imgSrc}
              src={imgSrc}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1100px) 50vw, 33vw"
            />
          )}
        </div>

        {/* BOTTOM CHIPS (bestseller left / frame size right) */}
        <div className="lm-chips">
          {product.bestseller ? (
            <span className="lm-chip lm-chip--hot">Bestseller</span>
          ) : (
            <span />
          )}

          <span className="lm-chips-right">
            {frameSizeLabel && (
              <span className="lm-chip lm-chip--size">{frameSizeLabel}</span>
            )}
          </span>
        </div>
      </div>

      {/* =====================================
          PRODUCT INFO
      ====================================== */}

      <div className="lm-brandrow">
        <p className="lm-brand">{brand}</p>

        <span className="lm-trust">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3 4 6v6c0 5 3.4 8 8 9 4.6-1 8-4 8-9V6z" />
            <path d="m8.5 12 2.5 2.5 4.5-5" />
          </svg>
          100% original
        </span>
      </div>

      <h3 className="lm-title">
        <Link href={href} title={product.name}>
          {product.name}
        </Link>
      </h3>

      {metaParts.length > 0 && (
        <p className="lm-meta">
          <span className="a">
            {metaParts.map((part, index) => (
              <Fragment key={`${part.text}-${index}`}>
                {index > 0 && " · "}
                {part.plain ? (
                  part.text
                ) : (
                  <b className={part.className || undefined}>{part.text}</b>
                )}
              </Fragment>
            ))}
          </span>
        </p>
      )}

      {product.rating ? (
        <p
          className="lm-rating"
          aria-label={`Rated ${product.rating} from ${product.reviews || 0} reviews`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" />
          </svg>
          {Number(product.rating).toFixed(1)}
          {product.reviews ? <small>({product.reviews})</small> : null}
        </p>
      ) : null}

      <div className="lm-buy">
        <div className="lm-price">
          {hasPrice ? (
            <span className="lm-now">{money(price)}</span>
          ) : (
            <span className="lm-now lm-now--request">Price on request</span>
          )}

          {onSale && <s className="lm-mrp">{money(oldPrice)}</s>}

          {onSale && (
            <p className="lm-sub">
              <b>Save {inr(oldPrice - price)}</b>
            </p>
          )}
        </div>

        {/* COLOUR SWATCHES (sunglasses + eyeglasses) */}
        {colors.length > 1 && (
          <div
            className="lm-swatches"
            role="radiogroup"
            aria-label={`${product.name} colour`}
          >
            {colors.slice(0, 4).map((color) => (
              <button
                type="button"
                key={color.name}
                className="lm-sw"
                role="radio"
                aria-checked={color.name === activeColor?.name}
                aria-label={color.name}
                title={color.name}
                onClick={(e) => handleColor(e, color)}
              >
                <i style={{ backgroundColor: color.hex }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {showCart ? (
        <button
          type="button"
          className="lm-cta"
          onClick={() => onAddToCart(product)}
        >
          {config.cartCta}
        </button>
      ) : (
        <Link className="lm-cta" href={href}>
          {config.cta}
        </Link>
      )}
    </article>
  );
}
