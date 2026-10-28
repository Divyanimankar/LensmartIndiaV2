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

// -------------------- Meta data-------------------------

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

// Square pagination buttons (inline so no other CSS can override it)
const SQUARE_BUTTON_STYLE = { borderRadius: 0 };

// Compact page list, e.g. 1 ... 4 5 6 ... 12 (keeps pagination on one line on mobile)
const getPageNumbers = (current, total) => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [1];

  if (current > 3) pages.push("...");

  for (
    let p = Math.max(2, current - 1);
    p <= Math.min(total - 1, current + 1);
    p++
  ) {
    pages.push(p);
  }

  if (current < total - 2) pages.push("...");

  pages.push(total);

  return pages;
};

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

            {/* PAGINATION (square buttons) */}
            {totalPages > 1 && (
              <nav
                className="all-products-pagination"
                aria-label="Product pagination"
              >
                <button
                  type="button"
                  className="pagination-arrow"
                  style={SQUARE_BUTTON_STYLE}
                  disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
                  aria-label="Previous page"
                >
                  ‹
                </button>

                {getPageNumbers(currentPage, totalPages).map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`dots-${index}`}
                      className="pagination-dots"
                      aria-hidden="true"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      type="button"
                      key={page}
                      style={SQUARE_BUTTON_STYLE}
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
                  ),
                )}

                <button
                  type="button"
                  className="pagination-arrow"
                  style={SQUARE_BUTTON_STYLE}
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
