import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

const FIRSTTIME_COUPON_CODE = "WELCOME10";
const FIRSTTIME_DISCOUNT_PERCENT = 10;

// Seed the WELCOME10 coupon if it doesn't exist yet
async function ensureWelcomeCoupon(db: Awaited<ReturnType<typeof getDb>>) {
  const exists = await db
    .collection("coupons")
    .findOne({ code: FIRSTTIME_COUPON_CODE });

  if (!exists) {
    await db.collection("coupons").insertOne({
      id: "firsttime-welcome",
      code: FIRSTTIME_COUPON_CODE,
      type: "percent",
      value: FIRSTTIME_DISCOUNT_PERCENT,
      minOrderAmount: 0,
      maxUses: 0,        // unlimited (each user only sees it once — enforced by purchase check)
      usedCount: 0,
      expiresAt: null,
      isActive: true,
      isFirstTimeCoupon: true,   // flag so admin can identify it
      createdAt: new Date().toISOString(),
    });
  }
}

// GET /api/coupon/firsttime
// Returns whether the current logged-in user qualifies for the first-time discount.
// Called when checkout page loads — before any payment.
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    // Not logged in — can't verify first-time status
    if (!session) {
      return NextResponse.json({ isFirstTime: false });
    }

    const db = await getDb();
    await ensureWelcomeCoupon(db);

    // Count how many purchases this user has made
    const purchaseCount = await db
      .collection("invites")
      .countDocuments({ userId: session.id });

    if (purchaseCount > 0) {
      // Already bought before — not eligible
      return NextResponse.json({ isFirstTime: false });
    }

    // First-time buyer — return the discount details
    const templatePrice = Number(req.nextUrl.searchParams.get("price") ?? 0);
    const discountAmount = templatePrice > 0
      ? Math.round((templatePrice * FIRSTTIME_DISCOUNT_PERCENT) / 100)
      : 0;

    return NextResponse.json({
      isFirstTime: true,
      couponCode: FIRSTTIME_COUPON_CODE,
      discountPercent: FIRSTTIME_DISCOUNT_PERCENT,
      discountAmount,
      finalPrice: Math.max(1, templatePrice - discountAmount),
      message: `🎉 First order! ${FIRSTTIME_DISCOUNT_PERCENT}% off applied automatically.`,
    });
  } catch (err) {
    console.error("firsttime check:", err);
    return NextResponse.json({ isFirstTime: false });
  }
}