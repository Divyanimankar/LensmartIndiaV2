import { NextResponse } from "next/server";
import {
  AUTHORIZE_URL,
  CLIENT_ID,
  REDIRECT_URI,
  randomString,
  challengeFrom,
  cookieOpts,
} from "@/lib/shopify-auth";

export async function GET() {
  const verifier = randomString();
  const state = randomString();
  const nonce = randomString();

  const url = new URL(AUTHORIZE_URL);
  url.search = new URLSearchParams({
    scope: "openid email customer-account-api:full",
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    state,
    nonce,
    code_challenge: challengeFrom(verifier),
    code_challenge_method: "S256",
  }).toString();

  const res = NextResponse.redirect(url);
  res.headers.set("Cache-Control", "no-store, max-age=0");
  res.cookies.set("sh_verifier", verifier, cookieOpts(600));
  res.cookies.set("sh_state", state, cookieOpts(600));
  return res;
}