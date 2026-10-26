"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

/* =========================================================
   useProductFilters(config, products)

   Holds the filter state for one listing page and applies it.
   `config` comes from data/filterConfig.js.

   URL SYNC
   The checkbox groups are pre-selected from the page URL, using the
   group's `key` as the query parameter:

     /eyeglasses?shape=Round
     /eyeglasses?category=Men&brand=Vogue%20Eyewear
     /eyeglasses?shape=Round,Oval          (comma = several options)

   - Values are matched against the group's `options` and their
     `aliases` (case-insensitive, "Cat-Eye" = "cat eye").
     Unknown values are ignored.
   - When the URL changes (e.g. a navbar link is clicked while already
     on the page) the selection is replaced by what the URL says.
   - Ticking a checkbox does NOT change the URL (state only).

   NOTE: because this uses useSearchParams(), the page that calls this
   hook must be rendered inside a <Suspense> boundary.

   Returns
   - filteredProducts   products that pass every filter (not sorted;
                        the page sorts them)
   - selected           { [groupKey]: [selected options] }
   - price              { min, max }
   - activeCount        number of active filters (price counts as one)
   - chips              [{ id, label, remove }] for the selected chips
   - toggle(key, value) tick / untick one option
   - clear()            reset everything
   - ...and the values <ProductFilter /> needs to draw itself
========================================================= */

const defaultGetPrice = (product) =>
  Number(product.price ?? product.salePrice ?? 0);

/* lower-case, trim, treat hyphens as spaces: "Cat-Eye" = "cat eye" */
export const normalizeValue = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const formatINR = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

/* does this product have `option` for this group? */
const optionMatches = (group, product, option) => {
  const values = (group.getValues(product) || []).map(normalizeValue);

  if (values.includes(normalizeValue(option))) return true;

  const aliases = group.aliases?.[option] || [];

  return aliases.some((alias) => values.includes(normalizeValue(alias)));
};

/* { [groupKey]: [options] } from the URL query string */
const readUrlSelection = (checkboxGroups, searchParams) =>
  Object.fromEntries(
    checkboxGroups.map((group) => {
      const wanted = (searchParams?.getAll(group.key) || [])
        .flatMap((value) => value.split(","))
        .map(normalizeValue)
        .filter(Boolean);

      /* an option is selected when the URL names it or one of its aliases */
      const options = group.options.filter((option) => {
        const names = [option, ...(group.aliases?.[option] || [])].map(
          normalizeValue,
        );

        return wanted.some((value) => names.includes(value));
      });

      return [group.key, options];
    }),
  );

const resolveBounds = (priceConfig, products) => {
  if (
    typeof priceConfig.min === "number" &&
    typeof priceConfig.max === "number"
  ) {
    return { min: priceConfig.min, max: priceConfig.max };
  }

  const getPrice = priceConfig.getPrice || defaultGetPrice;
  const prices = products.map(getPrice).filter((price) => price > 0);

  return {
    min: prices.length ? Math.floor(Math.min(...prices)) : 0,
    max: prices.length ? Math.ceil(Math.max(...prices)) : 10000,
  };
};

