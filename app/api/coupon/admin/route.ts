import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { Coupon } from "@/app/api/coupon/validate/route";

// GET /api/coupon/admin — list all coupons
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const coupons = await db
    .collection("coupons")
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(coupons);
}

// POST /api/coupon/admin — create new coupon
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { code, type, value, minOrderAmount, maxUses, expiresAt } = body;

    if (!code || !type || !value) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await getDb();

    // Check duplicate
    const existing = await db.collection("coupons").findOne({
      code: code.toUpperCase(),
    });
    if (existing) {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
    }

    const coupon: Coupon = {
      id: crypto.randomUUID(),
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxUses: Number(maxUses) || 0,
      usedCount: 0,
      expiresAt: expiresAt || null,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    await db.collection("coupons").insertOne(coupon);
    return NextResponse.json(coupon, { status: 201 });
  } catch (err) {
    console.error("coupon create:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/coupon/admin — toggle active/inactive
export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, isActive } = await req.json();
  const db = await getDb();
  await db.collection("coupons").updateOne({ id }, { $set: { isActive } });
  return NextResponse.json({ success: true });
}