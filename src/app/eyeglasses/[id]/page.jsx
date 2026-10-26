"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import "../../../styles/eyeglassesProductDetails.css";
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
    name: "Classic Rectangle Eyeglasses",
    category: "Men",
    shape: "Rectangle",
    material: "Acetate",
    frameSize: "M",
    price: 1299,
    oldPrice: 1799,
    badge: "New",
    description:
      "A clean and comfortable rectangle frame designed for everyday wear.",
    colors: [
      {
        name: "Black",
        value: "#222222",
        image: "/images/eyeglass1.png",
      },
      {
        name: "Brown",
        value: "#795548",
        image: "/images/eyeglass1.png",
      },
      {
        name: "Tortoise",
        value: "#8b5e3c",
        image: "/images/eyeglass1.png",
      },
      {
        name: "Gold",
        value: "#c8a951",
        image: "/images/eyeglass1.png",
      },
    ],
    images: [
      "/images/eyeglass1.png",
      "/images/eyeglass1.png",
      "/images/eyeglass1.png",
    ],
  },

  {
    id: 2,
    brand: "RAY-BAN",
    name: "Premium Round Eyeglasses",
    category: "Women",
    shape: "Round",
    material: "Metal",
    frameSize: "M",
    price: 1499,
    oldPrice: 1999,
    badge: "Popular",
    description:
      "A lightweight round frame with a modern and elegant everyday look.",
    colors: [
      {
        name: "Brown",
        value: "#795548",
        image: "/images/eyeglass2.png",
      },
      {
        name: "Black",
        value: "#222222",
        image: "/images/eyeglass2.png",
      },
      {
        name: "Gold",
        value: "#c8a951",
        image: "/images/eyeglass2.png",
      },
      {
        name: "Crystal",
        value: "#eeeeee",
        image: "/images/eyeglass2.png",
      },
    ],
    images: [
      "/images/eyeglass2.png",
      "/images/eyeglass2.png",
      "/images/eyeglass2.png",
    ],
  },

  {
    id: 3,
    brand: "VOGUE",
    name: "Modern Square Eyeglasses",
    category: "Men",
    shape: "Square",
    material: "TR90",
    frameSize: "L",
    price: 1199,
    oldPrice: 1699,
    badge: "",
    description:
      "A modern square frame with a simple design for everyday styling.",
    colors: [
      {
        name: "Black",
        value: "#222222",
        image: "/images/eyeglass3.png",
      },
      {
        name: "Blue",
        value: "#315c9e",
        image: "/images/eyeglass3.png",
      },
      {
        name: "Silver",
        value: "#b7b7b7",
        image: "/images/eyeglass3.png",
      },
    ],
    images: [
      "/images/eyeglass3.png",
      "/images/eyeglass3.png",
      "/images/eyeglass3.png",
    ],
  },

  {
    id: 4,
    brand: "LENS MART",
    name: "Elegant Cat-Eye Eyeglasses",
    category: "Women",
    shape: "Cat-Eye",
    material: "Acetate",
    frameSize: "S",
    price: 1599,
    oldPrice: 2199,
    badge: "Best Seller",
    description:
      "An elegant cat-eye frame created for a stylish and contemporary look.",
    colors: [
      {
        name: "Tortoise",
        value: "#8b5e3c",
        image: "/images/eyeglass4.png",
      },
      {
        name: "Black",
        value: "#222222",
        image: "/images/eyeglass4.png",
      },
      {
        name: "Brown",
        value: "#795548",
        image: "/images/eyeglass4.png",
      },
      {
        name: "Gold",
        value: "#c8a951",
        image: "/images/eyeglass4.png",
      },
    ],
    images: [
      "/images/eyeglass4.png",
      "/images/eyeglass4.png",
      "/images/eyeglass4.png",
    ],
  },

  {
    id: 5,
    brand: "LENS MART",
    name: "Kids Flexible Eyeglasses",
    category: "Kids",
    shape: "Rectangle",
    material: "TR90",
    frameSize: "XS",
    price: 999,
    oldPrice: 1399,
    badge: "",
    description:
      "A lightweight flexible frame designed for comfortable everyday use.",
    colors: [
      {
        name: "Blue",
        value: "#315c9e",
        image: "/images/eyeglass5.png",
      },
      {
        name: "Black",
        value: "#222222",
        image: "/images/eyeglass5.png",
      },
      {
        name: "Crystal",
        value: "#eeeeee",
        image: "/images/eyeglass5.png",
      },
    ],
    images: [
      "/images/eyeglass5.png",
      "/images/eyeglass5.png",
      "/images/eyeglass5.png",
    ],
  },

  {
    id: 6,
    brand: "Vogue",
    name: "Crystal Oval Eyeglasses",
    category: "Women",
    shape: "Oval",
    material: "Acetate",
    frameSize: "M",
    price: 1399,
    oldPrice: 1899,
    badge: "",
    description:
      "A clean oval frame with a lightweight construction and modern finish.",
    colors: [
      {
        name: "Crystal",
        value: "#eeeeee",
        image: "/images/eyeglass6.png",
      },
      {
        name: "Brown",
        value: "#795548",
        image: "/images/eyeglass6.png",
      },
      {
        name: "Black",
        value: "#222222",
        image: "/images/eyeglass6.png",
      },
    ],
    images: [
      "/images/eyeglass6.png",
      "/images/eyeglass6.png",
      "/images/eyeglass6.png",
    ],
  },

  {
    id: 7,
    brand: "LENS MART",
    name: "Geometric Metal Eyeglasses",
    category: "Men",
    shape: "Geometric",
    material: "Metal",
    frameSize: "M",
    price: 1699,
    oldPrice: 2299,
    badge: "New",
    description:
      "A geometric metal frame with a minimal and contemporary design.",
    colors: [
      {
        name: "Gold",
        value: "#c8a951",
        image: "/images/eyeglass7.png",
      },
      {
        name: "Silver",
        value: "#b7b7b7",
        image: "/images/eyeglass7.png",
      },
      {
        name: "Black",
        value: "#222222",
        image: "/images/eyeglass7.png",
      },
    ],
    images: [
      "/images/eyeglass7.png",
      "/images/eyeglass7.png",
      "/images/eyeglass7.png",
    ],
  },

  {
    id: 8,
    brand: "RAY-BAN",
    name: "Classic Aviator Eyeglasses",
    category: "Men",
    shape: "Aviator",
    material: "Metal",
    frameSize: "L",
    price: 1799,
    oldPrice: 2499,
    badge: "",
    description:
      "A classic aviator-inspired optical frame with a lightweight metal design.",
    colors: [
      {
        name: "Silver",
        value: "#b7b7b7",
        image: "/images/eyeglass8.png",
      },
      {
        name: "Gold",
        value: "#c8a951",
        image: "/images/eyeglass8.png",
      },
      {
        name: "Black",
        value: "#222222",
        image: "/images/eyeglass8.png",
      },
    ],
    images: [
      "/images/eyeglass8.png",
      "/images/eyeglass8.png",
      "/images/eyeglass8.png",
    ],
  },

  {
    id: 9,
    brand: "VOGUE",
    name: "Minimal Round Eyeglasses",
    category: "Women",
    shape: "Round",
    material: "Titanium",
    frameSize: "S",
    price: 1899,
    oldPrice: 2599,
    badge: "Trending",
    description:
      "A minimal round frame with a clean profile and lightweight feel.",
    colors: [
      {
        name: "Gold",
        value: "#c8a951",
        image: "/images/eyeglass9.png",
      },
      {
        name: "Black",
        value: "#222222",
        image: "/images/eyeglass9.png",
      },
      {
        name: "Silver",
        value: "#b7b7b7",
        image: "/images/eyeglass9.png",
      },
    ],
    images: [
      "/images/eyeglass9.png",
      "/images/eyeglass9.png",
      "/images/eyeglass9.png",
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

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

const LensIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="8" />
    <path d="M8 10a5 5 0 0 1 4-2.5" />
  </svg>
);

/* =========================================================
   LENS OPTIONS (placeholder prices - replace with your own)
========================================================= */
const lensOptions = [
  {
    id: "frame-only",
    name: "Frame Only",
    note: "Buy the frame now and add lenses later.",
    price: 0,
  },
  {
    id: "zero-power",
    name: "Zero Power Blue Cut",
    note: "Screen protection with no prescription power.",
    price: 399,
    tag: "Popular",
  },
  {
    id: "single-vision",
    name: "Single Vision",
    note: "For near or distance vision with your power.",
    price: 799,
  },
  {
    id: "progressive",
    name: "Progressive",
    note: "Seamless multifocal lenses for all distances.",
    price: 1999,
  },
];

const sizeGuide = [
  { size: "S", lens: "49 mm", bridge: "18 mm", temple: "138 mm" },
  { size: "M", lens: "52 mm", bridge: "18 mm", temple: "140 mm" },
  { size: "L", lens: "54 mm", bridge: "19 mm", temple: "142 mm" },
  { size: "XL", lens: "57 mm", bridge: "20 mm", temple: "145 mm" },
];

/* =========================================================
   PAGE
========================================================= */
export default function EyeglassesProductPage() {
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
  const [draftLens, setDraftLens] = useState("frame-only");
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
        (item) =>
          item.id === product.id && item.productType === "eyeglasses"
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

  // if (!product) {
  //   return (
  //     <div className="eyedetail-not-found">
  //       <h1>Product Not Found</h1>
  //       <p>This eyeglasses product is not available.</p>
  //       <Link href="/eyeglasses">Back to Eyeglasses</Link>
  //     </div>
  //   );
  // }

  if (!product) {
  return <ProductNotFound category="eyeglasses" />;
}

  /* =========================================================
     DISCOUNT
  ========================================================= */

  const discount =
    product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100
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
    setDraftLens(selectedLens ? selectedLens.id : "frame-only");
    setLensOpen(true);
  };

  const applyLens = () => {
    const option = lensOptions.find((item) => item.id === draftLens);

    setSelectedLens(
      option && option.id !== "frame-only"
        ? { id: option.id, name: option.name, price: option.price }
        : null
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
        (item) =>
          item.id === product.id && item.productType === "eyeglasses"
      );

      let updatedWishlist;

      if (exists) {
        updatedWishlist = savedWishlist.filter(
          (item) =>
            !(item.id === product.id && item.productType === "eyeglasses")
        );

        setIsWishlisted(false);
        setToast("Removed from wishlist");
      } else {
        const wishlistProduct = {
          id: product.id,
          productType: "eyeglasses",
          name: product.name,
          category: "Eyeglasses",
          image: selectedImage || product.images[0],
          price: product.price,
          oldPrice: product.oldPrice,
          selectedColor,
          selectedSize,
          link: `/eyeglasses/${product.id}`,
        };

        updatedWishlist = [...savedWishlist, wishlistProduct];

        setIsWishlisted(true);
        setToast("Saved to wishlist");
      }

      localStorage.setItem(
        "lensmartWishlist",
        JSON.stringify(updatedWishlist)
      );

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
        saved.productType === "eyeglasses",
    );

  const toggleCardWishlist = (item) => {
    if (!item) return;

    try {
      const saved =
        JSON.parse(localStorage.getItem("lensmartWishlist")) || [];
      const list = Array.isArray(saved) ? saved : [];
      const id = Number(item.id);

      const exists = list.some(
        (entry) => Number(entry.id) === id && entry.productType === "eyeglasses",
      );

      const updated = exists
        ? list.filter(
            (entry) =>
              !(Number(entry.id) === id && entry.productType === "eyeglasses"),
          )
        : [
            ...list,
            {
              id,
              productType: "eyeglasses",
              brand: item.brand,
              name: item.name,
              category: "Eyeglasses",
              image: item.image,
              price: item.price,
              oldPrice: item.oldPrice,
              link: `/eyeglasses/${id}`,
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

//   const addToCart = () => {
//     try {
//       const savedCart =
//         JSON.parse(localStorage.getItem("lensmartCart")) || [];

//       const lensId = selectedLens ? selectedLens.id : null;

//       const existingIndex = savedCart.findIndex(
//         (item) =>
//           item.id === product.id &&
//           item.productType === "eyeglasses" &&
//           item.selectedColor === selectedColor &&
//           item.selectedSize === selectedSize &&
//           ((item.selectedLens && item.selectedLens.id) || null) === lensId
//       );

//       const updatedCart = [...savedCart];

//       if (existingIndex !== -1) {
//         updatedCart[existingIndex] = {
//           ...updatedCart[existingIndex],
//           quantity:
//             Number(updatedCart[existingIndex].quantity || 1) + quantity,
//         };
//       } else {
//         brand: product.brand,
//         updatedCart.push({
//           id: product.id,
//           productType: "eyeglasses",
//           name: product.name,
//           category: "Eyeglasses",
//           image: selectedImage || product.images[0],
//           // price: product.price,
//           // oldPrice: product.oldPrice,


//            price: product.price + lensPrice,
//     oldPrice: product.oldPrice + lensPrice,

//      framePrice: product.price,
//     lensPrice,

//           selectedColor,
//           selectedSize,
//           selectedLens,
//           quantity,
//           link: `/eyeglasses/${product.id}`,
//         });
//       }

//       localStorage.setItem("lensmartCart", JSON.stringify(updatedCart));

//       window.dispatchEvent(new Event("cartUpdated"));

//       window.dispatchEvent(
//   new CustomEvent("openCartDrawer", {
//     detail: { key: `eyeglasses-${product.id}` }, // sunglasses me "sunglasses-..."
//   }),
// );

//       setToast("Product added to cart.");
//     } catch (error) {
//       console.error("Cart error:", error);
//     }
//   };


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
        item.productType === "eyeglasses" &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize &&
        ((item.selectedLens && item.selectedLens.id) || null) === lensId
    );

    const updatedCart = [...savedCart];

    if (existingIndex !== -1) {
      // purana item hataya, taaki naya data ke saath sabse last me jaye (latest)
      const old = updatedCart.splice(existingIndex, 1)[0];

      updatedCart.push({
        ...old,
        brand: product.brand,
        price: unitPrice,           // price bhi refresh
        oldPrice: unitOldPrice,
        framePrice: product.price,
        lensPrice,
        quantity: Number(old.quantity || 1) + quantity,
      });
    } else {
      updatedCart.push({
        id: product.id,
        productType: "eyeglasses",
        brand: product.brand,
        name: product.name,
        category: "Eyeglasses",
        image: selectedImage || product.images[0],
        price: unitPrice,
        oldPrice: unitOldPrice,
        framePrice: product.price,
        lensPrice,
        selectedColor,
        selectedSize,
        selectedLens,
        quantity,
        link: `/eyeglasses/${product.id}`,
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
      "Pincode entered successfully. Delivery availability will be confirmed at checkout."
    );
  };

  const handleZoomMove = (event) => {
    const box = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * 100;
    const y = ((event.clientY - box.top) / box.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };

  const sizeNames = { S: "Small", M: "Medium", L: "Large", XL: "Extra Large" };

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <div className="eyedetail-page">
      {/* BREADCRUMB */}

      <div className="eyedetail-container">
        <nav className="eyedetail-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/eyeglasses">Eyeglasses</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>
      </div>

      {/* PRODUCT AREA */}

      <section className="eyedetail-product-section">
        <div className="eyedetail-container">
          <div className="eyedetail-product-layout">
            {/* LEFT SIDE */}

            <div className="eyedetail-gallery">
              <div
                className={`eyedetail-main-image ${zoomed ? "zoomed" : ""}`}
                onClick={() => setZoomed((previous) => !previous)}
                onMouseMove={zoomed ? handleZoomMove : undefined}
                onMouseLeave={() => setZoomed(false)}
              >
                {product.badge && (
                  <span className="eyedetail-badge">{product.badge}</span>
                )}

                <button
                  type="button"
                  className={`eyedetail-image-heart ${
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

                <span className="eyedetail-image-note">
                  {zoomed ? "Click to zoom out" : "Click image to zoom"}
                </span>
              </div>

              <div className="eyedetail-thumbnails">
                {product.images.map((image, index) => (
                  <button
                    type="button"
                    key={`${image}-${index}`}
                    className={`eyedetail-thumbnail ${
                      selectedImage === image ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(image)}
                    aria-label={`View ${index + 1}`}
                  >
                    <img src={image} alt={`${product.name} view ${index + 1}`} />
                  </button>
                ))}
              </div>

              <div className="eyedetail-gallery-features">
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
                    <strong>Authentic Products</strong>
                    <small>Quality eyewear</small>
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}

            <div className="eyedetail-info">
              <div className="eyedetail-product-meta">
                <span>{product.category}</span>
                <span>{product.shape}</span>
              </div>

              <h1>{product.name}</h1>

              <p className="eyedetail-description">{product.description}</p>

              <div className="eyedetail-price-row">
                <strong className="eyedetail-price">
                  ₹{product.price.toLocaleString("en-IN")}
                </strong>

                <span className="eyedetail-old-price">
                  ₹{product.oldPrice.toLocaleString("en-IN")}
                </span>

                {discount > 0 && (
                  <span className="eyedetail-discount">{discount}% OFF</span>
                )}
              </div>

              <p className="eyedetail-tax">
                Inclusive of all taxes
                {savings > 0 &&
                  ` · You save ₹${savings.toLocaleString("en-IN")}`}
              </p>

              <div className="eyedetail-divider" />

              {/* FRAME COLOR */}

              <div className="eyedetail-selection">
                <div className="eyedetail-selection-title">
                  <span>Frame Color</span>
                  <strong>{selectedColor}</strong>
                </div>

                <div className="eyedetail-color-list">
                  {product.colors.map((color) => (
                    <button
                      type="button"
                      key={color.name}
                      className={`eyedetail-color-option ${
                        selectedColor === color.name ? "active" : ""
                      }`}
                      onClick={() => handleColorSelect(color)}
                      aria-pressed={selectedColor === color.name}
                    >
                      <span
                        className="eyedetail-color-dot"
                        style={{ backgroundColor: color.value }}
                      />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* FRAME SIZE */}

              <div className="eyedetail-selection">
                <div className="eyedetail-selection-title">
                  <span>Frame Size</span>

                  <button
                    type="button"
                    className="eyedetail-size-guide"
                    onClick={() => setGuideOpen(true)}
                  >
                    Size Guide
                  </button>
                </div>

                <div className="eyedetail-size-list">
                  {["S", "M", "L", "XL"].map((size) => (
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
                className={`eyedetail-lens-card ${selectedLens ? "selected" : ""}`}
                onClick={openLens}
                aria-haspopup="dialog"
              >
                <span className="eyedetail-lens-icon">
                  {selectedLens ? <CheckIcon /> : <LensIcon />}
                </span>

                <span className="eyedetail-lens-text">
                  <span className="eyedetail-step">
                    {selectedLens ? "LENSES ADDED" : "NEXT STEP"}
                  </span>
                  <h3>{selectedLens ? selectedLens.name : "Choose your lenses"}</h3>
                  <p>
                    {selectedLens
                      ? `+ ₹${selectedLens.price.toLocaleString("en-IN")} per pair · Tap to change`
                      : "Add lenses to your frame, or buy frame only."}
                  </p>
                </span>

                <span className="eyedetail-lens-arrow">→</span>
              </button>

              {/* QUANTITY + CART */}

              <div className="eyedetail-buy-row">
                <div className="eyedetail-quantity">
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
                  className="eyedetail-cart-button"
                  onClick={addToCart}
                >
                  <CartIcon />
                  Add to Cart
                  <span className="eyedetail-cart-total">
                    · ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </button>
              </div>

              {/* <button
                type="button"
                className={`eyedetail-wishlist-button ${
                  isWishlisted ? "active" : ""
                }`}
                onClick={toggleWishlist}
              >
                <HeartIcon />
                {isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}
              </button> */}

              {/* DELIVERY */}

              <div className="eyedetail-delivery">
                <div className="eyedetail-delivery-heading">
                  <TruckIcon />

                  <div>
                    <strong>Check delivery</strong>
                    <span>Enter your 6-digit pincode</span>
                  </div>
                </div>

                <div className="eyedetail-pincode">
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
                    className={`eyedetail-delivery-message ${
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
        productType="eyeglasses"
        product={product}
        selectedSize={selectedSize}
      />

      {/* BOTTOM FEATURES */}

      <section className="eyedetail-bottom-features">
        <div className="eyedetail-container">
          <div className="eyedetail-bottom-grid">
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
        productType="eyeglasses"
        viewAllHref="/eyeglasses"
        viewAllLabel="View All Eyeglasses"
        getHref={(item) => `/eyeglasses/${item.id}`}
        isWishlisted={isProductWishlisted}
        onWishlistToggle={toggleCardWishlist}
        defaultRating={4.8}
        defaultReviews={95}
      />

      {/* MORE FROM BRAND 

      <BrandProduct
        brand={product.brand}
        products={brandProducts}
        productType="eyeglasses"
        getHref={(item) => `/eyeglasses/${item.id}`}
        isWishlisted={isProductWishlisted}
        onWishlistToggle={toggleCardWishlist}
        defaultRating={4.8}
        defaultReviews={95}
      />
      */}

      {/* MOBILE STICKY BAR */}

      <div className="eyedetail-sticky-bar">
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
        className={`eyedetail-overlay ${lensOpen || guideOpen ? "show" : ""}`}
        onClick={() => {
          setLensOpen(false);
          setGuideOpen(false);
        }}
      />

      {/* LENS DRAWER (tablet/desktop) / FLOATING WINDOW (mobile) */}

      <aside
        className={`eyedetail-lens-panel ${lensOpen ? "show" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Choose your lenses"
        aria-hidden={!lensOpen}
      >
        <div className="eyedetail-panel-header">
          <div>
            <h3>Choose your lenses</h3>
            <p>{product.name}</p>
          </div>

          <button
            type="button"
            className="eyedetail-panel-close"
            onClick={() => setLensOpen(false)}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="eyedetail-panel-body">
          {lensOptions.map((option) => (
            <button
              type="button"
              key={option.id}
              className={`eyedetail-lens-option ${
                draftLens === option.id ? "active" : ""
              }`}
              onClick={() => setDraftLens(option.id)}
              aria-pressed={draftLens === option.id}
            >
              <span className="eyedetail-radio" />

              <span className="eyedetail-lens-option-text">
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

        <div className="eyedetail-panel-footer">
          <div className="eyedetail-panel-total">
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
        className={`eyedetail-modal ${guideOpen ? "show" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Size guide"
        aria-hidden={!guideOpen}
      >
        <button
          type="button"
          className="eyedetail-panel-close eyedetail-modal-close"
          onClick={() => setGuideOpen(false)}
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <h3>Frame size guide</h3>
        <p>Check the numbers printed inside your current frame, e.g. 52-18-140.</p>

        <div className="eyedetail-table-wrap">
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

      <div className={`eyedetail-toast ${toast ? "show" : ""}`} role="status">
        {toast}
      </div>
    </div>
  );
}