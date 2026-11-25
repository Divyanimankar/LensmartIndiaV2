import { NextResponse } from "next/server";
import { readCustomerMeta, writeCustomerMeta } from "@/lib/customer-api";

export const dynamic = "force-dynamic";

/* TEMPORARY debug link: /api/wishlist-debug
   Shopify me wishlist save ho rahi hai ya nahi, aur nahi to kyu.
   Kaam hone ke baad is poore folder ko delete kar dena. */
export async function GET() {
  const before = await readCustomerMeta();
  if (before.error) {
    return NextResponse.json({ step: "read", error: before.error });
  }

  const original = before.wishlist || "[]";
  const test = JSON.stringify([{ id: 1, name: "debug-test" }]);

  const wrote = await writeCustomerMeta(before.id, "wishlist", "json", test);
  const after = await readCustomerMeta();

  /* asli wishlist wapas rakh do */
  const restored = await writeCustomerMeta(before.id, "wishlist", "json", original);

  return NextResponse.json({
    customerId: before.id ? "ok" : "MISSING",
    originalLength: original.length,
    write: wrote,
    readBackAfterWrite: after.error ? { error: after.error } : after.wishlist,
    restore: restored,
  });
}