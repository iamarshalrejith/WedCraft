import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export interface Coupon {
  id: string;
  code: string;               // e.g. "WEDDING20"
  type: "percent" | "flat";   // percent off or flat INR off
  value: number;              // 20 = 20% or ₹200
  minOrderAmount: number;     // minimum cart value to apply
  maxUses: number;            // 0 = unlimited
  usedCount: number;
  expiresAt: string | null;   // ISO date or null
  isActive: boolean;
  createdAt: string;
}

// POST /api/coupon/validate
// Body: { code, templatePrice }
export async function POST(req: NextRequest) {
  try {
    const { code, templatePrice } = await req.json();

    if (!code?.trim()) {
      return NextResponse.json({ error: "Enter a coupon code" }, { status: 400 });
    }

    const db = await getDb();
    const coupon = await db.collection<Coupon>("coupons").findOne(
      { code: code.trim().toUpperCase() },
      { projection: { _id: 0 } }
    );

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: "This coupon is no longer active" }, { status: 400 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
    }

    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 });
    }

    if (templatePrice < coupon.minOrderAmount) {
      return NextResponse.json({
        error: `Minimum order ₹${coupon.minOrderAmount.toLocaleString("en-IN")} required for this coupon`,
      }, { status: 400 });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.type === "percent") {
      discountAmount = Math.round((templatePrice * coupon.value) / 100);
    } else {
      discountAmount = Math.min(coupon.value, templatePrice);
    }

    const finalPrice = Math.max(1, templatePrice - discountAmount);

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
      },
      discountAmount,
      finalPrice,
      message: coupon.type === "percent"
        ? `${coupon.value}% off applied!`
        : `₹${discountAmount.toLocaleString("en-IN")} off applied!`,
    });
  } catch (err) {
    console.error("coupon validate:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}