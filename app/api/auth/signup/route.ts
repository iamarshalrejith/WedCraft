import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser, hashPassword, encodeSession, SESSION_COOKIE, StoredUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });

    const existing = await findUserByEmail(email);
    if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      email, name,
      provider: "email",
      role: "user",
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
      purchases: [],
    };

    await createUser(newUser);

    const token = encodeSession({ id: newUser.id, email, name, role: "user" });
    const res = NextResponse.json({ success: true, user: { id: newUser.id, email, name, role: "user" } });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 604800,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("signup:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}