import { NextRequest, NextResponse } from "next/server";
import { userStore, hashPassword, encodeSession, StoredUser } from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    if (userStore.has(email)) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      email,
      name,
      provider: "email",
      role: "user",
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
      purchases: [],
    };

    userStore.set(email, newUser);

    const sessionToken = encodeSession({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });

    const res = NextResponse.json({
      success: true,
      user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
    });

    res.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("signup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}