"use client";

import { useEffect, useId, useRef, useState } from "react";
import { normalizeValue } from "../hooks/useProductFilters.js";
import "../styles/productFilter.css";

/* =========================================================
   ProductFilter — one filter UI for every product type

   Use it with the useProductFilters hook:

     const filters = useProductFilters(EYEGLASSES_FILTERS, products);

     // desktop sidebar
     <ProductFilter filters={filters} />

     // mobile drawer (opened by the page's own "Filters" button)
     <ProductFilter
       filters={filters}
       variant="drawer"
       open={mobileFilterOpen}
       onClose={() => setMobileFilterOpen(false)}
     />

   Props
   - filters        what useProductFilters returns
   - variant        "panel" (default) or "drawer"
   - open, onClose  drawer only
   - productLabel   singular noun for the drawer button (default "Product")

   Accessibility
   - Every group is an accordion button with aria-expanded.
   - Checkboxes are real inputs, with visible keyboard focus.
   - Selected filters are listed as removable chips.
   - The drawer is a modal dialog: Escape closes it, focus is kept
     inside and returned afterwards, and the page behind does not scroll.
========================================================= */

/* ---------- icons ---------- */

const Chevron = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const Tick = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const Cross = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="10.8" cy="10.8" r="6.8" />
    <path d="m16 16 4.2 4.2" />
  </svg>
);

const formatINR = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

/* ---------- accordion ---------- */

// function FilterGroup({ id, title, defaultOpen, activeCount, children }) {
//   const [open, setOpen] = useState(defaultOpen !== false);

function FilterGroup({ id, title, defaultOpen, activeCount, children }) {
  const [open, setOpen] = useState(defaultOpen !== false);

  useEffect(() => {
    if (activeCount > 0) setOpen(true);
  }, [activeCount]);



  return (
    <div className={`pf-group${open ? " is-open" : ""}`}>
      <h3 className="pf-group-title">
        <button
          type="button"
          className="pf-group-button"
          aria-expanded={open}
          aria-controls={`${id}-body`}
          onClick={() => setOpen((current) => !current)}
        >
          <span className="pf-group-name">{title}</span>

          {activeCount > 0 && (
            <span className="pf-group-count">
              {activeCount}
              <span className="pf-sr"> selected</span>
            </span>
          )}

          <span className="pf-chevron">
            <Chevron />
          </span>
        </button>
      </h3>

      {/* closed groups are hidden, not removed */}
      <div className="pf-group-body" id={`${id}-body`} hidden={!open}>
        {children}
      </div>
    </div>
  );
}

/* ---------- checkbox / pill options ---------- */

function CheckboxGroup({ id, group, selected, counts, onToggle }) {
  const [query, setQuery] = useState("");

  const search = normalizeValue(query);
  const pills = group.display === "pills";

  const options = search
    ? group.options.filter((option) => normalizeValue(option).includes(search))
    : group.options;

  const searchId = `${id}-search`;

  return (
    <>
      {group.searchable && (
        <div className="pf-search">
          <label className="pf-sr" htmlFor={searchId}>
            {group.searchLabel || `Search ${group.title}`}
          </label>

          <div className="pf-search-box">
            <SearchIcon />

            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={group.searchPlaceholder || "Search"}
              autoComplete="off"
            />

            {query && (
              <button
                type="button"
                className="pf-search-clear"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <Cross />
              </button>
            )}
          </div>

          {search && (
            <p className="pf-search-note" aria-live="polite">
              {options.length
                ? `${options.length} matching ${
                    options.length === 1 ? "option" : "options"
                  }`
                : "No matches found"}
            </p>
          )}
        </div>
      )}

      <div
        className={`pf-list${pills ? " pf-list--pills" : ""}${
          group.scroll ? " pf-list--scroll" : ""
        }`}
        role="group"
        aria-label={group.title}
      >
        {options.length ? (
          options.map((option) => {
            const checked = selected.includes(option);
            const count = counts?.[option];

            if (pills) {
              return (
                <label className="pf-pill" key={option}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(group.key, option)}
                  />
                  <span>{option}</span>
                </label>
              );
            }

            const swatch = group.swatches?.[option];

            return (
              <label
                className={`pf-option${count === 0 ? " is-empty" : ""}`}
                key={option}
              >
                <input
                  type="checkbox"
                  className="pf-input"
                  checked={checked}
                  onChange={() => onToggle(group.key, option)}
                />

                <span className="pf-box" aria-hidden="true">
                  <Tick />
                </span>

                {swatch && (
                  <span
                    className="pf-swatch"
                    style={{ background: swatch }}
                    aria-hidden="true"
                  />
                )}

                <span className="pf-option-label">{option}</span>

                {count !== undefined && (
                  <span className="pf-count">
                    {count}
                    <span className="pf-sr"> products</span>
                  </span>
                )}
              </label>
            );
          })
        ) : (
          <p className="pf-empty">{group.emptyText || "No matches found"}</p>
        )}
      </div>
    </>
  );
}

