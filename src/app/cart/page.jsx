"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import "../../styles/cartpage.css";

/* =========================================================
   CONFIG
========================================================= */

const FREE_SHIPPING_MIN = 999;

/* =========================================================
   ICONS
========================================================= */

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 7H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M9 3H15L16 7H8L9 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M6.5 7L7.5 21H16.5L17.5 7" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M10 11V17M14 11V17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 4H5L7 16H18L21 8H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="20" r="1.2" fill="currentColor" />
    <circle cx="18" cy="20" r="1.2" fill="currentColor" />
  </svg>
);

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12H19M14 7L19 12L14 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
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

const TagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M10 9.5l4 5M14 9.5l-4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* =========================================================
   HELPERS
========================================================= */

const money = (value) => `₹${Math.round(Number(value) || 0).toLocaleString("en-IN")}`;

// const getCartItemKey = (item) => `${item.productType || "product"}-${item.id}`;


const getCartItemKey = (item) =>
  [
    item.productType || "item",
    item.id,
    item.selectedColor || item.color || "",
    item.selectedSize || item.size || "",
    item.selectedLens?.id || item.selectedLens?.name || "",
  ].join("-");

const getSelectedOptions = (item) => {
  const options = [
    item.selectedColor || item.color
      ? { label: "Color", value: item.selectedColor || item.color }
      : null,

    item.selectedSize || item.size
      ? {
          label: "Size",
          value: `Size ${String(item.selectedSize || item.size).replace(/^size\s*/i, "")}`,
        }
      : null,

    item.selectedLens?.name || item.selectedLens?.type
      ? {
          label: "Lens",
          value: item.selectedLens.name || item.selectedLens.type,
        }
      : null,

    item.frameType
      ? { label: "Frame", value: item.frameType }
      : null,

    item.lensType
      ? { label: "Lens type", value: item.lensType }
      : null,

    item.category
      ? { label: "Category", value: item.category }
      : null,
  ];

  return options.filter(Boolean);
};



const getItemPrice = (item) => {
  const price = Number(item.price);
  return Number.isFinite(price) ? price : 0;
};

const getImageSrc = (image) =>
  (image && typeof image === "object" ? image.src : image) ||
  "/images/placeholder.png";

/* total boxes of one cart item (sum of selected eyes) */
const getItemQuantity = (item) => {
  if (item.rightEye || item.leftEye) {
    const right = item.rightEye?.selected ? Number(item.rightEye.quantity) || 0 : 0;
    const left = item.leftEye?.selected ? Number(item.leftEye.quantity) || 0 : 0;
    return right + left;
  }
  return Math.max(1, Number(item.quantity) || 1);
};

/* "-2.00" style display, empty -> dash */
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

