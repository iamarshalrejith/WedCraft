import { NextRequest, NextResponse } from "next/server";
import { RSVPResponse } from "@/types/rsvp";

// ── DB abstraction ────────────────────────────────────────────────────────────
async function getRsvpCollection() {
  try {
    const { getDb } = await import("@/lib/mongodb");
    const db = await getDb();
    return db.collection<RSVPResponse>("rsvps");
  } catch {
    return null;
  }
}

const memRsvp = new Map<string, RSVPResponse[]>(); // key = inviteSlug

async function saveRsvp(rsvp: RSVPResponse) {
  const col = await getRsvpCollection();
  if (col) {
    await col.insertOne(rsvp);
  } else {
    const list = memRsvp.get(rsvp.inviteSlug) ?? [];
    list.push(rsvp);
    memRsvp.set(rsvp.inviteSlug, list);
  }
}

async function getRsvpsForInvite(inviteSlug: string): Promise<RSVPResponse[]> {
  const col = await getRsvpCollection();
  if (col) return col.find({ inviteSlug }).sort({ respondedAt: -1 }).toArray();
  return memRsvp.get(inviteSlug) ?? [];
}

// ── POST /api/rsvp — guest submits RSVP ──────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { inviteSlug, guestName, guestPhone, attending, guestCount, message } = body;

    if (!inviteSlug || !guestName || !attending) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const rsvp: RSVPResponse = {
      id: crypto.randomUUID(),
      inviteSlug,
      guestName: guestName.trim(),
      guestPhone: guestPhone?.trim() || undefined,
      attending,
      guestCount: Number(guestCount) || 1,
      message: message?.trim() || undefined,
      respondedAt: new Date().toISOString(),
    };

    await saveRsvp(rsvp);

    return NextResponse.json({ success: true, rsvp });
  } catch (err) {
    console.error("rsvp POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── GET /api/rsvp?slug=rahul-weds-priya — couple views responses ──────────────
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const rsvps = await getRsvpsForInvite(slug);

  // Summary stats
  const stats = {
    total: rsvps.length,
    attending: rsvps.filter((r) => r.attending === "yes").length,
    notAttending: rsvps.filter((r) => r.attending === "no").length,
    maybe: rsvps.filter((r) => r.attending === "maybe").length,
    totalGuests: rsvps.filter((r) => r.attending === "yes").reduce((s, r) => s + r.guestCount, 0),
  };

  return NextResponse.json({ rsvps, stats });
}