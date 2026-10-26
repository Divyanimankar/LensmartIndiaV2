// "use client";

// import { useEffect, useMemo, useState } from "react";

// import Link from "next/link";

// import ProductGrid from "../../components/ProductGrid";
// import ProductFilter from "../../components/ProductFilter";
// import CollectionDescription from "../../components/CollectionDescription";
// import SortDropdown from "../../components/SortDropdown";

// import { SUNGLASSES_FILTERS } from "../../data/filterConfig";
// import { useProductFilters } from "../../hooks/useProductFilters";

// import GlassesBrand from "@/components/GlassesBrand";
// import "../../styles/sunglasses.css";
// import "../../styles/productsToolbar.css";
// import "../../styles/productListing.css";

// const PRODUCTS_PER_PAGE = 12;

// const SORT_OPTIONS = [
//   { value: "featured", label: "Featured" },
//   { value: "bestseller", label: "Bestseller" },
//   { value: "rating", label: "Top Rated" },
//   { value: "discount", label: "Biggest Discount" },
//   { value: "price-low", label: "Price: Low to High" },
//   { value: "price-high", label: "Price: High to Low" },
// ];

// /* =========================================
//    PRODUCT DATA
//    p(id, brand, rating, reviews, name, category, shape,
//      colors, material, frameSize, price, oldPrice, image,
//      badge, bestseller)

//    To switch the card image when a colour is picked, add
//    an `images` object, e.g. images: { Black: "/images/a.png" }
// ========================================= */

// const p = (
//   id,
//   brand,
//   rating,
//   reviews,
//   name,
//   category,
//   shape,
//   colors,
//   material,
//   frameSize,
//   price,
//   oldPrice,
//   image,
//   badge,
//   bestseller,
// ) => ({
//   id,
//   brand,
//   rating,
//   reviews,
//   name,
//   category,
//   shape,
//   colors,
//   material,
//   frameSize,
//   price,
//   oldPrice,
//   image,
//   badge,
//   bestseller,
// });

// const products = [
//   p(
//     1,
//     "VOGUE",
//     4.8,
//     95,
//     "Classic Rectangle Sunglasses",
//     "Men",
//     "Rectangle",
//     ["Black", "Brown", "Tortoise", "Gold"],
//     "Acetate",
//     "M",
//     1299,
//     1799,
//     "/images/sunglasses1.png",
//     "New",
//     false,
//   ),
//   p(
//     2,
//     "RAY-BAN",
//     4.6,
//     320,
//     "Premium Round Sunglasses",
//     "Women",
//     "Round",
//     ["Brown", "Black", "Gold", "Crystal"],
//     "Metal",
//     "M",
//     1499,
//     1999,
//     "/images/sunglasses2.png",
//     "Popular",
//     true,
//   ),
//   p(
//     3,
//     "VOGUE",
//     4.7,
//     122,
//     "Modern Square Sunglasses",
//     "Men",
//     "Square",
//     ["Black", "Blue", "Silver"],
//     "TR90",
//     "L",
//     1199,
//     1699,
//     "/images/sunglasses3.png",
//     "",
//     false,
//   ),
//   p(
//     4,
//     "LENS MART",
//     4.8,
//     175,
//     "Elegant Cat-Eye Sunglasses",
//     "Women",
//     "Cat-Eye",
//     ["Tortoise", "Black", "Brown", "Gold"],
//     "Acetate",
//     "S",
//     1599,
//     2199,
//     "/images/sunglasses4.png",
//     "Best Seller",
//     true,
//   ),
//   p(
//     5,
//     "LENS MART",
//     4.5,
//     86,
//     "Kids Flexible Sunglasses",
//     "Kids",
//     "Rectangle",
//     ["Blue", "Black", "Crystal"],
//     "TR90",
//     "XS",
//     999,
//     1399,
//     "/images/sunglasses5.png",
//     "",
//     false,
//   ),
//   p(
//     6,
//     "VOGUE",
//     4.7,
//     141,
//     "Crystal Oval Sunglasses",
//     "Women",
//     "Oval",
//     ["Crystal", "Brown", "Black", "Tortoise"],
//     "Acetate",
//     "M",
//     1399,
//     1899,
//     "/images/sunglasses6.png",
//     "",
//     false,
//   ),
//   p(
//     7,
//     "LENS MART",
//     4.6,
//     209,
//     "Geometric Metal Sunglasses",
//     "Men",
//     "Geometric",
//     ["Gold", "Silver", "Black", "Brown"],
//     "Metal",
//     "M",
//     1699,
//     2299,
//     "/images/sunglasses7.png",
//     "New",
//     true,
//   ),
//   p(
//     8,
//     "RAY-BAN",
//     4.8,
//     118,
//     "Classic Aviator Sunglasses",
//     "Men",
//     "Aviator",
//     ["Silver", "Gold", "Black"],
//     "Metal",
//     "L",
//     1799,
//     2499,
//     "/images/sunglasses8.png",
//     "",
//     false,
//   ),
//   p(
//     9,
//     "VOGUE",
//     4.7,
//     164,
//     "Minimal Round Sunglasses",
//     "Women",
//     "Round",
//     ["Gold", "Black", "Silver", "Crystal"],
//     "Titanium",
//     "S",
//     1899,
//     2599,
//     "/images/sunglasses9.png",
//     "Trending",
//     true,
//   ),

