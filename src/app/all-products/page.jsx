// "use client";

// import { useEffect, useMemo, useState } from "react";

// import ProductGrid from "../../components/ProductGrid";
// import ProductFilter from "../../components/ProductFilter";
// import CollectionDescription from "../../components/CollectionDescription";
// import SortDropdown from "../../components/SortDropdown";

// import BrandSlider from "@/components/BrandSlider";
// import { allProducts } from "../../data/allProducts";
// import { CONTACT_LENS_FILTERS } from "../../data/filterConfig";
// import { useProductFilters } from "../../hooks/useProductFilters";
// import "../../styles/allProducts.css";
// import "../../styles/productsToolbar.css";

// const SORT_OPTIONS = [
//   { value: "featured", label: "Featured" },
//   { value: "best-selling", label: "Best selling" },
//   { value: "price-low-high", label: "Price: Low to High" },
//   { value: "price-high-low", label: "Price: High to Low" },
// ];

// /* =========================================
//    ALL PRODUCTS PAGE
// ========================================= */

// export default function AllProductsPage() {
//   const [sortBy, setSortBy] = useState("featured");

//   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);

//   const productsPerPage = 12;

//   /* filter state + the filtered list (see data/filterConfig.js) */

//   const filters = useProductFilters(CONTACT_LENS_FILTERS, allProducts);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filters.selected, filters.price]);

//   /* =========================================
//      SORT PRODUCTS
//   ========================================= */

//   const filteredAndSortedProducts = useMemo(() => {
//     const result = [...filters.filteredProducts];

//     switch (sortBy) {
//       case "best-selling":
//         result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
//         break;

//       case "a-z":
//         result.sort((a, b) => a.name.localeCompare(b.name));
//         break;

//       case "z-a":
//         result.sort((a, b) => b.name.localeCompare(a.name));
//         break;

//       case "price-low-high":
//         result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
//         break;

//       case "price-high-low":
//         result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
//         break;

//       default:
//         break;
//     }

//     return result;
//   }, [filters.filteredProducts, sortBy]);

//   /* =========================================
//      PAGINATION
//   ========================================= */

//   const totalPages = Math.ceil(
//     filteredAndSortedProducts.length / productsPerPage,
//   );

//   const indexOfLastProduct = currentPage * productsPerPage;

//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

//   const currentProducts = filteredAndSortedProducts.slice(
//     indexOfFirstProduct,
//     indexOfLastProduct,
//   );

//   const totalProducts = filteredAndSortedProducts.length;
//   const showingFrom = totalProducts ? indexOfFirstProduct + 1 : 0;
//   const showingTo = Math.min(indexOfLastProduct, totalProducts);

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
//     <div className="all-products-page">
//       {/* =====================================
//           BANNER
//       ===================================== */}

//       <section className="contact-lens-banner">
//         <img
//           src="/images/contactlensbanner.jpg"
//           alt="Contact Lenses - LensMartIndia"
//           className="contact-lens-banner-image"
//         />
//       </section>

//       {/* =====================================
//           PRODUCT COUNT + SORT
//       ===================================== */}

//       <section className="pt-bar" aria-label="Product results">
//         <div className="pt-inner">
//           <p className="pt-count" aria-live="polite">
//             {totalProducts === 0 ? (
//               "No products found"
//             ) : (
//               <>
//                 <span className="pt-range">
//                   Showing{" "}
//                   <strong>
//                     {showingFrom}–{showingTo}
//                   </strong>{" "}
//                   of{" "}
//                 </span>
//                 <strong>{totalProducts}</strong> products
//               </>
//             )}
//           </p>

//           <SortDropdown
//             label="Sort by"
//             options={SORT_OPTIONS}
//             value={sortBy}
//             onChange={(value) => {
//               setSortBy(value);
//               setCurrentPage(1);
//             }}
//           />
//         </div>
//       </section>

//       {/* =====================================
//           PRODUCTS SECTION
//       ===================================== */}

//       <section className="all-products-content-section">
//         <div className="all-products-layout">
//           {/* =================================
//               DESKTOP FILTER
//           ================================= */}

//           <aside className="all-products-sidebar desktop-filter-sidebar">
//             <ProductFilter filters={filters} />
//           </aside>

