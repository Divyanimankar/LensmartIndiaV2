"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Newsletter from "../../components/Newsletter";
import {
  Avatar,
  CalendarIcon,
  ClockIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  SparkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "../../components/BlogShared";
import { POSTS, POSTS_PER_PAGE, FILTER_GROUPS, getGroup, formatDate } from "../../data/blogData";

import "../../styles/blog.css";

/* Page numbers with "…" jab pages zyada ho jayein */
function getPageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push("…");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < total - 1) items.push("…");
  items.push(total);
  return items;
}

export default function Blog() {
  const [activeCat, setActiveCat] = useState("All");
  const [page, setPage] = useState(1);
  const controlsRef = useRef(null);

  // Newest first
  const sortedPosts = useMemo(
    () => [...POSTS].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1)),
    []
  );

  // Hero (featured) alag; baaki sab grid mein
  const featured = useMemo(() => sortedPosts.find((p) => p.featured) ?? null, [sortedPosts]);
  const gridSource = useMemo(() => sortedPosts.filter((p) => !p.featured), [sortedPosts]);

  // Tabs: All + Eyeglasses + Sunglasses + Contact Lenses
  const categories = useMemo(
    () =>
      FILTER_GROUPS.map((name) => ({
        name,
        count: sortedPosts.filter((p) => getGroup(p) === name).length,
      })),
    [sortedPosts]
  );

  // Filter badalne par page 1 par wapas
  useEffect(() => {
    setPage(1);
  }, [activeCat]);

  const filtered = useMemo(
    () => gridSource.filter((p) => activeCat === "All" || getGroup(p) === activeCat),
    [gridSource, activeCat]
  );

  // Hero hamesha dikhta hai
  const showFeatured = featured !== null;

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = filtered.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    setPage(p);
    controlsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="blog-page">
      <div className="blog-wrap">
        {/* Header */}
        <div className="blog-head">
          <span className="blog-badge">
            <SparkIcon size={13} />
            Read Our Journal
          </span>
          <h1 className="blog-title">Browse Our Resources</h1>
          <p className="blog-sub">
            Expert fit guides, honest lens-care routines and eye-health advice from our optometrists. For real
            eyes, real days, zero guesswork.
          </p>
        </div>

        {/* Hero / featured story */}
        {showFeatured && (
          <Link href={`/blog/${featured.slug}`} className="blog-featured">
            <span className="blog-featured-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={featured.imageUrl} alt={featured.imageAlt} />
              <span className="blog-featured-veil" />
              <span className="blog-featured-arrow" aria-hidden="true">
                <ArrowUpRightIcon size={19} />
              </span>
              <span className="blog-featured-body">
                <span className="blog-featured-tags">
                  {featured.tags.slice(0, 3).map((tg) => (
                    <span key={tg} className="blog-chip-glass">
                      {tg}
                    </span>
                  ))}
                </span>
                <span className="blog-featured-title">{featured.title}</span>
                <span className="blog-featured-excerpt">{featured.excerpt}</span>
                <span className="blog-featured-meta">
                  <Avatar name={featured.author} size={34} />
                  <span className="blog-featured-author">
                    <strong>{featured.author}</strong>
                    <em>{featured.role}</em>
                  </span>
                  <span className="blog-dot blog-dot-light" aria-hidden="true" />
                  <span className="blog-featured-date">
                    <CalendarIcon size={14} />
                    {formatDate(featured.publishedAt)}
                  </span>
                  <span className="blog-dot blog-dot-light" aria-hidden="true" />
                  <span className="blog-featured-date">
                    <ClockIcon size={13} />
                    {featured.readMinutes} min read
                  </span>
                </span>
              </span>
            </span>
          </Link>
        )}

        {/* Category tabs */}
        <div className="blog-controls" ref={controlsRef}>
          <div className="blog-tabs" role="tablist" aria-label="Blog categories">
            <button
              type="button"
              role="tab"
              aria-selected={activeCat === "All"}
              className={`blog-tab ${activeCat === "All" ? "is-active" : ""}`}
              onClick={() => setActiveCat("All")}
            >
              All <span className="blog-tab-count">{sortedPosts.length}</span>
            </button>
            {categories.map((c) => (
              <button
                key={c.name}
                type="button"
                role="tab"
                aria-selected={activeCat === c.name}
                className={`blog-tab ${activeCat === c.name ? "is-active" : ""}`}
                onClick={() => setActiveCat(c.name)}
              >
                {c.name} <span className="blog-tab-count">{c.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid (9 per page) */}
        {pagePosts.length === 0 ? (
          <div className="blog-empty">
            <p className="blog-empty-title">No articles found</p>
            <p>Try a different category.</p>
            <button type="button" className="blog-btn" onClick={() => setActiveCat("All")}>
              Reset filters
            </button>
          </div>
        ) : (
          <div className="blog-grid" key={`${activeCat}-${currentPage}`}>
            {pagePosts.map((post, i) => (
              <article key={post.slug} className="blog-card" style={{ animationDelay: `${i * 50}ms` }}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="blog-card-media"
                  aria-label={`Read: ${post.title}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.imageUrl} alt={post.imageAlt} loading="lazy" />
                </Link>
                <div className="blog-card-copy">
                  <span className="blog-card-cat">{post.category}</span>
                  <h3 className="blog-card-title">
                    <Link href={`/blog/${post.slug}`} title={post.title}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                  <div className="blog-card-meta">
                    <Avatar name={post.author} size={26} />
                    <span className="blog-card-author">{post.author}</span>
                    <span className="blog-dot" aria-hidden="true" />
                    <span className="blog-card-date">
                      <CalendarIcon size={13} />
                      {formatDate(post.publishedAt)}
                    </span>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="blog-card-link">
                    Read details <ArrowRightIcon size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && totalPages > 1 && (
          <nav className="blog-pagination" aria-label="Blog pagination">
            <button
              type="button"
              className="blog-page-btn blog-page-nav"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeftIcon /> <span>Prev</span>
            </button>

            <div className="blog-page-list">
              {getPageItems(currentPage, totalPages).map((item, idx) =>
                item === "…" ? (
                  <span key={`dots-${idx}`} className="blog-page-dots">
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    className={`blog-page-btn ${item === currentPage ? "is-active" : ""}`}
                    onClick={() => goToPage(item)}
                    aria-label={`Page ${item}`}
                    aria-current={item === currentPage ? "page" : undefined}
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              className="blog-page-btn blog-page-nav"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <span>Next</span> <ChevronRightIcon />
            </button>
          </nav>
        )}
      </div>

      {/* <Newsletter /> */}
    </section>
  );
}