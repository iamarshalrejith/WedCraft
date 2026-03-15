import { NextRequest, NextResponse } from "next/server";

// POST /api/create-order
// Body: { amount: number, templateSlug: string, groomName: string, brideName: string }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, templateSlug, groomName, brideName } = body;

    if (!amount || !templateSlug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Razorpay API credentials from env
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay credentials not configured" },
        { status: 500 }
      );
    }

    // Create Razorpay order via their REST API
    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100, // Razorpay uses paise
        currency: "INR",
        receipt: `wedcraft_${templateSlug}_${Date.now()}`,
        notes: {
          groomName,
          brideName,
          templateSlug,
        },
      }),
    });

    if (!razorpayRes.ok) {
      const err = await razorpayRes.json();
      console.error("Razorpay error:", err);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    const order = await razorpayRes.json();
    return NextResponse.json({ orderId: order.id, amount: order.amount });
  } catch (err) {
    console.error("create-order error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}