//   /* Temporary products for pagination testing */
//   p(
//     10,
//     "LENS MART",
//     4.5,
//     77,
//     "Urban Rectangle Sunglasses",
//     "Men",
//     "Rectangle",
//     ["Black", "Brown", "Blue", "Silver"],
//     "TR90",
//     "L",
//     1299,
//     1799,
//     "/images/sunglasses1.png",
//     "",
//     false,
//   ),
//   p(
//     11,
//     "VOGUE",
//     4.8,
//     133,
//     "Classic Round Optical Frames",
//     "Women",
//     "Round",
//     ["Gold", "Black", "Crystal", "Brown"],
//     "Metal",
//     "M",
//     1499,
//     2099,
//     "/images/sunglasses2.png",
//     "Popular",
//     true,
//   ),
//   p(
//     12,
//     "RAY-BAN",
//     4.6,
//     98,
//     "Premium Square Frames",
//     "Men",
//     "Square",
//     ["Black", "Silver", "Blue", "Brown"],
//     "Acetate",
//     "XL",
//     1999,
//     2699,
//     "/images/sunglasses3.png",
//     "",
//     false,
//   ),
//   p(
//     13,
//     "VOGUE",
//     4.7,
//     156,
//     "Fashion Cat-Eye Frames",
//     "Women",
//     "Cat-Eye",
//     ["Black", "Tortoise", "Gold", "Brown"],
//     "Acetate",
//     "S",
//     1599,
//     2199,
//     "/images/sunglasses4.png",
//     "New",
//     true,
//   ),
//   p(
//     14,
//     "LENS MART",
//     4.5,
//     64,
//     "Kids Rectangle Optical Frames",
//     "Kids",
//     "Rectangle",
//     ["Blue", "Black", "Crystal"],
//     "TR90",
//     "XS",
//     899,
//     1299,
//     "/images/sunglasses5.png",
//     "",
//     false,
//   ),
//   p(
//     15,
//     "VOGUE",
//     4.8,
//     187,
//     "Premium Oval Sunglasses",
//     "Women",
//     "Oval",
//     ["Crystal", "Brown", "Black", "Gold"],
//     "Titanium",
//     "M",
//     2199,
//     2899,
//     "/images/sunglasses6.png",
//     "Best Seller",
//     true,
//   ),
// ];

// const discountOf = (product) =>
//   (product.oldPrice - product.price) / product.oldPrice;

// /* =========================================
//    PAGE
// ========================================= */

// export default function SunglassesPage() {
//   const [sortBy, setSortBy] = useState("featured");

//   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);

//   /* filter state + the filtered list (see data/filterConfig.js) */

//   const filters = useProductFilters(SUNGLASSES_FILTERS, products);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filters.selected, filters.price]);

//   /* =========================================
//      SORT PRODUCTS
//   ========================================= */

//   const sortedProducts = useMemo(() => {
//     const result = [...filters.filteredProducts];

//     switch (sortBy) {
//       case "bestseller":
//         result.sort((a, b) => Number(b.bestseller) - Number(a.bestseller));
//         break;

//       case "rating":
//         result.sort((a, b) => b.rating - a.rating);
//         break;

