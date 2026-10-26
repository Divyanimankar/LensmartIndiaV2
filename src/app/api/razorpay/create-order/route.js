// Place this file at:  app/api/razorpay/create-order/route.js
// Install:             npm i razorpay
// Env (.env.local):    RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
//                      RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx

import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { amount } = await request.json();

    /* Razorpay works in paise */
    const paise = Math.round(Number(amount) * 100);

    if (!Number.isFinite(paise) || paise < 100) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: paise,
      currency: "INR",
      receipt: `lmi_${Date.now()}`,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      keyId: process.env.RAZORPAY_KEY_ID, // public key id, safe for the browser
    });
  } catch (error) {
    console.error("create-order error:", error);
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }
}