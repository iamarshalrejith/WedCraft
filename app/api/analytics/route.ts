import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// POST /api/analytics  — called when a guest opens an invite
// Body: { slug }
export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

    const db = await getDb();

    // Increment view counter on the invite document
    await db.collection("invites").updateOne(
      { slug },
      {
        $inc: { viewCount: 1 },
        $set: { lastViewedAt: new Date().toISOString() },
      }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    // Never block the invite from loading due to analytics failure
    console.error("analytics:", err);
    return NextResponse.json({ success: false });
  }
}

// GET /api/analytics?slug=rahul-weds-priya  — get stats for dashboard
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  try {
    const db = await getDb();
    const invite = await db.collection("invites").findOne(
      { slug },
      { projection: { viewCount: 1, lastViewedAt: 1, _id: 0 } }
    );

    return NextResponse.json({
      viewCount: invite?.viewCount ?? 0,
      lastViewedAt: invite?.lastViewedAt ?? null,
    });
  } catch (err) {
    console.error("analytics GET:", err);
    return NextResponse.json({ viewCount: 0, lastViewedAt: null });
  }
}