//       case "discount":
//         result.sort((a, b) => discountOf(b) - discountOf(a));
//         break;

//       case "price-low":
//         result.sort((a, b) => a.price - b.price);
//         break;

//       case "price-high":
//         result.sort((a, b) => b.price - a.price);
//         break;

//       default:
//         break;
//     }

//     return result;
//   }, [filters.filteredProducts, sortBy]);

//   /* =========================================
//      PAGINATION
//   ========================================= */

//   const totalProducts = sortedProducts.length;

//   const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

//   const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

//   const currentProducts = sortedProducts.slice(
//     startIndex,
//     startIndex + PRODUCTS_PER_PAGE,
//   );

//   const showingFrom = totalProducts ? startIndex + 1 : 0;
//   const showingTo = Math.min(startIndex + PRODUCTS_PER_PAGE, totalProducts);

//   const goToPage = (page) => {
//     if (page < 1 || page > totalPages) {
//       return;
//     }

//     setCurrentPage(page);

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   /* =========================================
//      PAGE
//   ========================================= */

//   return (
//     <div className="sunglasses-page">
//       {/* BREADCRUMB */}

//       <div className="sunglasses-container">
//         <nav className="sunglasses-breadcrumb" aria-label="Breadcrumb">
//           <Link href="/">Home</Link>

//           <span>›</span>

//           <span>Sunglasses</span>
//         </nav>
//       </div>

//       {/* SUNGLASSES BANNER */}

//       <section className="sunglasses-banner">
//         <img
//           src="/images/sunglassesbanner.png"
//           alt="Sunglasses collection"
//           className="sunglasses-banner-image"
//         />
//       </section>

//       {/* PRODUCTS */}

//       <section className="sunglasses-products-section">
//         <div className="sunglasses-container">
//           {/* PRODUCT COUNT + SORT */}

//           <section className="pt-bar pt-bar--flush" aria-label="Product results">
//             <div className="pt-inner">
//               <p className="pt-count" aria-live="polite">
//                 {totalProducts === 0 ? (
//                   "No products found"
//                 ) : (
//                   <>
//                     <span className="pt-range">
//                       Showing{" "}
//                       <strong>
//                         {showingFrom}–{showingTo}
//                       </strong>{" "}
//                       of{" "}
//                     </span>
//                     <strong>{totalProducts}</strong> products
//                   </>
//                 )}
//               </p>

//               <SortDropdown
//                 label="Sort by"
//                 options={SORT_OPTIONS}
//                 value={sortBy}
//                 onChange={(value) => {
//                   setSortBy(value);
//                   setCurrentPage(1);
//                 }}
//               />
//             </div>
//           </section>

//           {/* MAIN LAYOUT */}

//           <div className="pl-layout">
//             {/* DESKTOP FILTER */}

//             <aside className="pl-sidebar" aria-label="Filters">
//               <ProductFilter filters={filters} />
//             </aside>

//             {/* PRODUCTS */}

//             <div className="pl-main">
//               {currentProducts.length > 0 ? (
//                 <>
//                   <ProductGrid
//                     products={currentProducts}
//                     productType="sunglasses"
//                   />

//                   {/* PAGINATION */}

//                   {totalPages > 1 && (
//                     <nav
//                       className="sunglasses-pagination"
//                       aria-label="Pagination"
//                     >
//                       <button
//                         type="button"
//                         className="pagination-arrow"
//                         disabled={currentPage === 1}
//                         onClick={() => goToPage(currentPage - 1)}
//                         aria-label="Previous page"
//                       >
//                         ‹
//                       </button>

//                       <div className="pagination-numbers">
//                         {Array.from({ length: totalPages }, (_, index) => {
//                           const page = index + 1;

//                           return (
//                             <button
//                               type="button"
//                               key={page}
//                               onClick={() => goToPage(page)}
//                               aria-current={
//                                 currentPage === page ? "page" : undefined
//                               }
//                               className={`pagination-number ${
//                                 currentPage === page ? "active" : ""
//                               }`}
//                             >
//                               {page}
//                             </button>
//                           );
//                         })}
//                       </div>

//                       <button
//                         type="button"
//                         className="pagination-arrow"
//                         disabled={currentPage === totalPages}
//                         onClick={() => goToPage(currentPage + 1)}
//                         aria-label="Next page"
//                       >
//                         ›
//                       </button>
//                     </nav>
//                   )}
//                 </>
//               ) : (
//                 <div className="sunglasses-no-products">
//                   <h3>No products found</h3>

