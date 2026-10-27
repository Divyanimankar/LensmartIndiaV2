import { NextResponse } from "next/server";
import { LOGOUT_URL, SITE_URL } from "@/lib/shopify-auth";

export async function GET(req) {
  const idToken = req.cookies.get("sh_id_token")?.value;

  const url = new URL(LOGOUT_URL);
  if (idToken) url.searchParams.set("id_token_hint", idToken);
  url.searchParams.set("post_logout_redirect_uri", `${SITE_URL}/`);

  const res = NextResponse.redirect(url);
  ["sh_access", "sh_refresh", "sh_id_token"].forEach((c) =>
    res.cookies.delete(c)
  );
  return res;
}