// Place this file at:  app/api/razorpay/verify/route.js

import crypto from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ verified: false }, { status: 400 });
    }

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const a = Buffer.from(expected);
    const b = Buffer.from(String(razorpay_signature));

    const verified = a.length === b.length && crypto.timingSafeEqual(a, b);

    return NextResponse.json({ verified }, { status: verified ? 200 : 400 });
  } catch (error) {
    console.error("verify error:", error);
    return NextResponse.json({ verified: false }, { status: 500 });
  }
}