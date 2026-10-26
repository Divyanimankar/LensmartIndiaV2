"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import Link from "next/link";

import ProductGrid from "../../components/ProductGrid";
import ProductFilter from "../../components/ProductFilter";
import CollectionDescription from "../../components/CollectionDescription";
import SortDropdown from "../../components/SortDropdown";

import { EYEGLASSES_FILTERS } from "../../data/filterConfig";
import { useProductFilters } from "../../hooks/useProductFilters";
import { eyeglassesProducts as products } from "../../data/eyeglassesProducts";
import GlassesBrand from "../../components/GlassesBrand";
import "../../styles/eyeglasses.css";
import "../../styles/productsToolbar.css";
import "../../styles/productListing.css";

import { Suspense } from "react";

const PRODUCTS_PER_PAGE = 12;

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "bestseller", label: "Bestseller" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

/* =========================================
   PRODUCT DATA
\========================================= */

/* =========================================
   PAGE
========================================= */




function EyeglassesContent() {


  const searchParams = useSearchParams();
const urlKey = searchParams.toString();
const productsRef = useRef(null);

/* navbar se filter wala link khule to filter + products tak scroll karo */
useEffect(() => {
  if (!urlKey) return;

  const timer = setTimeout(() => {
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 120);

  return () => clearTimeout(timer);
}, [urlKey]);

  // ... aapka poora existing code, jaisa hai waisa
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filters = useProductFilters(EYEGLASSES_FILTERS, products);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.selected, filters.price]);

  const sortedProducts = useMemo(() => {
    const result = [...filters.filteredProducts];

    switch (sortBy) {
      case "bestseller":
        result.sort((a, b) => Number(b.bestseller) - Number(a.bestseller));
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
    <div className="eyeglasses-page">
      <div className="eyeglasses-container">
        <nav className="eyeglasses-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>›</span>
          <span>Eyeglasses</span>
        </nav>
      </div>

      <section className="eyeglasses-banner">
        <img
          src="/images/eyeglassesbanner.png"
          alt="Eyeglasses collection"
          className="eyeglasses-banner-image"
        />
      </section>

      <section className="eyeglasses-products-section" ref={productsRef}>
        <div className="eyeglasses-container">
          {/* <section className="pt-bar pt-bar--flush" aria-label="Product results">
            <div className="pt-inner">
              <p className="pt-count" aria-live="polite">
                {totalProducts === 0 ? (
                  "No products found"
                ) : (
                  <>
                    <span className="pt-range">
                      Showing <strong>{showingFrom}–{showingTo}</strong> of{" "}
                    </span>
                    <strong>{totalProducts}</strong> products
                  </>
                )}
              </p>

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
          </section> */}
          
<section className="pt-bar pt-bar--flush" aria-label="Product results">
  <div className="pt-inner">
    <p className="pt-count" aria-live="polite">
      {totalProducts === 0 ? (
        "No products found"
      ) : (
        <>
          <span className="pt-range">
           {" "}
          </span>
          <strong>{totalProducts}</strong> products
        </>
      )}
    </p>

    <div className="eyeglasses-mobile-toolbar">
      <button
        type="button"
        className="eyeglasses-inline-filter"
        onClick={() => setMobileFiltersOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={mobileFiltersOpen}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 6h16M7 12h10M10 18h4" />
        </svg>

        <span>Filters</span>

        {filters.activeCount > 0 && (
          <span className="eyeglasses-inline-filter-count">
            {filters.activeCount}
          </span>
        )}
      </button>

      <div className="eyeglasses-mobile-sort">
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
                    productType="eyeglasses"
                  />

                  {totalPages > 1 && (
                    <nav
                      className="eyeglasses-pagination"
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
                              className={`pagination-number ${
                                currentPage === page ? "active" : ""
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
                <div className="eyeglasses-no-products">
                  <h3>No products found</h3>
                  <p>Try changing or clearing your filters.</p>
                  <button type="button" onClick={filters.clear}>
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* <div className="floating-filter-bar">
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
          </div> */}

          <CollectionDescription type="eyeglasses" products={products} />
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


// export default function EyeglassesPage() {
//   const [sortBy, setSortBy] = useState("featured");
//   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);

//   const filters = useProductFilters(EYEGLASSES_FILTERS, products);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filters.selected, filters.price]);

//   const sortedProducts = useMemo(() => {
//     const result = [...filters.filteredProducts];

//     switch (sortBy) {
//       case "bestseller":
//         result.sort((a, b) => Number(b.bestseller) - Number(a.bestseller));
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
//     if (page < 1 || page > totalPages) return;

//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   return (
//     <div className="eyeglasses-page">
//       <div className="eyeglasses-container">
//         <nav className="eyeglasses-breadcrumb" aria-label="Breadcrumb">
//           <Link href="/">Home</Link>
//           <span>›</span>
//           <span>Eyeglasses</span>
//         </nav>
//       </div>

//       <section className="eyeglasses-banner">
//         <img
//           src="/images/eyeglassesbanner.png"
//           alt="Eyeglasses collection"
//           className="eyeglasses-banner-image"
//         />
//       </section>

//       <section className="eyeglasses-products-section">
//         <div className="eyeglasses-container">
//           {/* <section className="pt-bar pt-bar--flush" aria-label="Product results">
//             <div className="pt-inner">
//               <p className="pt-count" aria-live="polite">
//                 {totalProducts === 0 ? (
//                   "No products found"
//                 ) : (
//                   <>
//                     <span className="pt-range">
//                       Showing <strong>{showingFrom}–{showingTo}</strong> of{" "}
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
//           </section> */}
          
// <section className="pt-bar pt-bar--flush" aria-label="Product results">
//   <div className="pt-inner">
//     <p className="pt-count" aria-live="polite">
//       {totalProducts === 0 ? (
//         "No products found"
//       ) : (
//         <>
//           <span className="pt-range">
//             Showing <strong>{showingFrom}–{showingTo}</strong> of{" "}
//           </span>
//           <strong>{totalProducts}</strong> products
//         </>
//       )}
//     </p>

//     <div className="eyeglasses-mobile-toolbar">
//       <button
//         type="button"
//         className="eyeglasses-inline-filter"
//         onClick={() => setMobileFiltersOpen(true)}
//         aria-haspopup="dialog"
//         aria-expanded={mobileFiltersOpen}
//       >
//         <svg viewBox="0 0 24 24" aria-hidden="true">
//           <path d="M4 6h16M7 12h10M10 18h4" />
//         </svg>

//         <span>Filters</span>

//         {filters.activeCount > 0 && (
//           <span className="eyeglasses-inline-filter-count">
//             {filters.activeCount}
//           </span>
//         )}
//       </button>

//       <div className="eyeglasses-mobile-sort">
//         <SortDropdown
//           label="Sort by"
//           options={SORT_OPTIONS}
//           value={sortBy}
//           onChange={(value) => {
//             setSortBy(value);
//             setCurrentPage(1);
//           }}
//         />
//       </div>
//     </div>
//   </div>
// </section>


//           <div className="pl-layout">
//             <aside className="pl-sidebar" aria-label="Filters">
//               <ProductFilter filters={filters} />
//             </aside>

//             <div className="pl-main">
//               {currentProducts.length > 0 ? (
//                 <>
//                   <ProductGrid
//                     products={currentProducts}
//                     productType="eyeglasses"
//                   />

//                   {totalPages > 1 && (
//                     <nav
//                       className="eyeglasses-pagination"
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
//                 <div className="eyeglasses-no-products">
//                   <h3>No products found</h3>
//                   <p>Try changing or clearing your filters.</p>
//                   <button type="button" onClick={filters.clear}>
//                     Clear Filters
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* <div className="floating-filter-bar">
//             <button
//               type="button"
//               className="floating-filter-button"
//               onClick={() => setMobileFiltersOpen(true)}
//               aria-haspopup="dialog"
//               aria-expanded={mobileFiltersOpen}
//             >
//               <svg viewBox="0 0 24 24" aria-hidden="true">
//                 <path d="M4 6h16M7 12h10M10 18h4" />
//               </svg>
//               Filters
//               {filters.activeCount > 0 && (
//                 <span className="floating-filter-badge">
//                   {filters.activeCount}
//                   <span className="pf-sr"> selected</span>
//                 </span>
//               )}
//             </button>
//           </div> */}

//           <CollectionDescription type="eyeglasses" products={products} />
//         </div>
//       </section>

//       <ProductFilter
//         filters={filters}
//         variant="drawer"
//         open={mobileFiltersOpen}
//         onClose={() => setMobileFiltersOpen(false)}
//         productLabel="Product"
//       />

//       <GlassesBrand />
//     </div>
//   );
// }
export default function EyeglassesPage() {
  return (
    <Suspense fallback={null}>
      <EyeglassesContent />
    </Suspense>
  );
}