//           {/* =================================
//               PRODUCTS RIGHT SIDE
//           ================================= */}

//           <div className="all-products-main">
//             {/* =================================
//                 PRODUCTS
//             ================================= */}

//             <ProductGrid
//               products={currentProducts}
//               productType="contact-lenses"
//               defaultRating={4.8}
//               defaultReviews={95}
//               emptyState={
//                 <div className="all-products-empty">
//                   <h2>No products found</h2>

//                   <p>Try changing or clearing your filters.</p>

//                   <button type="button" onClick={filters.clear}>
//                     CLEAR FILTERS
//                   </button>
//                 </div>
//               }
//             />

//             {/* =================================
//                 PAGINATION
//             ================================= */}

//             {totalPages > 1 && (
//               <div className="all-products-pagination">
//                 <button
//                   type="button"
//                   className="pagination-arrow"
//                   disabled={currentPage === 1}
//                   onClick={() => goToPage(currentPage - 1)}
//                 >
//                   ‹
//                 </button>

//                 {Array.from(
//                   { length: totalPages },
//                   (_, index) => index + 1,
//                 ).map((page) => (
//                   <button
//                     type="button"
//                     key={page}
//                     className={
//                       currentPage === page
//                         ? "pagination-number active"
//                         : "pagination-number"
//                     }
//                     onClick={() => goToPage(page)}
//                   >
//                     {page}
//                   </button>
//                 ))}

//                 <button
//                   type="button"
//                   className="pagination-arrow"
//                   disabled={currentPage === totalPages}
//                   onClick={() => goToPage(currentPage + 1)}
//                 >
//                   ›
//                 </button>
//               </div>
//             )}

//             {/* FLOATING FILTER BUTTON (tablet + mobile): floats at the
//                 bottom of the screen, then rests at the end of the grid */}

//             <div className="floating-filter-bar">
//               <button
//                 type="button"
//                 className="floating-filter-button"
//                 onClick={() => setMobileFiltersOpen(true)}
//               >
//                 <svg viewBox="0 0 24 24" aria-hidden="true">
//                   <path d="M4 6h16M7 12h10M10 18h4" />
//                 </svg>
//                 Filters
//                 {filters.activeCount > 0 && (
//                   <span className="floating-filter-badge">
//                     {filters.activeCount}
//                     <span className="pf-sr"> selected</span>
//                   </span>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         <CollectionDescription type="contact-lenses" products={allProducts} />
//       </section>

//       {/* =====================================
//           MOBILE FILTER DRAWER
//       ===================================== */}

//       <ProductFilter
//         filters={filters}
//         variant="drawer"
//         open={mobileFiltersOpen}
//         onClose={() => setMobileFiltersOpen(false)}
//         productLabel="Product"
//       />
//       <aside
//         className={`mobile-filter-drawer ${mobileFiltersOpen ? "open" : ""}`}
//       >
//         <div className="mobile-filter-header">
//           <h2>Filters</h2>

//           <div className="mobile-filter-header-actions">
//             <button
//               type="button"
//               className="mobile-reset-button"
//               onClick={clearFilters}
//             >
//               RESET
//             </button>

//             <button
//               type="button"
//               className="mobile-filter-close"
//               onClick={() => setMobileFiltersOpen(false)}
//               aria-label="Close filters"
//             >
//               ×
//             </button>
//           </div>
//         </div>

//         <div className="mobile-filter-scroll">{renderFilters()}</div>

//         <button
//           type="button"
//           className="mobile-show-products"
//           onClick={() => setMobileFiltersOpen(false)}
//         >
//           SHOW {filteredAndSortedProducts.length} PRODUCTS
//         </button>
//       </aside>
        
//         <BrandSlider />
      
//     </div>
//   );
// }

 


// "use client";

// import { useEffect, useMemo, useState } from "react";

// import ProductGrid from "../../components/ProductGrid";
// import ProductFilter from "../../components/ProductFilter";
// import CollectionDescription from "../../components/CollectionDescription";
// import SortDropdown from "../../components/SortDropdown";

