"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAnimatedClose } from "@/lib/motion";
import "../styles/contactLensProductDetails.css"; // drawer ki clp-cart-* styles yahin hain
// import "../styles/cartDrawer.css";

// const keyOf = (item) => `${item.productType || "item"}-${item.id}`;

const keyOf = (item) =>
  [
    item.productType || "item",
    item.id,
    item.selectedColor || "",
    item.selectedSize || "",
    item.selectedLens?.id || "",
  ].join("-");


const inr = (v) => `₹${Number(v || 0).toLocaleString("en-IN")}`;

const readCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("lensmartCart")) || [];
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [latestKey, setLatestKey] = useState("");
  const [closing, requestClose, cancelClose] = useAnimatedClose(() => setOpen(false));

  // "openCartDrawer" event aate hi drawer kholo
  useEffect(() => {
    // const onOpen = (e) => {
    //   const cart = readCart();
    //   setItems([...cart].reverse());
    //   setLatestKey(e.detail?.key || "");
    //   setOpen(cart.length > 0);
    // };
    
    
    const onOpen = () => {
  cancelClose();
  const cart = readCart();
  setItems([...cart].reverse());
  setLatestKey(cart.length ? keyOf(cart[cart.length - 1]) : "");
  setOpen(cart.length > 0);
};
    
    window.addEventListener("openCartDrawer", onOpen);
    return () => window.removeEventListener("openCartDrawer", onOpen);
  }, []);

  // scroll lock + Esc
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && requestClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const removeItem = (key) => {
    const updated = readCart().filter((i) => keyOf(i) !== key);
    localStorage.setItem("lensmartCart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
    const next = [...updated].reverse();
    setItems(next);
    if (next.length === 0) setOpen(false);
  };

  if (!open || items.length === 0) return null;

  const totals = items.reduce(
    (a, i) => {
      const q = Number(i.quantity || 1);
      const u = Number(i.price || 0);
      const o = Number(i.oldPrice || 0);
      a.boxes += q;
      a.subtotal += u * q;
      a.mrp += (o > u ? o : u) * q;
      return a;
    },
    { boxes: 0, subtotal: 0, mrp: 0 },
  );
  const saving = totals.mrp - totals.subtotal;

  return (
    <>
      <div className={`clp-cart-overlay ${closing ? "is-closing" : ""}`} onClick={requestClose} />

      <aside className={`clp-cart-drawer ${closing ? "is-closing" : ""}`} role="dialog" aria-modal="true" aria-label="Added to cart">
        <div className="clp-cart-drawer-header">
          <div className="clp-cart-drawer-title">
            <span className="clp-cart-drawer-tick" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10" /></svg>
            </span>
            <h2>Added to Cart</h2>
            <span className="clp-cart-drawer-count">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </div>
          <button type="button" className="clp-cart-close" onClick={requestClose} aria-label="Close cart">×</button>
        </div>

        <div className="clp-cart-drawer-body">
          {items.map((item) => {
            const key = keyOf(item);
            const unit = Number(item.price || 0);
            const old = Number(item.oldPrice || 0);
            const hasOff = old > unit;
            const off = hasOff ? Math.round(((old - unit) / old) * 100) : 0;
            const qty = Number(item.quantity || 1);

            return (
              <div className={`clp-drawer-item ${key === latestKey ? "latest" : ""}`} key={key}>
                <div className="clp-drawer-product">
                  <div className="clp-drawer-image">
                    <img src={item.image?.src || item.image} alt={item.name} />
                  </div>

                  <div className="clp-drawer-product-info">
                    {item.brand && <span className="clp-drawer-brand">{item.brand}</span>}
                    <h3>{item.name}</h3>

                    <div className="clp-drawer-price">
                      <strong>{inr(unit)}</strong>
                      {hasOff && <del>{inr(old)}</del>}
                      {hasOff && <span className="clp-drawer-discount">{off}% OFF</span>}
                    </div>

                    {/* <div className="clp-drawer-tags">
                      {item.category && <span className="clp-drawer-pack">{item.category}</span>}
                      {item.color && <span className="clp-drawer-pack alt">{item.color}</span>}
                    </div> */}
{/* 
                    <div className="clp-drawer-tags">
  {item.selectedColor && <span className="clp-drawer-pack">{item.selectedColor}</span>}
  {item.selectedSize && <span className="clp-drawer-pack alt">Size {item.selectedSize}</span>}
  {item.selectedLens?.name && <span className="clp-drawer-pack alt">{item.selectedLens.name}</span>}
</div> */}


<div className="clp-drawer-tags">
  {item.selectedColor && <span className="clp-drawer-pack">{item.selectedColor}</span>}
  {item.selectedSize && <span className="clp-drawer-pack alt">Size {item.selectedSize}</span>}
  {item.selectedLens?.name && (
    <span className="clp-drawer-pack alt">{item.selectedLens.name}</span>
  )}
</div>



                  </div>

                  <button type="button" className="clp-drawer-remove" onClick={() => removeItem(key)} aria-label={`Remove ${item.name} from cart`}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3" />
                    </svg>
                  </button>
                </div>

                <div className="clp-drawer-item-total">
                  <span>Qty: {qty}</span>
                  <strong>{inr(unit * qty)}</strong>
                </div>
              </div>
            );
          })}

          {saving > 0 && (
            <div className="clp-drawer-breakdown">
              <div><span>MRP total</span><del>{inr(totals.mrp)}</del></div>
              <div className="saving"><span>Discount</span><strong>− {inr(saving)}</strong></div>
            </div>
          )}
        </div>

        <div className="clp-cart-drawer-footer">
          <div className="clp-drawer-subtotal">
            <div>
              <span>Subtotal</span>
              <small>Inclusive of all taxes</small>
            </div>
            <strong>{inr(totals.subtotal)}</strong>
          </div>

          <div className="clp-drawer-actions">
            <button type="button" className="clp-continue-shopping" onClick={requestClose}>
              Continue Shopping
            </button>
            <Link href="/cart" className="clp-view-cart" onClick={requestClose}>
              View Cart
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}