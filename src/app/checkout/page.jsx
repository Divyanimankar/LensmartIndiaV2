"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteLayout from "@/components/SiteLayout";
import "../../styles/checkoutpage.css";

/* =========================================================
   CONFIG
========================================================= */

const FREE_SHIPPING_MIN = 999;
const SHIPPING_FEE = 99; /* charged only when subtotal is below FREE_SHIPPING_MIN */

const CART_KEY = "lensmartCart";
const DELIVERY_KEY = "lensmartDelivery";

const INDIA_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const EMPTY_FORM = {
  fullName: "",
  mobile: "",
  email: "",
  address1: "",
  address2: "",
  pincode: "",
  city: "",
  state: "",
  country: "India",
  billingSame: true,
};

/* =========================================================
   ICONS
========================================================= */

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12H19M14 7L19 12L14 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M19 12H5M10 7L5 12L10 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TruckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 6H14V16H3V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M14 10H18L21 13V16H14" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="7" cy="17.5" r="1.7" stroke="currentColor" strokeWidth="1.5" fill="#fff" />
    <circle cx="17.5" cy="17.5" r="1.7" stroke="currentColor" strokeWidth="1.5" fill="#fff" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* =========================================================
   HELPERS
========================================================= */

const money = (value) => `₹${Math.round(Number(value) || 0).toLocaleString("en-IN")}`;

const getCartItemKey = (item) => `${item.productType || "product"}-${item.id}`;

const getItemPrice = (item) => {
  const price = Number(item.price);
  return Number.isFinite(price) ? price : 0;
};

const getImageSrc = (image) =>
  (image && typeof image === "object" ? image.src : image) ||
  "/images/placeholder.png";

const getItemQuantity = (item) => {
  if (item.rightEye || item.leftEye) {
    const right = item.rightEye?.selected ? Number(item.rightEye.quantity) || 0 : 0;
    const left = item.leftEye?.selected ? Number(item.leftEye.quantity) || 0 : 0;
    return right + left;
  }
  return Math.max(1, Number(item.quantity) || 1);
};

const show = (value) => (value !== undefined && value !== null && value !== "" ? value : "—");

const getLensKind = (item, eyes) => {
  const text = `${item.name || ""} ${item.type || ""}`.toLowerCase();

  if (text.includes("toric") || text.includes("astigmatism") || eyes.some((e) => e.cyl)) {
    return "Toric";
  }
  if (text.includes("multifocal") || eyes.some((e) => e.addPower)) {
    return "Multifocal";
  }
  return "Spherical";
};

const boxWord = (n) => (n === 1 ? "box" : "boxes");

/* =========================================================
   VALIDATION
========================================================= */

const validate = (form) => {
  const errors = {};

  if (form.fullName.trim().length < 2) {
    errors.fullName = "Please enter the recipient’s full name.";
  }

  if (!/^[6-9]\d{9}$/.test(form.mobile)) {
    errors.mobile = "Enter a valid 10-digit mobile number.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (form.address1.trim().length < 5) {
    errors.address1 = "Please enter your house / flat number and street.";
  }

  if (!/^[1-9]\d{5}$/.test(form.pincode)) {
    errors.pincode = "Enter a valid 6-digit PIN code.";
  }

  if (form.city.trim().length < 2) {
    errors.city = "Please enter your city.";
  }

  if (!form.state) {
    errors.state = "Please select your state.";
  }

  return errors;
};

/* =========================================================
   CHECKOUT PAGE
========================================================= */

