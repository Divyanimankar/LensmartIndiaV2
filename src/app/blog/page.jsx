import { getAllPosts, BLOG_REVALIDATE } from "../../lib/shopify-blog";
import BlogListClient from "./BlogListClient";

// Server component: fetches articles from Shopify, cached + revalidated (ISR).
export const revalidate = BLOG_REVALIDATE;

export default async function Blog() {
  const posts = await getAllPosts();
  return <BlogListClient posts={posts} />;
}
