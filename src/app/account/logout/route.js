import { NextResponse } from "next/server";
import { LOGOUT_URL, SITE_URL } from "@/lib/shopify-auth";

export async function GET(req) {
  const idToken = req.cookies.get("sh_id_token")?.value;

  // Shopify rejects logout without id_token ("Invalid id_token").
  // So only go to Shopify when we have it, otherwise just clear and go home.
  let target;
  if (idToken) {
    target = new URL(LOGOUT_URL);
    target.searchParams.set("id_token_hint", idToken);
    target.searchParams.set("post_logout_redirect_uri", `${SITE_URL}/`);
  } else {
    target = new URL("/", SITE_URL);
  }

  const res = NextResponse.redirect(target);
  res.headers.set("Cache-Control", "no-store, max-age=0");
  ["sh_access", "sh_refresh", "sh_id_token"].forEach((c) =>
    res.cookies.delete(c)
  );

  return res;
}