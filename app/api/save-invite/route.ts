import { NextRequest, NextResponse } from "next/server";
import { InviteRecord } from "@/types/invite";
import { generateInviteSlug } from "@/lib/invite-utils";

// In production, replace this with your actual DB (MongoDB, Supabase, etc.)
// For now we use a simple in-memory store so you can test the full flow.
// When you add MongoDB: import clientPromise from "@/lib/mongodb"

const inviteStore = new Map<string, InviteRecord>();

// POST /api/save-invite  — called after payment is verified
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      templateId,
      templateSlug,
      coupleDetails,
      razorpayOrderId,
      razorpayPaymentId,
    } = body;

    if (!templateId || !coupleDetails?.groomName || !coupleDetails?.brideName) {
      return NextResponse.json({ error: "Missing invite data" }, { status: 400 });
    }

    // Generate unique slug, append random suffix if collision
    let slug = generateInviteSlug(coupleDetails.groomName, coupleDetails.brideName);
    if (inviteStore.has(slug)) {
      slug = `${slug}-${Math.floor(Math.random() * 9000) + 1000}`;
    }

    const invite: InviteRecord = {
      id: crypto.randomUUID(),
      slug,
      templateId,
      templateSlug,
      coupleDetails,
      isPurchased: true,
      razorpayOrderId,
      razorpayPaymentId,
      createdAt: new Date().toISOString(),
      purchasedAt: new Date().toISOString(),
    };

    // Save to store (replace with DB write in production)
    inviteStore.set(slug, invite);

    return NextResponse.json({ success: true, slug, inviteUrl: `/invite/${slug}` });
  } catch (err) {
    console.error("save-invite error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/save-invite?slug=rahul-weds-priya  — fetch invite data
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const invite = inviteStore.get(slug);
  if (!invite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  return NextResponse.json(invite);
}