// import BrandSlider from "@/components/BrandSlider";
// // import { allProducts } from "../../data/allProducts";
// import { allProducts } from "../../data/allProducts";
// // import allProducts from "../../data/allProducts";
// import { CONTACT_LENS_FILTERS } from "../../data/filterConfig";
// import { useProductFilters } from "../../hooks/useProductFilters";
// import "../../styles/allProducts.css";
// import "../../styles/productsToolbar.css";

// const SORT_OPTIONS = [
//   { value: "featured", label: "Featured" },
//   { value: "best-selling", label: "Best selling" },
//   { value: "price-low-high", label: "Price: Low to High" },
//   { value: "price-high-low", label: "Price: High to Low" },
// ];

// /* =========================================
//    ALL PRODUCTS PAGE
// ========================================= */

// export default function AllProductsPage() {
//   const [sortBy, setSortBy] = useState("featured");
//   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);

//   const productsPerPage = 12;

//   // Filter state and filtered products
//   const filters = useProductFilters(CONTACT_LENS_FILTERS, allProducts);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filters.selected, filters.price]);

//   // Sort products
//   const filteredAndSortedProducts = useMemo(() => {
//     const result = [...filters.filteredProducts];

//     switch (sortBy) {
//       case "best-selling":
//         // Use the available bestseller flag when product data provides it.
//         result.sort(
//           (a, b) => Number(Boolean(b.bestseller)) - Number(Boolean(a.bestseller)),
//         );
//         break;

//       case "price-low-high":
//         result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
//         break;

//       case "price-high-low":
//         result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
//         break;

//       default:
//         break;
//     }

//     return result;
//   }, [filters.filteredProducts, sortBy]);

//   // Pagination
//   const totalProducts = filteredAndSortedProducts.length;
//   const totalPages = Math.ceil(totalProducts / productsPerPage);
//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

//   const currentProducts = filteredAndSortedProducts.slice(
//     indexOfFirstProduct,
//     indexOfLastProduct,
//   );

//   const showingFrom = totalProducts ? indexOfFirstProduct + 1 : 0;
//   const showingTo = Math.min(indexOfLastProduct, totalProducts);

//   const goToPage = (page) => {
//     if (page < 1 || page > totalPages) return;

//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   return (
//     <div className="all-products-page">
//       {/* BANNER */}
//       <section className="contact-lens-banner">
//         <img
//           src="/images/contactlensbanner.jpg"
//           alt="Contact Lenses - LensMartIndia"
//           className="contact-lens-banner-image"
//         />
//       </section>

//       {/* PRODUCT COUNT + SORT */}
//      <section className="pt-bar pt-bar--flush" aria-label="Product results">
//   <div className="pt-inner">
//     {/* Product count - first row */}
//     <p className="pt-count" aria-live="polite">
//       {totalProducts === 0 ? (
//         "No products found"
//       ) : (
//         <>
//           <strong>{totalProducts}</strong> products
//         </>
//       )}
//     </p>

//     {/* Filters + Featured - second row */}
//     <div className="mobile-toolbar-controls">
//       <div className="collection-mobile-filter">
//         <button
//           type="button"
//           className="floating-filter-button"
//           onClick={() => setMobileFiltersOpen(true)}
//           aria-haspopup="dialog"
//           aria-expanded={mobileFiltersOpen}
//         >
//           <svg viewBox="0 0 24 24" aria-hidden="true">
//             <path d="M4 6h16M7 12h10M10 18h4" />
//           </svg>
//           Filters
//           {filters.activeCount > 0 && (
//             <span className="floating-filter-badge">
//               {filters.activeCount}
//             </span>
//           )}
//         </button>
//       </div>

//       <SortDropdown
//         label="Sort by"
//         options={SORT_OPTIONS}
//         value={sortBy}
//         onChange={(value) => {
//           setSortBy(value);
//           setCurrentPage(1);
//         }}
//       />
//     </div>
//   </div>
// </section>

//       {/* PRODUCTS SECTION */}
//       <section className="all-products-content-section">
//         <div className="all-products-layout">
//           {/* DESKTOP FILTER */}
//           <aside className="all-products-sidebar desktop-filter-sidebar">
//             <ProductFilter filters={filters} />
//           </aside>

