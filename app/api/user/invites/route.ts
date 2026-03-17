import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

// GET /api/user/invites — returns all invites for the logged-in user
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await getDb();
    const invites = await db
      .collection("invites")
      .find({ userId: session.id }, { projection: { _id: 0 } })
      .sort({ purchasedAt: -1 })
      .toArray();

    return NextResponse.json(invites);
  } catch (err) {
    console.error("user/invites:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}