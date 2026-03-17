import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser, updateUser, encodeSession, SESSION_COOKIE, StoredUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  if (!code) return NextResponse.redirect(`${appUrl}/auth/login?error=google_cancelled`);

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${appUrl}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return NextResponse.redirect(`${appUrl}/auth/login?error=google_failed`);

    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const g = await userInfoRes.json();
    if (!g.email) return NextResponse.redirect(`${appUrl}/auth/login?error=google_no_email`);

    let user = await findUserByEmail(g.email);
    if (!user) {
      const newUser: StoredUser = {
        id: crypto.randomUUID(),
        email: g.email,
        name: g.name || g.email.split("@")[0],
        avatarUrl: g.picture,
        provider: "google",
        role: "user",
        createdAt: new Date().toISOString(),
        purchases: [],
      };
      await createUser(newUser);
      user = newUser;
    } else if (g.picture) {
      await updateUser(user.id, { avatarUrl: g.picture });
      user.avatarUrl = g.picture;
    }

    const token = encodeSession({ id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl, role: user.role });
    const res = NextResponse.redirect(user.role === "admin" ? `${appUrl}/admin` : `${appUrl}/dashboard`);
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 604800,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("Google callback:", err);
    return NextResponse.redirect(`${appUrl}/auth/login?error=server_error`);
  }
}