//           {/* PRODUCTS */}
//           <div className="all-products-main">
//             <ProductGrid
//               products={currentProducts}
//               productType="contact-lenses"
//               defaultRating={4.8}
//               defaultReviews={95}
//               emptyState={
//                 <div className="all-products-empty">
//                   <h2>No products found</h2>
//                   <p>Try changing or clearing your filters.</p>
//                   <button type="button" onClick={filters.clear}>
//                     CLEAR FILTERS
//                   </button>
//                 </div>
//               }
//             />

//             {/* PAGINATION */}
//             {totalPages > 1 && (
//               <nav
//                 className="all-products-pagination"
//                 aria-label="Product pagination"
//               >
//                 <button
//                   type="button"
//                   className="pagination-arrow"
//                   disabled={currentPage === 1}
//                   onClick={() => goToPage(currentPage - 1)}
//                   aria-label="Previous page"
//                 >
//                   ‹
//                 </button>

//                 {Array.from({ length: totalPages }, (_, index) => index + 1).map(
//                   (page) => (
//                     <button
//                       type="button"
//                       key={page}
//                       className={
//                         currentPage === page
//                           ? "pagination-number active"
//                           : "pagination-number"
//                       }
//                       aria-current={currentPage === page ? "page" : undefined}
//                       onClick={() => goToPage(page)}
//                     >
//                       {page}
//                     </button>
//                   ),
//                 )}

//                 <button
//                   type="button"
//                   className="pagination-arrow"
//                   disabled={currentPage === totalPages}
//                   onClick={() => goToPage(currentPage + 1)}
//                   aria-label="Next page"
//                 >
//                   ›
//                 </button>
//               </nav>
//             )}

//             {/* FLOATING FILTER BUTTON (tablet + mobile) */}
//             {/* MOBILE FILTER BUTTON */}
// <div className="floating-filter-bar">
//   <button
//     type="button"
//     className="floating-filter-button"
//     onClick={() => setMobileFiltersOpen(true)}
//     aria-haspopup="dialog"
//     aria-expanded={mobileFiltersOpen}
//   >
//     <svg viewBox="0 0 24 24" aria-hidden="true">
//       <path d="M4 6h16M7 12h10M10 18h4" />
//     </svg>

//     Filters

//     {filters.activeCount > 0 && (
//       <span className="floating-filter-badge">
//         {filters.activeCount}
//       </span>
//     )}
//   </button>
// </div>
//           </div>
//         </div>

//         <CollectionDescription type="contact-lenses" products={allProducts} />
//       </section>

//       {/* MOBILE / TABLET FILTER DRAWER
//           Reuse ProductFilter's drawer variant. Do not render a second custom
//           drawer here because clearFilters and renderFilters are not defined. */}
//       <ProductFilter
//         filters={filters}
//         variant="drawer"
//         open={mobileFiltersOpen}
//         onClose={() => setMobileFiltersOpen(false)}
//         productLabel="Product"
//       />

//       <BrandSlider />
//     </div>
//   );
// }















"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import ProductGrid from "../../components/ProductGrid";
import ProductFilter from "../../components/ProductFilter";
import CollectionDescription from "../../components/CollectionDescription";
import SortDropdown from "../../components/SortDropdown";

import BrandSlider from "@/components/BrandSlider";
import { allProducts } from "../../data/allProducts";
import { CONTACT_LENS_FILTERS } from "../../data/filterConfig";
import { useProductFilters } from "../../hooks/useProductFilters";

import "../../styles/allProducts.css";
import "../../styles/productsToolbar.css";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "best-selling", label: "Best selling" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
];

const FILTER_QUERY_KEYS = [
  "brand",
  "lensType",
  "schedule",
  "manufacturer",
];

