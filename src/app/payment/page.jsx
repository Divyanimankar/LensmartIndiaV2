"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiGooglepay, SiPhonepe, SiPaytm } from "react-icons/si";
import SiteLayout from "@/components/SiteLayout";
import "../../styles/paymentpage.css";

/* =========================================================
   CONFIG
========================================================= */

const FREE_SHIPPING_MIN = 999;
const SHIPPING_FEE = 99; /* same as checkout page */
const COD_FEE = 0; /* set e.g. 49 to charge extra for Cash on Delivery */

const CART_KEY = "lensmartCart";
const DELIVERY_KEY = "lensmartDelivery";
const ORDERS_KEY = "lensmartOrders";
const LAST_ORDER_KEY = "lensmartLastOrder";

const RAZORPAY_SRC = "https://checkout.razorpay.com/v1/checkout.js";
const CREATE_ORDER_URL = "/api/razorpay/create-order";
const VERIFY_URL = "/api/razorpay/verify";
const STORE_NAME = "LensMart India";

/* UPI apps shown inside the UPI method.
   rzpApp = the app name Razorpay Checkout understands. */
const UPI_APPS = [
  /* Official logo files go in /public/images/upi/ (svg, png or webp).
     If a file is missing, the react-icons version is shown instead. */
  { id: "gpay", name: "Google Pay", rzpApp: "google_pay", color: "#4285f4", Brand: SiGooglepay, logos: ["/images/upi/gpay.svg", "/images/upi/gpay.png", "/images/upi/gpay.webp"], placeholder: "yourname@okhdfcbank" },
  { id: "phonepe", name: "PhonePe", rzpApp: "phonepe", color: "#5f259f", Brand: SiPhonepe, logos: ["/images/upi/phonepe.svg", "/images/upi/phonepe.png", "/images/upi/phonepe.webp"], placeholder: "9876543210@ybl" },
  { id: "paytm", name: "Paytm", rzpApp: "paytm", color: "#00baf2", Brand: SiPaytm, logos: ["/images/upi/paytm.svg", "/images/upi/paytm.png", "/images/upi/paytm.webp"], placeholder: "9876543210@paytm" },
  { id: "other", name: "Other UPI", rzpApp: null, color: "#161616", Brand: null, logos: [], placeholder: "yourname@bank" },
];

/* Net banking: code = Razorpay bank code (used to pre-select the bank) */
const BANKS = [
  { code: "SBIN", name: "State Bank of India", short: "SBI" },
  { code: "HDFC", name: "HDFC Bank", short: "HDFC" },
  { code: "ICIC", name: "ICICI Bank", short: "ICICI" },
  { code: "UTIB", name: "Axis Bank", short: "Axis" },
  { code: "KKBK", name: "Kotak Mahindra Bank", short: "Kotak" },
  { code: "PUNB", name: "Punjab National Bank", short: "PNB" },
  { code: "BARB", name: "Bank of Baroda", short: "BoB" },
  { code: "CNRB", name: "Canara Bank", short: "Canara" },
  { code: "UBIN", name: "Union Bank of India", short: "UBI" },
  { code: "YESB", name: "Yes Bank", short: "Yes" },
  { code: "IDFB", name: "IDFC FIRST Bank", short: "IDFC" },
  { code: "INDB", name: "IndusInd Bank", short: "IndusInd" },
];

const POPULAR_BANKS = BANKS.slice(0, 6);

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

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const UpiIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M14 14h3v3h-3zM19 19h2M19 14h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 10h18M7 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const BankIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 9.5 12 4l9 5.5H3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M5.5 12v6M10 12v6M14 12v6M18.5 12v6M3.5 20h17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6.5 9.5v.01M17.5 14.5v.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

