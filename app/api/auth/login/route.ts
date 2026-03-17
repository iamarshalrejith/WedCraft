import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, verifyPassword, encodeSession, SESSION_COOKIE, ensureAdminExists } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email and password are required" }, { status: 400 });

    await ensureAdminExists();

    const user = await findUserByEmail(email);
    if (!user || user.provider !== "email") return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    if (!user.passwordHash || !verifyPassword(password, user.passwordHash)) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const token = encodeSession({ id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl, role: user.role });
    const res = NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 604800,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("login:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}