"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "../styles/searchbox.css";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M16 16L21 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/* variant="desktop" (navbar) ya "mobile" (neeche khulne wala box) */
export default function SearchBox({ variant = "desktop", autoFocus = false, onNavigate }) {
  const router = useRouter();
  const pathname = usePathname();
  const boxRef = useRef(null);

  const [value, setValue] = useState("");
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const query = value.trim();

  /* type karte hi suggestions (thoda ruk kar) */
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setTotal(0);
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`, {
          signal: controller.signal,
        });
        const data = await response.json();
        setResults(Array.isArray(data.results) ? data.results : []);
        setTotal(data.total || 0);
        setActive(-1);
        setLoading(false);
      } catch (error) {
        if (error.name !== "AbortError") setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  /* page badalne par dropdown band */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* bahar click karne par band */
  useEffect(() => {
    const onDown = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, []);

  const finish = () => {
    setOpen(false);
    onNavigate?.();
  };

  const goToResults = () => {
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    finish();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (active >= 0 && results[active]) {
      router.push(results[active].href);
      finish();
      return;
    }
    goToResults();
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1 >= results.length ? 0 : i + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const showPanel = open && query.length >= 2;
  const formClass = variant === "mobile" ? "mobile-header-search" : "navbar-search";

  return (
    <div className={`lm-search lm-search-${variant}`} ref={boxRef}>
      <form className={formClass} onSubmit={handleSubmit} role="search">
        <SearchIcon />
        <input
          type="search"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search brands, frames, power..."
          aria-label="Search products"
          autoComplete="off"
          autoFocus={autoFocus}
        />
        {variant === "mobile" && (
          <button type="submit" className="mobile-header-search-submit" aria-label="Submit search">
            <SearchIcon />
          </button>
        )}
      </form>

      {showPanel && (
        <div className="lm-search-panel" role="listbox">
          {loading && results.length === 0 && <p className="lm-search-note">Searching…</p>}

          {!loading && results.length === 0 && (
            <p className="lm-search-note">No products found for “{query}”</p>
          )}

          {results.map((item, index) => (
            <Link
              href={item.href}
              key={item.key}
              className={`lm-search-item ${index === active ? "is-active" : ""}`}
              onClick={finish}
              onMouseEnter={() => setActive(index)}
              role="option"
              aria-selected={index === active}
            >
              <span className="lm-search-thumb">
                {item.image && <img src={item.image} alt="" loading="lazy" />}
              </span>
              <span className="lm-search-info">
                <span className="lm-search-name">
                  {item.name}
                  {item.pack && <em> ({item.pack})</em>}
                </span>
                <span className="lm-search-meta">
                  {item.brand ? `${item.brand} · ` : ""}
                  {item.kind}
                </span>
              </span>
              {item.price > 0 && <span className="lm-search-price">{money(item.price)}</span>}
            </Link>
          ))}

          {results.length > 0 && (
            <button type="button" className="lm-search-all" onClick={goToResults}>
              See all {total > results.length ? `${total} ` : ""}results for “{query}”
            </button>
          )}
        </div>
      )}
    </div>
  );
}