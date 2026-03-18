"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { InviteRecord } from "@/types/invite";
import { formatWeddingDate, daysUntil } from "@/lib/invite-utils";
import RSVPDashboard from "@/components/rsvp/RSVPDashboard";
import {
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Instagram,
  Loader2,
  Heart,
  CalendarDays,
  MapPin,
  User,
  LogIn,
  Plus,
  ChevronDown,
  ChevronUp,
  Users,
  Pencil,
} from "lucide-react";

// ─── Single invite card ───────────────────────────────────────────────────────
function InviteCard({ invite }: { invite: InviteRecord }) {
  const [copied, setCopied] = useState(false);
  const [showRsvp, setShowRsvp] = useState(false);
  const inviteUrl = `${window.location.origin}/invite/${invite.slug}`;
  const days = daysUntil(invite.coupleDetails.weddingDate);

  const copyLink = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
              <Heart size={18} className="text-rose-500 fill-rose-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {invite.coupleDetails.groomName} &{" "}
                {invite.coupleDetails.brideName}
              </h3>
              <p className="text-xs text-gray-400">
                {formatWeddingDate(invite.coupleDetails.weddingDate)}
              </p>
            </div>
          </div>
          {days > 0 && (
            <div className="text-center bg-black text-white rounded-xl px-3 py-1.5 shrink-0">
              <p className="text-lg font-bold leading-none">{days}</p>
              <p className="text-xs opacity-60">days</p>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <CalendarDays size={12} />
            {formatWeddingDate(invite.coupleDetails.weddingDate)} ·{" "}
            {invite.coupleDetails.weddingTime}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin size={12} />
            {invite.coupleDetails.venue}
          </div>
        </div>

        {/* URL bar */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-100 p-2.5 mb-3">
          <span className="flex-1 text-xs text-gray-600 font-mono truncate">
            {inviteUrl}
          </span>
          <button
            onClick={copyLink}
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all shrink-0 ${
              copied
                ? "bg-emerald-100 text-emerald-700"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {copied ? (
              <>
                <Check size={10} /> Copied!
              </>
            ) : (
              <>
                <Copy size={10} /> Copy
              </>
            )}
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() =>
              window.open(
                `https://wa.me/?text=${encodeURIComponent("You're invited! 💍 " + inviteUrl)}`,
                "_blank",
              )
            }
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium bg-[#25D366]/10 text-[#128C7E] rounded-xl hover:bg-[#25D366]/20 transition-colors"
          >
            <MessageCircle size={13} /> WhatsApp
          </button>
          <button
            onClick={() =>
              window.open(
                `https://www.instagram.com/share?url=${encodeURIComponent(inviteUrl)}`,
                "_blank",
              )
            }
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium bg-pink-50 text-pink-600 rounded-xl hover:bg-pink-100 transition-colors"
          >
            <Instagram size={13} /> Instagram
          </button>
          <Link
            href={`/invite/${invite.slug}`}
            target="_blank"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ExternalLink size={13} /> Open
          </Link>
          <Link
            href={`/edit/${invite.slug}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <Pencil size={13} /> Edit
          </Link>
        </div>
      </div>

      {/* RSVP toggle */}
      <button
        onClick={() => setShowRsvp(!showRsvp)}
        className="w-full flex items-center justify-between px-5 py-3 border-t border-gray-100 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Users size={13} /> Guest Responses (RSVP)
        </span>
        {showRsvp ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {showRsvp && (
        <div className="px-5 pb-5 pt-2 border-t border-gray-100">
          <RSVPDashboard inviteSlug={invite.slug} />
        </div>
      )}
    </div>
  );
}

// ─── Logged-in dashboard ──────────────────────────────────────────────────────
function LoggedInDashboard() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const newSlug = searchParams.get("slug");
  const [invites, setInvites] = useState<InviteRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const seen = new Set<string>();
      const results: InviteRecord[] = [];

      // Load new invite from checkout redirect
      if (newSlug) {
        try {
          const res = await fetch(`/api/save-invite?slug=${newSlug}`);
          const data = await res.json();
          if (data.id && !seen.has(data.slug)) {
            results.push(data);
            seen.add(data.slug);
          }
        } catch {
          /* ignore */
        }
      }

      // Load all user's invites from DB
      try {
        const res = await fetch("/api/user/invites");
        if (res.ok) {
          const data: InviteRecord[] = await res.json();
          data.forEach((inv) => {
            if (!seen.has(inv.slug)) {
              results.push(inv);
              seen.add(inv.slug);
            }
          });
        }
      } catch {
        /* ignore */
      }

      setInvites(results);
      setLoading(false);
    };
    load();
  }, [newSlug, user]);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shrink-0">
            <User size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-sm text-gray-500">
              Welcome back, {user?.name?.split(" ")[0]}
            </p>
          </div>
        </div>
        <Link
          href="/catalog"
          className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          <Plus size={15} /> New Invite
        </Link>
      </div>

      {/* Success banner */}
      {newSlug && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
          <Heart
            size={18}
            className="text-emerald-600 fill-emerald-600 shrink-0"
          />
          <div>
            <p className="text-sm font-semibold text-emerald-800">
              Your invitation is live! 🎉
            </p>
            <p className="text-xs text-emerald-600">
              Share it with your guests using the link below.
            </p>
          </div>
        </div>
      )}

      {/* Invites */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="animate-spin text-gray-400" />
        </div>
      ) : invites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-200">
          <div className="text-5xl mb-4">💌</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No invitations yet
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            Browse our templates and create your first wedding invitation.
          </p>
          <Link
            href="/catalog"
            className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            Browse Templates
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            {invites.length} invitation{invites.length !== 1 ? "s" : ""}
          </p>
          {invites.map((invite) => (
            <InviteCard key={invite.slug} invite={invite} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Guest (not logged in) view ───────────────────────────────────────────────
function GuestDashboard() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const [invite, setInvite] = useState<InviteRecord | null>(null);
  const [loading, setLoading] = useState(!!slug);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    fetch(`/api/save-invite?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.id) setInvite(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      {invite ? (
        <div>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
            <Heart size={28} className="text-emerald-600 fill-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your invitation is live! 🎉
          </h1>
          <p className="text-gray-500 mb-6">
            {invite.coupleDetails.groomName} & {invite.coupleDetails.brideName}{" "}
            · {formatWeddingDate(invite.coupleDetails.weddingDate)}
          </p>
          <Link
            href={`/invite/${invite.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors mb-6"
          >
            <ExternalLink size={15} /> Open Your Invitation
          </Link>
          <div className="mt-6 bg-blue-50 rounded-2xl p-5 border border-blue-100 text-left">
            <p className="text-sm font-semibold text-blue-900 mb-1">
              💡 Create an account to manage your invitations
            </p>
            <p className="text-xs text-blue-700 mb-3">
              Sign up free to track RSVPs and manage your invite from a
              dashboard.
            </p>
            <Link
              href="/auth/signup"
              className="text-xs font-semibold text-blue-900 underline"
            >
              Create free account →
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Sign in to view your dashboard
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            All your invitations will appear here once you log in.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/auth/login"
              className="flex items-center gap-2 border border-gray-300 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <LogIn size={15} /> Login
            </Link>
            <Link
              href="/auth/signup"
              className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
function DashboardContent() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-gray-400" />
      </div>
    );
  }
  return user ? <LoggedInDashboard /> : <GuestDashboard />;
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 size={28} className="animate-spin text-gray-400" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
