import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/search";

export const dynamic = "force-dynamic";

/* GET /api/search?q=ray&limit=6  ->  navbar dropdown suggestions */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = String(searchParams.get("q") || "").trim().slice(0, 80);
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 6, 1), 12);

  if (q.length < 2) {
    return NextResponse.json({ results: [], total: 0 });
  }

  try {
    const { results, counts } = await searchProducts(q, { limit });
    return NextResponse.json(
      {
        total: counts.all,
        results: results.map(({ card, ...r }) => ({
          ...r,
          image: r.image ? r.image.replace(/width=\d+/, "width=120") : "",
        })),
      },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
    );
  } catch (error) {
    return NextResponse.json({ results: [], total: 0, error: "Search failed" }, { status: 500 });
  }
}