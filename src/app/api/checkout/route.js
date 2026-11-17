import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const env = (name) => String(process.env[name] || "").trim();

const STOREFRONT_URL = () =>
  `https://${env("SHOPIFY_STORE_DOMAIN")}/api/2025-01/graphql.json`;

const CART_CREATE = `
mutation CartCreate($input: CartInput!) {
  cartCreate(input: $input) {
    cart { id checkoutUrl }
    userErrors { field message }
  }
}`;

const text = (v) => String(v ?? "").trim();

/* attributes: empty values are skipped, order is kept (Eye first) */
const attrs = (pairs) =>
  pairs
    .filter(([, value]) => text(value) !== "")
    .map(([key, value]) => ({ key, value: text(value) }));

const prescriberText = (p = {}) =>
  [p.doctorName, p.clinicName, p.city, p.phone].map(text).filter(Boolean).join(", ");

/* one cart item (from the browser cart) -> Shopify cart lines */
function linesFor(item) {
  /* lens package (eyeglasses / sunglasses) is not supported yet */
  if (item.selectedLens) {
    return { error: `${item.name || "A product"} has a lens option (${item.selectedLens.name || "lens"}), which is not available at checkout yet. Remove it and add the frame without a lens option.` };
  }

  const variantId = text(item.variantId);
  if (!variantId) return { error: `${item.name || "A product"} is an old cart item. Please remove it and add it again from the product page.` };

  /* contact lens: one line per eye */
  if (item.rightEye || item.leftEye) {
    const manual = item.prescriptionMode !== "upload";
    const prescriber = prescriberText(item.prescriber);
    const lines = [];

    [
      ["Right (OD)", item.rightEye],
      ["Left (OS)", item.leftEye],
    ].forEach(([label, eye]) => {
      if (!eye?.selected) return;
      const quantity = Math.min(99, Math.max(1, parseInt(eye.quantity, 10) || 1));

      lines.push({
        merchandiseId: variantId,
        quantity,
        attributes: attrs([
          ["Eye", label],
          ["Power", manual ? eye.power : ""],
          ["CYL", manual ? eye.cyl : ""],
          ["Axis", manual ? eye.axis : ""],
          ["Add", manual ? eye.addPower : ""],
          ["BC", manual ? eye.bc : ""],
          ["DIA", manual ? eye.dia : ""],
          ["Prescription", manual ? "" : "Will be verified by LensMartIndia"],
          ["Prescriber", prescriber],
        ]),
      });
    });

    return { lines };
  }

  /* frames etc.: one line, with the chosen colour / size */
  const quantity = Math.min(99, Math.max(1, parseInt(item.quantity, 10) || 1));
  return {
    lines: [
      {
        merchandiseId: variantId,
        quantity,
        attributes: attrs([
          ["Colour", item.selectedColor],
          ["Size", item.selectedSize],
        ]),
      },
    ],
  };
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const items = Array.isArray(body?.items) ? body.items : [];
  if (!items.length) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const lines = [];
  for (const item of items) {
    const result = linesFor(item);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
    lines.push(...result.lines);
  }

  try {
    const res = await fetch(STOREFRONT_URL(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": env("SHOPIFY_STOREFRONT_TOKEN"),
      },
      body: JSON.stringify({ query: CART_CREATE, variables: { input: { lines } } }),
      cache: "no-store",
    });

    const json = await res.json();
    const result = json?.data?.cartCreate;
    const errors = result?.userErrors || [];

    if (json?.errors || errors.length || !result?.cart?.checkoutUrl) {
      const message =
        errors[0]?.message ||
        json?.errors?.[0]?.message ||
        "Could not start checkout. Please try again.";
      /* local testing me asli wajah dikhao */
      const detail = JSON.stringify({ status: res.status, errors: json?.errors, userErrors: errors }).slice(0, 400);
      return NextResponse.json(
        { error: process.env.NODE_ENV === "production" ? message : `${message} [${detail}]` },
        { status: 400 },
      );
    }

    return NextResponse.json({ checkoutUrl: result.cart.checkoutUrl });
  } catch (e) {
    const message = "Could not start checkout. Please try again.";
    return NextResponse.json(
      { error: process.env.NODE_ENV === "production" ? message : `${message} [${String(e).slice(0, 200)}]` },
      { status: 502 },
    );
  }
}