import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

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

    // Make sure the invite belongs to the logged-in user (or admin)
    const invite = await db.collection("invites").findOne({ slug });
    if (!invite) return NextResponse.json({ error: "Invite not found" }, { status: 404 });

    if (session.role !== "admin" && invite.userId !== session.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.collection("invites").updateOne(
      { slug },
      { $set: { coupleDetails, updatedAt: new Date().toISOString() } }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("invite update:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}