"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import "../../../styles/sunglassesProductDetails.css";
import SimilarProduct from "@/components/SimilarProduct";
import BrandProduct from "@/components/BrandProduct";
import ProductDescription from "@/components/ProductDescription";

import ProductNotFound from "@/components/ProductNotFound";

/* =========================================================
   PRODUCT DATA
========================================================= */

const products = [
  {
    id: 1,
    brand: "VOGUE",
    name: "Classic Rectangle Sunglasses",
    category: "Men",
    shape: "Rectangle",
    material: "Acetate",
    frameSize: "M",
    price: 1299,
    oldPrice: 1799,
    badge: "New",
    description:
      "A classic rectangle sunglasses frame designed for a clean and modern everyday look.",
    colors: [
      { name: "Black", value: "#222222", image: "/images/sunglasses1.png" },
      { name: "Brown", value: "#795548", image: "/images/sunglasses1.png" },
      { name: "Tortoise", value: "#8b5e3c", image: "/images/sunglasses1.png" },
      { name: "Gold", value: "#c8a951", image: "/images/sunglasses1.png" },
    ],
    images: [
      "/images/sunglasses1.png",
      "/images/sunglasses1.png",
      "/images/sunglasses1.png",
    ],
  },

  {
    id: 2,
    brand: "RAY-BAN",
    name: "Premium Round Sunglasses",
    category: "Women",
    shape: "Round",
    material: "Metal",
    frameSize: "M",
    price: 1499,
    oldPrice: 1999,
    badge: "Popular",
    description:
      "Premium round sunglasses with a lightweight frame and a stylish everyday design.",
    colors: [
      { name: "Brown", value: "#795548", image: "/images/sunglasses2.png" },
      { name: "Black", value: "#222222", image: "/images/sunglasses2.png" },
      { name: "Gold", value: "#c8a951", image: "/images/sunglasses2.png" },
      { name: "Crystal", value: "#eeeeee", image: "/images/sunglasses2.png" },
    ],
    images: [
      "/images/sunglasses2.png",
      "/images/sunglasses2.png",
      "/images/sunglasses2.png",
    ],
  },

  {
    id: 3,
    brand: "VOGUE",
    name: "Modern Square Sunglasses",
    category: "Men",
    shape: "Square",
    material: "TR90",
    frameSize: "L",
    price: 1199,
    oldPrice: 1699,
    badge: "",
    description:
      "Modern square sunglasses with a clean profile and comfortable everyday frame.",
    colors: [
      { name: "Black", value: "#222222", image: "/images/sunglasses3.png" },
      { name: "Blue", value: "#315c9e", image: "/images/sunglasses3.png" },
      { name: "Silver", value: "#b7b7b7", image: "/images/sunglasses3.png" },
    ],
    images: [
      "/images/sunglasses3.png",
      "/images/sunglasses3.png",
      "/images/sunglasses3.png",
    ],
  },

  {
    id: 4,
    brand: "LENS MART",
    name: "Elegant Cat-Eye Sunglasses",
    category: "Women",
    shape: "Cat-Eye",
    material: "Acetate",
    frameSize: "S",
    price: 1599,
    oldPrice: 2199,
    badge: "Best Seller",
    description:
      "Elegant cat-eye sunglasses created for a stylish and contemporary look.",
    colors: [
      { name: "Tortoise", value: "#8b5e3c", image: "/images/sunglasses4.png" },
      { name: "Black", value: "#222222", image: "/images/sunglasses4.png" },
      { name: "Brown", value: "#795548", image: "/images/sunglasses4.png" },
      { name: "Gold", value: "#c8a951", image: "/images/sunglasses4.png" },
    ],
    images: [
      "/images/sunglasses4.png",
      "/images/sunglasses4.png",
      "/images/sunglasses4.png",
    ],
  },

  {
    id: 5,
    brand: "LENS MART",
    name: "Kids Flexible Sunglasses",
    category: "Kids",
    shape: "Rectangle",
    material: "TR90",
    frameSize: "XS",
    price: 999,
    oldPrice: 1399,
    badge: "",
    description:
      "Lightweight flexible sunglasses designed for comfortable everyday use.",
    colors: [
      { name: "Blue", value: "#315c9e", image: "/images/sunglasses5.png" },
      { name: "Black", value: "#222222", image: "/images/sunglasses5.png" },
      { name: "Crystal", value: "#eeeeee", image: "/images/sunglasses5.png" },
    ],
    images: [
      "/images/sunglasses5.png",
      "/images/sunglasses5.png",
      "/images/sunglasses5.png",
    ],
  },

  {
    id: 6,
    brand: "VOGUE",
    name: "Crystal Oval Sunglasses",
    category: "Women",
    shape: "Oval",
    material: "Acetate",
    frameSize: "M",
    price: 1399,
    oldPrice: 1899,
    badge: "",
    description:
      "Clean oval sunglasses with a lightweight construction and modern finish.",
    colors: [
      { name: "Crystal", value: "#eeeeee", image: "/images/sunglasses6.png" },
      { name: "Brown", value: "#795548", image: "/images/sunglasses6.png" },
      { name: "Black", value: "#222222", image: "/images/sunglasses6.png" },
    ],
    images: [
      "/images/sunglasses6.png",
      "/images/sunglasses6.png",
      "/images/sunglasses6.png",
    ],
  },

  {
    id: 7,
    brand: "LENS MART",
    name: "Geometric Metal Sunglasses",
    category: "Men",
    shape: "Geometric",
    material: "Metal",
    frameSize: "M",
    price: 1699,
    oldPrice: 2299,
    badge: "New",
    description:
      "Geometric metal sunglasses with a minimal and contemporary design.",
    colors: [
      { name: "Gold", value: "#c8a951", image: "/images/sunglasses7.png" },
      { name: "Silver", value: "#b7b7b7", image: "/images/sunglasses7.png" },
      { name: "Black", value: "#222222", image: "/images/sunglasses7.png" },
    ],
    images: [
      "/images/sunglasses7.png",
      "/images/sunglasses7.png",
      "/images/sunglasses7.png",
    ],
  },

  {
    id: 8,
    brand: "RAY-BAN",
    name: "Classic Aviator Sunglasses",
    category: "Men",
    shape: "Aviator",
    material: "Metal",
    frameSize: "L",
    price: 1799,
    oldPrice: 2499,
    badge: "",
    description:
      "Classic aviator sunglasses with a lightweight metal frame and timeless profile.",
    colors: [
      { name: "Silver", value: "#b7b7b7", image: "/images/sunglasses8.png" },
      { name: "Gold", value: "#c8a951", image: "/images/sunglasses8.png" },
      { name: "Black", value: "#222222", image: "/images/sunglasses8.png" },
    ],
    images: [
      "/images/sunglasses8.png",
      "/images/sunglasses8.png",
      "/images/sunglasses8.png",
    ],
  },

  {
    id: 9,
    brand: "VOGUE",
    name: "Minimal Round Sunglasses",
    category: "Women",
    shape: "Round",
    material: "Metal",
    frameSize: "S",
    price: 1899,
    oldPrice: 2599,
    badge: "Trending",
    description:
      "Minimal round sunglasses with a clean profile and lightweight everyday feel.",
    colors: [
      { name: "Gold", value: "#c8a951", image: "/images/sunglasses9.png" },
      { name: "Black", value: "#222222", image: "/images/sunglasses9.png" },
      { name: "Silver", value: "#b7b7b7", image: "/images/sunglasses9.png" },
    ],
    images: [
      "/images/sunglasses9.png",
      "/images/sunglasses9.png",
      "/images/sunglasses9.png",
    ],
  },
];