//                   <p>Try changing or clearing your filters.</p>

//                   <button type="button" onClick={filters.clear}>
//                     Clear Filters
//                   </button>
//                 </div>
//               )}

//               {/* FLOATING FILTER BUTTON (tablet + mobile): floats at the
//                   bottom of the screen, then rests at the end of the grid */}

//               <div className="floating-filter-bar">
//                 <button
//                   type="button"
//                   className="floating-filter-button"
//                   onClick={() => setMobileFiltersOpen(true)}
//                   aria-haspopup="dialog"
//                 >
//                   <svg viewBox="0 0 24 24" aria-hidden="true">
//                     <path d="M4 6h16M7 12h10M10 18h4" />
//                   </svg>
//                   Filters
//                   {filters.activeCount > 0 && (
//                     <span className="floating-filter-badge">
//                       {filters.activeCount}
//                       <span className="pf-sr"> selected</span>
//                     </span>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mobile-filter-content">
//           <FilterContent {...filterProps} />
//         </div>

//         <button
//           type="button"
//           className="mobile-show-products"
//           onClick={() => setMobileFilterOpen(false)}
//         >
//           Show {filteredProducts.length} Product
//           {filteredProducts.length === 1 ? "" : "s"}
//         </button>
//       </aside>
//       {/* GLASSES BRAND SLIDER */}

//       <GlassesBrand />
//     </div>
//   );
// }

// /* =========================================
//    FILTER CONTENT

// function FilterContent({
//   filters,
//   toggleFilter,
//   priceRange,
//   setPriceRange,
//   clearFilters,
// }) {
//   return (
//     <div className="filter-content">
//       <div className="filter-top">
//         <h2>Filters</h2>

//         <button type="button" onClick={clearFilters}>
//           Reset
//         </button>
//       </div>

//       <div className="filter-scroll-area">
//         {FILTER_GROUPS.map((group) => (
//           <FilterGroup
//             key={group.key}
//             title={group.title}
//             defaultOpen={group.defaultOpen}
//           >
//             {group.options.map((option) => (
//               <FilterCheckbox
//                 key={option}
//                 label={option}
//                 checked={filters[group.key].includes(option)}
//                 onChange={() => toggleFilter(group.key, option)}
//               />
//             ))}
//           </FilterGroup>
//         ))}

//         {/* PRICE */}

//         <FilterGroup title="Price" defaultOpen={true}>
//           <PriceRangeSlider
//             priceRange={priceRange}
//             setPriceRange={setPriceRange}
//           />
//         </FilterGroup>

//         {/* FRAME SIZE */}

//         <FilterGroup title="Frame Size" defaultOpen={true}>
//           {FRAME_SIZES.map((size) => (
//             <FilterCheckbox
//               key={size}
//               label={size}
//               checked={filters.size.includes(size)}
//               onChange={() => toggleFilter("size", size)}
//             />
//           ))}
//         </FilterGroup>
//       </div>
//     </div>
//   );
// }

// /* =========================================
//    PRICE SLIDER

// function PriceRangeSlider({ priceRange, setPriceRange }) {
//   const minPercent =
//     ((priceRange.min - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

//   const maxPercent =
//     ((priceRange.max - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

//   const handleMinChange = (event) => {
//     const value = Math.min(Number(event.target.value), priceRange.max - 100);

//     setPriceRange((current) => ({
//       ...current,
//       min: value,
//     }));
//   };

//   const handleMaxChange = (event) => {
//     const value = Math.max(Number(event.target.value), priceRange.min + 100);

//     setPriceRange((current) => ({
//       ...current,
//       max: value,
//     }));
//   };

//   return (
//     <div className="price-range-filter">
//       <div className="price-range-values">
//         <div className="price-value-box">
//           <span>Min</span>

//           <strong>₹{priceRange.min.toLocaleString("en-IN")}</strong>
//         </div>

//         <span className="price-range-separator">–</span>

//           {/* SEO DESCRIPTION */}

//           <CollectionDescription type="sunglasses" products={products} />
//         </div>
//       </section>

