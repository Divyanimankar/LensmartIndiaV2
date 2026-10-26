"use client";

import { useEffect, useId, useRef, useState } from "react";

/* =========================================================
   SortDropdown — accessible custom listbox

   <SortDropdown
     label="Sort by"
     options={[{ value: "featured", label: "Featured" }, ...]}
     value={sortBy}
     onChange={setSortBy}
   />

   Keyboard: Enter / Space / Arrow keys open it, Arrow keys,
   Home and End move, Enter or Space picks, Escape and Tab close.
========================================================= */

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

export default function SortDropdown({
  label = "Sort by",
  options,
  value,
  onChange,
}) {
  const baseId = `sd${useId().replace(/:/g, "")}`;
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);

  const [open, setOpen] = useState(false);

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  const [active, setActive] = useState(selectedIndex);

  const selected = options[selectedIndex];

  /* close on outside click */
  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  /* move focus into the list when it opens */
  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  const openMenu = () => {
    setActive(selectedIndex);
    setOpen(true);
  };

  const closeMenu = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  };

  const choose = (index) => {
    const option = options[index];
    if (option) onChange(option.value);
    closeMenu();
  };

  const onButtonKeyDown = (event) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      openMenu();
    }
  };

  const onListKeyDown = (event) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((current) => Math.min(current + 1, options.length - 1));
        break;

      case "ArrowUp":
        event.preventDefault();
        setActive((current) => Math.max(current - 1, 0));
        break;

      case "Home":
        event.preventDefault();
        setActive(0);
        break;

      case "End":
        event.preventDefault();
        setActive(options.length - 1);
        break;

      case "Enter":
      case " ":
        event.preventDefault();
        choose(active);
        break;

      case "Escape":
        event.preventDefault();
        closeMenu();
        break;

      case "Tab":
        closeMenu(false);
        break;

      default:
        break;
    }
  };

  return (
    <div className="sd" ref={rootRef}>
      <span className="sd-label" id={`${baseId}-label`}>
        {label}
      </span>

      <div className={`sd-control${open ? " is-open" : ""}`}>
        <button
          ref={buttonRef}
          type="button"
          className="sd-button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={`${baseId}-label ${baseId}-button`}
          id={`${baseId}-button`}
          onClick={() => (open ? closeMenu(false) : openMenu())}
          onKeyDown={onButtonKeyDown}
        >
          <span className="sd-value">{selected?.label}</span>

          <span className="sd-chevron">
            <Chevron />
          </span>
        </button>

        {open && (
          <ul
            ref={listRef}
            className="sd-menu"
            role="listbox"
            tabIndex={-1}
            aria-labelledby={`${baseId}-label`}
            aria-activedescendant={`${baseId}-opt-${active}`}
            onKeyDown={onListKeyDown}
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;

              return (
                <li
                  key={option.value}
                  id={`${baseId}-opt-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  className={`sd-option${isSelected ? " is-selected" : ""}${
                    index === active ? " is-active" : ""
                  }`}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => choose(index)}
                >
                  <span>{option.label}</span>

                  {isSelected && (
                    <span className="sd-tick">
                      <Tick />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
