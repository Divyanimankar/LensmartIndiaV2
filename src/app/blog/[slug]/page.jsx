import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, formatDate, getCta } from "../../../data/blogData";
import {
  Avatar,
  CalendarIcon,
  ClockIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
} from "../../../components/BlogShared";

import "../../../styles/blog.css";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const cta = getCta(post.category);

  return (
    <section className="blog-page blog-article-page">
      <div className="blog-wrap">
        <Link href="/blog" className="blog-back">
          <ChevronLeftIcon size={16} /> Back to journal
        </Link>
      </div>

      {/* Full-width hero */}
      <header className="blog-article-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.imageUrl} alt={post.imageAlt} />
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
            {formatDate(post.publishedAt)}
          </span>
          <span className="blog-dot" aria-hidden="true" />
          <span className="blog-modal-date">
            <ClockIcon size={13} />
            {post.readMinutes} min read
          </span>
        </div>

        {post.body.split("\n\n").map((para, i) => (
          <p key={i} className="blog-modal-para">
            {para}
          </p>
        ))}

        <div className="blog-modal-tags">
          {post.tags.map((t) => (
            <span key={t} className="blog-chip">
              {t}
            </span>
          ))}
        </div>

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