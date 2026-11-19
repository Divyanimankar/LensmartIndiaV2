import { revalidatePath, revalidateTag } from "next/cache";

// Called by Shopify Flow / a webhook when a blog article is created, updated or deleted,
// so the headless site updates immediately instead of waiting for the 5-minute revalidate.
// Request: POST /api/revalidate  with header  x-revalidate-secret: <REVALIDATE_SECRET>
export async function POST(request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag("blog", "max");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");

  return Response.json({ ok: true, revalidatedAt: new Date().toISOString() });
}
