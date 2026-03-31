import { NextRequest, NextResponse } from "next/server";
import { InviteRecord, TIER_EXPIRY_MONTHS } from "@/types/invite";
import { generateInviteSlug } from "@/lib/invite-utils";
import { getDb } from "@/lib/mongodb";
import { getTemplateBySlug } from "@/data/templates";

function calcExpiresAt(tier: string): string {
  const months = TIER_EXPIRY_MONTHS[tier] ?? 12;
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString();
}

// POST /api/save-invite — called after payment is verified
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      templateId,
      templateSlug,
      coupleDetails,
      razorpayOrderId,
      razorpayPaymentId,
      userId,
    } = body;

    if (!templateId || !coupleDetails?.groomName || !coupleDetails?.brideName) {
      return NextResponse.json({ error: "Missing invite data" }, { status: 400 });
    }

    // Resolve tier from template data
    const template = getTemplateBySlug(templateSlug);
    const purchasedTier = template?.tier ?? "Premium";

    const db = await getDb();
    const invites = db.collection("invites");

    // Generate unique slug
    let slug = generateInviteSlug(coupleDetails.groomName, coupleDetails.brideName);
    const existing = await invites.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Math.floor(Math.random() * 9000) + 1000}`;
    }

    const invite: Omit<InviteRecord, "_id"> = {
      id: crypto.randomUUID(),
      slug,
      templateId,
      templateSlug,
      coupleDetails,
      isPurchased: true,
      razorpayOrderId: razorpayOrderId || null,
      razorpayPaymentId: razorpayPaymentId || null,
      userId: userId || null,
      createdAt: new Date().toISOString(),
      purchasedAt: new Date().toISOString(),
      // ── Tier-based limits ────────────────────────────────────
      purchasedTier,
      expiresAt: calcExpiresAt(purchasedTier),
      editCount: 0,
    };

    await invites.insertOne(invite);

    // Link purchase to user account
    if (userId) {
      await db
        .collection("users")
        .updateOne({ id: userId }, { $addToSet: { purchases: slug } });
    }

    return NextResponse.json({
      success: true,
      slug,
      inviteUrl: `/invite/${slug}`,
    });
  } catch (err) {
    console.error("save-invite POST:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/save-invite?slug=rahul-weds-priya — fetch invite data
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const invite = await db
      .collection("invites")
      .findOne({ slug }, { projection: { _id: 0 } });

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    return NextResponse.json(invite);
  } catch (err) {
    console.error("save-invite GET:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}