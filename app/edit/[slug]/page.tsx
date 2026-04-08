"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { InviteRecord, WeddingEvent, FamilyMember } from "@/types/invite";
import { ArrowLeft, Save, Loader2, Plus, Trash2, Check, AlertTriangle, Lock, Users } from "lucide-react";
import FileUpload from "@/components/FileUpload";

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

function EditLimitBanner({
  editCount,
  maxEdits,
  locked,
  lockReason,
}: {
  editCount: number;
  maxEdits: number;
  locked: boolean;
  lockReason: string;
}) {
  const editsLeft = maxEdits - editCount;

  if (locked) {
    return (
      <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3.5 mb-6">
        <Lock size={16} className="text-red-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-red-800">Editing locked</p>
          <p className="text-xs text-red-600 mt-0.5">{lockReason}</p>
        </div>
      </div>
    );
  }

  if (editsLeft === 1) {
    return (
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5 mb-6">
        <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Last edit remaining</p>
          <p className="text-xs text-amber-600 mt-0.5">
            You have used {editCount} of {maxEdits} edits. This is your final edit — make it count.
          </p>
        </div>
      </div>
    );
  }

  if (editsLeft > 0) {
    return (
      <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-6">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: maxEdits }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i < editCount ? "bg-gray-300" : "bg-emerald-500"}`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-600">
          <span className="font-semibold">{editsLeft} edit{editsLeft !== 1 ? "s" : ""} remaining</span> of {maxEdits} included in your plan
        </p>
      </div>
    );
  }

  return null;
}

