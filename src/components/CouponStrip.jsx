"use client";

import { useRef, useState } from "react";

export default function CouponStrip({ coupons = [] }) {
  const [copied, setCopied] = useState("");
  const timer = useRef(null);

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // purane browsers ke liye fallback
      const area = document.createElement("textarea");
      area.value = code;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
      } catch {}
      document.body.removeChild(area);
    }

    setCopied(code);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(""), 1800);
  };

  return (
    <div className="lmo-coupons">
      {coupons.map((coupon) => (
        <article key={coupon.code} className={`lmo-coupon lmo-tone-${coupon.tone}`}>
          <div className="lmo-coupon-stub">
            <strong>{coupon.value}</strong>
            <span>{coupon.unit}</span>
          </div>

          <div className="lmo-coupon-body">
            <h3>{coupon.title}</h3>
            <p>{coupon.note}</p>

            {coupon.auto ? (
              <span className="lmo-coupon-auto">Applied automatically</span>
            ) : (
              <div className="lmo-coupon-code">
                <code>{coupon.code}</code>
                <button
                  type="button"
                  onClick={() => copyCode(coupon.code)}
                  className={copied === coupon.code ? "is-copied" : ""}
                  aria-label={`Copy coupon code ${coupon.code}`}
                >
                  {copied === coupon.code ? "Copied ✓" : "Copy"}
                </button>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
