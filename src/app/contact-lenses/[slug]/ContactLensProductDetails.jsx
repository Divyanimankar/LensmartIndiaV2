"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import "../../../styles/contactLensProductDetails.css";
import SimilarProduct from "@/components/SimilarProduct";
import BrandProduct from "@/components/BrandProduct";
import ProductDescription from "@/components/ProductDescription";
import { addToCart as addToShopifyCart, removeCartItem } from "@/lib/cartClient";

/* =========================
   SLUG
   Data file mein slug ho to wahi use hoga, warna yahin banta hai.
   "Air Optix Plus HydraGlyde" + "3 Pack"
     -> "air-optix-plus-hydraglyde-contact-lenses-3-pack"
========================= */

const slugify = (text) =>
  String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getSlug = (item) =>
  item.slug || slugify(`${item.name} contact lenses ${item.pack || ""}`);

/* products ab Shopify se props mein aate hain (page.jsx) */

/* =========================
   STATIC OPTIONS
========================= */

/* defaults: sirf tab use hote hain jab Shopify metafield mein options na ho */
const DEFAULT_MINUS = Array.from(
  { length: 48 },
  (_, i) => `-${((i + 1) * 0.25).toFixed(2)}`,
);

const DEFAULT_PLUS = Array.from(
  { length: 32 },
  (_, i) => `+${((i + 1) * 0.25).toFixed(2)}`,
);

const DEFAULT_BC = ["8.4", "8.5", "8.6", "8.7"];
const DEFAULT_DIA = ["13.8", "14.0", "14.2", "14.5"];
const DEFAULT_CYL = ["-0.75", "-1.25", "-1.75", "-2.25", "-2.75"];
const DEFAULT_AXIS = Array.from({ length: 18 }, (_, i) => String((i + 1) * 10));
const DEFAULT_ADD = ["Low", "Medium", "High"];

/* product.rx (Shopify metafield) se dropdown options; kuch na ho to default */
const pickList = (list, fallback) =>
  Array.isArray(list) && list.length > 0 ? list : fallback;

const buildRxOptions = (rx) => ({
  powers: {
    plano: rx?.powers?.plano || "0.00",
    minus: pickList(rx?.powers?.minus, DEFAULT_MINUS),
    plus: pickList(rx?.powers?.plus, DEFAULT_PLUS),
  },
  bc: pickList(rx?.bc, DEFAULT_BC),
  dia: pickList(rx?.dia, DEFAULT_DIA),
  cyl: pickList(rx?.cyl, DEFAULT_CYL),
  axis: pickList(rx?.axis, DEFAULT_AXIS),
  add: pickList(rx?.add, DEFAULT_ADD),
});

const emptyEye = {
  on: true,
  qty: 1,
  power: "",
  bc: "8.7",
  dia: "14.5",
  cyl: "",
  axis: "",
  add: "",
};

/* fields that are copied when "Same prescription for both eyes" is ticked */
const RX_KEYS = ["power", "bc", "dia", "cyl", "axis", "add", "qty"];

const formatINR = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

/* "30 Pack" / "Pack of 30" / "30 Lenses"  ->  "30 lenses/box" */
const formatPack = (pack) => {
  if (pack === null || pack === undefined) return "";

  const text = String(pack).trim();
  if (!text) return "";

  const count = text.match(/\d+/);
  if (count) return `${count[0]} lenses/box`;

  return text.replace(/\bpacks?\b/i, "lenses/box");
};

/* words that describe the lens power type, not the replacement schedule */
const POWER_TYPE_WORDS = /^(spherical|toric|multifocal)$/i;

/* cart item key Shopify route se aati hai */
const cartItemKey = (item) => item.key;

/* =========================
   PICKER  (used by EVERY dropdown)
   - no `options` prop  -> SPH / Power: "−" and "+" columns, 0.00 on top
   - `options` prop     -> single column list (CYL, AXIS, ADD, BC, DIA)
   - desktop: popover  |  phone: bottom sheet (see CSS)
   - keyboard: arrows move, Enter picks, Esc closes
========================= */