/* =========================================================
   ICONS
========================================================= */

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
  </svg>
);

const CartIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 4h2l2.3 11.2h10.8L21 8H6" />
    <circle cx="9" cy="20" r="1.3" />
    <circle cx="18" cy="20" r="1.3" />
  </svg>
);

const TruckIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 5h11v11H3Z" />
    <path d="M14 9h4l3 4v3h-7Z" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="18" cy="18" r="2" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 3 20 6v5c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 7v5h-5" />
    <path d="M19 12a7 7 0 1 0-2 5" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

const LensIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="8" />
    <path d="M8 10a5 5 0 0 1 4-2.5" />
  </svg>
);

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m5 12 4 4L19 6" />
  </svg>
);

/* =========================================================
   LENS OPTIONS (placeholder prices - replace with your own)
========================================================= */
const lensOptions = [
  {
    id: "standard",
    name: "Standard UV400",
    note: "Tinted lenses with full UV protection, as shown.",
    price: 0,
  },
  {
    id: "polarized",
    name: "Polarized UV400",
    note: "Cuts glare for driving, water and outdoor days.",
    price: 499,
    tag: "Popular",
  },
  {
    id: "rx-tinted",
    name: "Prescription Tinted",
    note: "Your power with tinted sun lenses.",
    price: 999,
  },
  {
    id: "rx-polarized",
    name: "Prescription Polarized",
    note: "Your power with glare-free polarized lenses.",
    price: 1499,
  },
];

