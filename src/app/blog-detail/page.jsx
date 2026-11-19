import { permanentRedirect } from "next/navigation";

// The old hardcoded "Contact Lens Care Guide" page. Articles now live in Shopify and are
// served from /blog/[slug], so this legacy route just sends visitors to the blog.
export default function Page() {
  permanentRedirect("/blog");
}
