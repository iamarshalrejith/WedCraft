import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { templates as staticTemplates } from "@/data/templates";

// Static slug → { name, price, tier } map — always available as fallback
const staticTemplateMap: Record<string, { name: string; price: number; tier: string }> =
  Object.fromEntries(
    staticTemplates.map((t) => [t.slug, { name: t.name, price: t.price, tier: t.tier }])
  );

// GET /api/admin/purchases
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "15");
    const search = url.searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    // Search filter
    const searchFilter = search
      ? {
          $or: [
            { "coupleDetails.groomName": { $regex: search, $options: "i" } },
            { "coupleDetails.brideName": { $regex: search, $options: "i" } },
            { templateSlug: { $regex: search, $options: "i" } },
            { slug: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [invites, total] = await Promise.all([
      db
        .collection("invites")
        .find(searchFilter, { projection: { _id: 0 } })
        .sort({ purchasedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("invites").countDocuments(searchFilter),
    ]);

    // ── User lookup ──────────────────────────────────────────────────────
    const userIds = [...new Set(invites.map((i) => i.userId).filter(Boolean))];
    let userMap: Record<string, { name: string; email: string }> = {};
    if (userIds.length > 0) {
      const users = await db
        .collection("users")
        .find({ id: { $in: userIds } }, { projection: { _id: 0, id: 1, name: 1, email: 1 } })
        .toArray();
      userMap = Object.fromEntries(users.map((u) => [u.id, { name: u.name, email: u.email }]));
    }

    // ── Template lookup ──────────────────────────────────────────────────
    // Start with static data (covers all built-in templates guaranteed).
    // Then overlay any DB-stored overrides (admin-edited templates).
    const templateMap: Record<string, { name: string; price: number; tier: string }> = {
      ...staticTemplateMap,
    };

    const templateSlugs = [...new Set(invites.map((i) => i.templateSlug).filter(Boolean))];
    if (templateSlugs.length > 0) {
      const dbTemplates = await db
        .collection("templates")
        .find(
          { slug: { $in: templateSlugs } },
          { projection: { _id: 0, slug: 1, name: 1, price: 1, tier: 1 } }
        )
        .toArray();
      for (const t of dbTemplates) {
        templateMap[t.slug] = { name: t.name, price: t.price, tier: t.tier };
      }
    }

    // ── Merge ────────────────────────────────────────────────────────────
    const purchases = invites.map((invite) => {
      const user = invite.userId ? userMap[invite.userId] : null;
      const tmpl = invite.templateSlug ? templateMap[invite.templateSlug] : null;
      return {
        id: invite.id,
        slug: invite.slug,
        groomName: invite.coupleDetails?.groomName || "—",
        brideName: invite.coupleDetails?.brideName || "—",
        userName: user?.name || "Guest",
        userEmail: user?.email || "—",
        userId: invite.userId || null,
        templateSlug: invite.templateSlug || "—",
        templateName: tmpl?.name || invite.templateSlug || "—",
        templateTier: tmpl?.tier || "—",
        amountPaid: tmpl?.price ?? null,
        razorpayPaymentId: invite.razorpayPaymentId || null,
        razorpayOrderId: invite.razorpayOrderId || null,
        purchasedAt: invite.purchasedAt || invite.createdAt,
        createdAt: invite.createdAt,
        viewCount: invite.viewCount ?? 0,
      };
    });

    // ── Revenue total (uses static prices as source of truth) ────────────
    const allInvites = await db
      .collection("invites")
      .find({}, { projection: { _id: 0, templateSlug: 1 } })
      .toArray();

    const totalRevenue = allInvites.reduce((sum, inv) => {
      const price = inv.templateSlug ? (templateMap[inv.templateSlug]?.price ?? 0) : 0;
      return sum + price;
    }, 0);

    return NextResponse.json({
      purchases,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        totalPurchases: await db.collection("invites").countDocuments(),
        totalRevenue,
      },
    });
  } catch (err) {
    console.error("admin/purchases GET:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}