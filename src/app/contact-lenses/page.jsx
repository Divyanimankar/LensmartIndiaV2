"use client";

import { useMemo, useState } from "react";

import ProductGrid from "../../components/ProductGrid";

import { allProducts } from "../../data/allProducts";
import "../../styles/allProducts.css";

/* =========================================
   HELPERS
========================================= */

const getProductPrice = (product) =>
  Number(product.price ?? product.salePrice ?? 0);

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .trim();

/* What each filter reads from a product.
   A product can match more than one value (e.g. Spherical + Color). */
const FILTER_VALUES = {
  Brand: (product) => [product.brand],
  "Lens Type": (product) => [product.type, product.isColor ? "Color" : ""],
  "Replacement Schedule": (product) => [product.replacementSchedule],
  Manufacturer: (product) => [product.manufacturer],
};

/* =========================================
   FILTER DATA
========================================= */

const filterData = {
  Brand: [
    "Acuvue",
    "Air Optix",
    "Aspire",
    "Bausch + Lomb",
    "Biofinity",
    "Biomedics",
    "Biotrue",
    "Dailies",
    "FreshLook",
    "Iconnect",
    "Lacelle",
    "MyDay",
    "Optima",
    "Precision1",
    "Proclear",
    "PureVision",
    "SofLens",
    "Ultra",
  ],

  "Lens Type": ["Spherical", "Toric", "Multifocal", "Color"],

  "Replacement Schedule": [
    "Daily Disposable",
    "Weekly Disposable",
    "Monthly Disposable",
  ],

  Manufacturer: [
    "Johnson & Johnson",
    "Alcon",
    "CooperVision",
    "Bausch + Lomb",
    "Aspire",
    "Iconnect",
    "Lacelle",
  ],
};

/* =========================================
   PRICE BOUNDS (min / max from products)
========================================= */

const productPrices = allProducts
  .map(getProductPrice)
  .filter((price) => price > 0);

const PRICE_BOUNDS = {
  min: productPrices.length ? Math.floor(Math.min(...productPrices)) : 0,
  max: productPrices.length ? Math.ceil(Math.max(...productPrices)) : 10000,
};

/* =========================================
   OPTION COUNTS (products per option)
========================================= */

const OPTION_COUNTS = (() => {
  const counts = {
    Brand: {},
    "Lens Type": {},
    "Replacement Schedule": {},
    Manufacturer: {},
  };

  allProducts.forEach((product) => {
    Object.entries(FILTER_VALUES).forEach(([category, getValues]) => {
      getValues(product).forEach((value) => {
        const key = normalize(value);

        if (!key) return;

        counts[category][key] = (counts[category][key] || 0) + 1;
      });
    });
  });

  return counts;
})();

const getOptionCount = (category, option) =>
  OPTION_COUNTS[category]?.[normalize(option)] || 0;

const EMPTY_FILTERS = {
  Brand: [],
  "Lens Type": [],
  "Replacement Schedule": [],
  Manufacturer: [],
};

/* =========================================
   ALL PRODUCTS PAGE
========================================= */

