import { createHash, randomBytes } from "crypto";

export const SHOP_ID = process.env.SHOPIFY_SHOP_ID;
export const CLIENT_ID = process.env.SHOPIFY_CUSTOMER_CLIENT_ID;
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
export const REDIRECT_URI = `${SITE_URL}/account/authorize`;

const BASE = `https://shopify.com/authentication/${SHOP_ID}`;
export const AUTHORIZE_URL = `${BASE}/oauth/authorize`;
export const TOKEN_URL = `${BASE}/oauth/token`;
export const LOGOUT_URL = `${BASE}/logout`;

export const randomString = () => randomBytes(32).toString("base64url");

export const challengeFrom = (verifier) =>
  createHash("sha256").update(verifier).digest("base64url");

export const cookieOpts = (maxAge) => ({
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/",
  maxAge,
});