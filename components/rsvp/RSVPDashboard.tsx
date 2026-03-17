"use client";

import { useEffect, useState } from "react";
import { RSVPResponse } from "@/types/rsvp";
import { Users, Check, X, HelpCircle, Loader2, Calendar } from "lucide-react";

interface RSVPDashboardProps {
  inviteSlug: string;
}

interface RsvpStats {
  total: number;
  attending: number;
  notAttending: number;
  maybe: number;
  totalGuests: number;
}

export default function RSVPDashboard({ inviteSlug }: RSVPDashboardProps) {
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);
  const [stats, setStats] = useState<RsvpStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/rsvp?slug=${inviteSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else { setRsvps(data.rsvps); setStats(data.stats); }
      })
      .catch(() => setError("Failed to load responses"))
      .finally(() => setLoading(false));
  }, [inviteSlug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-500 py-4">{error}</div>
    );
  }

  const attendingIcon = (status: string) => {
    if (status === "yes") return <Check size={14} className="text-emerald-500" />;
    if (status === "no") return <X size={14} className="text-red-400" />;
    return <HelpCircle size={14} className="text-amber-400" />;
  };

  const attendingBg = (status: string) => {
    if (status === "yes") return "bg-emerald-50 text-emerald-700";
    if (status === "no") return "bg-red-50 text-red-600";
    return "bg-amber-50 text-amber-700";
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total RSVPs", value: stats.total, icon: Users, color: "text-gray-700" },
            { label: "Attending", value: stats.attending, icon: Check, color: "text-emerald-600" },
            { label: "Declined", value: stats.notAttending, icon: X, color: "text-red-500" },
            { label: "Total Guests", value: stats.totalGuests, icon: Calendar, color: "text-blue-600" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 font-medium">{label}</span>
                <Icon size={14} className={color} />
              </div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Response list */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 text-sm">Guest Responses</h3>
          <span className="text-xs text-gray-400">{rsvps.length} total</span>
        </div>

        {rsvps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <Users size={32} className="text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">No responses yet</p>
            <p className="text-xs text-gray-300 mt-1">Share your invite link to start receiving RSVPs</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {rsvps.map((r) => (
              <div key={r.id} className="px-5 py-3.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-sm font-semibold text-gray-600">
                  {r.guestName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-900">{r.guestName}</span>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${attendingBg(r.attending)}`}>
                      {attendingIcon(r.attending)}
                      {r.attending === "yes" ? "Attending" : r.attending === "no" ? "Declined" : "Maybe"}
                    </span>
                    {r.attending === "yes" && r.guestCount > 1 && (
                      <span className="text-xs text-gray-400">· {r.guestCount} people</span>
                    )}
                  </div>
                  {r.guestPhone && (
                    <p className="text-xs text-gray-400 mt-0.5">{r.guestPhone}</p>
                  )}
                  {r.message && (
                    <p className="text-xs text-gray-500 mt-1 italic">&ldquo;{r.message}&rdquo;</p>
                  )}
                </div>
                <span className="text-xs text-gray-300 shrink-0">
                  {new Date(r.respondedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}