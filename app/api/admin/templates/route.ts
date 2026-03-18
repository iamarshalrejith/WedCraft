import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { Template } from "@/data/templates";
import { templates as staticTemplates } from "@/data/templates";

// Seed static templates into DB if collection is empty
async function seedIfEmpty() {
  const db = await getDb();
  const col = db.collection("templates");
  const count = await col.countDocuments();
  if (count === 0) {
    await col.insertMany(staticTemplates.map((t) => ({ ...t })));
  }
}

// GET /api/admin/templates
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await seedIfEmpty();
  const db = await getDb();
  const templates = await db.collection("templates").find({}, { projection: { _id: 0 } }).toArray();
  return NextResponse.json(templates);
}

// POST /api/admin/templates — create new
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { name, slug, price, tier, religion, themes, description, features,
            rating, reviewCount, isFeatured, isNew, thumbnail, previewBg, colors } = body;

    if (!name || !slug || !price || !tier || !religion) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const template: Template = {
      id: `t${Date.now()}`,
      name, slug,
      price: Number(price), tier, religion,
      themes: themes || [],
      description: description || "",
      features: features || [],
      rating: Number(rating) || 5.0,
      reviewCount: Number(reviewCount) || 0,
      isFeatured: Boolean(isFeatured),
      isNew: Boolean(isNew),
      thumbnail: thumbnail || "",
      previewBg: previewBg || "from-gray-100 to-gray-200",
      colors: colors || ["#000000"],
    };

    await seedIfEmpty();
    const db = await getDb();
    await db.collection("templates").insertOne(template);
    return NextResponse.json(template, { status: 201 });
  } catch (err) {
    console.error("create template:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}