export default function EditInvitePage({ params }: EditPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [invite, setInvite] = useState<InviteRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Edit limit state
  const [editCount, setEditCount] = useState(0);
  const [maxEdits] = useState(2);
  const [locked, setLocked] = useState(false);
  const [lockReason, setLockReason] = useState("");

  const [form, setForm] = useState({
    groomName: "", brideName: "", weddingDate: "", weddingTime: "",
    venue: "", venueAddress: "", mapLink: "", phone: "", personalMessage: "",
    couplePhotoUrl: "", bgMusicUrl: "",
    // Family fields
    groomFatherName: "", groomMotherName: "",
    brideFatherName: "", brideMotherName: "",
  });
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [relatives, setRelatives] = useState<FamilyMember[]>([]);

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
          couplePhotoUrl: c.couplePhotoUrl || "",
          bgMusicUrl: c.bgMusicUrl || "",
          groomFatherName: c.groomFatherName || "",
          groomMotherName: c.groomMotherName || "",
          brideFatherName: c.brideFatherName || "",
          brideMotherName: c.brideMotherName || "",
        });
        setEvents(c.events || []);
        setRelatives(c.relatives || []);

        // Set edit count from DB
        const currentEdits = data.editCount ?? 0;
        setEditCount(currentEdits);

        // Check if locked due to edit limit
        if (currentEdits >= maxEdits) {
          setLocked(true);
          setLockReason(`You have used all ${maxEdits} edits included in your plan.`);
        }

        // Check if locked due to wedding passed
        const weddingDate = new Date(c.weddingDate || "");
        const gracePeriod = new Date(weddingDate);
        gracePeriod.setDate(gracePeriod.getDate() + 1);
        if (weddingDate.getTime() > 0 && new Date() > gracePeriod) {
          setLocked(true);
          setLockReason("Your wedding date has passed. Editing is no longer available.");
        }
      })
      .catch(() => setError("Failed to load invite"))
      .finally(() => setLoading(false));
  }, [slug, maxEdits]);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const updateEvent = (i: number, field: keyof WeddingEvent, value: string) =>
    setEvents((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));

  const addRelative = () =>
    setRelatives((prev) => [...prev, { name: "", relation: "", side: "groom" }]);

  const updateRelative = (i: number, field: keyof FamilyMember, value: string) =>
    setRelatives((prev) =>
      prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r)
    );

  const removeRelative = (i: number) =>
    setRelatives((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (locked) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/invite/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          coupleDetails: {
            ...form,
            events,
            relatives,
          },
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.code === "EDIT_LIMIT_REACHED") {
          setLocked(true);
          setLockReason(data.error);
          setError(data.error);
        } else if (data.code === "WEDDING_PASSED") {
          setLocked(true);
          setLockReason(data.error);
          setError(data.error);
        } else {
          setError(data.error || "Failed to save");
        }
        return;
      }

      setEditCount(data.editCount);
      if (data.editsLeft === 0) {
        setLocked(true);
        setLockReason(`You have used all ${data.maxEdits} edits included in your plan.`);
      }

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
    <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-8 py-6 md:py-8 mt-6 md:mt-10">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-black mb-4 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Invitation</h1>
            <p className="text-sm text-gray-500 mt-1">
              Changes appear live instantly on your invite.
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

      {/* Edit limit banner */}
      <EditLimitBanner
        editCount={editCount}
        maxEdits={maxEdits}
        locked={locked}
        lockReason={lockReason}
      />

      <div className="space-y-4 md:space-y-5">
        {/* Names */}
        <div className={`bg-white rounded-2xl border border-gray-200 p-6 space-y-4 ${locked ? "opacity-60 pointer-events-none" : ""}`}>
          <h2 className="font-semibold text-gray-900">Couple Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Groom's Name">
              <input className={inputCls} value={form.groomName}
                onChange={(e) => update("groomName", e.target.value)} placeholder="e.g. Rahul" />
            </Field>
            <Field label="Bride's Name">
              <input className={inputCls} value={form.brideName}
                onChange={(e) => update("brideName", e.target.value)} placeholder="e.g. Priya" />
            </Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* ── FAMILY SECTION ── */}
        <div className={`bg-white rounded-2xl border border-gray-200 p-6 space-y-5 ${locked ? "opacity-60 pointer-events-none" : ""}`}>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-500" />
            <h2 className="font-semibold text-gray-900">Family</h2>
          </div>

          {/* Groom's Parents */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Groom&apos;s Parents
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Father's Name">
                <input
                  className={inputCls}
                  value={form.groomFatherName}
                  onChange={(e) => update("groomFatherName", e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                />
              </Field>
              <Field label="Mother's Name">
                <input
                  className={inputCls}
                  value={form.groomMotherName}
                  onChange={(e) => update("groomMotherName", e.target.value)}
                  placeholder="e.g. Sunita Kumar"
                />
              </Field>
            </div>
          </div>

          {/* Bride's Parents */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Bride&apos;s Parents
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Father's Name">
                <input
                  className={inputCls}
                  value={form.brideFatherName}
                  onChange={(e) => update("brideFatherName", e.target.value)}
                  placeholder="e.g. Vijay Sharma"
                />
              </Field>
              <Field label="Mother's Name">
                <input
                  className={inputCls}
                  value={form.brideMotherName}
                  onChange={(e) => update("brideMotherName", e.target.value)}
                  placeholder="e.g. Meena Sharma"
                />
              </Field>
            </div>
          </div>

          {/* Relatives */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Relatives &amp; Extended Family
              </p>
              <button
                onClick={addRelative}
                className="flex items-center justify-center sm:justify-start gap-1 text-xs font-medium border border-gray-200 px-2.5 py-1 rounded-lg hover:bg-gray-50"
              >
                <Plus size={12} /> Add Relative
              </button>
            </div>

            {relatives.length === 0 && (
              <p className="text-sm text-gray-400">
                No relatives added yet. Click &quot;Add Relative&quot; to include family members.
              </p>
            )}

            <div className="space-y-2">
              {relatives.map((rel, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start bg-gray-50 p-3 rounded-xl"
                >
                  {/* Name */}
                  <input
                    className={`${inputCls} md:col-span-3`}
                    placeholder="Full name"
                    value={rel.name}
                    onChange={(e) => updateRelative(i, "name", e.target.value)}
                  />
                  {/* Relation */}
                  <input
                    className={`${inputCls} md:col-span-3`}
                    placeholder="Relation (e.g. Uncle)"
                    value={rel.relation}
                    onChange={(e) => updateRelative(i, "relation", e.target.value)}
                  />
                  {/* Spouse name */}
                  <input
                    className={`${inputCls} md:col-span-3`}
                    placeholder="Spouse name (optional)"
                    value={rel.spouseName || ""}
                    onChange={(e) => updateRelative(i, "spouseName", e.target.value)}
                  />
                  {/* Side */}
                  <select
                    className={`${inputCls} md:col-span-2`}
                    value={rel.side}
                    onChange={(e) => updateRelative(i, "side", e.target.value as "groom" | "bride")}
                  >
                    <option value="groom">Groom&apos;s side</option>
                    <option value="bride">Bride&apos;s side</option>
                  </select>
                  {/* Remove */}
                  <button
                    onClick={() => removeRelative(i)}
                    className="md:col-span-1 p-2.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Venue */}
        <div className={`bg-white rounded-2xl border border-gray-200 p-6 space-y-4 ${locked ? "opacity-60 pointer-events-none" : ""}`}>
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
        <div className={`bg-white rounded-2xl border border-gray-200 p-6 space-y-4 ${locked ? "opacity-60 pointer-events-none" : ""}`}>
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

        {/* Photo & Music — shown for Premium/Luxury templates */}
        {invite && (invite.purchasedTier === "Premium" || invite.purchasedTier === "Luxury") && (
          <div className={`bg-white rounded-2xl border border-gray-200 p-6 space-y-5 ${locked ? "opacity-60 pointer-events-none" : ""}`}>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-900">Photo & Music</h2>
              <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                {invite.purchasedTier}
              </span>
            </div>

            <Field label="Couple Photo (optional)">
              <FileUpload
                type="photo"
                value={form.couplePhotoUrl}
                onChange={(url) => update("couplePhotoUrl", url)}
                disabled={locked}
              />
            </Field>

            <Field label="Background Music (optional)">
              <FileUpload
                type="music"
                value={form.bgMusicUrl}
                onChange={(url) => update("bgMusicUrl", url)}
                disabled={locked}
              />
            </Field>
          </div>
        )}

        {/* Events */}
        <div className={`bg-white rounded-2xl border border-gray-200 p-6 space-y-4 ${locked ? "opacity-60 pointer-events-none" : ""}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="font-semibold text-gray-900">Events</h2>
            <button
              onClick={() => setEvents([...events, { name: "", date: "", time: "", venue: "" }])}
              className="flex items-center justify-center sm:justify-start gap-1 text-xs font-medium border border-gray-200 px-2.5 py-1 rounded-lg hover:bg-gray-50"
            >
              <Plus size={12} /> Add Event
            </button>
          </div>

          {events.length === 0 && (
            <p className="text-sm text-gray-400">No events added yet.</p>
          )}

          <div className="space-y-3">
            {events.map((event, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start bg-gray-50 p-3 rounded-xl">
                <input className={`${inputCls} md:col-span-3`} placeholder="Event name"
                  value={event.name} onChange={(e) => updateEvent(i, "name", e.target.value)} />
                <input type="date" className={`${inputCls} md:col-span-3`}
                  value={event.date} onChange={(e) => updateEvent(i, "date", e.target.value)} />
                <input className={`${inputCls} md:col-span-2`} placeholder="Time"
                  value={event.time} onChange={(e) => updateEvent(i, "time", e.target.value)} />
                <input className={`${inputCls} md:col-span-3`} placeholder="Venue (optional)"
                  value={event.venue || ""} onChange={(e) => updateEvent(i, "venue", e.target.value)} />
                <button onClick={() => setEvents(events.filter((_, idx) => idx !== i))}
                  className="md:col-span-1 p-2.5 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving || locked}
          className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
            locked
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              : saved
                ? "bg-emerald-500 text-white"
                : "bg-black text-white hover:bg-gray-800"
          } disabled:opacity-60`}
        >
          {saving ? (
            <><Loader2 size={16} className="animate-spin" /> Saving...</>
          ) : locked ? (
            <><Lock size={16} /> Editing locked</>
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