/* ---------- price ---------- */

function PriceGroup({ filters }) {
  const { price, bounds, maxSuffix, step, setPriceValue, nextPrice, setPrice } =
    filters;

  const [text, setText] = useState({
    min: String(price.min),
    max: String(price.max),
  });

  /* keep the boxes in step with the slider */
  useEffect(() => {
    setText({ min: String(price.min), max: String(price.max) });
  }, [price.min, price.max]);

  const span = bounds.max - bounds.min || 1;
  const left = ((price.min - bounds.min) / span) * 100;
  const right = 100 - ((price.max - bounds.min) / span) * 100;

  const commit = (thumb) => {
    const typed = parseInt(text[thumb], 10);

    if (Number.isNaN(typed)) {
      setText({ min: String(price.min), max: String(price.max) });
      return;
    }

    const next = nextPrice(thumb, typed);

    setPrice(next);
    setText({ min: String(next.min), max: String(next.max) });
  };

  const onKeyDown = (thumb) => (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commit(thumb);
    }
  };

  return (
    <div className="pf-price">
      <div className="pf-price-inputs">
        {["min", "max"].map((thumb, index) => (
          <div className="pf-price-field" key={thumb}>
            {index === 1 && (
              <span className="pf-price-dash" aria-hidden="true">
                –
              </span>
            )}

            <label className="pf-price-box">
              <span className="pf-price-label">
                {thumb === "min" ? "Min" : "Max"}
              </span>

              <span className="pf-price-value">
                <span aria-hidden="true">₹</span>

                <input
                  type="text"
                  inputMode="numeric"
                  value={text[thumb]}
                  onChange={(event) =>
                    setText((current) => ({
                      ...current,
                      [thumb]: event.target.value.replace(/[^0-9]/g, ""),
                    }))
                  }
                  onBlur={() => commit(thumb)}
                  onKeyDown={onKeyDown(thumb)}
                  aria-label={
                    thumb === "min" ? "Minimum price" : "Maximum price"
                  }
                />
              </span>
            </label>
          </div>
        ))}
      </div>

      <div className="pf-range">
        <div className="pf-range-track" />

        <div
          className="pf-range-fill"
          style={{ left: `${left}%`, right: `${right}%` }}
        />

        <input
          type="range"
          className="pf-range-input"
          min={bounds.min}
          max={bounds.max}
          step={step}
          value={price.min}
          onChange={(event) => setPriceValue("min", event.target.value)}
          aria-label="Minimum price"
          aria-valuetext={formatINR(price.min)}
          style={{ zIndex: left > 90 ? 5 : 3 }}
        />

        <input
          type="range"
          className="pf-range-input"
          min={bounds.min}
          max={bounds.max}
          step={step}
          value={price.max}
          onChange={(event) => setPriceValue("max", event.target.value)}
          aria-label="Maximum price"
          aria-valuetext={formatINR(price.max)}
          style={{ zIndex: 4 }}
        />
      </div>

      <div className="pf-range-labels">
        <span>{formatINR(bounds.min)}</span>
        <span>
          {formatINR(bounds.max)}
          {maxSuffix}
        </span>
      </div>
    </div>
  );
}

/* ---------- selected chips + all groups ---------- */