const sizeGuide = [
  { size: "XS", lens: "46 mm", bridge: "17 mm", temple: "135 mm" },
  { size: "S", lens: "49 mm", bridge: "18 mm", temple: "138 mm" },
  { size: "M", lens: "52 mm", bridge: "18 mm", temple: "140 mm" },
  { size: "L", lens: "54 mm", bridge: "19 mm", temple: "142 mm" },
  { size: "XL", lens: "57 mm", bridge: "20 mm", temple: "145 mm" },
];

/* =========================================================
   PAGE
========================================================= */
export default function SunglassesProductPage() {
  const params = useParams();
  const productId = Number(params.id);

  const product = products.find((item) => item.id === productId);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [pincode, setPincode] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");

  /* NEW UI STATE */
  const [lensOpen, setLensOpen] = useState(false);
  const [selectedLens, setSelectedLens] = useState(null);
  const [draftLens, setDraftLens] = useState("standard");
  const [guideOpen, setGuideOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [toast, setToast] = useState("");
  const [wishlist, setWishlist] = useState([]);

  /* =========================================================
     DEFAULT VALUES
  ========================================================= */

  useEffect(() => {
    if (!product) return;

    setSelectedImage(product.images[0]);
    setSelectedColor(product.colors[0]?.name || "");
    setSelectedSize(product.frameSize || "M");
    setQuantity(1);
    setSelectedLens(null);
  }, [product]);

  /* =========================================================
     CHECK WISHLIST
  ========================================================= */

  useEffect(() => {
    if (!product) return;

    try {
      const savedWishlist =
        JSON.parse(localStorage.getItem("lensmartWishlist")) || [];

      const exists = savedWishlist.some(
        (item) => item.id === product.id && item.productType === "sunglasses",
      );

      setIsWishlisted(exists);
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  }, [product]);

  /* KEEP FULL WISHLIST IN SYNC (for the product rows below) */

  useEffect(() => {
    const syncWishlist = () => {
      try {
        const saved =
          JSON.parse(localStorage.getItem("lensmartWishlist")) || [];
        setWishlist(Array.isArray(saved) ? saved : []);
      } catch (error) {
        setWishlist([]);
      }
    };

    syncWishlist();
    window.addEventListener("wishlistUpdated", syncWishlist);
    window.addEventListener("storage", syncWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", syncWishlist);
      window.removeEventListener("storage", syncWishlist);
    };
  }, []);

  /* =========================================================
     OVERLAYS: ESC TO CLOSE + LOCK BACKGROUND SCROLL
  ========================================================= */

  useEffect(() => {
    const anyOpen = lensOpen || guideOpen;

    const onKey = (event) => {
      if (event.key === "Escape") {
        setLensOpen(false);
        setGuideOpen(false);
      }
    };

    document.body.style.overflow = anyOpen ? "hidden" : "";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lensOpen, guideOpen]);

  /* =========================================================
     TOAST AUTO HIDE
  ========================================================= */

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  /* =========================================================
     NOT FOUND
  ========================================================= */

  if (!product) {
    return <ProductNotFound category="sunglasses" />;
  }

  /* =========================================================
     DISCOUNT
  ========================================================= */

  const discount =
    product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100,
        )
      : 0;

  const savings = product.oldPrice - product.price;
  const lensPrice = selectedLens ? selectedLens.price : 0;
  const totalPrice = (product.price + lensPrice) * quantity;

  /* =========================================================
     COLOR
  ========================================================= */

  const handleColorSelect = (color) => {
    setSelectedColor(color.name);

    if (color.image) {
      setSelectedImage(color.image);
    }
  };

  /* =========================================================
     LENS DRAWER
  ========================================================= */

  const openLens = () => {
    setDraftLens(selectedLens ? selectedLens.id : "standard");
    setLensOpen(true);
  };

  const applyLens = () => {
    const option = lensOptions.find((item) => item.id === draftLens);

    setSelectedLens(
      option
        ? { id: option.id, name: option.name, price: option.price }
        : null,
    );
    setLensOpen(false);
  };

  /* =========================================================
     WISHLIST
  ========================================================= */

  const toggleWishlist = () => {
    try {
      const savedWishlist =
        JSON.parse(localStorage.getItem("lensmartWishlist")) || [];

      const exists = savedWishlist.some(
        (item) => item.id === product.id && item.productType === "sunglasses",
      );

      let updatedWishlist;

      if (exists) {
        updatedWishlist = savedWishlist.filter(
          (item) =>
            !(item.id === product.id && item.productType === "sunglasses"),
        );

        setIsWishlisted(false);
        setToast("Removed from wishlist");
      } else {
        const wishlistProduct = {
          id: product.id,
          productType: "sunglasses",
          brand: product.brand,
          name: product.name,
          category: "Sunglasses",
          image: selectedImage || product.images[0],
          price: product.price,
          oldPrice: product.oldPrice,
          selectedColor,
          selectedSize,
          link: `/sunglasses/${product.id}`,
        };

        updatedWishlist = [...savedWishlist, wishlistProduct];

        setIsWishlisted(true);
        setToast("Saved to wishlist");
      }

      localStorage.setItem("lensmartWishlist", JSON.stringify(updatedWishlist));

      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  /* =========================================================
     SIMILAR + SAME-BRAND PRODUCTS
  ========================================================= */

  const sameBrand = (a, b) =>
    String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();

  /* shape the page's product into what LensesProductCard expects */
  const toCardProduct = (item) => ({
    id: item.id,
    name: item.name,
    brand: item.brand,
    category: item.category,
    badge: item.badge,
    image: item.images?.[0] || item.colors?.[0]?.image,
    price: item.price,
    oldPrice: item.oldPrice,
  });

  /* same shape / category first, then everything else */
  const similarProducts = products
    .filter((item) => item.id !== product.id)
    .map((item) => ({
      item,
      score:
        (item.shape === product.shape ? 2 : 0) +
        (item.category === product.category ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ item }) => toCardProduct(item));

  const brandProducts = products
    .filter((item) => item.id !== product.id && sameBrand(item.brand, product.brand))
    .map(toCardProduct);

  const isProductWishlisted = (item) =>
    wishlist.some(
      (saved) =>
        Number(saved.id) === Number(item.id) &&
        saved.productType === "sunglasses",
    );

  const toggleCardWishlist = (item) => {
    if (!item) return;

    try {
      const saved =
        JSON.parse(localStorage.getItem("lensmartWishlist")) || [];
      const list = Array.isArray(saved) ? saved : [];
      const id = Number(item.id);

      const exists = list.some(
        (entry) => Number(entry.id) === id && entry.productType === "sunglasses",
      );

      const updated = exists
        ? list.filter(
            (entry) =>
              !(Number(entry.id) === id && entry.productType === "sunglasses"),
          )
        : [
            ...list,
            {
              id,
              productType: "sunglasses",
              brand: item.brand,
              name: item.name,
              category: "Sunglasses",
              image: item.image,
              price: item.price,
              oldPrice: item.oldPrice,
              link: `/sunglasses/${id}`,
            },
          ];

      localStorage.setItem("lensmartWishlist", JSON.stringify(updated));
      setWishlist(updated);
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  /* =========================================================
     ADD TO CART
  ========================================================= */

  const addToCart = () => {
    try {
      const savedCart =
        JSON.parse(localStorage.getItem("lensmartCart")) || [];

      const lensId = selectedLens ? selectedLens.id : null;

      // frame + lens ki price (1 piece)
      const unitPrice = product.price + lensPrice;
      const unitOldPrice = product.oldPrice + lensPrice;

      const existingIndex = savedCart.findIndex(
        (item) =>
          item.id === product.id &&
          item.productType === "sunglasses" &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize &&
          ((item.selectedLens && item.selectedLens.id) || null) === lensId,
      );

      const updatedCart = [...savedCart];

      if (existingIndex !== -1) {
        // purana item hata ke refresh karke last me daalo (latest)
        const old = updatedCart.splice(existingIndex, 1)[0];

        updatedCart.push({
          ...old,
          brand: product.brand,
          price: unitPrice,
          oldPrice: unitOldPrice,
          framePrice: product.price,
          lensPrice,
          quantity: Number(old.quantity || 1) + quantity,
        });
      } else {
        updatedCart.push({
          id: product.id,
          productType: "sunglasses",
          brand: product.brand,
          name: product.name,
          category: "Sunglasses",
          image: selectedImage || product.images[0],
          price: unitPrice,
          oldPrice: unitOldPrice,
          framePrice: product.price,
          lensPrice,
          selectedColor,
          selectedSize,
          selectedLens,
          quantity,
          link: `/sunglasses/${product.id}`,
        });
      }

      localStorage.setItem("lensmartCart", JSON.stringify(updatedCart));

      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("openCartDrawer"));

      setToast("Product added to cart.");
    } catch (error) {
      console.error("Cart error:", error);
    }
  };

  /* =========================================================
     PINCODE
  ========================================================= */

  const checkDelivery = () => {
    const cleanPincode = pincode.trim();

    if (!/^[0-9]{6}$/.test(cleanPincode)) {
      setDeliveryMessage("Please enter a valid 6-digit pincode.");
      return;
    }

    setDeliveryMessage(
      "Pincode entered successfully. Delivery availability will be confirmed at checkout.",
    );
  };

  const handleZoomMove = (event) => {
    const box = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * 100;
    const y = ((event.clientY - box.top) / box.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };

  const sizeNames = {
    XS: "Extra Small",
    S: "Small",
    M: "Medium",
    L: "Large",
    XL: "Extra Large",
  };

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <div className="sundetail-page">
      {/* BREADCRUMB */}

      <div className="sundetail-container">
        <nav className="sundetail-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/sunglasses">Sunglasses</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>
      </div>

      {/* PRODUCT AREA */}

      <section className="sundetail-product-section">
        <div className="sundetail-container">
          <div className="sundetail-product-layout">
            {/* LEFT SIDE */}

            <div className="sundetail-gallery">
              <div
                className={`sundetail-main-image ${zoomed ? "zoomed" : ""}`}
                onClick={() => setZoomed((previous) => !previous)}
                onMouseMove={zoomed ? handleZoomMove : undefined}
                onMouseLeave={() => setZoomed(false)}
              >
                {product.badge && (
                  <span className="sundetail-badge">{product.badge}</span>
                )}

                <button
                  type="button"
                  className={`sundetail-image-heart ${
                    isWishlisted ? "active" : ""
                  }`}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleWishlist();
                  }}
                  aria-label="Wishlist"
                  aria-pressed={isWishlisted}
                >
                  <HeartIcon />
                </button>

                <img
                  src={selectedImage || product.images[0]}
                  alt={product.name}
                  style={{ transformOrigin: zoomOrigin }}
                />

                <span className="sundetail-image-note">
                  {zoomed ? "Click to zoom out" : "Click image to zoom"}
                </span>
              </div>

              <div className="sundetail-thumbnails">
                {product.images.map((image, index) => (
                  <button
                    type="button"
                    key={`${image}-${index}`}
                    className={`sundetail-thumbnail ${
                      selectedImage === image && index === 0 ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(image)}
                    aria-label={`View ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                    />
                  </button>
                ))}
              </div>

              <div className="sundetail-gallery-features">
                <div>
                  <TruckIcon />
                  <span>
                    <strong>Fast Delivery</strong>
                    <small>Check availability</small>
                  </span>
                </div>

                <div>
                  <RefreshIcon />
                  <span>
                    <strong>Easy Replacement</strong>
                    <small>Subject to policy</small>
                  </span>
                </div>

                <div>
                  <ShieldIcon />
                  <span>
                    <strong>Quality Eyewear</strong>
                    <small>Shop with confidence</small>
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}

            <div className="sundetail-info">
              <h3>{product.brand}</h3>

              <h1>{product.name}</h1>

              <div className="sundetail-product-meta">
                <span>{product.category}</span>
                <span>{product.shape}</span>
              </div>

              <p className="sundetail-description">{product.description}</p>

              <div className="sundetail-price-row">
                <strong className="sundetail-price">
                  ₹{product.price.toLocaleString("en-IN")}
                </strong>

                <span className="sundetail-old-price">
                  ₹{product.oldPrice.toLocaleString("en-IN")}
                </span>

                {discount > 0 && (
                  <span className="sundetail-discount">{discount}% OFF</span>
                )}
              </div>

              <p className="sundetail-tax">
                Inclusive of all taxes
                {savings > 0 &&
                  ` · You save ₹${savings.toLocaleString("en-IN")}`}
              </p>

              <div className="sundetail-divider" />

              {/* FRAME COLOR */}

              <div className="sundetail-selection">
                <div className="sundetail-selection-title">
                  <span>Frame Color</span>
                  <strong>{selectedColor}</strong>
                </div>

                <div className="sundetail-color-list">
                  {product.colors.map((color) => (
                    <button
                      type="button"
                      key={color.name}
                      className={`sundetail-color-option ${
                        selectedColor === color.name ? "active" : ""
                      }`}
                      onClick={() => handleColorSelect(color)}
                      aria-pressed={selectedColor === color.name}
                    >
                      <span
                        className="sundetail-color-dot"
                        style={{ backgroundColor: color.value }}
                      />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* FRAME SIZE */}

              <div className="sundetail-selection">
                <div className="sundetail-selection-title">
                  <span>Frame Size</span>

                  <button
                    type="button"
                    className="sundetail-size-guide"
                    onClick={() => setGuideOpen(true)}
                  >
                    Size Guide
                  </button>
                </div>

                <div className="sundetail-size-list">
                  {["XS", "S", "M", "L", "XL"].map((size) => (
                    <button
                      type="button"
                      key={size}
                      className={selectedSize === size ? "active" : ""}
                      onClick={() => setSelectedSize(size)}
                      aria-pressed={selectedSize === size}
                    >
                      <strong>{size}</strong>
                      <small>{sizeNames[size]}</small>
                    </button>
                  ))}
                </div>
              </div>

              {/* LENS CTA - OPENS DRAWER / FLOATING WINDOW */}

              <button
                type="button"
                className={`sundetail-lens-card ${selectedLens ? "selected" : ""}`}
                onClick={openLens}
                aria-haspopup="dialog"
              >
                <span className="sundetail-lens-icon">
                  {selectedLens ? <CheckIcon /> : <LensIcon />}
                </span>

                <span className="sundetail-lens-text">
                  <span className="sundetail-step">
                    {selectedLens ? "LENSES ADDED" : "NEXT STEP"}
                  </span>
                  <h3>
                    {selectedLens ? selectedLens.name : "Choose your lenses"}
                  </h3>
                  <p>
                    {selectedLens
                      ? `+ ₹${selectedLens.price.toLocaleString("en-IN")} per pair · Tap to change`
                      : "Add lenses to your frame, or buy frame only."}
                  </p>
                </span>

                <span className="sundetail-lens-arrow">→</span>
              </button>

              {/* QUANTITY + CART */}

              <div className="sundetail-buy-row">
                <div className="sundetail-quantity">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((previous) => Math.max(1, previous - 1))
                    }
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    onClick={() => setQuantity((previous) => previous + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="sundetail-cart-button"
                  onClick={addToCart}
                >
                  <CartIcon />
                  Add to Cart
                  <span className="sundetail-cart-total">
                    · ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </button>
              </div>

              {/* DELIVERY */}

              <div className="sundetail-delivery">
                <div className="sundetail-delivery-heading">
                  <TruckIcon />

                  <div>
                    <strong>Check delivery</strong>
                    <span>Enter your 6-digit pincode</span>
                  </div>
                </div>

                <div className="sundetail-pincode">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={pincode}
                    onChange={(event) =>
                      setPincode(event.target.value.replace(/\D/g, ""))
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") checkDelivery();
                    }}
                    placeholder="Enter pincode"
                    aria-label="Delivery pincode"
                  />

                  <button type="button" onClick={checkDelivery}>
                    CHECK
                  </button>
                </div>

                {deliveryMessage && (
                  <p
                    className={`sundetail-delivery-message ${
                      /^Please/.test(deliveryMessage) ? "error" : "ok"
                    }`}
                  >
                    {deliveryMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT INFORMATION */}

      <ProductDescription
        productType="sunglasses"
        product={product}
        selectedSize={selectedSize}
      />

      {/* BOTTOM FEATURES */}

      <section className="sundetail-bottom-features">
        <div className="sundetail-container">
          <div className="sundetail-bottom-grid">
            <div>
              <TruckIcon />
              <span>
                <strong>Fast Delivery</strong>
                <small>Check delivery by pincode</small>
              </span>
            </div>

            <div>
              <RefreshIcon />
              <span>
                <strong>Easy Replacement</strong>
                <small>Subject to store policy</small>
              </span>
            </div>

            <div>
              <ShieldIcon />
              <span>
                <strong>Secure Shopping</strong>
                <small>Simple checkout experience</small>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SIMILAR PRODUCTS */}

      <SimilarProduct
        title="Similar Products You May Like"
        products={similarProducts}
        productType="sunglasses"
        viewAllHref="/sunglasses"
        viewAllLabel="View All Sunglasses"
        getHref={(item) => `/sunglasses/${item.id}`}
        isWishlisted={isProductWishlisted}
        onWishlistToggle={toggleCardWishlist}
        defaultRating={4.8}
        defaultReviews={95}
      />

      {/* MORE FROM BRAND 

      <BrandProduct
        brand={product.brand}
        products={brandProducts}
        productType="sunglasses"
        getHref={(item) => `/sunglasses/${item.id}`}
        isWishlisted={isProductWishlisted}
        onWishlistToggle={toggleCardWishlist}
        defaultRating={4.8}
        defaultReviews={95}
      />
      */}

      {/* MOBILE STICKY BAR */}

      <div className="sundetail-sticky-bar">
        <div>
          <strong>₹{totalPrice.toLocaleString("en-IN")}</strong>
          <small>Inclusive of taxes</small>
        </div>

        <button type="button" onClick={addToCart}>
          <CartIcon />
          Add to Cart
        </button>
      </div>

      {/* OVERLAY */}

      <div
        className={`sundetail-overlay ${lensOpen || guideOpen ? "show" : ""}`}
        onClick={() => {
          setLensOpen(false);
          setGuideOpen(false);
        }}
      />

      {/* LENS DRAWER (tablet/desktop) / FLOATING WINDOW (mobile) */}

      <aside
        className={`sundetail-lens-panel ${lensOpen ? "show" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Choose your lenses"
        aria-hidden={!lensOpen}
      >
        <div className="sundetail-panel-header">
          <div>
            <h3>Choose your lenses</h3>
            <p>{product.name}</p>
          </div>

          <button
            type="button"
            className="sundetail-panel-close"
            onClick={() => setLensOpen(false)}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="sundetail-panel-body">
          {lensOptions.map((option) => (
            <button
              type="button"
              key={option.id}
              className={`sundetail-lens-option ${
                draftLens === option.id ? "active" : ""
              }`}
              onClick={() => setDraftLens(option.id)}
              aria-pressed={draftLens === option.id}
            >
              <span className="sundetail-radio" />

              <span className="sundetail-lens-option-text">
                <strong>
                  {option.name}
                  {option.tag && <em>{option.tag}</em>}
                </strong>
                <small>{option.note}</small>
              </span>

              <b>
                {option.price
                  ? `+ ₹${option.price.toLocaleString("en-IN")}`
                  : "Free"}
              </b>
            </button>
          ))}
        </div>

        <div className="sundetail-panel-footer">
          <div className="sundetail-panel-total">
            <span>Total per pair</span>
            <strong>
              ₹
              {(
                product.price +
                (lensOptions.find((item) => item.id === draftLens)?.price || 0)
              ).toLocaleString("en-IN")}
            </strong>
          </div>

          <button type="button" onClick={applyLens}>
            Apply
          </button>
        </div>
      </aside>

      {/* SIZE GUIDE MODAL */}

      <div
        className={`sundetail-modal ${guideOpen ? "show" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Size guide"
        aria-hidden={!guideOpen}
      >
        <button
          type="button"
          className="sundetail-panel-close sundetail-modal-close"
          onClick={() => setGuideOpen(false)}
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <h3>Frame size guide</h3>
        <p>
          Check the numbers printed inside your current frame, e.g. 52-18-140.
        </p>

        <div className="sundetail-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Size</th>
                <th>Lens width</th>
                <th>Bridge</th>
                <th>Temple</th>
              </tr>
            </thead>
            <tbody>
              {sizeGuide.map((row) => (
                <tr
                  key={row.size}
                  className={selectedSize === row.size ? "active" : ""}
                  onClick={() => {
                    setSelectedSize(row.size);
                    setGuideOpen(false);
                  }}
                >
                  <td>{row.size}</td>
                  <td>{row.lens}</td>
                  <td>{row.bridge}</td>
                  <td>{row.temple}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOAST */}

      <div className={`sundetail-toast ${toast ? "show" : ""}`} role="status">
        {toast}
      </div>
    </div>
  );
}