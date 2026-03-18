"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Template } from "@/data/templates";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Loader2,
  ShieldCheck,
  LayoutGrid,
  Eye,
  TrendingUp,
  Tag,
} from "lucide-react";

const tierColors: Record<string, string> = {
  Basic: "bg-gray-100 text-gray-700",
  Premium: "bg-amber-100 text-amber-800",
  Luxury: "bg-zinc-900 text-yellow-400",
};

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.replace("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === "admin") fetchTemplates();
  }, [user]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/templates");
      const data = await res.json();
      setTemplates(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/templates/${id}`, {
        method: "DELETE",
      });
      if (res.ok) setTemplates((prev) => prev.filter((t) => t.id !== id));
      else setError("Failed to delete template");
    } catch {
      setError("Failed to delete template");
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }

  const stats = {
    total: templates.length,
    featured: templates.filter((t) => t.isFeatured).length,
    newBadge: templates.filter((t) => t.isNew).length,
    avgRating: templates.length
      ? (
          templates.reduce((s, t) => s + t.rating, 0) / templates.length
        ).toFixed(1)
      : "—",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">Manage WedCraft templates</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/coupons"
            className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            <Tag size={16} /> Coupons
          </Link>

          <Link
            href="/admin/templates/new"
            className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            <Plus size={16} /> Add Template
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Templates", value: stats.total, icon: LayoutGrid },
          { label: "Featured", value: stats.featured, icon: TrendingUp },
          { label: "New Badges", value: stats.newBadge, icon: Eye },
          { label: "Avg Rating", value: stats.avgRating, icon: Star },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-medium">{label}</span>
              <Icon size={16} className="text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Templates Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">All Templates</h2>
          <span className="text-sm text-gray-500">
            {templates.length} total
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-gray-400" />
          </div>
        ) : templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <LayoutGrid size={36} className="text-gray-300 mb-3" />
            <p className="text-gray-500 mb-4">No templates yet</p>
            <Link
              href="/admin/templates/new"
              className="text-sm font-medium bg-black text-white px-4 py-2 rounded-xl"
            >
              Add your first template
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-wider border-b bg-gray-50">
                  <th className="text-left px-6 py-3 font-medium">Template</th>
                  <th className="text-left px-4 py-3 font-medium">Tier</th>
                  <th className="text-left px-4 py-3 font-medium">Religion</th>
                  <th className="text-left px-4 py-3 font-medium">Price</th>
                  <th className="text-left px-4 py-3 font-medium">Rating</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {templates.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.previewBg} shrink-0`}
                        />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {t.name}
                          </p>
                          <p className="text-xs text-gray-400">{t.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tierColors[t.tier]}`}
                      >
                        {t.tier}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">
                        {t.religion}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-gray-900">
                        ₹{t.price.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <Star
                          size={12}
                          className="fill-amber-400 text-amber-400"
                        />
                        <span className="text-sm text-gray-700">
                          {t.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {t.isFeatured && (
                          <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                            Featured
                          </span>
                        )}
                        {t.isNew && (
                          <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">
                            New
                          </span>
                        )}
                        {!t.isFeatured && !t.isNew && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/preview/${t.slug}`}
                          target="_blank"
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          href={`/admin/templates/${t.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(t.id, t.name)}
                          disabled={deletingId === t.id}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === t.id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
