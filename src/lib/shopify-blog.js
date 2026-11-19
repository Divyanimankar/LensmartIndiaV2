// Shopify Storefront API data layer for the blog.
// Maps Shopify articles into the same "post" shape the old static POSTS array used,
// so the JSX / class names in the pages do not need to change.

import { cache } from "react";
import { detectGroup, FILTER_GROUPS } from "./blog-config";

export { shopifyImage, imageSrcSet } from "./shopify-image";

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN; // e.g. your-store.myshopify.com
const TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = process.env.SHOPIFY_STOREFRONT_API_VERSION || "2026-10";
export const BLOG_HANDLE = process.env.SHOPIFY_BLOG_HANDLE || "news";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lensmartindia.com";

// Cache time in seconds.
//   0   = no caching: every page load fetches fresh data from Shopify (new posts show on refresh).
//   300 = cache for 5 minutes (faster, fewer API calls; use /api/revalidate for instant updates).
export const BLOG_REVALIDATE = 0;

const FEATURED_TAG = "featured";

async function storefront(query, variables = {}) {
  if (!DOMAIN || !TOKEN) {
    throw new Error(
      "Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_TOKEN environment variable."
    );
  }
  const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    ...(BLOG_REVALIDATE > 0
      ? { next: { revalidate: BLOG_REVALIDATE, tags: ["blog"] } }
      : { cache: "no-store" }),
  });
  if (!res.ok) throw new Error(`Shopify Storefront API error: ${res.status} ${res.statusText}`);
  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(`Shopify Storefront API: ${json.errors.map((e) => e.message).join("; ")}`);
  }
  return json.data;
}

const LIST_QUERY = `
  query BlogArticles($handle: String!, $first: Int!, $after: String) {
    blog(handle: $handle) {
      articles(first: $first, after: $after, sortKey: PUBLISHED_AT, reverse: true) {
        pageInfo { hasNextPage endCursor }
        nodes {
          handle
          title
          excerpt(truncateAt: 180)
          content
          publishedAt
          tags
          image { url altText }
          author { name bio }
        }
      }
    }
  }
`;

const DETAIL_QUERY = `
  query BlogArticle($handle: String!, $articleHandle: String!) {
    blog(handle: $handle) {
      articleByHandle(handle: $articleHandle) {
        handle
        title
        excerpt
        content
        contentHtml
        publishedAt
        tags
        image { url altText }
        author { name bio }
        seo { title description }
      }
    }
  }
`;

/* ---------- helpers ---------- */

function readMinutes(text = "") {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// Adds the existing paragraph class so current CSS applies to Shopify rich-text paragraphs
function decorateHtml(html = "") {
  return html.replace(/<p(\s[^>]*)?>/gi, (_m, attrs = "") => {
    if (/class\s*=/i.test(attrs)) {
      return `<p${attrs.replace(/class\s*=\s*(["'])/i, "class=$1blog-modal-para ")}>`;
    }
    return `<p class="blog-modal-para"${attrs}>`;
  });
}

function mapArticle(a, { withBody = false } = {}) {
  const tags = a.tags || [];
  const featured = tags.some((t) => t.toLowerCase() === FEATURED_TAG);
  const group = detectGroup(tags);
  const isGroupTag = (t) => FILTER_GROUPS.some((g) => g.toLowerCase() === t.toLowerCase().replace(/[\s_-]+/g, " ").trim());
  // Chips shown on the article: every tag except "featured" and the tab tags (the category chip already shows those)
  const displayTags = tags.filter((t) => t.toLowerCase() !== FEATURED_TAG && !isGroupTag(t));
  const category = group || "Eye Care";

  const post = {
    slug: a.handle,
    title: a.title,
    excerpt: a.excerpt || "",
    category,
    group, // tab this article belongs to (or null -> only shown under "All")
    tags: displayTags,
    featured,
    author: a.author?.name || "LensMartIndia",
    role: a.author?.bio || "LensMartIndia Team",
    publishedAt: a.publishedAt,
    readMinutes: readMinutes(a.content),
    imageUrl: a.image?.url || "",
    imageAlt: a.image?.altText || a.title,
  };

  if (withBody) {
    post.bodyHtml = decorateHtml(a.contentHtml || "");
    post.seoTitle = a.seo?.title || a.title;
    post.seoDescription = a.seo?.description || a.excerpt || "";
  }
  return post;
}

/* ---------- public API ---------- */

// All published articles, newest first (paginates through the Storefront API)
export const getAllPosts = cache(async () => {
  const posts = [];
  let after = null;
  for (let i = 0; i < 20; i++) {
    const data = await storefront(LIST_QUERY, { handle: BLOG_HANDLE, first: 50, after });
    const conn = data?.blog?.articles;
    if (!conn) break;
    posts.push(...conn.nodes.map((n) => mapArticle(n)));
    if (!conn.pageInfo.hasNextPage) break;
    after = conn.pageInfo.endCursor;
  }
  return posts;
});

export const getPostBySlug = cache(async (slug) => {
  const data = await storefront(DETAIL_QUERY, { handle: BLOG_HANDLE, articleHandle: slug });
  const article = data?.blog?.articleByHandle;
  return article ? mapArticle(article, { withBody: true }) : null;
});
