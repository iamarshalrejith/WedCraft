"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Template } from "@/data/templates";
import { Loader2, ArrowLeft, Plus, X } from "lucide-react";

type FormData = Omit<Template, "id">;

interface TemplateFormProps {
  initialData?: Partial<FormData>;
  templateId?: string; // if editing
  mode: "create" | "edit";
}

const religions = ["Hindu", "Muslim", "Christian", "Sikh", "Universal"];
const themes = ["Traditional", "Modern", "Minimal", "Beach", "Royal", "Floral"];
const tiers = ["Basic", "Premium", "Luxury"];

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-colors placeholder:text-gray-400";

const Field = ({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);

export default function TemplateForm({ initialData, templateId, mode }: TemplateFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<FormData>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    price: initialData?.price || 999,
    tier: initialData?.tier || "Premium",
    religion: initialData?.religion || "Universal",
    themes: initialData?.themes || [],
    description: initialData?.description || "",
    features: initialData?.features || [""],
    rating: initialData?.rating || 5.0,
    reviewCount: initialData?.reviewCount || 0,
    isFeatured: initialData?.isFeatured || false,
    isNew: initialData?.isNew || false,
    thumbnail: initialData?.thumbnail || "",
    previewBg: initialData?.previewBg || "from-pink-100 via-white to-rose-100",
    colors: initialData?.colors || ["#000000"],
  });

  const update = (field: keyof FormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    update("name", name);
    if (mode === "create") {
      const slug = name.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-").replace(/-+$/, "");
      update("slug", slug);
    }
  };

  const toggleTheme = (theme: string) => {
    const current = form.themes as string[];
    update("themes", current.includes(theme) ? current.filter((t) => t !== theme) : [...current, theme]);
  };

  const updateFeature = (i: number, value: string) => {
    const updated = [...form.features];
    updated[i] = value;
    update("features", updated);
  };

  const addFeature = () => update("features", [...form.features, ""]);

  const removeFeature = (i: number) =>
    update("features", form.features.filter((_, idx) => idx !== i));

  const updateColor = (i: number, value: string) => {
    const updated = [...form.colors];
    updated[i] = value;
    update("colors", updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const cleanedForm = {
      ...form,
      features: form.features.filter((f) => f.trim()),
      colors: form.colors.filter((c) => c.trim()),
    };

    try {
      const url = mode === "create"
        ? "/api/admin/templates"
        : `/api/admin/templates/${templateId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedForm),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save template");
        return;
      }

      setSuccess(mode === "create" ? "Template created successfully!" : "Template updated!");
      setTimeout(() => router.push("/admin"), 1200);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-black mb-4 transition-colors">
          <ArrowLeft size={15} /> Back to Admin
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === "create" ? "Add New Template" : "Edit Template"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {mode === "create" ? "Add a new wedding invitation design to the catalog." : "Update the template details."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-base border-b pb-3">Basic Info</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Template Name" required>
              <input className={inputCls} placeholder="e.g. Mangal Utsav" value={form.name}
                onChange={(e) => handleNameChange(e.target.value)} required />
            </Field>
            <Field label="URL Slug" required hint="Auto-generated from name. Used in URLs.">
              <input className={inputCls} placeholder="e.g. mangal-utsav" value={form.slug}
                onChange={(e) => update("slug", e.target.value)} required />
            </Field>
          </div>

          <Field label="Description" required>
            <textarea className={`${inputCls} resize-none`} rows={3}
              placeholder="Describe the design style, mood, and who it's for..."
              value={form.description} onChange={(e) => update("description", e.target.value)} required />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="Tier" required>
              <select className={inputCls} value={form.tier}
                onChange={(e) => update("tier", e.target.value)}>
                {tiers.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Price (₹)" required>
              <input type="number" className={inputCls} min={99} max={9999}
                value={form.price} onChange={(e) => update("price", Number(e.target.value))} required />
            </Field>
            <Field label="Religion / Culture" required>
              <select className={inputCls} value={form.religion}
                onChange={(e) => update("religion", e.target.value)}>
                {religions.map((r) => <option key={r}>{r}</option>)}
              </select>
            </Field>
          </div>
        </div>

        {/* Themes */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 text-base border-b pb-3">Themes</h2>
          <div className="flex flex-wrap gap-2">
            {themes.map((theme) => {
              const active = (form.themes as string[]).includes(theme);
              return (
                <button key={theme} type="button" onClick={() => toggleTheme(theme)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    active ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}>
                  {theme}
                </button>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="font-semibold text-gray-900 text-base">Features</h2>
            <button type="button" onClick={addFeature}
              className="flex items-center gap-1 text-xs font-medium border border-gray-200 px-2.5 py-1 rounded-lg hover:bg-gray-50 transition-colors">
              <Plus size={12} /> Add
            </button>
          </div>
          <div className="space-y-2">
            {form.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <input className={`${inputCls} flex-1`} placeholder={`Feature ${i + 1}`}
                  value={f} onChange={(e) => updateFeature(i, e.target.value)} />
                <button type="button" onClick={() => removeFeature(i)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-base border-b pb-3">Visual Settings</h2>

          <Field label="Preview Background" hint="Tailwind gradient classes, e.g. from-orange-100 via-yellow-50 to-red-100">
            <input className={inputCls} placeholder="from-pink-100 via-white to-rose-100"
              value={form.previewBg} onChange={(e) => update("previewBg", e.target.value)} />
            <div className={`mt-2 h-12 rounded-xl bg-gradient-to-br ${form.previewBg}`} />
          </Field>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Palette (up to 3 colors)
            </label>
            <div className="flex items-center gap-3">
              {form.colors.map((color, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="color" value={color}
                    onChange={(e) => updateColor(i, e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                  <input className="w-28 px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono"
                    value={color} onChange={(e) => updateColor(i, e.target.value)} />
                </div>
              ))}
              {form.colors.length < 3 && (
                <button type="button" onClick={() => update("colors", [...form.colors, "#cccccc"])}
                  className="text-xs text-gray-500 hover:text-black border border-dashed border-gray-300 px-3 py-2 rounded-xl">
                  + Color
                </button>
              )}
            </div>
          </div>

          <Field label="Thumbnail Image Path" hint="Path under /public, e.g. /templates/mangal-utsav.jpg">
            <input className={inputCls} placeholder="/templates/your-template.jpg"
              value={form.thumbnail} onChange={(e) => update("thumbnail", e.target.value)} />
          </Field>
        </div>

        {/* Meta */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-base border-b pb-3">Display Settings</h2>
          <div className="grid grid-cols-2 gap-5">
            <Field label="Rating (0–5)">
              <input type="number" className={inputCls} min={0} max={5} step={0.1}
                value={form.rating} onChange={(e) => update("rating", Number(e.target.value))} />
            </Field>
            <Field label="Review Count">
              <input type="number" className={inputCls} min={0}
                value={form.reviewCount} onChange={(e) => update("reviewCount", Number(e.target.value))} />
            </Field>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <div onClick={() => update("isFeatured", !form.isFeatured)}
                className={`w-10 h-6 rounded-full transition-colors relative ${form.isFeatured ? "bg-black" : "bg-gray-200"}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isFeatured ? "translate-x-5" : "translate-x-1"}`} />
              </div>
              <span className="text-sm text-gray-700">Featured on homepage</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <div onClick={() => update("isNew", !form.isNew)}
                className={`w-10 h-6 rounded-full transition-colors relative ${form.isNew ? "bg-black" : "bg-gray-200"}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isNew ? "translate-x-5" : "translate-x-1"}`} />
              </div>
              <span className="text-sm text-gray-700">Show "New" badge</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</div>
        )}
        {success && (
          <div className="text-sm text-emerald-700 bg-emerald-50 px-4 py-3 rounded-xl">{success}</div>
        )}

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors">
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {mode === "create" ? "Create Template" : "Save Changes"}
          </button>
          <Link href="/admin" className="px-6 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}