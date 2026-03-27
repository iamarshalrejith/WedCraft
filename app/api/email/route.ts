import { NextRequest, NextResponse } from "next/server";

// ── Resend free tier: 100 emails/day, no credit card required ────────────────
// Setup: go to resend.com → sign up free → create API key → add to .env:
//   RESEND_API_KEY=re_xxxxxxxxxxxx
//   RESEND_FROM=onboarding@resend.dev   ← use this until you verify a domain
//   ADMIN_EMAIL=hello@wedcraft.in

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — email skipped");
    return { skipped: true };
  }

  const from = process.env.RESEND_FROM ?? "onboarding@resend.dev";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Resend error:", err);
    throw new Error(`Resend: ${err}`);
  }

  return res.json();
}

// ── POST /api/email ───────────────────────────────────────────────────────────
// Called internally after a purchase is verified.
// Body: { type: "purchase", groomName, brideName, inviteUrl, buyerEmail, templateName }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, groomName, brideName, inviteUrl, buyerEmail, templateName } = body;

    if (type !== "purchase") {
      return NextResponse.json({ error: "Unknown email type" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://wedcraft.in";
    const adminEmail = process.env.ADMIN_EMAIL ?? "hello@wedcraft.in";

    // ── 1. Email to the buyer ─────────────────────────────────────────────────
    const buyerHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,0.06);">

        <!-- Header -->
        <tr><td style="background:#0a0a0a;padding:28px 32px;text-align:center;">
          <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">WedCraft 💍</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:36px 32px;">
          <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#0a0a0a;">Your invitation is live! 🎉</h1>
          <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6;">
            Hey ${groomName}! Your <strong>${templateName}</strong> wedding invitation for
            <strong>${groomName} & ${brideName}</strong> has been created and is ready to share.
          </p>

          <!-- Invite URL box -->
          <div style="background:#f4f4f4;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
            <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.08em;">Your invite link</p>
            <a href="${inviteUrl}" style="color:#0a0a0a;font-size:14px;font-weight:500;word-break:break-all;">${inviteUrl}</a>
          </div>

          <!-- CTA -->
          <div style="text-align:center;margin-bottom:28px;">
            <a href="${inviteUrl}" style="display:inline-block;background:#0a0a0a;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:14px;font-weight:600;letter-spacing:0.02em;">
              Open My Invitation →
            </a>
          </div>

          <hr style="border:none;border-top:1px solid #eee;margin:0 0 24px;">

          <p style="margin:0 0 8px;font-size:13px;color:#888;line-height:1.6;">
            <strong>What's next?</strong><br>
            • Share the link on WhatsApp, Instagram, or anywhere<br>
            • Go to your <a href="${appUrl}/dashboard" style="color:#0a0a0a;">dashboard</a> to view RSVP responses<br>
            • <a href="${appUrl}/edit/${inviteUrl.split("/invite/")[1]}" style="color:#0a0a0a;">Edit details</a> anytime — changes go live instantly
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 32px;background:#f9f9f9;text-align:center;">
          <p style="margin:0;font-size:12px;color:#aaa;">
            Made with ❤️ by WedCraft · <a href="${appUrl}" style="color:#aaa;">${appUrl}</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // ── 2. Admin alert email ──────────────────────────────────────────────────
    const adminHtml = `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;padding:24px;background:#fff;">
  <h2 style="margin:0 0 16px;color:#0a0a0a;">🎉 New Purchase!</h2>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:8px;border:1px solid #eee;font-weight:600;width:140px;">Template</td><td style="padding:8px;border:1px solid #eee;">${templateName}</td></tr>
    <tr><td style="padding:8px;border:1px solid #eee;font-weight:600;">Couple</td><td style="padding:8px;border:1px solid #eee;">${groomName} & ${brideName}</td></tr>
    <tr><td style="padding:8px;border:1px solid #eee;font-weight:600;">Buyer email</td><td style="padding:8px;border:1px solid #eee;">${buyerEmail || "Guest (not logged in)"}</td></tr>
    <tr><td style="padding:8px;border:1px solid #eee;font-weight:600;">Invite URL</td><td style="padding:8px;border:1px solid #eee;"><a href="${inviteUrl}">${inviteUrl}</a></td></tr>
    <tr><td style="padding:8px;border:1px solid #eee;font-weight:600;">Time</td><td style="padding:8px;border:1px solid #eee;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</td></tr>
  </table>
</body>
</html>`;

    const results = await Promise.allSettled([
      // Send to buyer only if we have their email
      buyerEmail
        ? sendEmail({ to: buyerEmail, subject: `Your WedCraft invitation is live! 💍 ${groomName} & ${brideName}`, html: buyerHtml })
        : Promise.resolve({ skipped: true }),

      // Always send admin alert
      sendEmail({ to: adminEmail, subject: `New purchase: ${groomName} & ${brideName} — ${templateName}`, html: adminHtml }),
    ]);

    const [buyerResult, adminResult] = results;
    return NextResponse.json({
      success: true,
      buyer: buyerResult.status === "fulfilled" ? buyerResult.value : { error: (buyerResult as PromiseRejectedResult).reason?.message },
      admin: adminResult.status === "fulfilled" ? adminResult.value : { error: (adminResult as PromiseRejectedResult).reason?.message },
    });
  } catch (err) {
    console.error("email route:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}