//       {/* =====================================
//           MOBILE / TABLET FILTER DRAWER
//       ===================================== */}

//       <ProductFilter
//         filters={filters}
//         variant="drawer"
//         open={mobileFiltersOpen}
//         onClose={() => setMobileFiltersOpen(false)}
//         productLabel="Product"
//       />
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import ProductGrid from "../../components/ProductGrid";
import ProductFilter from "../../components/ProductFilter";
import CollectionDescription from "../../components/CollectionDescription";
import SortDropdown from "../../components/SortDropdown";

import { SUNGLASSES_FILTERS } from "../../data/filterConfig";
import { useProductFilters } from "../../hooks/useProductFilters";

import { sunglassesProducts as products } from "../../data/sunglassesProducts";


import GlassesBrand from "@/components/GlassesBrand";
import "../../styles/sunglasses.css";
import "../../styles/productsToolbar.css";
import "../../styles/productListing.css";

const PRODUCTS_PER_PAGE = 12;

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "bestseller", label: "Bestseller" },
  { value: "rating", label: "Top Rated" },
  { value: "discount", label: "Biggest Discount" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

/* =========================================
   PRODUCT DATA
   p(id, brand, rating, reviews, name, category, shape,
     colors, material, frameSize, price, oldPrice, image,
     badge, bestseller)

   To switch the card image when a colour is picked, add
   an `images` object, e.g. images: { Black: "/images/a.png" }
========================================= */

// const p = (
//   id,
//   brand,
//   rating,
//   reviews,
//   name,
//   category,
//   shape,
//   colors,
//   material,
//   frameSize,
//   price,
//   oldPrice,
//   image,
//   badge,
//   bestseller,
// ) => ({
//   id,
//   brand,
//   rating,
//   reviews,
//   name,
//   category,
//   shape,
//   colors,
//   material,
//   frameSize,
//   price,
//   oldPrice,
//   image,
//   badge,
//   bestseller,
// });

// const products = [
//   p(
//     1,
//     "VOGUE",
//     4.8,
//     95,
//     "Classic Rectangle Sunglasses",
//     "Men",
//     "Rectangle",
//     ["Black", "Brown", "Tortoise", "Gold"],
//     "Acetate",
//     "M",
//     1299,
//     1799,
//     "/images/sunglasses1.png",
//     "New",
//     false,
//   ),
//   p(
//     2,
//     "RAY-BAN",
//     4.6,
//     320,
//     "Premium Round Sunglasses",
//     "Women",
//     "Round",
//     ["Brown", "Black", "Gold", "Crystal"],
//     "Metal",
//     "M",
//     1499,
//     1999,
//     "/images/sunglasses2.png",
//     "Popular",
//     true,
//   ),
//   p(
//     3,
//     "VOGUE",
//     4.7,
//     122,
//     "Modern Square Sunglasses",
//     "Men",
//     "Square",
//     ["Black", "Blue", "Silver"],
//     "TR90",
//     "L",
//     1199,
//     1699,
//     "/images/sunglasses3.png",
//     "",
//     false,
//   ),
//   p(
//     4,
//     "LENS MART",
//     4.8,
//     175,
//     "Elegant Cat-Eye Sunglasses",
//     "Women",
//     "Cat-Eye",
//     ["Tortoise", "Black", "Brown", "Gold"],
//     "Acetate",
//     "S",
//     1599,
//     2199,
//     "/images/sunglasses4.png",
//     "Best Seller",
//     true,
//   ),
//   p(
//     5,
//     "LENS MART",
//     4.5,
//     86,
//     "Kids Flexible Sunglasses",
//     "Kids",
//     "Rectangle",
//     ["Blue", "Black", "Crystal"],
//     "TR90",
//     "XS",
//     999,
//     1399,
//     "/images/sunglasses5.png",
//     "",
//     false,
//   ),
//   p(
//     6,
//     "VOGUE",
//     4.7,
//     141,
//     "Crystal Oval Sunglasses",
//     "Women",
//     "Oval",
//     ["Crystal", "Brown", "Black", "Tortoise"],
//     "Acetate",
//     "M",
//     1399,
//     1899,
//     "/images/sunglasses6.png",
//     "",
//     false,
//   ),
//   p(
//     7,
//     "LENS MART",
//     4.6,
//     209,
//     "Geometric Metal Sunglasses",
//     "Men",
//     "Geometric",
//     ["Gold", "Silver", "Black", "Brown"],
//     "Metal",
//     "M",
//     1699,
//     2299,
//     "/images/sunglasses7.png",
//     "New",
//     true,
//   ),
//   p(
//     8,
//     "RAY-BAN",
//     4.8,
//     118,
//     "Classic Aviator Sunglasses",
//     "Men",
//     "Aviator",
//     ["Silver", "Gold", "Black"],
//     "Metal",
//     "L",
//     1799,
//     2499,
//     "/images/sunglasses8.png",
//     "",
//     false,
//   ),
//   p(
//     9,
//     "VOGUE",
//     4.7,
//     164,
//     "Minimal Round Sunglasses",
//     "Women",
//     "Round",
//     ["Gold", "Black", "Silver", "Crystal"],
//     "Titanium",
//     "S",
//     1899,
//     2599,
//     "/images/sunglasses9.png",
//     "Trending",
//     true,
//   ),

//   /* Temporary products for pagination testing */
//   p(
//     10,
//     "LENS MART",
//     4.5,
//     77,
//     "Urban Rectangle Sunglasses",
//     "Men",
//     "Rectangle",
//     ["Black", "Brown", "Blue", "Silver"],
//     "TR90",
//     "L",
//     1299,
//     1799,
//     "/images/sunglasses1.png",
//     "",
//     false,
//   ),
//   p(
//     11,
//     "VOGUE",
//     4.8,
//     133,
//     "Classic Round Optical Frames",
//     "Women",
//     "Round",
//     ["Gold", "Black", "Crystal", "Brown"],
//     "Metal",
//     "M",
//     1499,
//     2099,
//     "/images/sunglasses2.png",
//     "Popular",
//     true,
//   ),
//   p(
//     12,
//     "RAY-BAN",
//     4.6,
//     98,
//     "Premium Square Frames",
//     "Men",
//     "Square",
//     ["Black", "Silver", "Blue", "Brown"],
//     "Acetate",
//     "XL",
//     1999,
//     2699,
//     "/images/sunglasses3.png",
//     "",
//     false,
//   ),
//   p(
//     13,
//     "VOGUE",
//     4.7,
//     156,
//     "Fashion Cat-Eye Frames",
//     "Women",
//     "Cat-Eye",
//     ["Black", "Tortoise", "Gold", "Brown"],
//     "Acetate",
//     "S",
//     1599,
//     2199,
//     "/images/sunglasses4.png",
//     "New",
//     true,
//   ),
//   p(
//     14,
//     "LENS MART",
//     4.5,
//     64,
//     "Kids Rectangle Optical Frames",
//     "Kids",
//     "Rectangle",
//     ["Blue", "Black", "Crystal"],
//     "TR90",
//     "XS",
//     899,
//     1299,
//     "/images/sunglasses5.png",
//     "",
//     false,
//   ),
//   p(
//     15,
//     "VOGUE",
//     4.8,
//     187,
//     "Premium Oval Sunglasses",
//     "Women",
//     "Oval",
//     ["Crystal", "Brown", "Black", "Gold"],
//     "Titanium",
//     "M",
//     2199,
//     2899,
//     "/images/sunglasses6.png",
//     "Best Seller",
//     true,
//   ),
// ];

const discountOf = (product) =>
  (product.oldPrice - product.price) / product.oldPrice;

/* =========================================
   PAGE
========================================= */

function SunglassesContent() {
  const searchParams = useSearchParams();
  const urlKey = searchParams.toString();
  const productsRef = useRef(null);

  /* navbar se filter wala link khule to filter + products tak scroll karo */
  useEffect(() => {
    if (!urlKey) return;

    const timer = setTimeout(() => {
      productsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);

    return () => clearTimeout(timer);
  }, [urlKey]);

  const [sortBy, setSortBy] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filters = useProductFilters(SUNGLASSES_FILTERS, products);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.selected, filters.price]);

  const sortedProducts = useMemo(() => {
    const result = [...filters.filteredProducts];

    switch (sortBy) {
      case "bestseller":
        result.sort((a, b) => Number(b.bestseller) - Number(a.bestseller));
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "discount":
        result.sort((a, b) => discountOf(b) - discountOf(a));
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return result;
  }, [filters.filteredProducts, sortBy]);

  const totalProducts = sortedProducts.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = sortedProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );
  const showingFrom = totalProducts ? startIndex + 1 : 0;
  const showingTo = Math.min(startIndex + PRODUCTS_PER_PAGE, totalProducts);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="sunglasses-page">
      <div className="sunglasses-container">
        <nav className="sunglasses-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>›</span>
          <span>Sunglasses</span>
        </nav>
      </div>

      <section className="sunglasses-banner">
        <img
          src="/images/sunglassesbanner.png"
          alt="Sunglasses collection"
          className="sunglasses-banner-image"
        />
      </section>

      <section ref={productsRef} className="sunglasses-products-section">
        <div className="sunglasses-container">
          <section
            className="pt-bar pt-bar--flush"
            aria-label="Product results"
          >
            <div className="pt-inner">
              {/* Product count - first row */}
              <p className="pt-count" aria-live="polite">
                {totalProducts === 0 ? (
                  "No products found"
                ) : (
                  <>
                    <strong>{totalProducts}</strong> products
                  </>
                )}
              </p>

              {/* Filters + Featured - second row */}
              <div className="mobile-toolbar-controls">
                <div className="collection-mobile-filter">
                  <button
                    type="button"
                    className="floating-filter-button"
                    onClick={() => setMobileFiltersOpen(true)}
                    aria-haspopup="dialog"
                    aria-expanded={mobileFiltersOpen}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 6h16M7 12h10M10 18h4" />
                    </svg>
                    Filters
                    {filters.activeCount > 0 && (
                      <span className="floating-filter-badge">
                        {filters.activeCount}
                      </span>
                    )}
                  </button>
                </div>

                <SortDropdown
                  label="Sort by"
                  options={SORT_OPTIONS}
                  value={sortBy}
                  onChange={(value) => {
                    setSortBy(value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </section>

          <div className="pl-layout">
            <aside className="pl-sidebar" aria-label="Filters">
              <ProductFilter filters={filters} />
            </aside>

            <div className="pl-main">
              {currentProducts.length > 0 ? (
                <>
                  <ProductGrid
                    products={currentProducts}
                    productType="sunglasses"
                  />

                  {totalPages > 1 && (
                    <nav
                      className="sunglasses-pagination"
                      aria-label="Pagination"
                    >
                      <button
                        type="button"
                        className="pagination-arrow"
                        disabled={currentPage === 1}
                        onClick={() => goToPage(currentPage - 1)}
                        aria-label="Previous page"
                      >
                        ‹
                      </button>

                      <div className="pagination-numbers">
                        {Array.from({ length: totalPages }, (_, index) => {
                          const page = index + 1;

                          return (
                            <button
                              type="button"
                              key={page}
                              onClick={() => goToPage(page)}
                              aria-current={
                                currentPage === page ? "page" : undefined
                              }
                              className={`pagination-number ${currentPage === page ? "active" : ""
                                }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        className="pagination-arrow"
                        disabled={currentPage === totalPages}
                        onClick={() => goToPage(currentPage + 1)}
                        aria-label="Next page"
                      >
                        ›
                      </button>
                    </nav>
                  )}
                </>
              ) : (
                <div className="sunglasses-no-products">
                  <h3>No products found</h3>
                  <p>Try changing or clearing your filters.</p>
                  <button type="button" onClick={filters.clear}>
                    Clear Filters
                  </button>
                </div>
              )}

              <div className="floating-filter-bar">
                <button
                  type="button"
                  className="floating-filter-button"
                  onClick={() => setMobileFiltersOpen(true)}
                  aria-haspopup="dialog"
                  aria-expanded={mobileFiltersOpen}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 6h16M7 12h10M10 18h4" />
                  </svg>
                  Filters
                  {filters.activeCount > 0 && (
                    <span className="floating-filter-badge">
                      {filters.activeCount}
                      <span className="pf-sr"> selected</span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          <CollectionDescription type="sunglasses" products={products} />
        </div>
      </section>

      <ProductFilter
        filters={filters}
        variant="drawer"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        productLabel="Product"
      />

      <GlassesBrand />
    </div>
  );
}

export default function SunglassesPage() {
  return (
    <Suspense fallback={null}>
      <SunglassesContent />
    </Suspense>
  );
}
