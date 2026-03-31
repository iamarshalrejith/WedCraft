"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { InviteRecord, WeddingEvent } from "@/types/invite";
import { ArrowLeft, Save, Loader2, Plus, Trash2, Check } from "lucide-react";

interface EditPageProps {
  params: Promise<{ slug: string }>;
}

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-colors placeholder:text-gray-400";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    {children}
  </div>
);

export default function EditInvitePage({ params }: EditPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [invite, setInvite] = useState<InviteRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    groomName: "", brideName: "", weddingDate: "", weddingTime: "",
    venue: "", venueAddress: "", mapLink: "", phone: "", personalMessage: "",
  });
  const [events, setEvents] = useState<WeddingEvent[]>([]);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/auth/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    fetch(`/api/save-invite?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError("Invite not found"); return; }
        setInvite(data);
        const c = data.coupleDetails;
        setForm({
          groomName: c.groomName || "",
          brideName: c.brideName || "",
          weddingDate: c.weddingDate || "",
          weddingTime: c.weddingTime || "",
          venue: c.venue || "",
          venueAddress: c.venueAddress || "",
          mapLink: c.mapLink || "",
          phone: c.phone || "",
          personalMessage: c.personalMessage || "",
        });
        setEvents(c.events || []);
      })
      .catch(() => setError("Failed to load invite"))
      .finally(() => setLoading(false));
  }, [slug]);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const updateEvent = (i: number, field: keyof WeddingEvent, value: string) =>
    setEvents((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/invite/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, coupleDetails: { ...form, events } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (error && !invite) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">{error}</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 mt-10">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-black mb-4 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Invitation</h1>
            <p className="text-sm text-gray-500 mt-1">
              Update your wedding details — changes appear live instantly.
            </p>
          </div>
          <Link
            href={`/invite/${slug}`}
            target="_blank"
            className="text-sm text-gray-500 hover:text-black underline"
          >
            Preview →
          </Link>
        </div>
      </div>

      <div className="space-y-5">
        {/* Names */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Couple Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Groom's Name">
              <input className={inputCls} value={form.groomName}
                onChange={(e) => update("groomName", e.target.value)} placeholder="e.g. Rahul" />
            </Field>
            <Field label="Bride's Name">
              <input className={inputCls} value={form.brideName}
                onChange={(e) => update("brideName", e.target.value)} placeholder="e.g. Priya" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Wedding Date">
              <input type="date" className={inputCls} value={form.weddingDate}
                onChange={(e) => update("weddingDate", e.target.value)} />
            </Field>
            <Field label="Wedding Time">
              <input className={inputCls} value={form.weddingTime}
                onChange={(e) => update("weddingTime", e.target.value)} placeholder="e.g. 7:00 PM" />
            </Field>
          </div>
        </div>

        {/* Venue */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Venue</h2>
          <Field label="Venue Name">
            <input className={inputCls} value={form.venue}
              onChange={(e) => update("venue", e.target.value)} placeholder="e.g. Grand Palace Banquet Hall" />
          </Field>
          <Field label="Venue Address">
            <input className={inputCls} value={form.venueAddress}
              onChange={(e) => update("venueAddress", e.target.value)} placeholder="Full address" />
          </Field>
          <Field label="Google Maps Link">
            <input className={inputCls} value={form.mapLink}
              onChange={(e) => update("mapLink", e.target.value)} placeholder="https://maps.google.com/..." />
          </Field>
        </div>

        {/* Contact & Message */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Contact & Message</h2>
          <Field label="WhatsApp / Phone for RSVP">
            <input className={inputCls} value={form.phone}
              onChange={(e) => update("phone", e.target.value)} placeholder="+91 98765 43210" />
          </Field>
          <Field label="Personal Message">
            <textarea className={`${inputCls} resize-none`} rows={3} value={form.personalMessage}
              onChange={(e) => update("personalMessage", e.target.value)}
              placeholder="A short note to your guests..." />
          </Field>
        </div>

        {/* Events */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Events</h2>
            <button
              onClick={() => setEvents([...events, { name: "", date: "", time: "", venue: "" }])}
              className="flex items-center gap-1 text-xs font-medium border border-gray-200 px-2.5 py-1 rounded-lg hover:bg-gray-50"
            >
              <Plus size={12} /> Add Event
            </button>
          </div>

          {events.length === 0 && (
            <p className="text-sm text-gray-400">No events added yet.</p>
          )}

          <div className="space-y-3">
            {events.map((event, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-start bg-gray-50 p-3 rounded-xl">
                <input className={`${inputCls} col-span-3`} placeholder="Event name"
                  value={event.name} onChange={(e) => updateEvent(i, "name", e.target.value)} />
                <input type="date" className={`${inputCls} col-span-3`}
                  value={event.date} onChange={(e) => updateEvent(i, "date", e.target.value)} />
                <input className={`${inputCls} col-span-2`} placeholder="Time"
                  value={event.time} onChange={(e) => updateEvent(i, "time", e.target.value)} />
                <input className={`${inputCls} col-span-3`} placeholder="Venue (optional)"
                  value={event.venue || ""} onChange={(e) => updateEvent(i, "venue", e.target.value)} />
                <button onClick={() => setEvents(events.filter((_, idx) => idx !== i))}
                  className="col-span-1 p-2.5 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
            saved
              ? "bg-emerald-500 text-white"
              : "bg-black text-white hover:bg-gray-800"
          } disabled:opacity-50`}
        >
          {saving ? (
            <><Loader2 size={16} className="animate-spin" /> Saving...</>
          ) : saved ? (
            <><Check size={16} /> Saved! Your invite is updated.</>
          ) : (
            <><Save size={16} /> Save Changes</>
          )}
        </button>
      </div>
    </div>
  );
}