"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import ProductGrid from "@/components/ProductGrid";
import ProductFilter from "@/components/ProductFilter";
import SortDropdown from "@/components/SortDropdown";
import BrandSlider from "@/components/BrandSlider";

import { useProductFilters } from "@/hooks/useProductFilters";
import { createSlug } from "@/lib/slug";
import {
  CATALOGS,
  GROUPS,
  getAccepted,
  getProductsFor,
  getHeadingParts,
  getHeroText,
} from "@/lib/glassesCatalog";

import "@/styles/allProducts.css";
import "@/styles/productsToolbar.css";
import "@/styles/catalogHero.css";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "best-selling", label: "Best selling" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
];

const PER_PAGE = 12;

function GlassesContent({ category, group, slug }) {
  const cat = CATALOGS[category];
  const { pre, name, post } = getHeadingParts(category, group, slug);

  const [sortBy, setSortBy] = useState("featured");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const baseProducts = useMemo(
    () => getProductsFor(category, group, slug),
    [category, group, slug],
  );

  const filters = useProductFilters(cat.filters, baseProducts);

  useEffect(() => {
    setPage(1);
  }, [filters.selected, filters.price]);

  // Us page ka apna filter lock: sirf wahi option, tick ke saath
  const lockKey = GROUPS[group].filterKey;

  const view = useMemo(() => {
    const accepted = getAccepted(slug);
    let locked = null;

    const groups = filters.groups.map((g) => {
      if (g.key !== lockKey) return g;
      locked = g.options?.find((o) => accepted.includes(createSlug(o))) ?? null;
      return locked ? { ...g, options: [locked], searchable: false } : g;
    });

    if (!locked) return filters;

    return {
      ...filters,
      groups,
      selected: { ...filters.selected, [lockKey]: [locked] },
      toggle: (key, option) => {
        if (key !== lockKey) filters.toggle(key, option);
      },
    };
  }, [filters, lockKey, slug]);

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
      {/* HERO */}
      <section className="catalog-hero">
        <div className="catalog-hero-bg" aria-hidden="true">
          <span className="hero-orb hero-orb-1" />
          <span className="hero-orb hero-orb-2" />
          <svg className="hero-lens-art" viewBox="0 0 240 240" fill="none">
            <circle cx="75" cy="130" r="42" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="3" opacity="0.7" />
            <circle cx="165" cy="130" r="42" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="3" opacity="0.7" />
            <path d="M117 124 Q120 110 123 124" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
            <path d="M33 124 L12 104M207 124 L228 104" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
            <path d="M50 112 A30 30 0 0 1 72 100" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
          </svg>
        </div>

        <div className="catalog-hero-inner">
          <nav className="catalog-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <Link href={cat.base}>{cat.name}</Link>
            <span className="sep">/</span>
            <span className="current">{name}</span>
          </nav>

          {/* <span className="catalog-hero-eyebrow">{GROUPS[group].label}</span> */}

          <h1 className="catalog-hero-title">
            {pre}
            <span className="hero-name">{name}</span>
            {post}
          </h1>

          {/* <p className="catalog-hero-text">{getHeroText(category, group, slug)}</p> */}

          <div className="catalog-hero-stats">
            {/* <span className="catalog-hero-chip">
              <strong>{baseProducts.length}</strong> Products
            </span> */}
          </div>
        </div>
      </section>

      {/* COUNT + SORT */}
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

      {/* FILTERS + PRODUCTS */}
      <section className="all-products-content-section">
        <div className="all-products-layout">
          <aside className="all-products-sidebar desktop-filter-sidebar">
            <ProductFilter filters={view} />
          </aside>

          <div className="all-products-main">
            <ProductGrid
              products={current}
              productType={cat.productType}
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

export default function GlassesCatalogPage(props) {
  return (
    <Suspense fallback={<div className="all-products-page"><p>Loading...</p></div>}>
      <GlassesContent key={`${props.category}-${props.group}-${props.slug}`} {...props} />
    </Suspense>
  );
}