const getLensKind = (item) => {
  const eyes = [item.rightEye, item.leftEye].filter((e) => e?.selected);
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

const UPI_ID_REGEX = /^[\w.\-]{2,}@[a-zA-Z]{2,}$/;

/* detect the card network from the first digits */
const getCardBrand = (number) => {
  const d = (number || "").replace(/\s/g, "");
  if (!d) return "";
  if (/^3[47]/.test(d)) return "American Express";
  if (/^4/.test(d)) return "Visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(d)) return "Mastercard";
  if (/^(60|65|81|82|508|353|356)/.test(d)) return "RuPay";
  if (/^(36|30[0-5]|38|39)/.test(d)) return "Diners Club";
  return "";
};

/* card helpers */
const formatCardNumber = (value) =>
  value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

const luhnValid = (number) => {
  let sum = 0;
  let alt = false;
  for (let i = number.length - 1; i >= 0; i--) {
    let n = Number(number[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

const expiryValid = (value) => {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
};

/* load Razorpay Checkout once */
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);

    const existing = document.querySelector(`script[src="${RAZORPAY_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const METHODS = [
  { id: "upi", title: "UPI", sub: "Google Pay, PhonePe, Paytm & more", Icon: UpiIcon, badge: "Recommended" },
  { id: "card", title: "Credit / Debit card", sub: "Visa, Mastercard, RuPay", Icon: CardIcon },
  { id: "netbanking", title: "Net banking", sub: "All major Indian banks", Icon: BankIcon },
  { id: "cod", title: "Cash on delivery", sub: "Pay when your order arrives", Icon: CashIcon },
];

const EMPTY_PAY = {
  upiApp: "gpay",
  upiId: "",
  cardNumber: "",
  cardName: "",
  expiry: "",
  cvv: "",
  bank: "",
};

/* Logo image from /public/images/upi/ first; falls back to the react-icons version */
function UpiLogo({ app }) {
  const [index, setIndex] = useState(0);

  if (!app.Brand) {
    return (
      <span className="lmi-upi-mark lmi-upi-mark-other" aria-hidden="true">
        <UpiIcon />
      </span>
    );
  }

  const src = app.logos && app.logos[index];

  if (src) {
    return (
      <span className="lmi-upi-mark lmi-upi-mark-logo" aria-hidden="true">
        <img src={src} alt="" onError={() => setIndex((i) => i + 1)} />
      </span>
    );
  }

  const Brand = app.Brand;

  return (
    <span className="lmi-upi-mark lmi-upi-mark-brand" aria-hidden="true">
      <Brand color={app.color} />
    </span>
  );
}

/* =========================================================
   PAYMENT PAGE
========================================================= */

export default function PaymentPage() {
  const router = useRouter();
  const placedRef = useRef(false);
  const paidRef = useRef(false);

  const [cartItems, setCartItems] = useState([]);
  const [delivery, setDelivery] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const [method, setMethod] = useState("upi");
  const [pay, setPay] = useState(EMPTY_PAY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [processing, setProcessing] = useState(false);
  const [payError, setPayError] = useState("");

  /* =======================================================
     LOAD CART + DELIVERY
  ======================================================= */

  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
      setCartItems(
        Array.isArray(savedCart)
          ? savedCart.map((item) => ({
              ...item,
              price: getItemPrice(item),
              quantity: getItemQuantity(item),
            }))
          : []
      );
    } catch (error) {
      setCartItems([]);
    }

    try {
      setDelivery(JSON.parse(localStorage.getItem(DELIVERY_KEY)));
    } catch (error) {
      setDelivery(null);
    }

    setLoaded(true);
  }, []);

  /* guards: need a cart and delivery details */
  useEffect(() => {
    if (!loaded || placedRef.current) return;

    if (cartItems.length === 0) {
      router.replace("/cart");
    } else if (!delivery || !delivery.fullName || !delivery.address1) {
      router.replace("/checkout");
    }
  }, [loaded, cartItems.length, delivery, router]);

  /* warm up the gateway script so the pay click is instant */
  useEffect(() => {
    loadRazorpay();
  }, []);

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
  const codFee = method === "cod" ? COD_FEE : 0;
  const total = subtotal + shippingCost + codFee;

  const displayItems = [...cartItems].reverse();

  const activeUpiApp = UPI_APPS.find((app) => app.id === pay.upiApp) || UPI_APPS[0];

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validate = (values, selected) => {
    const found = {};

    if (selected === "upi") {
      const id = values.upiId.trim();
      const required = values.upiApp === "other";

      /* for Google Pay / PhonePe / Paytm the UPI ID is optional */
      if ((required || id) && !UPI_ID_REGEX.test(id)) {
        found.upiId = "Enter a valid UPI ID, e.g. name@bank";
      }
    }

    if (selected === "card") {
      const digits = (values.cardNumber || "").replace(/\s/g, "");
      if (digits.length < 13 || !luhnValid(digits)) found.cardNumber = "Enter a valid card number.";
      if ((values.cardName || "").trim().length < 2) found.cardName = "Enter the name on your card.";
      if (!expiryValid(values.expiry || "")) found.expiry = "Enter a valid expiry (MM/YY).";
      if (!/^\d{3,4}$/.test(values.cvv || "")) found.cvv = "Enter a valid CVV.";
    }

    if (selected === "netbanking") {
      if (!values.bank) found.bank = "Please select your bank.";
    }

    return found;
  };

  const updatePay = (name, value) => {
    const next = { ...pay, [name]: value };
    setPay(next);
    if (touched[name]) setErrors(validate(next, method));
  };

  const blurPay = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(pay, method));
  };

  const fieldError = (name) => (touched[name] && errors[name] ? errors[name] : "");

  const chooseMethod = (id) => {
    setMethod(id);
    setErrors({});
    setTouched({});
    setPayError("");
  };

  const chooseUpiApp = (id) => {
    setPay((prev) => ({ ...prev, upiApp: id }));
    setErrors({});
    setTouched({});
    setPayError("");
  };

  /* =======================================================
     SAVE ORDER + GO TO SUCCESS PAGE
  ======================================================= */

  const finalizeOrder = (payment) => {
    const order = {
      id: `LMI${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString(),
      status: method === "cod" ? "Order placed (Cash on delivery)" : "Paid",
      paymentMethod: method,
      paymentApp: method === "upi" ? activeUpiApp.name : undefined,
      payment: payment || undefined,
      items: cartItems,
      delivery,
      totals: { totalMrp, discount, subtotal, shipping: shippingCost, codFee, total },
    };

    let previous = [];
    try {
      previous = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    } catch (error) {
      previous = [];
    }

    localStorage.setItem(
      ORDERS_KEY,
      JSON.stringify([order, ...(Array.isArray(previous) ? previous : [])])
    );
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));

    placedRef.current = true;
    localStorage.removeItem(CART_KEY);
    window.dispatchEvent(new Event("cartUpdated"));

    router.push("/order-success");
  };

  /* =======================================================
     RAZORPAY CHECKOUT
  ======================================================= */

  /* open only the payment option the customer picked */
  const buildDisplayConfig = () => {
    let instrument;
    let label;

    if (method === "upi") {
      instrument = activeUpiApp.rzpApp
        ? { method: "upi", apps: [activeUpiApp.rzpApp] }
        : { method: "upi" };
      label = activeUpiApp.rzpApp ? `Pay with ${activeUpiApp.name}` : "Pay with UPI";
    } else if (method === "card") {
      instrument = { method: "card" };
      label = "Pay with card";
    } else {
      instrument = { method: "netbanking" };
      label = "Pay with net banking";
    }

    return {
      display: {
        blocks: { selected: { name: label, instruments: [instrument] } },
        sequence: ["block.selected"],
        preferences: { show_default_blocks: false },
      },
    };
  };

  const startOnlinePayment = async () => {
    setProcessing(true);
    setPayError("");
    paidRef.current = false;

    /* 1. gateway script */
    const ready = await loadRazorpay();
    if (!ready) {
      setPayError("Couldn’t load the payment window. Check your internet and try again.");
      setProcessing(false);
      return;
    }

    /* 2. create the order on our server */
    let data;
    try {
      const res = await fetch(CREATE_ORDER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      data = await res.json();
      if (!res.ok || !data.orderId) throw new Error(data.error || "Order creation failed");
    } catch (error) {
      setPayError("Couldn’t start the payment. Please try again in a moment.");
      setProcessing(false);
      return;
    }

    /* 3. open the checkout window */
    const upiId = pay.upiId.trim();

    const options = {
      key: data.keyId,
      amount: data.amount,
      currency: "INR",
      order_id: data.orderId,
      name: STORE_NAME,
      description: `${totalBoxes} ${boxWord(totalBoxes)} of contact lenses`,
      prefill: {
        name: delivery.fullName,
        email: delivery.email,
        contact: delivery.mobile,
        method,
        ...(method === "upi" && upiId ? { vpa: upiId } : {}),
        ...(method === "netbanking" && pay.bank ? { bank: pay.bank } : {}),
        /* card details are only passed to Razorpay's window (never saved by us).
           CVV is never passed - the customer enters it in the secure window. */
        ...(method === "card"
          ? {
              "card[name]": pay.cardName.trim(),
              "card[number]": pay.cardNumber.replace(/\s/g, ""),
              "card[expiry]": pay.expiry,
            }
          : {}),
      },
      config: buildDisplayConfig(),
      theme: { color: "#1b6b6a" },

      handler: async (response) => {
        paidRef.current = true;

        /* 4. verify the payment signature on our server */
        try {
          const res = await fetch(VERIFY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const result = await res.json();
          if (!res.ok || !result.verified) throw new Error("Verification failed");

          finalizeOrder({
            gateway: "razorpay",
            paymentId: response.razorpay_payment_id,
            gatewayOrderId: response.razorpay_order_id,
          });
        } catch (error) {
          setPayError(
            `We couldn’t confirm your payment. If money was deducted, please contact support with payment ID ${response.razorpay_payment_id}.`
          );
          setProcessing(false);
        }
      },

      modal: {
        ondismiss: () => {
          if (paidRef.current) return;
          setPayError("Payment was cancelled. You can try again.");
          setProcessing(false);
        },
      },
    };

    try {
      const checkout = new window.Razorpay(options);

      checkout.on("payment.failed", (response) => {
        setPayError(response?.error?.description || "Payment failed. Please try again.");
        setProcessing(false);
      });

      checkout.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      setPayError("Couldn’t open the payment window. Please try again.");
      setProcessing(false);
    }
  };

  /* =======================================================
     PLACE ORDER
  ======================================================= */

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    if (processing) return;

    const found = validate(pay, method);
    setErrors(found);

    if (Object.keys(found).length) {
      setTouched(Object.fromEntries(Object.keys(found).map((key) => [key, true])));
      const el = document.getElementById(`lmi-pay-${Object.keys(found)[0]}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus({ preventScroll: true });
      }
      return;
    }

    if (method === "cod") {
      setProcessing(true);
      finalizeOrder(null);
      return;
    }

    await startOnlinePayment();
  };

  /* =======================================================
     LOADING / REDIRECT
  ======================================================= */

  if (!loaded || cartItems.length === 0 || !delivery || !delivery.fullName) {
    return (
      <SiteLayout>
        <div className="lmi-payment-page">
          <div className="lmi-pay-loading">Loading payment...</div>
        </div>
      </SiteLayout>
    );
  }

  const addressLine = [
    delivery.address1,
    delivery.address2,
    `${delivery.city}, ${delivery.state} ${delivery.pincode}`,
    delivery.country || "India",
  ]
    .filter(Boolean)
    .join(", ");

  const payLabel = method === "cod" ? "Place order" : `Pay ${money(total)}`;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <SiteLayout>
      <div className="lmi-payment-page">
        <section className="lmi-pay-section">
          <div className="lmi-pay-container">
            {/* BREADCRUMB */}
            <nav className="lmi-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/cart">Your cart</Link>
              <span>/</span>
              <Link href="/checkout">Delivery</Link>
              <span>/</span>
              <span>Payment</span>
            </nav>

            {/* HEADING + STEPS */}
            <div className="lmi-pay-top">
              <div className="lmi-pay-title">
                <h1>Payment</h1>
                <p>Choose how you’d like to pay for your order.</p>
              </div>

              <ol className="lmi-steps" aria-label="Checkout steps">
                <li className="done">
                  <span>
                    <CheckIcon />
                  </span>
                  Cart
                </li>
                <li className="line done" aria-hidden="true" />
                <li className="done">
                  <span>
                    <CheckIcon />
                  </span>
                  Delivery
                </li>
                <li className="line done" aria-hidden="true" />
                <li className="active">
                  <span>3</span>Payment
                </li>
              </ol>
            </div>

            <form className="lmi-pay-layout" onSubmit={handlePlaceOrder} noValidate>
              {/* ================= LEFT ================= */}
              <div className="lmi-pay-main">
                {/* DELIVERING TO */}
                <div className="lmi-pay-card">
                  <div className="lmi-pay-card-head">
                    <h2>Delivering to</h2>
                    <Link href="/checkout" className="lmi-edit-link">
                      Change
                    </Link>
                  </div>

                  <div className="lmi-address-box">
                    <PinIcon />
                    <div>
                      <strong>{delivery.fullName}</strong>
                      <p>{addressLine}</p>
                      <p className="lmi-address-contact">
                        +91 {delivery.mobile} · {delivery.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* PAYMENT METHOD */}
                <div className="lmi-pay-card">
                  <div className="lmi-pay-card-head">
                    <h2>Payment method</h2>
                    <span className="lmi-secure-chip">
                      <LockIcon />
                      Secure
                    </span>
                  </div>

                  <div className="lmi-methods" role="radiogroup" aria-label="Payment method">
                    {METHODS.map(({ id, title, sub, Icon, badge }) => {
                      const selected = method === id;

                      return (
                        <div className={`lmi-method ${selected ? "selected" : ""}`} key={id}>
                          <label className="lmi-method-head">
                            <input
                              type="radio"
                              name="payment-method"
                              value={id}
                              checked={selected}
                              onChange={() => chooseMethod(id)}
                            />
                            <span className="lmi-radio" aria-hidden="true" />
                            <span className="lmi-method-icon">
                              <Icon />
                            </span>
                            <span className="lmi-method-text">
                              <strong>{title}</strong>
                              <small>{sub}</small>
                            </span>
                            {badge && <span className="lmi-method-badge">{badge}</span>}
                          </label>

                          {selected && (
                            <div className="lmi-method-body">
                              {/* UPI */}
                              {id === "upi" && (
                                <>
                                  <p className="lmi-upi-label">Pay using</p>

                                  <div className="lmi-upi-apps" role="radiogroup" aria-label="UPI app">
                                    {UPI_APPS.map((app) => {
                                      const active = pay.upiApp === app.id;

                                      return (
                                        <button
                                          type="button"
                                          key={app.id}
                                          role="radio"
                                          aria-checked={active}
                                          className={`lmi-upi-app ${active ? "active" : ""}`}
                                          onClick={() => chooseUpiApp(app.id)}
                                        >
                                          <UpiLogo app={app} />
                                          <span className="lmi-upi-name">{app.name}</span>
                                          {active && (
                                            <span className="lmi-upi-tick" aria-hidden="true">
                                              <CheckIcon />
                                            </span>
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>

                                  <div className={`lmi-field ${fieldError("upiId") ? "has-error" : ""}`}>
                                    <label htmlFor="lmi-pay-upiId">
                                      {pay.upiApp === "other"
                                        ? "UPI ID *"
                                        : `${activeUpiApp.name} UPI ID (optional)`}
                                    </label>
                                    <input
                                      id="lmi-pay-upiId"
                                      type="text"
                                      autoComplete="off"
                                      placeholder={activeUpiApp.placeholder}
                                      value={pay.upiId}
                                      onChange={(e) => updatePay("upiId", e.target.value)}
                                      onBlur={() => blurPay("upiId")}
                                    />
                                    {fieldError("upiId") ? (
                                      <p className="lmi-field-error">{errors.upiId}</p>
                                    ) : (
                                      <p className="lmi-field-hint">
                                        {pay.upiApp === "other"
                                          ? "You’ll get a payment request in your UPI app."
                                          : `On mobile, ${activeUpiApp.name} opens directly. Add your UPI ID to get a request in the app instead.`}
                                      </p>
                                    )}
                                  </div>
                                </>
                              )}

                              {/* CARD */}
                              {id === "card" && (
                                <>
                                  <div className={`lmi-field ${fieldError("cardNumber") ? "has-error" : ""}`}>
                                    <label htmlFor="lmi-pay-cardNumber">Card number *</label>
                                    <div className="lmi-input-wrap">
                                      <input
                                        id="lmi-pay-cardNumber"
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="cc-number"
                                        placeholder="1234 5678 9012 3456"
                                        value={pay.cardNumber || ""}
                                        onChange={(e) =>
                                          updatePay("cardNumber", formatCardNumber(e.target.value))
                                        }
                                        onBlur={() => blurPay("cardNumber")}
                                      />
                                      {getCardBrand(pay.cardNumber) && (
                                        <span className="lmi-card-brand">{getCardBrand(pay.cardNumber)}</span>
                                      )}
                                    </div>
                                    {fieldError("cardNumber") && (
                                      <p className="lmi-field-error">{errors.cardNumber}</p>
                                    )}
                                  </div>

                                  <div className={`lmi-field ${fieldError("cardName") ? "has-error" : ""}`}>
                                    <label htmlFor="lmi-pay-cardName">Name on card *</label>
                                    <input
                                      id="lmi-pay-cardName"
                                      type="text"
                                      autoComplete="cc-name"
                                      placeholder="Enter name as printed on card"
                                      value={pay.cardName}
                                      onChange={(e) => updatePay("cardName", e.target.value)}
                                      onBlur={() => blurPay("cardName")}
                                    />
                                    {fieldError("cardName") && (
                                      <p className="lmi-field-error">{errors.cardName}</p>
                                    )}
                                  </div>

                                  <div className="lmi-pay-grid">
                                    <div className={`lmi-field ${fieldError("expiry") ? "has-error" : ""}`}>
                                      <label htmlFor="lmi-pay-expiry">Expiry date *</label>
                                      <input
                                        id="lmi-pay-expiry"
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="cc-exp"
                                        placeholder="MM/YY"
                                        value={pay.expiry}
                                        onChange={(e) => updatePay("expiry", formatExpiry(e.target.value))}
                                        onBlur={() => blurPay("expiry")}
                                      />
                                      {fieldError("expiry") && (
                                        <p className="lmi-field-error">{errors.expiry}</p>
                                      )}
                                    </div>

                                    <div className={`lmi-field ${fieldError("cvv") ? "has-error" : ""}`}>
                                      <label htmlFor="lmi-pay-cvv">CVV *</label>
                                      <input
                                        id="lmi-pay-cvv"
                                        type="password"
                                        inputMode="numeric"
                                        autoComplete="cc-csc"
                                        maxLength={4}
                                        placeholder="•••"
                                        value={pay.cvv}
                                        onChange={(e) =>
                                          updatePay("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))
                                        }
                                        onBlur={() => blurPay("cvv")}
                                      />
                                      {fieldError("cvv") && <p className="lmi-field-error">{errors.cvv}</p>}
                                    </div>
                                  </div>

                                  <p className="lmi-field-hint">
                                    Card details are sent only to the payment gateway, never saved on
                                    our site. You’ll confirm with an OTP from your bank.
                                  </p>
                                </>
                              )}

                              {/* NET BANKING */}
                              {id === "netbanking" && (
                                <>
                                  <p className="lmi-upi-label">Popular banks</p>

                                  <div className="lmi-bank-grid" role="radiogroup" aria-label="Popular banks">
                                    {POPULAR_BANKS.map((bank) => {
                                      const active = pay.bank === bank.code;

                                      return (
                                        <button
                                          type="button"
                                          key={bank.code}
                                          role="radio"
                                          aria-checked={active}
                                          className={`lmi-bank ${active ? "active" : ""}`}
                                          onClick={() => updatePay("bank", bank.code)}
                                        >
                                          <span className="lmi-bank-mark">{bank.short}</span>
                                          <span className="lmi-bank-name">{bank.name}</span>
                                          {active && (
                                            <span className="lmi-upi-tick" aria-hidden="true">
                                              <CheckIcon />
                                            </span>
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>

                                  <div className={`lmi-field ${fieldError("bank") ? "has-error" : ""}`}>
                                    <label htmlFor="lmi-pay-bank">Or choose another bank *</label>
                                    <div className="lmi-select">
                                      <select
                                        id="lmi-pay-bank"
                                        value={pay.bank}
                                        className={pay.bank ? "filled" : ""}
                                        onChange={(e) => updatePay("bank", e.target.value)}
                                        onBlur={() => blurPay("bank")}
                                      >
                                        <option value="">Choose bank</option>
                                        {BANKS.map((bank) => (
                                          <option key={bank.code} value={bank.code}>
                                            {bank.name}
                                          </option>
                                        ))}
                                      </select>
                                      <ChevronDown />
                                    </div>
                                    {fieldError("bank") ? (
                                      <p className="lmi-field-error">{errors.bank}</p>
                                    ) : (
                                      <p className="lmi-field-hint">
                                        You’ll log in to your bank securely in the payment window.
                                      </p>
                                    )}
                                  </div>
                                </>
                              )}

                              {/* COD */}
                              {id === "cod" && (
                                <p className="lmi-cod-note">
                                  Pay in cash or UPI to our delivery partner when your lenses arrive.
                                  {COD_FEE > 0 && ` A cash on delivery fee of ${money(COD_FEE)} applies.`}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* TRUST NOTE */}
                <div className="lmi-trust-box">
                  <LockIcon />
                  <div>
                    <strong>Your payment is safe with us</strong>
                    <p>
                      Payments are encrypted and processed securely. We never store your card or
                      bank details.
                    </p>
                  </div>
                </div>
              </div>

              {/* ================= RIGHT ================= */}
              <aside className="lmi-pay-side">
                <div className="lmi-summary">
                  <h2>Order summary</h2>

                  <div className="lmi-sum-items">
                    {displayItems.map((item) => {
                      const price = getItemPrice(item);
                      const boxes = getItemQuantity(item);
                      const metaLine = [item.type, item.pack, getLensKind(item)]
                        .filter(Boolean)
                        .join(" · ");

                      return (
                        <div className="lmi-sum-item" key={getCartItemKey(item)}>
                          <div className="lmi-sum-thumb">
                            <img src={getImageSrc(item.image)} alt={item.name || "Product"} />
                          </div>

                          <div className="lmi-sum-info">
                            <h3>{item.name}</h3>
                            {metaLine && <p className="lmi-sum-meta">{metaLine}</p>}
                            <p className="lmi-sum-boxes">
                              {boxes} {boxWord(boxes)} × {money(price)}
                            </p>
                          </div>

                          <strong className="lmi-sum-amount">{money(price * boxes)}</strong>
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

                  {codFee > 0 && (
                    <div className="lmi-sum-row">
                      <span>Cash on delivery fee</span>
                      <strong>{money(codFee)}</strong>
                    </div>
                  )}

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
                    Inclusive of all taxes · {totalBoxes} {boxWord(totalBoxes)} in total.
                  </p>

                  {payError && (
                    <div className="lmi-pay-error" role="alert">
                      {payError}
                    </div>
                  )}

                  <button type="submit" className="lmi-pay-button" disabled={processing}>
                    {processing ? (
                      <>
                        <span className="lmi-spinner" aria-hidden="true" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {payLabel}
                        <ArrowRight />
                      </>
                    )}
                  </button>

                  <div className="lmi-secure">
                    <LockIcon />
                    Safe &amp; secure payments
                  </div>
                </div>

                <Link href="/checkout" className="lmi-back">
                  <ArrowLeft />
                  Back to delivery
                </Link>
              </aside>
            </form>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}