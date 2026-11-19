import Link from "next/link";
import { notFound } from "next/navigation";
import { getCta } from "../../../lib/blog-config";
import { formatPostDate } from "../../../lib/format-date";
import { getPostBySlug, shopifyImage, imageSrcSet, SITE_URL, BLOG_REVALIDATE } from "../../../lib/shopify-blog";
import {
  Avatar,
  CalendarIcon,
  ClockIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
} from "../../../components/BlogShared";

import "../../../styles/blog.css";
import "../../../styles/blog-article-content.css";

// Rendered on every request (BLOG_REVALIDATE = 0 in lib/shopify-blog.js), so new or edited
// articles show up on refresh. If you set BLOG_REVALIDATE > 0, add generateStaticParams back.
export const revalidate = BLOG_REVALIDATE;
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const image = post.imageUrl ? shopifyImage(post.imageUrl, 1200) : undefined;
  return {
    title: post.seoTitle,
    description: post.seoDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      ...(image ? { images: [{ url: image, alt: post.imageAlt }] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const cta = getCta(post.group);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author },
    image: post.imageUrl ? [shopifyImage(post.imageUrl, 1200)] : undefined,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <section className="blog-page blog-article-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="blog-wrap">
        <Link href="/blog" className="blog-back">
          <ChevronLeftIcon size={16} /> Back to journal
        </Link>
      </div>

      {/* Full-width hero */}
      <header className="blog-article-hero">
        {post.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={shopifyImage(post.imageUrl, 1600)}
            srcSet={imageSrcSet(post.imageUrl, [800, 1200, 1600, 2000])}
            sizes="100vw"
            alt={post.imageAlt}
            fetchPriority="high"
            decoding="async"
          />
        )}
        <span className="blog-modal-veil" />
        <div className="blog-article-hero-inner">
          <span className="blog-chip blog-chip-solid">{post.category}</span>
          <h1>{post.title}</h1>
        </div>
      </header>

      {/* Article body */}
      <article className="blog-article-body">
        <div className="blog-modal-meta">
          <Avatar name={post.author} size={38} />
          <span className="blog-modal-author">
            <strong>{post.author}</strong>
            <em>{post.role}</em>
          </span>
          <span className="blog-dot" aria-hidden="true" />
          <span className="blog-modal-date">
            <CalendarIcon size={14} />
            {formatPostDate(post.publishedAt)}
          </span>
          <span className="blog-dot" aria-hidden="true" />
          <span className="blog-modal-date">
            <ClockIcon size={13} />
            {post.readMinutes} min read
          </span>
        </div>

        {/* Shopify rich-text body. <p> tags get the existing .blog-modal-para class. */}
        <div className="blog-article-html" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />

        {post.tags.length > 0 && (
          <div className="blog-modal-tags">
            {post.tags.map((t) => (
              <span key={t} className="blog-chip">
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="blog-modal-cta">
          <p>{cta.text}</p>
          <Link href={cta.href} className="blog-btn">
            {cta.label} <ArrowRightIcon size={14} />
          </Link>
        </div>
      </article>
    </section>
  );
}
