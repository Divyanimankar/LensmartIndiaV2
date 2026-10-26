"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import ProductGrid from "@/components/ProductGrid";
import ProductFilter from "@/components/ProductFilter";
import SortDropdown from "@/components/SortDropdown";
import BrandSlider from "@/components/BrandSlider";

import { CONTACT_LENS_FILTERS } from "@/data/filterConfig";
import { useProductFilters } from "@/hooks/useProductFilters";
import { getProductsFor, getDisplayName } from "@/lib/catalog";
import { findLensType } from "@/lib/lensTypes";

import "@/styles/allProducts.css";
import "@/styles/productsToolbar.css";
import "@/styles/catalogHero.css";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "best-selling", label: "Best selling" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
];

const TITLES = {
  brand: (n) => `${n} Contact Lenses`,
  manufacturer: (n) => `Contact Lenses by ${n}`,
  "lens-type": (n) => `${n} Contact Lenses`,
};

const PER_PAGE = 12;

function CatalogContent({ type, slug }) {
  const [sortBy, setSortBy] = useState("featured");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const name = getDisplayName(type, slug);

  // Is page ke products hi filter ka base hain
  const baseProducts = useMemo(() => getProductsFor(type, slug), [type, slug]);

  const filters = useProductFilters(CONTACT_LENS_FILTERS, baseProducts);
  // Lens-type page par us type ka filter lock rahega (sirf wahi option dikhega)
const lensType = type === "lens-type" ? findLensType(slug) : null;

// Har page par uska apna filter lock rahega (sirf wahi option, tick ke saath)
const lock = useMemo(() => {
  if (type === "lens-type") {
    const lt = findLensType(slug);
    return lt ? { key: lt.group, value: lt.value } : null;
  }
  if (type === "brand") return { key: "brand", value: name };
  if (type === "manufacturer") return { key: "manufacturer", value: name };
  return null;
}, [type, slug, name]);

const view = useMemo(() => {
  if (!lock || !lock.value) return filters;

  const same = (a, b) =>
    String(a).toLowerCase().trim() === String(b).toLowerCase().trim();

  let groupFound = false;
  let lockedOption = lock.value;

  const groups = filters.groups.map((g) => {
    if (g.key !== lock.key) return g;
    groupFound = true;
    lockedOption = g.options?.find((o) => same(o, lock.value)) ?? lock.value;
    return { ...g, options: [lockedOption], searchable: false };
  });

  // filter group config mein nahi mila to kuch mat badlo
  if (!groupFound) return filters;

  return {
    ...filters,
    groups,
    selected: { ...filters.selected, [lock.key]: [lockedOption] },
    toggle: (key, option) => {
      if (key !== lock.key) filters.toggle(key, option);
    },
  };
}, [filters, lock]);


// const view = useMemo(() => {
//   if (!lensType) return filters;

//   const { group: lockedKey, value } = lensType;
//   const same = (a, b) =>
//     String(a).toLowerCase().trim() === String(b).toLowerCase().trim();

//   let lockedOption = null;

//   const groups = filters.groups.map((g) => {
//     if (g.key !== lockedKey) return g;
//     lockedOption = g.options?.find((o) => same(o, value)) ?? null;
//     return lockedOption
//       ? { ...g, options: [lockedOption], searchable: false }
//       : g;
//   });

//   // group ya option config mein nahi mila to kuch mat badlo
//   if (!lockedOption) return filters;

//   return {
//     ...filters,
//     groups,
//     selected: { ...filters.selected, [lockedKey]: [lockedOption] },
//     toggle: (key, option) => {
//       if (key !== lockedKey) filters.toggle(key, option);
//     },
//   };
// }, [filters, lensType]);


  useEffect(() => {
    setPage(1);
  }, [filters.selected, filters.price]);

  const sorted = useMemo(() => {
    const result = [...filters.filteredProducts];

    if (sortBy === "best-selling")
      result.sort((a, b) => Number(Boolean(b.bestseller)) - Number(Boolean(a.bestseller)));
    if (sortBy === "price-low-high")
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    if (sortBy === "price-high-low")
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));

    return result;
  }, [filters.filteredProducts, sortBy]);

  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const current = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filterButton = (
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
        <span className="floating-filter-badge">{filters.activeCount}</span>
      )}
    </button>
  );

  return (
    <div className="all-products-page">
      <section className="catalog-hero">
        <nav className="catalog-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <Link href="/all-products">Contact Lenses</Link> /{" "}
          <span>{name}</span>
        </nav>
        <h1>{TITLES[type](name)}</h1>
      </section>

      <section className="pt-bar pt-bar--flush" aria-label="Product results">
        <div className="pt-inner">
          <p className="pt-count" aria-live="polite">
            {sorted.length === 0 ? (
              "No products found"
            ) : (
              <>
                <strong>{sorted.length}</strong> products
              </>
            )}
          </p>

          <div className="mobile-toolbar-controls">
            <div className="collection-mobile-filter">{filterButton}</div>

            <SortDropdown
              label="Sort by"
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={(v) => {
                setSortBy(v);
                setPage(1);
              }}
            />
          </div>
        </div>
      </section>

      <section className="all-products-content-section">
        <div className="all-products-layout">
          {/* LEFT SIDE FILTER (desktop) */}
          <aside className="all-products-sidebar desktop-filter-sidebar">
            <ProductFilter filters={view} />
          </aside>

          {/* PRODUCTS */}
          <div className="all-products-main">
            <ProductGrid
              products={current}
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

            {totalPages > 1 && (
              <nav className="all-products-pagination" aria-label="Product pagination">
                <button type="button" className="pagination-arrow"
                  disabled={page === 1} onClick={() => goToPage(page - 1)}>‹</button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button type="button" key={p}
                    className={page === p ? "pagination-number active" : "pagination-number"}
                    aria-current={page === p ? "page" : undefined}
                    onClick={() => goToPage(p)}>{p}</button>
                ))}

                <button type="button" className="pagination-arrow"
                  disabled={page === totalPages} onClick={() => goToPage(page + 1)}>›</button>
              </nav>
            )}

            <div className="floating-filter-bar">{filterButton}</div>
          </div>
        </div>
      </section>

      {/* MOBILE FILTER DRAWER */}
      <ProductFilter
        filters={view}
        variant="drawer"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        productLabel="Product"
      />

      <BrandSlider />
    </div>
  );
}

export default function CatalogPage(props) {
  return (
    <Suspense fallback={<div className="all-products-page"><p>Loading...</p></div>}>
      {/* key: page badalne par filter selection reset ho jaye */}
      <CatalogContent key={`${props.type}-${props.slug}`} {...props} />
    </Suspense>
  );
}