function AllProductsContent() {
  const searchParams = useSearchParams();
  const urlKey = searchParams.toString();

  const productsSectionRef = useRef(null);

  const [sortBy, setSortBy] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 12;

  // URL query parameters automatically select the matching filter options.
  const filters = useProductFilters(CONTACT_LENS_FILTERS, allProducts);

  // Reset pagination when the filters or price range change.
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.selected, filters.price]);

  // Scroll to the products and filters section when a navbar filter link
  // is clicked, including when the user is already on /all-products.
  useEffect(() => {
    const hasFilterQuery = FILTER_QUERY_KEYS.some((key) =>
      searchParams.getAll(key).some((value) => value.trim() !== ""),
    );

    if (!hasFilterQuery) return;

    let firstTimer;
    let secondTimer;

    const scrollToProducts = () => {
      const target = productsSectionRef.current;

      if (!target) return;

      const header = document.querySelector(".main-header");
      const headerHeight = header?.getBoundingClientRect().height || 0;

      const targetTop =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        16;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth",
      });
    };

    // Wait for the URL-driven filter state and layout to update.
    firstTimer = setTimeout(scrollToProducts, 250);
    secondTimer = setTimeout(scrollToProducts, 750);

    return () => {
      clearTimeout(firstTimer);
      clearTimeout(secondTimer);
    };
  }, [urlKey, searchParams]);

  // Sort products.
  const filteredAndSortedProducts = useMemo(() => {
    const result = [...filters.filteredProducts];

    switch (sortBy) {
      case "best-selling":
        result.sort(
          (a, b) =>
            Number(Boolean(b.bestseller)) -
            Number(Boolean(a.bestseller)),
        );
        break;

      case "price-low-high":
        result.sort(
          (a, b) => Number(a.price || 0) - Number(b.price || 0),
        );
        break;

      case "price-high-low":
        result.sort(
          (a, b) => Number(b.price || 0) - Number(a.price || 0),
        );
        break;

      default:
        break;
    }

    return result;
  }, [filters.filteredProducts, sortBy]);

  // Pagination.
  const totalProducts = filteredAndSortedProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filteredAndSortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const showingFrom = totalProducts ? indexOfFirstProduct + 1 : 0;
  const showingTo = Math.min(indexOfLastProduct, totalProducts);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    const target = productsSectionRef.current;

    if (target) {
      const header = document.querySelector(".main-header");
      const headerHeight = header?.getBoundingClientRect().height || 0;

      window.scrollTo({
        top:
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight -
          16,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="all-products-page">
      {/* CONTACT LENS BANNER */}
      <section className="contact-lens-banner">
        <img
          src="/images/contactlensbanner.jpg"
          alt="Contact Lenses - LensMartIndia"
          className="contact-lens-banner-image"
        />
      </section>

      {/* PRODUCT COUNT + SORT + MOBILE FILTERS */}
      <section
        className="pt-bar pt-bar--flush"
        aria-label="Product results"
      >
        <div className="pt-inner">
          <p className="pt-count" aria-live="polite">
            {totalProducts === 0 ? (
              "No products found"
            ) : (
              <>
                <strong>{totalProducts}</strong> products
              </>
            )}
          </p>

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

      {/* FILTERS + PRODUCTS */}
      <section
        id="products"
        className="all-products-content-section"
        ref={productsSectionRef}
      >
        <div className="all-products-layout">
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="all-products-sidebar desktop-filter-sidebar">
            <ProductFilter filters={filters} />
          </aside>

          {/* PRODUCT GRID */}
          <div className="all-products-main">
            <ProductGrid
              products={currentProducts}
              productType="contact-lenses"
              defaultRating={4.8}
              defaultReviews={95}
              emptyState={
                <div className="all-products-empty">
                  <h2>No products found</h2>
                  <p>Try changing or clearing your filters.</p>

                  <button type="button" onClick={filters.clear}>
                    CLEAR FILTERS
                  </button>
                </div>
              }
            />

            {/* PAGINATION */}
            {totalPages > 1 && (
              <nav
                className="all-products-pagination"
                aria-label="Product pagination"
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

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    type="button"
                    key={page}
                    className={
                      currentPage === page
                        ? "pagination-number active"
                        : "pagination-number"
                    }
                    aria-current={
                      currentPage === page ? "page" : undefined
                    }
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                ))}

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

            {/* FLOATING MOBILE FILTER BUTTON */}
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
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <CollectionDescription
          type="contact-lenses"
          products={allProducts}
        />
      </section>

      {/* MOBILE / TABLET FILTER DRAWER */}
      <ProductFilter
        filters={filters}
        variant="drawer"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        productLabel="Product"
      />

      <BrandSlider />
    </div>
  );
}

export default function AllProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="all-products-page">
          <p>Loading contact lenses...</p>
        </div>
      }
    >
      <AllProductsContent />
    </Suspense>
  );
}
