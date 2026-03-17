import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAllTemplates, createTemplate } from "@/lib/template-store";

// GET /api/admin/templates — list all templates
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getAllTemplates());
}

// POST /api/admin/templates — create new template
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

    const template = createTemplate({
      name,
      slug,
      price: Number(price),
      tier,
      religion,
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
    });

    return NextResponse.json(template, { status: 201 });
  } catch (err) {
    console.error("create template error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}