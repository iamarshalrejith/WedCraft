import { NextRequest, NextResponse } from "next/server";
import { hashPassword, updateUser } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

// POST /api/auth/reset-password
// Body: { token, password }
export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const db = await getDb();

    // Find the reset record
    const resetRecord = await db.collection("password_resets").findOne({ token });

    if (!resetRecord) {
      return NextResponse.json(
        { error: "This reset link is invalid. Please request a new one." },
        { status: 400 }
      );
    }

    // Check expiry
    if (new Date(resetRecord.expiresAt) < new Date()) {
      await db.collection("password_resets").deleteOne({ token });
      return NextResponse.json(
        { error: "This reset link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Update the user's password
    await updateUser(resetRecord.userId, {
      passwordHash: hashPassword(password),
    });

    // Delete the used token so it can't be reused
    await db.collection("password_resets").deleteOne({ token });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("reset-password:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}