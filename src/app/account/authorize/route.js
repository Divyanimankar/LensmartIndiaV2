import { NextResponse } from "next/server";
import {
  TOKEN_URL,
  CLIENT_ID,
  REDIRECT_URI,
  SITE_URL,
  cookieOpts,
} from "@/lib/shopify-auth";

export async function GET(req) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const savedState = req.cookies.get("sh_state")?.value;
  const verifier = req.cookies.get("sh_verifier")?.value;

  const fail = () => NextResponse.redirect(new URL("/?auth=error", SITE_URL));

  if (!code || !state || state !== savedState || !verifier) return fail();

  const r = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Origin: SITE_URL,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      code,
      code_verifier: verifier,
    }),
  });

  if (!r.ok) return fail();
  const t = await r.json();

  const res = NextResponse.redirect(new URL("/my-account", SITE_URL));
  res.cookies.set("sh_access", t.access_token, cookieOpts(t.expires_in));
  res.cookies.set("sh_refresh", t.refresh_token, cookieOpts(60 * 60 * 24 * 30));
  res.cookies.set("sh_id_token", t.id_token, cookieOpts(60 * 60 * 24 * 30));
  res.cookies.delete("sh_state");
  res.cookies.delete("sh_verifier");
  return res;
}