export function useProductFilters(config, products) {
  const { groups, price: priceConfig = {} } = config;

  const searchParams = useSearchParams();
  const urlKey = searchParams.toString();

  const checkboxGroups = useMemo(
    () => groups.filter((group) => group.type !== "price"),
    [groups],
  );

  const hasPrice = groups.some((group) => group.type === "price");

  const getPrice = priceConfig.getPrice || defaultGetPrice;
  const step = priceConfig.step ?? 1;
  const minGap = priceConfig.minGap ?? 0;
  const maxSuffix = priceConfig.maxSuffix || "";

  const bounds = useMemo(
    () => resolveBounds(priceConfig, products),
    [priceConfig, products],
  );

  const emptySelected = useMemo(
    () =>
      Object.fromEntries(checkboxGroups.map((group) => [group.key, []])),
    [checkboxGroups],
  );

  /* what the URL asks for; only changes when the query string changes */
  const urlSelected = useMemo(
    () => readUrlSelection(checkboxGroups, searchParams),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkboxGroups, urlKey],
  );

  const [selected, setSelected] = useState(urlSelected);
  const [price, setPrice] = useState({ min: bounds.min, max: bounds.max });

  /* navbar link clicked (or back / forward): follow the URL */
  useEffect(() => {
    setSelected(urlSelected);
    setPrice({ min: bounds.min, max: bounds.max });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSelected]);

  /* ---------- changes ---------- */

  const toggle = useCallback((key, value) => {
    setSelected((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));
  }, []);

  /* the next { min, max } after moving one end of the price range */
  const computePrice = useCallback(
    (current, thumb, raw) => {
      const snapped =
        bounds.min + Math.round((Number(raw) - bounds.min) / step) * step;
      const value = Math.min(Math.max(snapped, bounds.min), bounds.max);

      return thumb === "min"
        ? { min: Math.min(value, current.max - minGap), max: current.max }
        : { min: current.min, max: Math.max(value, current.min + minGap) };
    },
    [bounds, step, minGap],
  );

  const setPriceValue = useCallback(
    (thumb, raw) => setPrice((current) => computePrice(current, thumb, raw)),
    [computePrice],
  );

  const nextPrice = useCallback(
    (thumb, raw) => computePrice(price, thumb, raw),
    [computePrice, price],
  );

  const resetPrice = useCallback(
    () => setPrice({ min: bounds.min, max: bounds.max }),
    [bounds],
  );

  const clear = useCallback(() => {
    setSelected(emptySelected);
    setPrice({ min: bounds.min, max: bounds.max });
  }, [emptySelected, bounds]);

  /* ---------- results ---------- */

  const priceActive =
    hasPrice && (price.min !== bounds.min || price.max !== bounds.max);

  const filteredProducts = useMemo(() => {
    let result = products;

    checkboxGroups.forEach((group) => {
      const chosen = selected[group.key] || [];

      if (chosen.length) {
        result = result.filter((product) =>
          chosen.some((option) => optionMatches(group, product, option)),
        );
      }
    });

    if (priceActive) {
      result = result.filter((product) => {
        const value = getPrice(product);

        /* the top of the slider means "no upper limit" */
        return (
          value >= price.min && (price.max >= bounds.max || value <= price.max)
        );
      });
    }

    return result;
  }, [products, checkboxGroups, selected, priceActive, price, bounds, getPrice]);

  /* products per option, across the whole catalogue */
  const counts = useMemo(
    () =>
      Object.fromEntries(
        checkboxGroups.map((group) => [
          group.key,
          Object.fromEntries(
            group.options.map((option) => [
              option,
              products.filter((product) =>
                optionMatches(group, product, option),
              ).length,
            ]),
          ),
        ]),
      ),
    [checkboxGroups, products],
  );

  const activeCount =
    Object.values(selected).reduce((total, list) => total + list.length, 0) +
    (priceActive ? 1 : 0);

  const chips = useMemo(
    () => [
      ...checkboxGroups.flatMap((group) =>
        (selected[group.key] || []).map((value) => ({
          id: `${group.key}-${value}`,
          label: group.chipLabel ? group.chipLabel(value) : value,
          remove: () => toggle(group.key, value),
        })),
      ),
      ...(priceActive
        ? [
            {
              id: "price",
              label: `${formatINR(price.min)} – ${formatINR(price.max)}${
                price.max >= bounds.max ? maxSuffix : ""
              }`,
              remove: resetPrice,
            },
          ]
        : []),
    ],
    [
      checkboxGroups,
      selected,
      priceActive,
      price,
      bounds,
      maxSuffix,
      toggle,
      resetPrice,
    ],
  );

  return {
    groups,
    selected,
    price,
    bounds,
    step,
    maxSuffix,
    priceActive,
    counts,
    filteredProducts,
    resultCount: filteredProducts.length,
    activeCount,
    chips,
    toggle,
    setPriceValue,
    nextPrice,
    setPrice,
    resetPrice,
    clear,
  };
}