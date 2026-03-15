"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { InviteRecord } from "@/types/invite";
import { formatWeddingDate, daysUntil } from "@/lib/invite-utils";
import {
  Copy,
  Check,
  ExternalLink,
  Share2,
  MessageCircle,
  Instagram,
  Loader2,
  Heart,
  CalendarDays,
  MapPin,
} from "lucide-react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const [invite, setInvite] = useState<InviteRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/invite/${slug}`
      : `/invite/${slug}`;

  useEffect(() => {
    if (!slug) {
      setError("No invite found.");
      setLoading(false);
      return;
    }
    fetch(`/api/save-invite?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setInvite(data);
      })
      .catch(() => setError("Failed to load invite."))
      .finally(() => setLoading(false));
  }, [slug]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(
      `You're invited! 💍 View our wedding invitation here: ${inviteUrl}`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const days = invite ? daysUntil(invite.coupleDetails.weddingDate) : 0;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !invite) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-4xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Invite not found</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link href="/" className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium">
          Go Home
        </Link>
      </div>
    );
  }

  const { coupleDetails } = invite;

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-10">
      {/* Success Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
          <Heart size={28} className="text-emerald-600 fill-emerald-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Your invitation is live! 🎉
        </h1>
        <p className="text-gray-500">
          {coupleDetails.groomName} & {coupleDetails.brideName} —{" "}
          {formatWeddingDate(coupleDetails.weddingDate)}
        </p>
      </div>

      {/* Countdown */}
      {days > 0 && (
        <div className="bg-black text-white rounded-2xl p-5 text-center mb-6">
          <p className="text-sm text-gray-400 mb-1">Wedding in</p>
          <p className="text-5xl font-bold tabular-nums">{days}</p>
          <p className="text-sm text-gray-400 mt-1">days to go</p>
        </div>
      )}

      {/* Invite URL Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-1">Your Invitation Link</h2>
        <p className="text-sm text-gray-500 mb-4">
          Share this link with your guests. It works on any device, forever.
        </p>

        {/* URL Bar */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-200 p-3 mb-4">
          <span className="flex-1 text-sm text-gray-700 font-mono truncate">
            {inviteUrl}
          </span>
          <button
            onClick={copyLink}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shrink-0 ${
              copied
                ? "bg-emerald-100 text-emerald-700"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {copied ? (
              <>
                <Check size={12} /> Copied!
              </>
            ) : (
              <>
                <Copy size={12} /> Copy
              </>
            )}
          </button>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={shareWhatsApp}
            className="flex flex-col items-center gap-1.5 p-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 rounded-xl transition-colors"
          >
            <MessageCircle size={20} className="text-[#25D366]" />
            <span className="text-xs font-medium text-gray-700">WhatsApp</span>
          </button>

          <button
            onClick={() =>
              window.open(
                `https://www.instagram.com/share?url=${encodeURIComponent(inviteUrl)}`,
                "_blank"
              )
            }
            className="flex flex-col items-center gap-1.5 p-3 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors"
          >
            <Instagram size={20} className="text-pink-600" />
            <span className="text-xs font-medium text-gray-700">Instagram</span>
          </button>

          <Link
            href={`/invite/${slug}`}
            target="_blank"
            className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ExternalLink size={20} className="text-gray-600" />
            <span className="text-xs font-medium text-gray-700">Open Invite</span>
          </Link>
        </div>
      </div>

      {/* Details summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Invite Summary</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Heart size={16} className="text-rose-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {coupleDetails.groomName} & {coupleDetails.brideName}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CalendarDays size={16} className="text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-700">
                {formatWeddingDate(coupleDetails.weddingDate)} at{" "}
                {coupleDetails.weddingTime}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-green-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-700">{coupleDetails.venue}</p>
              {coupleDetails.venueAddress && (
                <p className="text-xs text-gray-400">{coupleDetails.venueAddress}</p>
              )}
            </div>
          </div>
        </div>

        {coupleDetails.events.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Events
            </p>
            <div className="space-y-1.5">
              {coupleDetails.events.map((event, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-700 font-medium">{event.name}</span>
                  <span className="text-gray-500">
                    {formatWeddingDate(event.date)} · {event.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Help tips */}
      <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
        <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
          <Share2 size={16} /> Tips for sharing
        </h3>
        <ul className="space-y-2 text-sm text-amber-800">
          <li>
            📱 <strong>WhatsApp:</strong> Paste the link in your family groups — it
            auto-previews with your name.
          </li>
          <li>
            📸 <strong>Instagram:</strong> Add the link to your bio and stories.
          </li>
          <li>
            📧 <strong>Email:</strong> Copy the link and paste it in your email
            invitations.
          </li>
          <li>
            🖨️ <strong>Print:</strong> Add a QR code linking to this URL on your
            physical cards.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-gray-400" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}