export default function AllProductsPage() {
  const [sortBy, setSortBy] = useState("featured");

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [openFilters, setOpenFilters] = useState({
    Brand: true,
    "Lens Type": false,
    "Replacement Schedule": false,
    Manufacturer: false,
    "Price Range": true,
  });

  const [selectedFilters, setSelectedFilters] = useState(EMPTY_FILTERS);

  const [brandSearch, setBrandSearch] = useState("");

  const [priceRange, setPriceRange] = useState([
    PRICE_BOUNDS.min,
    PRICE_BOUNDS.max,
  ]);

  const [priceInputs, setPriceInputs] = useState({
    min: String(PRICE_BOUNDS.min),
    max: String(PRICE_BOUNDS.max),
  });

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 12;

  /* =========================================
     FILTER ACCORDION
  ========================================= */

  const toggleFilter = (category) => {
    setOpenFilters((previous) => ({
      ...previous,
      [category]: !previous[category],
    }));
  };

  /* =========================================
     FILTER CHECKBOX
  ========================================= */

  const handleFilterChange = (category, option) => {
    setSelectedFilters((previous) => {
      const alreadySelected = previous[category].includes(option);

      return {
        ...previous,

        [category]: alreadySelected
          ? previous[category].filter((item) => item !== option)
          : [...previous[category], option],
      };
    });

    setCurrentPage(1);
  };

  /* =========================================
     PRICE RANGE HANDLERS
  ========================================= */

  const priceFilterActive =
    priceRange[0] !== PRICE_BOUNDS.min || priceRange[1] !== PRICE_BOUNDS.max;

  const handleSliderChange = (thumb, rawValue) => {
    const value = Number(rawValue);

    const nextRange =
      thumb === "min"
        ? [Math.min(value, priceRange[1]), priceRange[1]]
        : [priceRange[0], Math.max(value, priceRange[0])];

    setPriceRange(nextRange);

    setPriceInputs({
      min: String(nextRange[0]),
      max: String(nextRange[1]),
    });

    setCurrentPage(1);
  };

  const handlePriceInputChange = (thumb, rawValue) => {
    setPriceInputs((previous) => ({
      ...previous,
      [thumb]: rawValue.replace(/[^0-9]/g, ""),
    }));
  };

  const commitPriceInput = (thumb) => {
    const parsed = parseInt(priceInputs[thumb], 10);

    if (Number.isNaN(parsed)) {
      setPriceInputs({
        min: String(priceRange[0]),
        max: String(priceRange[1]),
      });

      return;
    }

    let nextRange;

    if (thumb === "min") {
      const clamped = Math.min(
        Math.max(parsed, PRICE_BOUNDS.min),
        priceRange[1],
      );

      nextRange = [clamped, priceRange[1]];
    } else {
      const clamped = Math.max(
        Math.min(parsed, PRICE_BOUNDS.max),
        priceRange[0],
      );

      nextRange = [priceRange[0], clamped];
    }

    setPriceRange(nextRange);

    setPriceInputs({
      min: String(nextRange[0]),
      max: String(nextRange[1]),
    });

    setCurrentPage(1);
  };

  /* =========================================
     CLEAR FILTERS
  ========================================= */

  const clearFilters = () => {
    setSelectedFilters(EMPTY_FILTERS);

    setBrandSearch("");

    setPriceRange([PRICE_BOUNDS.min, PRICE_BOUNDS.max]);

    setPriceInputs({
      min: String(PRICE_BOUNDS.min),
      max: String(PRICE_BOUNDS.max),
    });

    setCurrentPage(1);
  };

  /* =========================================
     FILTER + SORT PRODUCTS
  ========================================= */

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...allProducts];

    /* BRAND / LENS TYPE / REPLACEMENT SCHEDULE / MANUFACTURER */

    Object.entries(FILTER_VALUES).forEach(([category, getValues]) => {
      const selected = selectedFilters[category];

      if (selected.length > 0) {
        result = result.filter((product) => {
          const values = getValues(product).map(normalize);

          return selected.some((option) => values.includes(normalize(option)));
        });
      }
    });

    /* PRICE RANGE */

    if (priceFilterActive) {
      result = result.filter((product) => {
        const price = getProductPrice(product);

        return price >= priceRange[0] && price <= priceRange[1];
      });
    }

    /* SORT */

    switch (sortBy) {
      case "best-selling":
        result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        break;

      case "a-z":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "z-a":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;

      case "price-low-high":
        result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        break;

      case "price-high-low":
        result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        break;

      default:
        break;
    }

    return result;
  }, [selectedFilters, priceRange, priceFilterActive, sortBy]);

  /* =========================================
     PAGINATION
  ========================================= */

  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / productsPerPage,
  );

  const indexOfLastProduct = currentPage * productsPerPage;

  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filteredAndSortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================
     FORMAT PRICE
  ========================================= */

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === "") {
      return null;
    }

    return Number(price).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });
  };

  /* =========================================
     FILTER UI (shared: desktop + mobile)
  ========================================= */

  const renderFilterGroup = (category, body) => (
    <div className="all-filter-group" key={category}>
      <button
        type="button"
        className="all-filter-heading"
        onClick={() => toggleFilter(category)}
      >
        <span>{category}</span>

        <svg
          className={`all-filter-arrow ${openFilters[category] ? "open" : ""}`}
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {openFilters[category] && body}
    </div>
  );

  const renderCheckboxOptions = (category, options) => {
    const isBrand = category === "Brand";

    const visibleOptions =
      isBrand && brandSearch.trim()
        ? options.filter((option) =>
            normalize(option).includes(normalize(brandSearch)),
          )
        : options;

    return (
      <div className="all-filter-options">
        {isBrand && (
          <input
            type="text"
            className="all-filter-search"
            placeholder="Search brand"
            value={brandSearch}
            onChange={(event) => setBrandSearch(event.target.value)}
            aria-label="Search brand"
          />
        )}

        <div className={`all-filter-list ${isBrand ? "scrollable" : ""}`}>
          {visibleOptions.length > 0 ? (
            visibleOptions.map((option) => (
              <label className="all-filter-option" key={option}>
                <input
                  type="checkbox"
                  checked={selectedFilters[category].includes(option)}
                  onChange={() => handleFilterChange(category, option)}
                />

                <span className="all-filter-option-name">{option}</span>

                <span className="all-filter-option-count">
                  {getOptionCount(category, option)}
                </span>
              </label>
            ))
          ) : (
            <p className="all-filter-no-result">No brands found</p>
          )}
        </div>
      </div>
    );
  };

  const renderPriceFilter = () => {
    const span = PRICE_BOUNDS.max - PRICE_BOUNDS.min || 1;

    const leftPercent = ((priceRange[0] - PRICE_BOUNDS.min) / span) * 100;

    const rightPercent =
      100 - ((priceRange[1] - PRICE_BOUNDS.min) / span) * 100;

    return (
      <div className="all-filter-options price-filter">
        <div className="price-slider">
          <div className="price-slider-rail">
            <div
              className="price-slider-fill"
              style={{
                left: `${leftPercent}%`,
                right: `${rightPercent}%`,
              }}
            />
          </div>

          <input
            type="range"
            className="price-slider-input"
            min={PRICE_BOUNDS.min}
            max={PRICE_BOUNDS.max}
            step={1}
            value={priceRange[0]}
            onChange={(event) => handleSliderChange("min", event.target.value)}
            style={{
              zIndex: priceRange[0] > PRICE_BOUNDS.max - span * 0.1 ? 5 : 3,
            }}
            aria-label="Minimum price"
          />

          <input
            type="range"
            className="price-slider-input"
            min={PRICE_BOUNDS.min}
            max={PRICE_BOUNDS.max}
            step={1}
            value={priceRange[1]}
            onChange={(event) => handleSliderChange("max", event.target.value)}
            style={{ zIndex: 4 }}
            aria-label="Maximum price"
          />
        </div>

        <div className="price-slider-labels">
          <span>₹{formatPrice(PRICE_BOUNDS.min)}</span>
          <span>₹{formatPrice(PRICE_BOUNDS.max)}</span>
        </div>

        <div className="price-inputs">
          <label className="price-input-box">
            <span>₹</span>

            <input
              type="text"
              inputMode="numeric"
              value={priceInputs.min}
              onChange={(event) =>
                handlePriceInputChange("min", event.target.value)
              }
              onBlur={() => commitPriceInput("min")}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  commitPriceInput("min");
                }
              }}
              aria-label="Minimum price"
            />
          </label>

          <label className="price-input-box">
            <span>₹</span>

            <input
              type="text"
              inputMode="numeric"
              value={priceInputs.max}
              onChange={(event) =>
                handlePriceInputChange("max", event.target.value)
              }
              onBlur={() => commitPriceInput("max")}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  commitPriceInput("max");
                }
              }}
              aria-label="Maximum price"
            />
          </label>
        </div>
      </div>
    );
  };

  const renderFilters = () => (
    <>
      {Object.entries(filterData).map(([category, options]) =>
        renderFilterGroup(category, renderCheckboxOptions(category, options)),
      )}

      {renderFilterGroup("Price Range", renderPriceFilter())}
    </>
  );

  /* =========================================
     PAGE
  ========================================= */

  return (
    <div className="all-products-page">
      {/* =====================================
          BANNER
      ===================================== */}

      <section className="contact-lens-banner">
        <img
          src="/images/contactlensbanner.jpg"
          alt="Contact Lenses - LensMartIndia"
          className="contact-lens-banner-image"
        />
      </section>

      {/* =====================================
          PRODUCT COUNT + SORT
      ===================================== */}

      <section className="products-top-section">
        <div className="products-top-inner">
          <p className="products-count">
            {filteredAndSortedProducts.length} Products
          </p>

          <div className="top-sort-box">
            <span>Sort by:</span>

            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="featured">Featured</option>

              <option value="best-selling">Best selling</option>

              <option value="price-low-high">Price: low to high</option>

              <option value="price-high-low">Price: high to low</option>
            </select>
          </div>
        </div>
      </section>

      {/* =====================================
          PRODUCTS SECTION
      ===================================== */}

      <section className="all-products-content-section">
        <div className="all-products-layout">
          {/* =================================
              DESKTOP FILTER
          ================================= */}

          <aside className="all-products-sidebar desktop-filter-sidebar">
            <div className="all-products-filter-title">
              <h2>Filters</h2>

              <button type="button" onClick={clearFilters}>
                Reset
              </button>
            </div>

            {renderFilters()}
          </aside>

          {/* =================================
              PRODUCTS RIGHT SIDE
          ================================= */}

          <div className="all-products-main">
            {/* MOBILE TOOLBAR */}

            <div className="mobile-products-toolbar">
              <button
                type="button"
                className="mobile-filter-button"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 6h16M7 12h10M10 18h4" />
                </svg>
                Filters
              </button>

              <div className="mobile-sort">
                <span>Sort by:</span>

                <select
                  value={sortBy}
                  onChange={(event) => {
                    setSortBy(event.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="featured">Featured</option>

                  <option value="best-selling">Best selling</option>

                  <option value="price-low-high">Price: Low to High</option>

                  <option value="price-high-low">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* =================================
                PRODUCTS
            ================================= */}

            <ProductGrid
              products={currentProducts}
              productType="contact-lenses"
              defaultRating={4.8}
              defaultReviews={95}
              emptyState={
                <div className="all-products-empty">
                  <h2>No products found</h2>

                  <p>Try changing or clearing your filters.</p>

                  <button type="button" onClick={clearFilters}>
                    CLEAR FILTERS
                  </button>
                </div>
              }
            />

            {/* =================================
                PAGINATION
            ================================= */}

            {totalPages > 1 && (
              <div className="all-products-pagination">
                <button
                  type="button"
                  className="pagination-arrow"
                  disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
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
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================
          MOBILE FILTER OVERLAY
      ===================================== */}

      <div
        className={`mobile-filter-overlay ${mobileFiltersOpen ? "open" : ""}`}
        onClick={() => setMobileFiltersOpen(false)}
      />

      {/* =====================================
          MOBILE FILTER DRAWER
      ===================================== */}

      <aside
        className={`mobile-filter-drawer ${mobileFiltersOpen ? "open" : ""}`}
      >
        <div className="mobile-filter-header">
          <h2>Filters</h2>

          <div className="mobile-filter-header-actions">
            <button
              type="button"
              className="mobile-reset-button"
              onClick={clearFilters}
            >
              RESET
            </button>

            <button
              type="button"
              className="mobile-filter-close"
              onClick={() => setMobileFiltersOpen(false)}
              aria-label="Close filters"
            >
              ×
            </button>
          </div>
        </div>

        <div className="mobile-filter-scroll">{renderFilters()}</div>

        <button
          type="button"
          className="mobile-show-products"
          onClick={() => setMobileFiltersOpen(false)}
        >
          SHOW {filteredAndSortedProducts.length} PRODUCTS
        </button>
      </aside>
    </div>
  );
}