export default function CheckoutPage() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /* =======================================================
     LOAD CART + SAVED DELIVERY DETAILS
  ======================================================= */

  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

      const normalized = Array.isArray(savedCart)
        ? savedCart.map((item) => ({
            ...item,
            price: getItemPrice(item),
            quantity: getItemQuantity(item),
          }))
        : [];

      setCartItems(normalized);
    } catch (error) {
      console.error("Error loading cart:", error);
      setCartItems([]);
    }

    try {
      const savedDelivery = JSON.parse(localStorage.getItem(DELIVERY_KEY));
      if (savedDelivery && typeof savedDelivery === "object") {
        setForm({ ...EMPTY_FORM, ...savedDelivery, country: "India" });
      }
    } catch (error) {
      /* ignore */
    }

    setCartLoaded(true);
  }, []);

  /* empty cart -> back to cart page */
  useEffect(() => {
    if (cartLoaded && cartItems.length === 0) {
      router.replace("/cart");
    }
  }, [cartLoaded, cartItems.length, router]);

  /* =======================================================
     FORM HANDLERS
  ======================================================= */

  const updateField = (name, value) => {
    const next = { ...form, [name]: value };
    setForm(next);

    if (touched[name] || Object.keys(errors).length) {
      setErrors(validate(next));
    }
  };

  const markTouched = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(form));
  };

  const fieldError = (name) => (touched[name] && errors[name] ? errors[name] : "");

  const handleContinue = (event) => {
    event.preventDefault();

    const found = validate(form);
    setErrors(found);
    setTouched({
      fullName: true, mobile: true, email: true, address1: true,
      pincode: true, city: true, state: true,
    });

    if (Object.keys(found).length) {
      const firstKey = Object.keys(found)[0];
      const el = document.getElementById(`lmi-co-${firstKey}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus({ preventScroll: true });
      }
      return;
    }

    try {
      localStorage.setItem(DELIVERY_KEY, JSON.stringify(form));
    } catch (error) {
      console.error("Error saving delivery details:", error);
    }

    router.push("/payment");
  };

  /* =======================================================
     TOTALS
  ======================================================= */

  const totalBoxes = cartItems.reduce((sum, item) => sum + getItemQuantity(item), 0);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + getItemPrice(item) * getItemQuantity(item),
    0
  );

  const totalMrp = cartItems.reduce((sum, item) => {
    const price = getItemPrice(item);
    const old = Number(item.oldPrice);
    const mrp = Number.isFinite(old) && old > price ? old : price;
    return sum + mrp * getItemQuantity(item);
  }, 0);

  const discount = Math.max(0, totalMrp - subtotal);
  const freeShipping = subtotal >= FREE_SHIPPING_MIN;
  const shippingCost = freeShipping ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingCost;

  /* latest added product first */
  const displayItems = [...cartItems].reverse();

  /* =======================================================
     LOADING / REDIRECT
  ======================================================= */

  if (!cartLoaded || cartItems.length === 0) {
    return (
      <SiteLayout>
        <div className="lmi-checkout-page">
          <div className="lmi-co-loading">Loading checkout...</div>
        </div>
      </SiteLayout>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <SiteLayout>
      <div className="lmi-checkout-page">
        <section className="lmi-co-section">
          <div className="lmi-co-container">
            {/* BREADCRUMB */}
            <nav className="lmi-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/cart">Your cart</Link>
              <span>/</span>
              <span>Delivery</span>
            </nav>

            {/* HEADING + STEPS */}
            <div className="lmi-co-top">
              <div className="lmi-co-title">
                <h1>Delivery details</h1>
                <p>Tell us where to send your lenses.</p>
              </div>

              <ol className="lmi-steps" aria-label="Checkout steps">
                <li className="done">
                  <span>
                    <CheckIcon />
                  </span>
                  Cart
                </li>
                <li className="line done" aria-hidden="true" />
                <li className="active">
                  <span>2</span>Delivery
                </li>
                <li className="line" aria-hidden="true" />
                <li>
                  <span>3</span>Payment
                </li>
              </ol>
            </div>

            <form className="lmi-co-layout" onSubmit={handleContinue} noValidate>
              {/* ================= LEFT ================= */}
              <div className="lmi-co-main">
                <div className="lmi-co-card">
                  {/* ---------- CONTACT ---------- */}
                  <div className="lmi-co-card-head">
                    <h2>Contact details</h2>
                    <span className="lmi-co-required">* Required fields</span>
                  </div>

                  <div className="lmi-co-grid">
                    <div className={`lmi-field ${fieldError("fullName") ? "has-error" : ""}`}>
                      <label htmlFor="lmi-co-fullName">Full Name *</label>
                      <input
                        id="lmi-co-fullName"
                        type="text"
                        autoComplete="name"
                        placeholder="Enter your full name"
                        value={form.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        onBlur={() => markTouched("fullName")}
                      />
                      {fieldError("fullName") && <p className="lmi-field-error">{errors.fullName}</p>}
                    </div>

                    <div className={`lmi-field ${fieldError("mobile") ? "has-error" : ""}`}>
                      <label htmlFor="lmi-co-mobile">Mobile Number *</label>
                      <div className="lmi-input-prefix">
                        <span>+91</span>
                        <input
                          id="lmi-co-mobile"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel-national"
                          maxLength={10}
                          placeholder="Enter 10-digit mobile number"
                          value={form.mobile}
                          onChange={(e) =>
                            updateField("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))
                          }
                          onBlur={() => markTouched("mobile")}
                        />
                      </div>
                      {fieldError("mobile") && <p className="lmi-field-error">{errors.mobile}</p>}
                    </div>
                  </div>

                  <div className={`lmi-field ${fieldError("email") ? "has-error" : ""}`}>
                    <label htmlFor="lmi-co-email">Email Address *</label>
                    <input
                      id="lmi-co-email"
                      type="email"
                      autoComplete="email"
                      placeholder="Enter email address"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      onBlur={() => markTouched("email")}
                    />
                    {fieldError("email") && <p className="lmi-field-error">{errors.email}</p>}
                  </div>

                  <p className="lmi-field-hint">
                    We’ll send order updates here. Your mobile number helps with delivery.
                  </p>

                  <div className="lmi-co-divider" />

                  {/* ---------- ADDRESS ---------- */}
                  <div className="lmi-co-card-head">
                    <h2>Delivery address</h2>
                  </div>

                  <div className={`lmi-field ${fieldError("address1") ? "has-error" : ""}`}>
                    <label htmlFor="lmi-co-address1">Address line 1 *</label>
                    <input
                      id="lmi-co-address1"
                      type="text"
                      autoComplete="address-line1"
                      placeholder="House / flat number, building and street"
                      value={form.address1}
                      onChange={(e) => updateField("address1", e.target.value)}
                      onBlur={() => markTouched("address1")}
                    />
                    {fieldError("address1") && <p className="lmi-field-error">{errors.address1}</p>}
                  </div>

                  <div className="lmi-field">
                    <label htmlFor="lmi-co-address2">Address line 2 (optional)</label>
                    <input
                      id="lmi-co-address2"
                      type="text"
                      autoComplete="address-line2"
                      placeholder="Area, locality or landmark"
                      value={form.address2}
                      onChange={(e) => updateField("address2", e.target.value)}
                    />
                  </div>

                  <div className="lmi-co-grid">
                    <div className={`lmi-field ${fieldError("pincode") ? "has-error" : ""}`}>
                      <label htmlFor="lmi-co-pincode">PIN code *</label>
                      <input
                        id="lmi-co-pincode"
                        type="text"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        maxLength={6}
                        placeholder="Enter 6-digit PIN code"
                        value={form.pincode}
                        onChange={(e) =>
                          updateField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        onBlur={() => markTouched("pincode")}
                      />
                      {fieldError("pincode") && <p className="lmi-field-error">{errors.pincode}</p>}
                    </div>

                    <div className={`lmi-field ${fieldError("city") ? "has-error" : ""}`}>
                      <label htmlFor="lmi-co-city">City *</label>
                      <input
                        id="lmi-co-city"
                        type="text"
                        autoComplete="address-level2"
                        placeholder="Enter city"
                        value={form.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        onBlur={() => markTouched("city")}
                      />
                      {fieldError("city") && <p className="lmi-field-error">{errors.city}</p>}
                    </div>

                    <div className={`lmi-field ${fieldError("state") ? "has-error" : ""}`}>
                      <label htmlFor="lmi-co-state">State *</label>
                      <div className="lmi-select">
                        <select
                          id="lmi-co-state"
                          autoComplete="address-level1"
                          value={form.state}
                          className={form.state ? "filled" : ""}
                          onChange={(e) => updateField("state", e.target.value)}
                          onBlur={() => markTouched("state")}
                        >
                          <option value="">Select state</option>
                          {INDIA_STATES.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                        <ChevronDown />
                      </div>
                      {fieldError("state") && <p className="lmi-field-error">{errors.state}</p>}
                    </div>

                    <div className="lmi-field">
                      <label htmlFor="lmi-co-country">Country</label>
                      <input
                        id="lmi-co-country"
                        type="text"
                        value={form.country}
                        readOnly
                        className="readonly"
                      />
                    </div>
                  </div>

                  <label className="lmi-check">
                    <input
                      type="checkbox"
                      checked={form.billingSame}
                      onChange={(e) => updateField("billingSame", e.target.checked)}
                    />
                    <span className="lmi-check-box" aria-hidden="true">
                      <CheckIcon />
                    </span>
                    <span>Use this address for billing too</span>
                  </label>
                </div>

                {/* DELIVERY METHOD */}
                <div className="lmi-delivery-box">
                  <div className="lmi-delivery-top">
                    <TruckIcon />
                    <div className="lmi-delivery-text">
                      <strong>Standard delivery</strong>
                      <p>
                        {freeShipping
                          ? `Your order qualifies for free shipping · On orders over ${money(FREE_SHIPPING_MIN)}`
                          : `Free shipping on orders over ${money(FREE_SHIPPING_MIN)}`}
                      </p>
                    </div>
                    <span className="lmi-delivery-price">
                      {freeShipping ? "Free" : money(SHIPPING_FEE)}
                    </span>
                  </div>

                  <p className="lmi-delivery-note">
                    Delivery availability and estimated timing depend on your PIN code. Tracking
                    details will be shared once your order is dispatched.
                  </p>
                </div>
              </div>

              {/* ================= RIGHT ================= */}
              <aside className="lmi-co-side">
                <div className="lmi-summary">
                  <h2>Order summary</h2>

                  <div className="lmi-sum-items">
                    {displayItems.map((item) => {
                      const price = getItemPrice(item);
                      const itemBoxes = getItemQuantity(item);

                      const hasEyes = Boolean(item.rightEye || item.leftEye);
                      const isManual = item.prescriptionMode !== "upload";

                      const rows = hasEyes
                        ? [
                            { side: "right", label: "Right eye (OD)", data: item.rightEye },
                            { side: "left", label: "Left eye (OS)", data: item.leftEye },
                          ].filter((row) => row.data?.selected)
                        : [];

                      const eyeData = rows.map((row) => row.data || {});
                      const showSpecs = hasEyes && isManual && rows.length > 0;

                      const showCyl = showSpecs && eyeData.some((e) => e.cyl);
                      const showAxis = showSpecs && eyeData.some((e) => e.axis);
                      const showAdd = showSpecs && eyeData.some((e) => e.addPower);

                      const cols = showSpecs
                        ? [
                            { key: "power", label: "SPH" },
                            showCyl && { key: "cyl", label: "CYL" },
                            showAxis && { key: "axis", label: "AXIS" },
                            showAdd && { key: "addPower", label: "ADD" },
                            { key: "bc", label: "BC" },
                            { key: "dia", label: "DIA" },
                          ].filter(Boolean)
                        : [];

                      const gridTemplate = `minmax(96px, 1.6fr) ${cols
                        .map(() => "minmax(0, 1fr)")
                        .join(" ")} 44px`;

                      const lensKind = getLensKind(item, eyeData);
                      const metaLine = [item.type, item.pack, lensKind].filter(Boolean).join(" · ");

                      const perEye =
                        rows.length === 2 && rows[0].data?.quantity === rows[1].data?.quantity
                          ? ` · ${rows[0].data.quantity} ${boxWord(Number(rows[0].data.quantity))} for each eye`
                          : "";

                      return (
                        <div className="lmi-sum-item" key={getCartItemKey(item)}>
                          <div className="lmi-sum-item-top">
                            <div className="lmi-sum-thumb">
                              <img src={getImageSrc(item.image)} alt={item.name || "Product"} />
                            </div>

                            <div className="lmi-sum-info">
                              <h3>{item.name}</h3>
                              {metaLine && <p className="lmi-sum-meta">{metaLine}</p>}
                              <p className="lmi-sum-price">{money(price)} / box</p>
                              <p className="lmi-sum-boxes">
                                {itemBoxes} {boxWord(itemBoxes)}
                                {perEye}
                              </p>
                            </div>
                          </div>

                          {showSpecs && (
                            <div className="lmi-mini-rx" role="table">
                              <div
                                className="lmi-mini-row lmi-mini-head"
                                role="row"
                                style={{ gridTemplateColumns: gridTemplate }}
                              >
                                <span role="columnheader">Eye</span>
                                {cols.map((col) => (
                                  <span role="columnheader" key={col.key}>
                                    {col.label}
                                  </span>
                                ))}
                                <span role="columnheader">Boxes</span>
                              </div>

                              {rows.map((row) => (
                                <div
                                  className="lmi-mini-row"
                                  role="row"
                                  key={row.side}
                                  style={{ gridTemplateColumns: gridTemplate }}
                                >
                                  <span className="lmi-mini-eye" role="cell">
                                    {row.label}
                                  </span>
                                  {cols.map((col) => (
                                    <span
                                      role="cell"
                                      key={col.key}
                                      className={col.key === "power" ? "strong" : ""}
                                    >
                                      {show(row.data?.[col.key])}
                                    </span>
                                  ))}
                                  <span role="cell">{Math.max(1, Number(row.data?.quantity) || 1)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="lmi-summary-line" />

                  <div className="lmi-sum-row">
                    <span>Total MRP</span>
                    <strong>{money(totalMrp)}</strong>
                  </div>

                  {discount > 0 && (
                    <div className="lmi-sum-row green">
                      <span>Product discount</span>
                      <strong>−{money(discount)}</strong>
                    </div>
                  )}

                  <div className="lmi-sum-row bold">
                    <span>Subtotal</span>
                    <strong>{money(subtotal)}</strong>
                  </div>

                  <div className="lmi-sum-row green">
                    <span>Shipping</span>
                    <strong>{freeShipping ? "Free" : money(shippingCost)}</strong>
                  </div>

                  <div className="lmi-summary-line" />

                  <div className="lmi-total-row">
                    <span>Total</span>
                    <strong>{money(total)}</strong>
                  </div>

                  {discount > 0 && (
                    <div className="lmi-save-box">
                      <CheckIcon />
                      <span>
                        You save <b>{money(discount)}</b> on this order
                      </span>
                    </div>
                  )}

                  <p className="lmi-tax-text">
                    Inclusive of all taxes. Final total confirmed at checkout.
                  </p>

                  <button type="submit" className="lmi-pay-button">
                    Continue to Payment
                    <ArrowRight />
                  </button>

                  <div className="lmi-secure">
                    <LockIcon />
                    Safe &amp; secure payments
                  </div>
                </div>

                <Link href="/cart" className="lmi-back">
                  <ArrowLeft />
                  Back to cart
                </Link>
              </aside>
            </form>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
