import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

// ── Types ────────────────────────────────────────────────────────────────────
export interface Review {
  id: string;
  templateSlug: string;
  userId: string;
  userName: string;
  rating: number;       // 1–5
  comment: string;
  createdAt: string;
}

// ── GET /api/review?slug=mangal-utsav ────────────────────────────────────────
// Returns all reviews + computed average for a template
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  try {
    const db = await getDb();
    const reviews = await db
      .collection<Review>("reviews")
      .find({ templateSlug: slug }, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    const count = reviews.length;
    const average =
      count > 0
        ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10
        : 0;

    // Also check if the logged-in user has already reviewed
    const session = await getSession();
    const userReview = session
      ? reviews.find((r) => r.userId === session.id) ?? null
      : null;

    return NextResponse.json({ reviews, count, average, userReview });
  } catch (err) {
    console.error("review GET:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── POST /api/review ─────────────────────────────────────────────────────────
// Submit a review — only verified buyers can submit
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "You must be logged in to leave a review" }, { status: 401 });
  }

  try {
    const { templateSlug, rating, comment } = await req.json();

    if (!templateSlug || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const db = await getDb();

    // ── Verify this user actually purchased this template ──────────────────
    const purchase = await db.collection("invites").findOne({
      userId: session.id,
      templateSlug,
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "Only verified buyers can leave a review for this template" },
        { status: 403 }
      );
    }

    // ── One review per user per template ──────────────────────────────────
    const existing = await db.collection("reviews").findOne({
      userId: session.id,
      templateSlug,
    });

    if (existing) {
      // Update the existing review instead
      await db.collection("reviews").updateOne(
        { userId: session.id, templateSlug },
        {
          $set: {
            rating: Number(rating),
            comment: comment?.trim() ?? "",
            updatedAt: new Date().toISOString(),
          },
        }
      );
      return NextResponse.json({ success: true, updated: true });
    }

    // ── Insert new review ──────────────────────────────────────────────────
    const review: Review = {
      id: crypto.randomUUID(),
      templateSlug,
      userId: session.id,
      userName: session.name ?? "User",
      rating: Number(rating),
      comment: comment?.trim() ?? "",
      createdAt: new Date().toISOString(),
    };

    await db.collection("reviews").insertOne(review);

    return NextResponse.json({ success: true, updated: false });
  } catch (err) {
    console.error("review POST:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}