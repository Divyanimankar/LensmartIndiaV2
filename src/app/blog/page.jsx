import { getAllPosts } from "../../lib/shopify-blog";
import BlogListClient from "./BlogListClient";

// Server component: fetches articles from Shopify, cached + revalidated (ISR).
export const revalidate = 60;

export default async function Blog() {
  const posts = await getAllPosts();
  return <BlogListClient posts={posts} />;
}