function Picker({ id, value, onChange, title, options, powers, disabled }) {
  const isPower = !options;

  const plano = powers?.plano || "0.00";
  const minusList = powers?.minus || DEFAULT_MINUS;
  const plusList = powers?.plus || DEFAULT_PLUS;
  const powerRows = Math.max(minusList.length, plusList.length);

  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const popRef = useRef(null);
  const listRef = useRef(null);
  const btnRef = useRef(null);

  /* greyed-out picker can never stay open */
  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  useEffect(() => {
    if (!open) return;

    const onDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    document.body.classList.add("clp-sheet-open");

    /* bring the chosen value into view and focus it */
    const list = listRef.current;
    const active = list?.querySelector(".active");

    if (list && active) {
      list.scrollTop = Math.max(
        0,
        active.offsetTop - list.clientHeight / 2 + active.clientHeight / 2,
      );
    }

    const target =
      active ||
      popRef.current?.querySelector(".clp-power-zero") ||
      popRef.current?.querySelector("[data-r]");

    target?.focus({ preventScroll: true });

    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("clp-sheet-open");
    };
  }, [open]);

  const pick = (selected) => {
    onChange(selected);
    setOpen(false);
    btnRef.current?.focus();
  };

  const onPopKey = (event) => {
    if (
      !["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(event.key)
    ) {
      return;
    }

    const current = document.activeElement;
    if (!current || current.dataset.r === undefined) return;

    event.preventDefault();

    let row = Number(current.dataset.r);
    let col = Number(current.dataset.c);

    if (event.key === "ArrowDown") row += 1;
    if (event.key === "ArrowUp") row -= 1;
    if (event.key === "ArrowLeft") col = 0;
    if (event.key === "ArrowRight") col = 1;
    if (row < 0) col = 0;

    popRef.current
      ?.querySelector(`[data-r="${row}"][data-c="${row < 0 ? 0 : col}"]`)
      ?.focus();
  };

  const popTitle = title || (isPower ? "SPH / Power" : "Select");

  return (
    <div className="clp-power-picker" ref={ref}>
      <button
        type="button"
        id={id}
        ref={btnRef}
        className={`clp-pill clp-pill-btn ${value ? "has-value" : ""}`}
        onClick={() => setOpen((previous) => !previous)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{value || "Select"}</span>

        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <>
          <div className="clp-sheet-bg" onClick={() => setOpen(false)} />

          <div
            className={`clp-power-pop ${isPower ? "" : "sm"}`}
            ref={popRef}
            role="listbox"
            aria-label={popTitle}
            onKeyDown={onPopKey}
          >
            {/* title + close: only visible in the phone bottom sheet */}
            <div className="clp-power-title">
              <span>{popTitle}</span>

              <button
                type="button"
                className="clp-power-x"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>

            {isPower ? (
              <>
                <div className="clp-power-head" aria-hidden="true">
                  <span>−</span>
                  <span>+</span>
                </div>

                <button
                  type="button"
                  role="option"
                  aria-selected={value === plano}
                  data-r="-1"
                  data-c="0"
                  className={`clp-power-zero ${
                    value === plano ? "active" : ""
                  }`}
                  onClick={() => pick(plano)}
                >
                  {plano}
                </button>

                <div className="clp-power-list" ref={listRef}>
                  {Array.from({ length: powerRows }, (_, index) => {
                    const minus = minusList[index];
                    const plus = plusList[index];

                    return (
                      <div className="clp-power-row" key={index}>
                        {minus ? (
                          <button
                            type="button"
                            role="option"
                            aria-selected={value === minus}
                            data-r={index}
                            data-c="0"
                            className={value === minus ? "active" : ""}
                            onClick={() => pick(minus)}
                          >
                            {minus}
                          </button>
                        ) : (
                          <span />
                        )}

                        {plus ? (
                          <button
                            type="button"
                            role="option"
                            aria-selected={value === plus}
                            data-r={index}
                            data-c="1"
                            className={value === plus ? "active" : ""}
                            onClick={() => pick(plus)}
                          >
                            {plus}
                          </button>
                        ) : (
                          <span />
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="clp-power-list" ref={listRef}>
                {options.map((option, index) => (
                  <div className="clp-power-row single" key={option}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={value === option}
                      data-r={index}
                      data-c="0"
                      className={value === option ? "active" : ""}
                      onClick={() => pick(option)}
                    >
                      {option}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* SPH / Power keeps its name; every other dropdown uses the same picker */

function PowerPicker(props) {
  return <Picker {...props} />;
}

function PillSelect(props) {
  return <Picker {...props} />;
}

/* =========================
   PAGE
========================= */

export default function ContactLensProductDetails({
  products: shopifyProducts = [],
}) {
  const router = useRouter();
  const params = useParams();
  const productSlug = decodeURIComponent(String(params.slug || ""));

  /* har Shopify product ke saath slug jod do */
  const products = useMemo(
    () => shopifyProducts.map((item) => ({ ...item, slug: getSlug(item) })),
    [shopifyProducts],
  );

  /* slug se dhundo; purane /contact-lenses/1 links ke liye id se bhi */
  const product = useMemo(
    () =>
      products.find(
        (item) => item.slug === productSlug || String(item.id) === productSlug,
      ),
    [productSlug, products],
  );

  const productId = product ? Number(product.id) : null;

  /* dropdown options: is product ke Shopify metafield se */
  const rxOptions = useMemo(() => buildRxOptions(product?.rx), [product]);

  /* naye product ke hisaab se default BC / DIA (pehla option) */
  const makeEye = () => ({
    ...emptyEye,
    bc: rxOptions.bc[0] ?? emptyEye.bc,
    dia: rxOptions.dia[0] ?? emptyEye.dia,
  });

  /* REDIRECT: /contact-lenses/1  ->  /contact-lenses/<slug> */

  useEffect(() => {
    if (product && productSlug !== product.slug) {
      router.replace(`/contact-lenses/${product.slug}`);
    }
  }, [product, productSlug, router]);

  /* EYE STATES */

  const [eyes, setEyes] = useState({
    right: makeEye(),
    left: makeEye(),
  });

  /* dusre product par jaane par prescription reset */
  useEffect(() => {
    setEyes({ right: makeEye(), left: makeEye() });
    setSameForBoth(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  /* SAME PRESCRIPTION FOR BOTH EYES */

  const [sameForBoth, setSameForBoth] = useState(false);

  const setEye = (side, patch) => {
    setEyes((previous) => {
      const next = {
        ...previous,
        [side]: { ...previous[side], ...patch },
      };

      /* while the checkbox is ticked, right-eye changes flow to left eye */
      if (sameForBoth && side === "right") {
        const rxPatch = {};

        RX_KEYS.forEach((key) => {
          if (key in patch) rxPatch[key] = patch[key];
        });

        next.left = { ...previous.left, ...rxPatch };
      }

      return next;
    });
  };

  const handleSameForBoth = (checked) => {
    setSameForBoth(checked);

    if (checked) {
      setEyes((previous) => {
        const rx = {};
        RX_KEYS.forEach((key) => {
          rx[key] = previous.right[key];
        });

        return { ...previous, left: { ...previous.left, ...rx } };
      });
    }
  };

  /* PRESCRIPTION */

  const [prescriptionMode, setPrescriptionMode] = useState("manual");
  const [prescriptionFile, setPrescriptionFile] = useState(null);

  /* PRESCRIBER */

  const [prescriberOpen, setPrescriberOpen] = useState(false);
  const [clinicName, setClinicName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  /* WISHLIST */

  const [wishlist, setWishlist] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);

  /* CART DRAWER
     drawerItems  = saare cart products (latest sabse upar)
     latestKey    = abhi add kiya hua product (highlight ke liye) */

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [drawerItems, setDrawerItems] = useState([]);
  const [latestKey, setLatestKey] = useState("");
  const [adding, setAdding] = useState(false);

  /* TOAST */

  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  /* LOCK PAGE SCROLL + ESC TO CLOSE WHILE DRAWER IS OPEN */

  useEffect(() => {
    if (!cartDrawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") setCartDrawerOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [cartDrawerOpen]);

  /* PRODUCT GALLERY */

  const [activeImage, setActiveImage] = useState(0);

  const gallery = useMemo(() => {
    if (!product) return [];

    const toSrc = (img) => (img && typeof img === "object" ? img.src : img);

    // product.images ho to wahi, warna same image 3 baar
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.map(toSrc);
    }

    const single = toSrc(product.image);
    return single ? [single, single, single] : [];
  }, [product]);

  /* naya product khulne par pehli image se shuru */
  useEffect(() => {
    setActiveImage(0);
  }, [productId]);

  /* LOAD WISHLIST */

  useEffect(() => {
    if (!product) return;

    try {
      const savedWishlist =
        JSON.parse(localStorage.getItem("lensmartWishlist")) || [];

      const safeWishlist = Array.isArray(savedWishlist) ? savedWishlist : [];

      setWishlist(safeWishlist);

      setIsWishlisted(
        safeWishlist.some(
          (item) =>
            Number(item.id) === Number(product.id) &&
            item.productType === "contact-lens",
        ),
      );
    } catch (error) {
      console.error("Wishlist load error:", error);
      setWishlist([]);
      setIsWishlisted(false);
    }
  }, [product]);

  /* SYNC WISHLIST */

  useEffect(() => {
    const syncWishlist = () => {
      try {
        const savedWishlist =
          JSON.parse(localStorage.getItem("lensmartWishlist")) || [];

        const safeWishlist = Array.isArray(savedWishlist) ? savedWishlist : [];

        setWishlist(safeWishlist);

        if (product) {
          setIsWishlisted(
            safeWishlist.some(
              (item) =>
                Number(item.id) === Number(product.id) &&
                item.productType === "contact-lens",
            ),
          );
        }
      } catch (error) {
        console.error("Wishlist sync error:", error);
      }
    };

    window.addEventListener("wishlistUpdated", syncWishlist);
    window.addEventListener("storage", syncWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", syncWishlist);
      window.removeEventListener("storage", syncWishlist);
    };
  }, [product]);

  /* NOT FOUND */

  if (!product) {
    return (
      <div className="clp-not-found">
        <h1>Product Not Found</h1>
        <p>This contact lens product is not available.</p>
        <Link href="/all-products">Back to Contact Lenses</Link>
      </div>
    );
  }

  /* LENS TYPE */

  const productSearchText = `
    ${product.name || ""}
    ${product.type || ""}
  `.toLowerCase();

  const isToric =
    productSearchText.includes("toric") ||
    productSearchText.includes("astigmatism");

  const isMultifocal = productSearchText.includes("multifocal");

  const lensKind = isToric
    ? "Toric"
    : isMultifocal
      ? "Multifocal"
      : "Spherical";

  /* "Daily", "Monthly" ... (older data keeps it in product.type) */
  const rawSchedule =
    product.replacementSchedule ||
    product.schedule ||
    (POWER_TYPE_WORDS.test(String(product.type || "").trim())
      ? ""
      : product.type);

  const scheduleLabel = rawSchedule ? String(rawSchedule).trim() : "";
  const packLabel = formatPack(product.pack);

  /* PRICE */

  const currentPrice =
    product.price !== null && product.price !== undefined
      ? Number(product.price)
      : Number(product.oldPrice || 0);

  const oldPrice =
    product.oldPrice !== null && product.oldPrice !== undefined
      ? Number(product.oldPrice)
      : null;

  const hasDiscount = oldPrice && currentPrice && oldPrice > currentPrice;

  const discount = hasDiscount
    ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
    : 0;

  /* BOX QUANTITY */

  const rightBoxes = eyes.right.on ? eyes.right.qty : 0;
  const leftBoxes = eyes.left.on ? eyes.left.qty : 0;
  const totalBoxes = rightBoxes + leftBoxes;
  const totalPrice = totalBoxes * currentPrice;

  /* SIMILAR PRODUCTS */

  const similarProducts = products
    .filter(
      (item) =>
        Number(item.id) !== productId &&
        item.image &&
        (item.price !== undefined || item.oldPrice !== undefined),
    )
    .slice(0, 10);

  /* MORE FROM THE SAME MANUFACTURER */

  const brandProducts = product?.manufacturer
    ? products
        .filter(
          (item) =>
            Number(item.id) !== productId &&
            item.image &&
            (item.price !== undefined || item.oldPrice !== undefined) &&
            String(item.manufacturer || "")
              .trim()
              .toLowerCase() ===
              String(product.manufacturer).trim().toLowerCase(),
        )
        .slice(0, 10)
    : [];

  /* WISHLIST CHECK */

  const isProductWishlisted = (id) => {
    return (
      Array.isArray(wishlist) &&
      wishlist.some(
        (item) =>
          Number(item.id) === Number(id) && item.productType === "contact-lens",
      )
    );
  };

  /* TOGGLE WISHLIST */

  const toggleWishlist = (wishlistProduct) => {
    if (!wishlistProduct) return;

    try {
      const savedWishlist =
        JSON.parse(localStorage.getItem("lensmartWishlist")) || [];

      const safeWishlist = Array.isArray(savedWishlist) ? savedWishlist : [];
      const wishlistProductId = Number(wishlistProduct.id);

      const exists = safeWishlist.some(
        (item) =>
          Number(item.id) === wishlistProductId &&
          item.productType === "contact-lens",
      );

      let updatedWishlist;

      if (exists) {
        updatedWishlist = safeWishlist.filter(
          (item) =>
            !(
              Number(item.id) === wishlistProductId &&
              item.productType === "contact-lens"
            ),
        );
      } else {
        const price =
          wishlistProduct.price !== null && wishlistProduct.price !== undefined
            ? Number(wishlistProduct.price)
            : 0;

        const wishlistOldPrice =
          wishlistProduct.oldPrice !== null &&
          wishlistProduct.oldPrice !== undefined
            ? Number(wishlistProduct.oldPrice)
            : null;

        const newWishlistItem = {
          id: wishlistProductId,
          productType: "contact-lens",
          name: wishlistProduct.name || "",
          category: "Contact Lens",
          brand: wishlistProduct.brand || "",
          manufacturer: wishlistProduct.manufacturer || "",
          type: wishlistProduct.type || "",
          pack: wishlistProduct.pack || "",
          image: wishlistProduct.image,
          price,
          oldPrice: wishlistOldPrice,
          link: `/contact-lenses/${getSlug(wishlistProduct)}`,
        };

        updatedWishlist = [...safeWishlist, newWishlistItem];
      }

      localStorage.setItem("lensmartWishlist", JSON.stringify(updatedWishlist));

      setWishlist(updatedWishlist);

      if (Number(product.id) === wishlistProductId) {
        setIsWishlisted(!exists);
      }

      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      console.error("Wishlist update error:", error);
    }
  };

  /* ADD TO CART */

  const addToCart = async () => {
    if (adding) return;

    const { right, left } = eyes;

    if (!right.on && !left.on) {
      alert("Please select at least one eye.");
      return;
    }

    /* MANUAL VALIDATION */

    if (prescriptionMode === "manual") {
      const checks = [
        ["Right", right],
        ["Left", left],
      ];

      for (const [label, eye] of checks) {
        if (!eye.on) continue;

        if (!eye.power) {
          alert(`Please select ${label} Eye power.`);
          return;
        }

        if (isToric && !eye.cyl) {
          alert(`Please select ${label} Eye CYL.`);
          return;
        }

        if (isToric && !eye.axis) {
          alert(`Please select ${label} Eye AXIS.`);
          return;
        }

        if (isMultifocal && !eye.add) {
          alert(`Please select ${label} Eye ADD POWER.`);
          return;
        }
      }
    }

    /* UPLOAD VALIDATION */

    if (prescriptionMode === "upload" && !prescriptionFile) {
      alert("Please upload your prescription.");
      return;
    }

    setAdding(true);

    try {
      const manual = prescriptionMode === "manual";

      const buildEye = (eye, boxes) => ({
        selected: eye.on,
        quantity: boxes,
        power: manual ? eye.power : "",
        bc: manual ? eye.bc : "",
        dia: manual ? eye.dia : "",
        cyl: manual && isToric ? eye.cyl : "",
        axis: manual && isToric ? eye.axis : "",
        addPower: manual && isMultifocal ? eye.add : "",
      });

      const cartProduct = {
        id: product.id,
        variantId: product.variantId,
        productType: "contact-lens",
        name: product.name,
        category: "Contact Lens",
        brand: product.brand || "",
        manufacturer: product.manufacturer || "",
        type: product.type || "",
        pack: product.pack || "",
        lensKind,
        rightEye: buildEye(right, rightBoxes),
        leftEye: buildEye(left, leftBoxes),
        prescriber: { clinicName, doctorName, phone, city },
        prescriptionMode,
        prescriptionFileName: prescriptionFile ? prescriptionFile.name : "",
        link: `/contact-lenses/${product.slug}`,
      };

      /* Shopify cart me add (same product dobara add ho to purani entry replace) */
      const data = await addToShopifyCart(cartProduct);

      /* drawer: saare products, latest sabse upar */
      setDrawerItems([...(data.items || [])]);
      setLatestKey(data.addedKey || "");
      setCartDrawerOpen(true);
      setToast("Product added to cart.");
    } catch (error) {
      console.error("Cart error:", error);
      alert(error.message || "Could not add to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  /* REMOVE ITEM FROM DRAWER (and from cart) */

  const removeDrawerItem = async (key) => {
    try {
      const data = await removeCartItem(key);
      const nextItems = [...(data.items || [])];

      setDrawerItems(nextItems);

      if (nextItems.length === 0) setCartDrawerOpen(false);
    } catch (error) {
      console.error("Cart remove error:", error);
    }
  };

  /* =========================
     EYE CARD (fields + boxes)
  ========================= */

  const renderEyeCard = (side) => {
    const eye = eyes[side];
    const isRight = side === "right";
    const label = isRight ? "Right eye" : "Left eye";
    const isSynced = side === "left" && sameForBoth;

    return (
      <div
        className={`clp-eye-card ${eye.on ? "" : "off"} ${
          side === "left" && sameForBoth ? "synced" : ""
        }`}
        key={side}
      >
        {/* HEAD */}

        <div className="clp-eye-card-head">
          <h3>
            <span className={`clp-eye-dot ${side}`} />
            {label}
            <small>{isRight ? "(OD)" : "(OS)"}</small>
          </h3>

          <label className="clp-switch">
            <input
              type="checkbox"
              checked={eye.on}
              onChange={(event) => setEye(side, { on: event.target.checked })}
              aria-label={`Order ${label.toLowerCase()}`}
            />
            <span />
          </label>
        </div>

        {/* FIELDS */}

        <div className="clp-fields">
          {/* SPH / POWER */}

          <div
            className={`clp-field ${
              isToric || isMultifocal ? "span-3" : "span-6"
            }`}
          >
            <label className="clp-field-label" htmlFor={`${side}-power`}>
              SPH / Power
            </label>

            <PowerPicker
              id={`${side}-power`}
              title={`${label} · SPH / Power`}
              disabled={isSynced}
              powers={rxOptions.powers}
              value={eye.power}
              onChange={(value) => setEye(side, { power: value })}
            />
          </div>

          {/* CYL */}

          {isToric && (
            <div className="clp-field span-3">
              <label className="clp-field-label" htmlFor={`${side}-cyl`}>
                CYL
              </label>

              <PillSelect
                id={`${side}-cyl`}
                title={`${label} · CYL`}
                disabled={isSynced}
                value={eye.cyl}
                onChange={(value) => setEye(side, { cyl: value })}
                options={rxOptions.cyl}
              />
            </div>
          )}

          {/* ADD */}

          {isMultifocal && (
            <div className="clp-field span-3">
              <label className="clp-field-label" htmlFor={`${side}-add`}>
                ADD
              </label>

              <PillSelect
                id={`${side}-add`}
                title={`${label} · ADD`}
                disabled={isSynced}
                value={eye.add}
                onChange={(value) => setEye(side, { add: value })}
                options={rxOptions.add}
              />
            </div>
          )}

          {/* AXIS */}

          {isToric && (
            <div className="clp-field span-2">
              <label className="clp-field-label" htmlFor={`${side}-axis`}>
                AXIS
              </label>

              <PillSelect
                id={`${side}-axis`}
                title={`${label} · AXIS`}
                disabled={isSynced}
                value={eye.axis}
                onChange={(value) => setEye(side, { axis: value })}
                options={rxOptions.axis}
              />
            </div>
          )}

          {/* BC */}

          <div className={`clp-field ${isToric ? "span-2" : "span-3"}`}>
            <label className="clp-field-label" htmlFor={`${side}-bc`}>
              BC
            </label>

            <PillSelect
              id={`${side}-bc`}
              title={`${label} · BC`}
              disabled={isSynced}
              value={eye.bc}
              onChange={(value) => setEye(side, { bc: value })}
              options={rxOptions.bc}
            />
          </div>

          {/* DIA */}

          <div className={`clp-field ${isToric ? "span-2" : "span-3"}`}>
            <label className="clp-field-label" htmlFor={`${side}-dia`}>
              DIA
            </label>

            <PillSelect
              id={`${side}-dia`}
              title={`${label} · DIA`}
              disabled={isSynced}
              value={eye.dia}
              onChange={(value) => setEye(side, { dia: value })}
              options={rxOptions.dia}
            />
          </div>
        </div>

        {/* BOXES */}

        <div className="clp-eye-boxes">
          <span className="clp-field-label">Boxes</span>

          <div
            className="clp-quantity"
            role="group"
            aria-label={`${label} boxes`}
          >
            <button
              type="button"
              onClick={() => setEye(side, { qty: Math.max(1, eye.qty - 1) })}
              disabled={!eye.on || eye.qty <= 1}
              aria-label={`Decrease ${label} boxes`}
            >
              −
            </button>

            <div aria-live="polite">
              <strong>{eye.on ? eye.qty : 0}</strong>
              <span>{eye.on && eye.qty === 1 ? "Box" : "Boxes"}</span>
            </div>

            <button
              type="button"
              onClick={() => setEye(side, { qty: eye.qty + 1 })}
              disabled={!eye.on}
              aria-label={`Increase ${label} boxes`}
            >
              +
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* =========================
     CART DRAWER — PRESCRIPTION TABLE (per item)
  ========================= */

  const renderDrawerRx = (item) => {
    /* contact-lens ke alawa koi aur product ho to sirf quantity dikhao */
    if (!item.rightEye && !item.leftEye) {
      return (
        <p className="clp-drawer-simple-qty">
          Quantity: <strong>{item.quantity || 1}</strong>
        </p>
      );
    }

    const manual = item.prescriptionMode === "manual";
    const kind = item.lensKind;

    const rows = [
      ["right", "Right", item.rightEye],
      ["left", "Left", item.leftEye],
    ].filter(([, , eye]) => eye && eye.selected);

    const columns = [];

    if (manual) {
      columns.push(["Power", "power"]);
      if (kind === "Toric") {
        columns.push(["CYL", "cyl"]);
        columns.push(["Axis", "axis"]);
      }
      if (kind === "Multifocal") columns.push(["Add", "addPower"]);
      columns.push(["BC", "bc"]);
      columns.push(["DIA", "dia"]);
    }

    columns.push(["Boxes", "quantity"]);

    const template = {
      gridTemplateColumns: `62px repeat(${columns.length}, minmax(0, 1fr))`,
    };

    return (
      <>
        {!manual && (
          <p className="clp-drawer-upload-note">
            Prescription uploaded
            {item.prescriptionFileName ? `: ${item.prescriptionFileName}` : "."}
          </p>
        )}

        <div className="clp-drawer-rx">
          <div className="clp-drawer-rx-row head" style={template}>
            <span>Eye</span>

            {columns.map(([label]) => (
              <span key={label}>{label}</span>
            ))}
          </div>

          {rows.map(([side, label, eye]) => (
            <div className="clp-drawer-rx-row" style={template} key={side}>
              <span className="eye">
                <i className={`clp-eye-dot ${side}`} />
                {label}
              </span>

              {columns.map(([colLabel, key]) => (
                <strong key={colLabel}>
                  {key === "quantity" ? eye.quantity : eye[key] || "—"}
                </strong>
              ))}
            </div>
          ))}
        </div>
      </>
    );
  };

  /* =========================
     CART DRAWER — TOTALS (saare products ka)
  ========================= */

  const drawerTotals = drawerItems.reduce(
    (acc, item) => {
      const qty = Number(item.quantity || 1);
      const unit = Number(item.price || 0);
      const old = Number(item.oldPrice || 0);
      const mrpUnit = old > unit ? old : unit;

      acc.boxes += qty;
      acc.subtotal += unit * qty;
      acc.mrp += mrpUnit * qty;

      return acc;
    },
    { boxes: 0, subtotal: 0, mrp: 0 },
  );

  const drawerSaving = drawerTotals.mrp - drawerTotals.subtotal;
  const drawerHasSaving = drawerSaving > 0;
  const drawerSavingPercent = drawerHasSaving
    ? Math.round((drawerSaving / drawerTotals.mrp) * 100)
    : 0;

  /* =========================
     RETURN
  ========================= */

  return (
    <div className="clp-page">
      {/* BREADCRUMB */}

      <div className="clp-container">
        <nav className="clp-breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/all-products">Contact Lenses</Link>
          <span>/</span>
          <span>
  {product.name}
  {(product.packSize || product.pack) &&
    ` (${product.packSize || product.pack})`}
</span>
        </nav>
      </div>

      {/* MAIN PRODUCT */}

      <section className="clp-product-section">
        <div className="clp-container">
          <div className="clp-product-layout">
            {/* LEFT IMAGE */}

            <div className="clp-left">
              <div className="clp-image-card">
                {packLabel && (
                  <span className="clp-pack-badge">{packLabel}</span>
                )}

                <button
                  type="button"
                  className={`clp-heart ${isWishlisted ? "active" : ""}`}
                  onClick={() => toggleWishlist(product)}
                  aria-label={
                    isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                  aria-pressed={isWishlisted}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
                  </svg>
                </button>

                <img
                  src={gallery[activeImage] || gallery[0]}
                  alt={product.name}
                  className="clp-product-image"
                />
              </div>

              {/* THUMBNAILS */}

              {gallery.length > 1 && (
                <div className="clp-thumbnails">
                  {gallery.map((src, index) => (
                    <button
                      type="button"
                      key={`${src}-${index}`}
                      className={`clp-thumbnail ${
                        activeImage === index ? "active" : ""
                      }`}
                      onClick={() => setActiveImage(index)}
                      aria-label={`View image ${index + 1}`}
                      aria-pressed={activeImage === index}
                    >
                      <img src={src} alt={`${product.name} view ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}

              {/* CUSTOMER TRUST */}

              <ul className="clp-trust" aria-label="Why buy from us">
                {[
                  `100% Genuine ${
                    product.manufacturer || product.brand || ""
                  } Products`
                    .replace(/\s{2,}/g, " ")
                    .trim(),
                  "Manufacturer-sealed box",
                  "Secure Payments",
                  "Easy Prescription Verification",
                ].map((text) => (
                  <li key={text}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M8 12.4l2.7 2.7L16.2 9.6" />
                    </svg>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT */}

            <div className="clp-right">
              {product.brand && (
                <span className="clp-brand-line">{product.manufacturer}</span>
              )}

              <h1>
  {product.name}
  {(product.packSize || product.pack) && (
    <span className="clp-title-pack">
      {" "}({product.packSize || product.pack})
    </span>
  )}
</h1>

              {/* PRICE */}

              <div className="clp-price-area">
                <strong className="clp-current-price">
                  ₹{currentPrice.toLocaleString("en-IN")}
                </strong>

                <span className="clp-per-box">per box</span>

                {hasDiscount && (
                  <span className="clp-old-price">
                    ₹{oldPrice.toLocaleString("en-IN")}
                  </span>
                )}

                {hasDiscount && (
                  <span className="clp-discount">{discount}% OFF</span>
                )}
              </div>

              <p className="clp-tax">Inclusive of all taxes</p>

              {/* REPLACEMENT SCHEDULE · LENS TYPE · LENSES PER BOX */}

              <ul className="clp-specs" aria-label="Lens details">
                {scheduleLabel && (
                  <li className="clp-spec schedule">
                    <b>{scheduleLabel}</b>
                  </li>
                )}

                <li className="clp-spec schedule">
                  <b>{lensKind}</b>
                </li>

                {packLabel && (
                  <li className="clp-spec schedule">
                    <b>{packLabel}</b>
                  </li>
                )}
              </ul>

              <div className="clp-buy-box">
                {/* PRESCRIPTION BANNER */}

                <div className="clp-rx-banner">
                  <div className="clp-rx-banner-text">
                    <strong>
                      {prescriptionMode === "manual"
                        ? "Enter your contact-lens prescription"
                        : "Upload your contact-lens prescription"}
                    </strong>

                    <p>
                      {prescriptionMode === "manual"
                        ? "Use the values printed on your current lens box or valid prescription."
                        : "Upload a clear photo or PDF of your valid prescription."}
                    </p>
                  </div>

                  <div className="clp-rx-banner-actions">
                    <button
                      type="button"
                      className={`clp-rx-action ${
                        prescriptionMode === "manual" ? "active" : ""
                      }`}
                      onClick={() => setPrescriptionMode("manual")}
                      aria-pressed={prescriptionMode === "manual"}
                    >
                      Enter prescription manually
                    </button>

                    <button
                      type="button"
                      className={`clp-rx-action ${
                        prescriptionMode === "upload" ? "active" : ""
                      }`}
                      onClick={() => setPrescriptionMode("upload")}
                      aria-pressed={prescriptionMode === "upload"}
                    >
                      Upload instead
                    </button>
                  </div>
                </div>

                {/* SAME PRESCRIPTION FOR BOTH EYES */}

                {prescriptionMode === "manual" && (
                  <label className="clp-same-check">
                    <input
                      type="checkbox"
                      checked={sameForBoth}
                      onChange={(event) =>
                        handleSameForBoth(event.target.checked)
                      }
                    />

                    <span className="clp-same-box" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M5 12l5 5 9-10" />
                      </svg>
                    </span>

                    <span className="clp-same-text">
                      Same prescription for both eyes
                    </span>
                  </label>
                )}

                {/* MANUAL PRESCRIPTION — EYE CARDS (with boxes inside) */}

                {prescriptionMode === "manual" && (
                  <div className="clp-eye-cards">
                    {renderEyeCard("right")}
                    {renderEyeCard("left")}
                  </div>
                )}

                {/* UPLOAD PRESCRIPTION */}

                {prescriptionMode === "upload" && (
                  <>
                    {!prescriptionFile ? (
                      <div className="clp-upload-area">
                        <input
                          type="file"
                          id="prescription-file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(event) =>
                            setPrescriptionFile(event.target.files?.[0] || null)
                          }
                        />

                        <label htmlFor="prescription-file">
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 16V4M7 9l5-5 5 5M5 14v5h14v-5" />
                          </svg>

                          <strong>Upload Prescription</strong>
                          <span>JPG, PNG or PDF</span>
                        </label>
                      </div>
                    ) : (
                      <div className="clp-upload-done">
                        <div className="clp-upload-done-top">
                          <span className="clp-upload-check" aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                              <path d="M5 12l5 5 9-10" />
                            </svg>
                          </span>

                          <div className="clp-upload-done-text">
                            <strong>You have uploaded your prescription</strong>
                            <p>{prescriptionFile.name}</p>
                          </div>
                        </div>

                        <div className="clp-upload-done-actions">
                          <button
                            type="button"
                            className="clp-upload-remove"
                            onClick={() => setPrescriptionFile(null)}
                          >
                            Remove and add new
                          </button>

                          <button
                            type="button"
                            className="clp-upload-link"
                            onClick={() => setPrescriptionMode("manual")}
                          >
                            Enter prescription manually instead
                          </button>
                        </div>
                      </div>
                    )}

                    {/* In upload mode the eye cards are hidden,
                      so boxes are shown here */}

                    <div className="clp-eye-cards">
                      {["right", "left"].map((side) => {
                        const eye = eyes[side];
                        const isRight = side === "right";
                        const label = isRight ? "Right eye" : "Left eye";

                        return (
                          <div
                            className={`clp-eye-card ${eye.on ? "" : "off"}`}
                            key={side}
                          >
                            <div className="clp-eye-card-head">
                              <h3>
                                <span className={`clp-eye-dot ${side}`} />
                                {label}
                                <small>{isRight ? "(OD)" : "(OS)"}</small>
                              </h3>

                              <div className="clp-eye-head-right">
                                <span
                                  className="clp-eye-state"
                                  aria-hidden="true"
                                >
                                  {eye.on ? "Ordering" : "Not ordering"}
                                </span>

                                <label className="clp-switch">
                                  <input
                                    type="checkbox"
                                    checked={eye.on}
                                    onChange={(event) =>
                                      setEye(side, { on: event.target.checked })
                                    }
                                    aria-label={`Order ${label.toLowerCase()}`}
                                  />
                                  <span />
                                </label>
                              </div>
                            </div>

                            <div className="clp-eye-boxes">
                              <span className="clp-field-label">Boxes</span>

                              <div className="clp-quantity">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEye(side, {
                                      qty: Math.max(1, eye.qty - 1),
                                    })
                                  }
                                  disabled={!eye.on || eye.qty <= 1}
                                  aria-label={`Decrease ${label} boxes`}
                                >
                                  −
                                </button>

                                <div>
                                  <strong>{eye.on ? eye.qty : 0}</strong>
                                  <span>
                                    {eye.on && eye.qty === 1 ? "Box" : "Boxes"}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setEye(side, { qty: eye.qty + 1 })
                                  }
                                  disabled={!eye.on}
                                  aria-label={`Increase ${label} boxes`}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* PRESCRIBER */}

                <div className="clp-prescriber">
                  <button
                    type="button"
                    className="clp-prescriber-toggle"
                    onClick={() => setPrescriberOpen((previous) => !previous)}
                    aria-expanded={prescriberOpen}
                  >
                    <span className="clp-prescriber-plus">
                      {prescriberOpen ? "−" : "+"}
                    </span>

                    <strong>Prescriber details</strong>
                    <span className="clp-optional">(optional)</span>
                  </button>

                  {prescriberOpen && (
                    <div className="clp-prescriber-grid">
                      <label>
                        <span>CLINIC NAME</span>
                        <input
                          type="text"
                          value={clinicName}
                          onChange={(event) =>
                            setClinicName(event.target.value)
                          }
                          placeholder="e.g. Vision Care Clinic"
                        />
                      </label>

                      <label>
                        <span>DOCTOR NAME</span>
                        <input
                          type="text"
                          value={doctorName}
                          onChange={(event) =>
                            setDoctorName(event.target.value)
                          }
                          placeholder="e.g. Dr. Sharma"
                        />
                      </label>

                      <label>
                        <span>PHONE NO.</span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          placeholder="e.g. +91 98765 43210"
                        />
                      </label>

                      <label>
                        <span>CITY</span>
                        <input
                          type="text"
                          value={city}
                          onChange={(event) => setCity(event.target.value)}
                          placeholder="e.g. Ahmedabad"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* ADD TO CART */}

                <div className="clp-cta-bar">
                  <button
                    type="button"
                    className="clp-add-cart"
                    onClick={addToCart}
                    disabled={adding}
                  >
                    <strong>
                      {adding ? "Adding..." : "Add prescription to cart"}
                    </strong>

                    <span>
                      · {totalBoxes} {totalBoxes === 1 ? "box" : "boxes"} · ₹
                      {totalPrice.toLocaleString("en-IN")}
                    </span>
                  </button>
                </div>
              </div>
              {/* /clp-buy-box */}
            </div>
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}

      <ProductDescription
        productType="contact-lenses"
        product={product}
        lensKind={lensKind}
        scheduleLabel={scheduleLabel}
        packLabel={packLabel}
      />

      {/* SIMILAR PRODUCTS */}

      <SimilarProduct
        title="Similar Products You May Like"
        products={similarProducts}
        productType="contact-lenses"
        viewAllHref="/all-products"
        viewAllLabel="View All Lenses"
        getHref={(item) => `/contact-lenses/${item.slug}`}
        isWishlisted={(item) => isProductWishlisted(item.id)}
        onWishlistToggle={toggleWishlist}
        defaultRating={4.8}
        defaultReviews={95}
      />

      {/* MORE FROM MANUFACTURER */}

      <BrandProduct
        brand={product.manufacturer}
        products={brandProducts}
        productType="contact-lenses"
        viewAllHref="/all-products"
        viewAllLabel="View All Lenses"
        getHref={(item) => `/contact-lenses/${item.slug}`}
        isWishlisted={(item) => isProductWishlisted(item.id)}
        onWishlistToggle={toggleWishlist}
        defaultRating={4.8}
        defaultReviews={95}
      />

      {/* =========================
          CART DRAWER
      ========================= */}

      {cartDrawerOpen && drawerItems.length > 0 && (
        <>
          <div
            className="clp-cart-overlay"
            onClick={() => setCartDrawerOpen(false)}
          />

          <aside
            className="clp-cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Added to cart"
          >
            {/* HEADER */}

            <div className="clp-cart-drawer-header">
              <div className="clp-cart-drawer-title">
                <span className="clp-cart-drawer-tick" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 12l5 5 9-10" />
                  </svg>
                </span>

                <h2>Added to Cart</h2>

                <span className="clp-cart-drawer-count">
                  {drawerItems.length}{" "}
                  {drawerItems.length === 1 ? "item" : "items"}
                </span>
              </div>

              <button
                type="button"
                className="clp-cart-close"
                onClick={() => setCartDrawerOpen(false)}
                aria-label="Close cart"
              >
                ×
              </button>
            </div>

            {/* BODY — saare products, latest sabse upar */}

            <div className="clp-cart-drawer-body">
              {drawerItems.map((item, index) => {
                const key = cartItemKey(item);
                const isLatest = key === latestKey;

                const unit = Number(item.price || 0);
                const old = Number(item.oldPrice || 0);
                const hasOff = old > unit;
                const off = hasOff ? Math.round(((old - unit) / old) * 100) : 0;

                return (
                  <div
                    className={`clp-drawer-item ${isLatest ? "latest" : ""}`}
                    key={`${key}-${index}`}
                  >
                    {/* PRODUCT */}

                    <div className="clp-drawer-product">
                      <div className="clp-drawer-image">
                        <img
                          src={item.image?.src || item.image}
                          alt={item.name}
                        />
                      </div>

                      <div className="clp-drawer-product-info">
                        {item.brand && (
                          <span className="clp-drawer-brand">{item.brand}</span>
                        )}

                        <h3>{item.name}</h3>

                        <div className="clp-drawer-price">
                          <strong>{formatINR(unit)}</strong>

                          {hasOff && <del>{formatINR(old)}</del>}

                          {hasOff && (
                            <span className="clp-drawer-discount">
                              {off}% OFF
                            </span>
                          )}

                          <small>/ box</small>
                        </div>

                        <div className="clp-drawer-tags">
                          {item.pack && (
                            <span className="clp-drawer-pack">
                              {formatPack(item.pack)}
                            </span>
                          )}

                          {item.type && (
                            <span className="clp-drawer-pack alt">
                              {item.type}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="clp-drawer-remove"
                        onClick={() => removeDrawerItem(key)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3" />
                        </svg>
                      </button>
                    </div>

                    {/* PRESCRIPTION */}

                    <div className="clp-drawer-section">
                      <h4>Prescription</h4>

                      {renderDrawerRx(item)}
                    </div>

                    {/* ITEM TOTAL */}

                    <div className="clp-drawer-item-total">
                      <span>
                        {Number(item.quantity || 1)}{" "}
                        {Number(item.quantity || 1) === 1 ? "box" : "boxes"}
                      </span>

                      <strong>
                        {formatINR(unit * Number(item.quantity || 1))}
                      </strong>
                    </div>
                  </div>
                );
              })}

              {/* PRICE BREAKDOWN (saare products ka) */}

              <div className="clp-drawer-breakdown">
                <div>
                  <span>Total boxes</span>
                  <strong>{drawerTotals.boxes}</strong>
                </div>

                {drawerHasSaving && (
                  <div>
                    <span>MRP total</span>
                    <del>{formatINR(drawerTotals.mrp)}</del>
                  </div>
                )}

                {drawerHasSaving && (
                  <div className="saving">
                    <span>Discount ({drawerSavingPercent}% OFF)</span>
                    <strong>− {formatINR(drawerSaving)}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* FOOTER */}

            <div className="clp-cart-drawer-footer">
              <div className="clp-drawer-subtotal">
                <div>
                  <span>Subtotal</span>
                  <small>Inclusive of all taxes</small>
                </div>

                <strong>{formatINR(drawerTotals.subtotal)}</strong>
              </div>

              <div className="clp-drawer-actions">
                <button
                  type="button"
                  className="clp-continue-shopping"
                  onClick={() => setCartDrawerOpen(false)}
                >
                  Continue Shopping
                </button>

                <Link
                  href="/cart"
                  className="clp-view-cart"
                  onClick={() => setCartDrawerOpen(false)}
                >
                  View Cart
                </Link>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* TOAST */}

      <div
        className={`clp-toast ${toast ? "show" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
    </div>
  );
}