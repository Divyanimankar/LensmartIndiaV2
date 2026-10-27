import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/shopify-auth";

export async function GET() {
  const res = NextResponse.redirect(new URL("/", SITE_URL));
  res.headers.set("Cache-Control", "no-store, max-age=0");
  ["sh_access", "sh_refresh", "sh_id_token"].forEach((c) =>
    res.cookies.delete(c)
  );
  return res;
}