function FilterBody({ filters, idBase }) {
  const { groups, selected, counts, chips, priceActive, toggle } = filters;

  return (
    <div className="pf-body">
      {chips.length > 0 && (
        <div className="pf-chips-wrap">
          <p className="pf-chips-title">Selected filters</p>

          <ul className="pf-chips">
            {chips.map((chip) => (
              <li key={chip.id}>
                <button
                  type="button"
                  className="pf-chip"
                  onClick={chip.remove}
                  aria-label={`Remove filter ${chip.label}`}
                >
                  <span>{chip.label}</span>
                  <Cross />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* only the first group starts open; the rest start closed */}
      {groups.map((group, index) => {
        const id = `${idBase}-${group.key}`;

        if (group.type === "price") {
          return (
            <FilterGroup
              key={group.key}
              id={id}
              title={group.title}
              defaultOpen={index === 0}
              activeCount={priceActive ? 1 : 0}
            >
              <PriceGroup filters={filters} />
            </FilterGroup>
          );
        }

        return (
          <FilterGroup
            key={group.key}
            id={id}
            title={group.title}
            defaultOpen={index === 0 || selected[group.key]?.length > 0}
  activeCount={selected[group.key]?.length || 0}
            // defaultOpen={index === 0 || selected[group.key]?.length > 0}
            // defaultOpen={index === 0}
            // activeCount={selected[group.key].length}
          >
            <CheckboxGroup
              id={id}
              group={group}
              selected={selected[group.key]}
              counts={counts[group.key]}
              onToggle={toggle}
            />
          </FilterGroup>
        );
      })}
    </div>
  );
}

/* ---------- mobile drawer ---------- */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

function FilterDrawer({ filters, open, onClose, idBase, productLabel }) {
  const sheetRef = useRef(null);
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return undefined;

    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onCloseRef.current?.();
        return;
      }

      if (event.key !== "Tab" || !sheetRef.current) return;

      const items = [...sheetRef.current.querySelectorAll(FOCUSABLE)].filter(
        (item) => item.offsetParent !== null,
      );

      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, [open]);

  const total = filters.resultCount;

  return (
    <>
      <div
        className={`pf-overlay${open ? " is-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={sheetRef}
        className={`pf-drawer${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        aria-hidden={!open}
      >
        <span className="pf-grabber" aria-hidden="true" />

        <div className="pf-head">
          <h2 className="pf-title">
            Filters
            {filters.activeCount > 0 && (
              <span className="pf-badge">{filters.activeCount}</span>
            )}
          </h2>

          <div className="pf-head-actions">
            <button
              type="button"
              className="pf-reset"
              onClick={filters.clear}
              disabled={!filters.activeCount}
            >
              Reset
            </button>

            <button
              ref={closeRef}
              type="button"
              className="pf-close"
              onClick={onClose}
              aria-label="Close filters"
            >
              <Cross />
            </button>
          </div>
        </div>

        <div className="pf-drawer-scroll">
          <FilterBody filters={filters} idBase={idBase} />
        </div>

        <div className="pf-drawer-foot">
          <button
            type="button"
            className="pf-clear"
            onClick={filters.clear}
            disabled={!filters.activeCount}
          >
            Clear all
          </button>

          <button type="button" className="pf-show" onClick={onClose}>
            Show {total} {productLabel}
            {total === 1 ? "" : "s"}
          </button>
        </div>
      </div>
    </>
  );
}

/* ---------- main export ---------- */

export default function ProductFilter({
  filters,
  variant = "panel",
  open = false,
  onClose,
  productLabel = "Product",
}) {
  const idBase = `pf${useId().replace(/:/g, "")}`;

  if (variant === "drawer") {
    return (
      <FilterDrawer
        filters={filters}
        open={open}
        onClose={onClose}
        idBase={idBase}
        productLabel={productLabel}
      />
    );
  }

  return (
    <div className="pf-panel">
      <div className="pf-head">
        <h2 className="pf-title">
          Filters
          {filters.activeCount > 0 && (
            <span className="pf-badge">{filters.activeCount}</span>
          )}
        </h2>

        <button
          type="button"
          className="pf-reset"
          onClick={filters.clear}
          disabled={!filters.activeCount}
        >
          Reset
        </button>
      </div>

      <FilterBody filters={filters} idBase={idBase} />
    </div>
  );
}