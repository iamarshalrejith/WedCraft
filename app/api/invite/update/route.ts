import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { TIER_MAX_EDITS } from "@/types/invite";

// PATCH /api/invite/update — couple updates their invite details
export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { slug, coupleDetails } = body;

    if (!slug || !coupleDetails) {
      return NextResponse.json({ error: "Missing slug or coupleDetails" }, { status: 400 });
    }

    const db = await getDb();
    const invite = await db.collection("invites").findOne({ slug });
    if (!invite) return NextResponse.json({ error: "Invite not found" }, { status: 404 });

    // Ownership check
    if (session.role !== "admin" && invite.userId !== session.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ── Expiry check — blocked after wedding date passes ─────────────────────
    const weddingDate = new Date(invite.coupleDetails?.weddingDate || "");
    const now = new Date();
    // Give a 1-day grace period after wedding
    const gracePeriod = new Date(weddingDate);
    gracePeriod.setDate(gracePeriod.getDate() + 1);

    if (session.role !== "admin" && weddingDate.getTime() > 0 && now > gracePeriod) {
      return NextResponse.json({
        error: "Your wedding date has passed. Editing is no longer available.",
        code: "WEDDING_PASSED",
      }, { status: 403 });
    }

    // ── Edit count check — max 2 edits for all tiers ─────────────────────────
    const tier = invite.purchasedTier ?? "Premium";
    const maxEdits = TIER_MAX_EDITS[tier] ?? 2;
    const currentEdits = invite.editCount ?? 0;

    if (session.role !== "admin" && currentEdits >= maxEdits) {
      return NextResponse.json({
        error: `You have used all ${maxEdits} edits included in your ${tier} plan.`,
        code: "EDIT_LIMIT_REACHED",
        editCount: currentEdits,
        maxEdits,
      }, { status: 403 });
    }

    // ── Save the update ───────────────────────────────────────────────────────
    await db.collection("invites").updateOne(
      { slug },
      {
        $set: { coupleDetails, updatedAt: new Date().toISOString() },
        $inc: { editCount: 1 },
      }
    );

    const newCount = currentEdits + 1;
    const editsLeft = maxEdits - newCount;

    return NextResponse.json({
      success: true,
      editCount: newCount,
      editsLeft,
      maxEdits,
    });
  } catch (err) {
    console.error("invite update:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}