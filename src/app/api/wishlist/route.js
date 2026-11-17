import { NextResponse } from "next/server";
import { readCustomerMeta, writeCustomerMeta } from "@/lib/customer-api";

export const dynamic = "force-dynamic";

/* Wishlist customer metafield "custom.wishlist" (JSON) me.
   GET -> { loggedIn, items }      PUT { items } -> { ok } */

const parse = (value) => {
  try {
    const list = JSON.parse(value || "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

export async function GET() {
  const meta = await readCustomerMeta();

  if (meta.error) {
    return NextResponse.json({
      loggedIn: false,
      ...(process.env.NODE_ENV !== "production" ? { reason: meta.error } : {}),
    });
  }

  return NextResponse.json({ loggedIn: true, items: parse(meta.wishlist) });
}

export async function PUT(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  if (!Array.isArray(body?.items)) {
    return NextResponse.json({ error: "items must be a list." }, { status: 400 });
  }

  const meta = await readCustomerMeta();
  if (meta.error) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const wrote = await writeCustomerMeta(
    meta.id,
    "wishlist",
    "json",
    JSON.stringify(body.items),
  );

  if (wrote.error) {
    return NextResponse.json(
      {
        error: "Could not save wishlist.",
        ...(process.env.NODE_ENV !== "production" ? { reason: wrote.error } : {}),
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}