import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readCustomerMeta, writeCustomerMeta } from "@/lib/customer-api";

export const dynamic = "force-dynamic";

/* SIRF LOCAL TEST — go-live se pehle delete karna.
   Local: http://localhost:3000/api/cart/test
   Live:  https://lensmartindia.com/api/cart/test?key=<CART_TEST_KEY> */

export async function GET(request) {
  /* live site par sirf tab chalega jab URL me ?key=... Vercel ke CART_TEST_KEY se match kare */
  if (process.env.NODE_ENV === "production") {
    const key = new URL(request.url).searchParams.get("key");
    const secret = String(process.env.CART_TEST_KEY || "");

    if (!secret || key !== secret) {
      return NextResponse.json({ error: "disabled" }, { status: 404 });
    }
  }

  const before = await readCustomerMeta();
  if (before.error) {
    /* sirf cookie ke NAAM dikhate hain (value nahi) */
    const names = (await cookies()).getAll().map((c) => c.name);
    return NextResponse.json({ step: "read", ...before, cookieNamesSeen: names });
  }

  const original = before.cartId;
  const probe = `test-${Date.now()}`;

  const wrote = await writeCustomerMeta(before.id, "cart_id", "single_line_text_field", probe);
  if (wrote.error) {
    return NextResponse.json({ step: "write", ...wrote });
  }

  const after = await readCustomerMeta();

  /* purani value wapas */
  if (original) {
    await writeCustomerMeta(before.id, "cart_id", "single_line_text_field", original);
  }

  return NextResponse.json({
    step: "done",
    canRead: true,
    canWrite: after.cartId === probe,
    note:
      after.cartId === probe
        ? "Customer Account API se write ho raha hai. Admin token ki zarurat nahi."
        : "Write hua par wapas padha nahi gaya.",
  });
}