/* =========================================================
   CART PAGE
========================================================= */

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  const [agreed, setAgreed] = useState(false);
  const [termsError, setTermsError] = useState(false);

  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  /* =======================================================
     LOAD CART
  ======================================================= */

  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = JSON.parse(localStorage.getItem("lensmartCart")) || [];

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
      } finally {
        setCartLoaded(true);
      }
    };

    loadCart();

    window.addEventListener("cartUpdated", loadCart);
    window.addEventListener("storage", loadCart);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
      window.removeEventListener("storage", loadCart);
    };
  }, []);

  /* =======================================================
     SAVE CART
  ======================================================= */

  const saveCart = (updatedCart) => {
    setCartItems(updatedCart);

    try {
      localStorage.setItem("lensmartCart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  /* =======================================================
     CHANGE BOXES (per eye, or whole item for old cart data)
  ======================================================= */

  const changeBoxes = (targetItem, side, delta) => {
    const targetKey = getCartItemKey(targetItem);

    const updatedCart = cartItems.map((item) => {
      if (getCartItemKey(item) !== targetKey) return item;

      let next = { ...item };

      if (side === "all") {
        next.quantity = Math.max(1, (Number(item.quantity) || 1) + delta);
        return next;
      }

      const eyeKey = side === "right" ? "rightEye" : "leftEye";
      const eye = item[eyeKey] || {};

      next[eyeKey] = {
        ...eye,
        quantity: Math.max(1, (Number(eye.quantity) || 1) + delta),
      };

      next.quantity = getItemQuantity(next);
      return next;
    });

    saveCart(updatedCart);
  };

  /* =======================================================
     REMOVE
  ======================================================= */

  const removeItem = (targetItem) => {
    const targetKey = getCartItemKey(targetItem);
    saveCart(cartItems.filter((item) => getCartItemKey(item) !== targetKey));
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
  const total = subtotal;

  /* =======================================================
     DISPLAY ORDER — most recently added product comes first
     (new items are pushed to the END of the saved array,
      so we show the list reversed)
  ======================================================= */

  const displayItems = [...cartItems].reverse();

  /* =======================================================
     ACTIONS
  ======================================================= */

  const handleCheckout = (event) => {
    if (!agreed) {
      event.preventDefault();
      setTermsError(true);
    }
  };

  const applyCoupon = () => {
    if (!coupon.trim()) {
      setCouponMessage("Please enter a coupon code.");
      return;
    }
    /* connect your coupon API here */
    setCouponMessage("This coupon code is not valid.");
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (!cartLoaded) {
    return (
      <SiteLayout>
        <div className="lmi-cart-page">
          <div className="lmi-cart-loading">Loading cart...</div>
        </div>
      </SiteLayout>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <SiteLayout>
      <div className="lmi-cart-page">
        {cartItems.length === 0 ? (
          /* ================= EMPTY ================= */
          <section className="lmi-empty-cart">
            <div className="lmi-empty-cart-inner">
              <div className="lmi-empty-cart-icon">
                <CartIcon />
              </div>

              <h1>Your cart is empty</h1>
              <p>You have not added any products to your cart yet.</p>

              <Link href="/all-products" className="lmi-start-shopping">
                Start shopping
                <ArrowRight />
              </Link>
            </div>
          </section>
        ) : (
          <section className="lmi-cart-section">
            <div className="lmi-cart-container">
              {/* BREADCRUMB */}
              <nav className="lmi-breadcrumb" aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <span>/</span>
                <span>Your cart</span>
              </nav>

              {/* HEADING + STEPS */}
              <div className="lmi-cart-top">
                <div className="lmi-cart-title">
                  <div className="lmi-cart-title-row">
                    <h1>Your cart</h1>
                    <span className="lmi-cart-count">
                      {totalBoxes} {totalBoxes === 1 ? "box" : "boxes"}
                    </span>
                  </div>
                  <p>Review your lenses and prescription before checkout.</p>
                </div>

                <ol className="lmi-steps" aria-label="Checkout steps">
                  <li className="active">
                    <span>1</span>Cart
                  </li>
                  <li className="line" aria-hidden="true" />
                  <li>
                    <span>2</span>Delivery
                  </li>
                  <li className="line" aria-hidden="true" />
                  <li>
                    <span>3</span>Payment
                  </li>
                </ol>
              </div>

              <div className="lmi-cart-layout">
                {/* ================= LEFT ================= */}
                <div className="lmi-cart-main">
                  {displayItems.map((item) => {
                    const itemKey = getCartItemKey(item);
                    const price = getItemPrice(item);
                    const oldPrice = Number(item.oldPrice);
                    const hasDiscount = Number.isFinite(oldPrice) && oldPrice > price;
                    const discountPercent = hasDiscount
                      ? Math.round(((oldPrice - price) / oldPrice) * 100)
                      : 0;

                    const itemBoxes = getItemQuantity(item);
                    const itemTotal = price * itemBoxes;

                    const isManual = item.prescriptionMode !== "upload";
                    const hasEyes = Boolean(item.rightEye || item.leftEye);

                    /* eye rows */
                    const rows = hasEyes
                      ? [
                          { side: "right", label: "Right eye (OD)", data: item.rightEye },
                          { side: "left", label: "Left eye (OS)", data: item.leftEye },
                        ].filter((row) => row.data?.selected)
                      : [
                          {
                            side: "all",
                            label: "Quantity",
                            data: { quantity: itemBoxes },
                          },
                        ];

                    const eyeData = rows.map((row) => row.data || {});
                    const showSpecs = hasEyes && isManual;

                    const showCyl = showSpecs && eyeData.some((e) => e.cyl);
                    const showAxis = showSpecs && eyeData.some((e) => e.axis);
                    const showAdd = showSpecs && eyeData.some((e) => e.addPower);

                    /* dynamic columns */
                    const specColumns = showSpecs
                      ? [
                          { key: "power", label: "SPH / Power" },
                          showCyl && { key: "cyl", label: "CYL" },
                          showAxis && { key: "axis", label: "AXIS" },
                          showAdd && { key: "addPower", label: "ADD" },
                          { key: "bc", label: "BC" },
                          { key: "dia", label: "DIA" },
                        ].filter(Boolean)
                      : [];

                    const gridTemplate = `minmax(120px, 1.5fr) ${specColumns
                      .map(() => "minmax(0, 0.8fr)")
                      .join(" ")} 140px minmax(80px, 0.9fr)`;

                    const lensKind = getLensKind(item, eyeData);

                    const metaLine = [item.type, item.pack, lensKind]
                      .filter(Boolean)
                      .join(" · ");

                    const prescriber = item.prescriber || {};
                    const hasPrescriber = Object.values(prescriber).some(Boolean);

                    const boxesSummary =
                      rows.length === 2 &&
                      rows[0].data?.quantity === rows[1].data?.quantity
                        ? `${itemBoxes} ${itemBoxes === 1 ? "box" : "boxes"} · ${
                            rows[0].data.quantity
                          } ${rows[0].data.quantity === 1 ? "box" : "boxes"} for each eye`
                        : `${itemBoxes} ${itemBoxes === 1 ? "box" : "boxes"}`;

                    return (
                      <article className="lmi-item-card" key={itemKey}>
                        {/* ---------- PRODUCT HEAD ---------- */}
                        <div className="lmi-item-head">
                          <div className="lmi-item-image">
                            {item.link ? (
                              <Link href={item.link}>
                                <img src={getImageSrc(item.image)} alt={item.name || "Product"} />
                              </Link>
                            ) : (
                              <img src={getImageSrc(item.image)} alt={item.name || "Product"} />
                            )}
                          </div>

                          <div className="lmi-item-info">
                            <div className="lmi-item-info-top">
                              <div className="lmi-item-title">
                                {item.brand && (
                                  <span className="lmi-item-brand">{item.brand}</span>
                                )}

                                {item.link ? (
                                  <Link href={item.link} className="lmi-item-name">
                                    {item.name}
                                  </Link>
                                ) : (
                                  <h2 className="lmi-item-name">{item.name}</h2>
                                )}
                              </div>

                              <button
                                type="button"
                                className="lmi-remove"
                                onClick={() => removeItem(item)}
                                aria-label={`Remove ${item.name || "product"} from cart`}
                              >
                                <TrashIcon />
                                <span>Remove</span>
                              </button>
                            </div>

                            {metaLine && <p className="lmi-item-meta">{metaLine}</p>}

                            
{getSelectedOptions(item).length > 0 && (
  <div className="lmi-selected-options">
    {getSelectedOptions(item).map((option) => (
      <span
        className="lmi-selected-option"
        key={`${option.label}-${option.value}`}
      >
        {option.value}
      </span>
    ))}
  </div>
)}



                            <div className="lmi-item-price">
                              <strong>{money(price)}</strong>

                              {hasDiscount && <del>{money(oldPrice)}</del>}

                              <span className="lmi-per-box">/ box</span>

                              {hasDiscount && (
                                <span className="lmi-off">{discountPercent}% OFF</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* ---------- PRESCRIPTION ---------- */}
                        <div className="lmi-rx">
                          <h3>Your selected prescription</h3>

                          {hasEyes && !isManual && (
                            <div className="lmi-rx-note">
                              <CheckIcon />
                              <span>
                                You chose to upload your prescription. We will verify it
                                before dispatching your order.
                              </span>
                            </div>
                          )}

                          <div className="lmi-rx-table" role="table">
                            {/* HEADER */}
                            <div
                              className="lmi-rx-head"
                              role="row"
                              style={{ gridTemplateColumns: gridTemplate }}
                            >
                              <span role="columnheader">{hasEyes ? "Eye" : "Item"}</span>

                              {specColumns.map((col) => (
                                <span role="columnheader" key={col.key}>
                                  {col.label}
                                </span>
                              ))}

                              <span role="columnheader">Boxes</span>
                              <span role="columnheader" className="lmi-right">
                                Amount
                              </span>
                            </div>

                            {/* ROWS */}
                            {rows.map((row) => {
                              const data = row.data || {};
                              const qty = Math.max(1, Number(data.quantity) || 1);

                              return (
                                <div
                                  className="lmi-rx-row"
                                  role="row"
                                  key={row.side}
                                  style={{ gridTemplateColumns: gridTemplate }}
                                >
                                  <div className="lmi-cell lmi-cell-eye" role="cell">
                                    {row.side !== "all" && (
                                      <span className={`lmi-eye-dot ${row.side}`} />
                                    )}
                                    {row.label}
                                  </div>

                                  {specColumns.map((col) => (
                                    <div
                                      className={`lmi-cell lmi-cell-spec ${
                                        col.key === "power" ? "strong" : ""
                                      }`}
                                      role="cell"
                                      data-label={col.label}
                                      key={col.key}
                                    >
                                      {show(data[col.key])}
                                    </div>
                                  ))}

                                  <div
                                    className="lmi-cell lmi-cell-boxes"
                                    role="cell"
                                    data-label="Boxes"
                                  >
                                    <div className="lmi-qty">
                                      <button
                                        type="button"
                                        onClick={() => changeBoxes(item, row.side, -1)}
                                        disabled={qty <= 1}
                                        aria-label={`Decrease ${row.label} boxes`}
                                      >
                                        −
                                      </button>

                                      <span>{qty}</span>

                                      <button
                                        type="button"
                                        onClick={() => changeBoxes(item, row.side, 1)}
                                        aria-label={`Increase ${row.label} boxes`}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>

                                  <div
                                    className="lmi-cell lmi-cell-amount"
                                    role="cell"
                                    data-label="Amount"
                                  >
                                    {money(price * qty)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {hasPrescriber && (
                            <div className="lmi-prescriber">
                              <strong>Prescriber</strong>
                              <p>
                                {[
                                  prescriber.doctorName,
                                  prescriber.clinicName,
                                  prescriber.city,
                                  prescriber.phone,
                                ]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* ---------- CARD FOOTER ---------- */}
                        <div className="lmi-item-foot">
                          <span>{boxesSummary}</span>
                          <strong>{money(itemTotal)}</strong>
                        </div>
                      </article>
                    );
                  })}

                  {/* SHIPPING BANNER */}
                  <div className="lmi-ship-banner">
                    <TruckIcon />
                    <div>
                      {freeShipping ? (
                        <>
                          <strong>Your order qualifies for free shipping</strong>
                          <p>Complimentary on orders over {money(FREE_SHIPPING_MIN)}</p>
                        </>
                      ) : (
                        <>
                          <strong>
                            Add {money(FREE_SHIPPING_MIN - subtotal)} more for free shipping
                          </strong>
                          <p>Complimentary on orders over {money(FREE_SHIPPING_MIN)}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* ================= RIGHT ================= */}
                <aside className="lmi-cart-side">
                  <div className="lmi-summary">
                    <h2>Order summary</h2>

                    <p className="lmi-summary-items">
                      {displayItems
                        .map(
                          (item) =>
                            `${item.name} · ${getItemQuantity(item)} ${
                              getItemQuantity(item) === 1 ? "box" : "boxes"
                            }`
                        )
                        .join(", ")}
                    </p>

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
                      <strong>{freeShipping ? "Free" : "At checkout"}</strong>
                    </div>

                    <div className="lmi-summary-line" />

                    {/* COUPON — inside summary, before total & checkout */}
                    <div className="lmi-coupon">
                      <h3>
                        <TagIcon />
                        Have a coupon?
                      </h3>

                      <div className="lmi-coupon-row">
                        <input
                          type="text"
                          value={coupon}
                          onChange={(event) => {
                            setCoupon(event.target.value);
                            setCouponMessage("");
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") applyCoupon();
                          }}
                          placeholder="Enter coupon code"
                          aria-label="Coupon code"
                        />
                        <button type="button" onClick={applyCoupon}>
                          Apply
                        </button>
                      </div>

                      {couponMessage && <p className="lmi-coupon-msg">{couponMessage}</p>}
                    </div>

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

                    <label className="lmi-terms">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(event) => {
                          setAgreed(event.target.checked);
                          if (event.target.checked) setTermsError(false);
                        }}
                      />
                      <span className="lmi-terms-box" aria-hidden="true">
                        <CheckIcon />
                      </span>
                      <span>I agree with the Terms &amp; Conditions</span>
                    </label>

                    {termsError && (
                      <p className="lmi-terms-error">
                        Please accept the Terms &amp; Conditions to continue.
                      </p>
                    )}

                    <Link
                      href="/checkout"
                      className="lmi-checkout-button"
                      onClick={handleCheckout}
                    >
                      Proceed to checkout
                      <ArrowRight />
                    </Link>

                    <div className="lmi-secure">
                      <LockIcon />
                      Safe &amp; secure payments
                    </div>
                  </div>

                  <Link href="/all-products" className="lmi-continue">
                    Continue shopping
                  </Link>
                </aside>
              </div>
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
