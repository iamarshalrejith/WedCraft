import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

// Token expires in 1 hour
const TOKEN_TTL_MS = 60 * 60 * 1000;

async function sendResetEmail(to: string, resetUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — reset email skipped");
    return;
  }

  const from = process.env.RESEND_FROM ?? "onboarding@resend.dev";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://wedcraft.in";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,0.06);">

        <tr><td style="background:#0a0a0a;padding:24px 32px;text-align:center;">
          <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">WedCraft 💍</p>
        </td></tr>

        <tr><td style="padding:36px 32px;">
          <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#0a0a0a;">Reset your password</h2>
          <p style="margin:0 0 28px;color:#555;font-size:15px;line-height:1.6;">
            We received a request to reset your WedCraft password. Click the button below to choose a new one.
            This link expires in <strong>1 hour</strong>.
          </p>

          <div style="text-align:center;margin-bottom:28px;">
            <a href="${resetUrl}"
              style="display:inline-block;background:#0a0a0a;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:14px;font-weight:600;letter-spacing:0.02em;">
              Reset Password →
            </a>
          </div>

          <p style="margin:0 0 8px;font-size:13px;color:#888;line-height:1.6;">
            If the button doesn&apos;t work, copy and paste this link:
          </p>
          <p style="margin:0 0 24px;font-size:12px;word-break:break-all;">
            <a href="${resetUrl}" style="color:#0a0a0a;">${resetUrl}</a>
          </p>

          <hr style="border:none;border-top:1px solid #eee;margin:0 0 20px;">
          <p style="margin:0;font-size:12px;color:#aaa;">
            If you didn&apos;t request a password reset, you can safely ignore this email.
            Your password will not change.
          </p>
        </td></tr>

        <tr><td style="padding:16px 32px;background:#f9f9f9;text-align:center;">
          <p style="margin:0;font-size:12px;color:#aaa;">
            WedCraft · <a href="${appUrl}" style="color:#aaa;">${appUrl}</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: "Reset your WedCraft password",
      html,
    }),
  });
}

// POST /api/auth/forgot-password
// Body: { email }
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await findUserByEmail(email.trim().toLowerCase());

    // Always return success — don't reveal whether email exists (security best practice)
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // Google-only accounts can't reset password
    if (user.provider === "google" && !user.passwordHash) {
      return NextResponse.json({
        error: "This account uses Google sign-in. Please sign in with Google instead.",
      }, { status: 400 });
    }

    // Generate a secure random token
    const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString();

    const db = await getDb();

    // Delete any existing reset tokens for this user
    await db.collection("password_resets").deleteMany({ userId: user.id });

    // Store the token
    await db.collection("password_resets").insertOne({
      token,
      userId: user.id,
      email: user.email,
      expiresAt,
      createdAt: new Date().toISOString(),
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://wedcraft.in";
    const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;

    await sendResetEmail(user.email, resetUrl);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("forgot-password:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}