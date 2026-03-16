import { NextRequest, NextResponse } from "next/server";
import { userStore, encodeSession, SESSION_COOKIE, StoredUser } from "@/lib/auth";

// GET /api/auth/google/callback  — Google redirects here with ?code=...
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!code) {
    return NextResponse.redirect(`${appUrl}/auth/login?error=google_cancelled`);
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    const redirectUri = `${appUrl}/api/auth/google/callback`;

    // 1. Exchange code for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return NextResponse.redirect(`${appUrl}/auth/login?error=google_failed`);
    }

    // 2. Get user info from Google
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userInfoRes.json();

    if (!googleUser.email) {
      return NextResponse.redirect(`${appUrl}/auth/login?error=google_no_email`);
    }

    // 3. Find or create user
    let user = userStore.get(googleUser.email);

    if (!user) {
      const newUser: StoredUser = {
        id: crypto.randomUUID(),
        email: googleUser.email,
        name: googleUser.name || googleUser.email.split("@")[0],
        avatarUrl: googleUser.picture,
        provider: "google",
        role: "user",
        createdAt: new Date().toISOString(),
        purchases: [],
      };
      userStore.set(googleUser.email, newUser);
      user = newUser;
    } else {
      // Update avatar if changed
      if (googleUser.picture) user.avatarUrl = googleUser.picture;
    }

    // 4. Create session
    const sessionToken = encodeSession({
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role,
    });

    const res = NextResponse.redirect(
      user.role === "admin" ? `${appUrl}/admin` : `${appUrl}/dashboard`
    );

    res.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("Google callback error:", err);
    return NextResponse.redirect(`${appUrl}/auth/login?error=server_error`);
  }
}