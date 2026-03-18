"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Plus, Tag, ToggleLeft, ToggleRight, ArrowLeft, Check, X } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  type: "percent" | "flat";
  value: number;
  minOrderAmount: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

const inputCls = "w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-colors placeholder:text-gray-400";

export default function AdminCouponsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    code: "", type: "percent" as "percent" | "flat",
    value: "", minOrderAmount: "0", maxUses: "0", expiresAt: "",
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) router.replace("/auth/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === "admin") fetchCoupons();
  }, [user]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/coupon/admin");
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch { setError("Failed to load coupons"); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess("");
    try {
      const res = await fetch("/api/coupon/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, value: Number(form.value), minOrderAmount: Number(form.minOrderAmount), maxUses: Number(form.maxUses), expiresAt: form.expiresAt || null }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSuccess("Coupon created!");
      setCoupons((prev) => [data, ...prev]);
      setForm({ code:"", type:"percent", value:"", minOrderAmount:"0", maxUses:"0", expiresAt:"" });
      setShowForm(false);
    } catch { setError("Failed to create coupon"); }
    finally { setSaving(false); }
  };

  const toggleActive = async (coupon: Coupon) => {
    await fetch("/api/coupon/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: coupon.id, isActive: !coupon.isActive }),
    });
    setCoupons((prev) => prev.map((c) => c.id === coupon.id ? { ...c, isActive: !c.isActive } : c));
  };

  if (authLoading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 size={28} className="animate-spin text-gray-400"/></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-sm text-gray-500 hover:text-black flex items-center gap-1"><ArrowLeft size={15}/> Admin</Link>
          <span className="text-gray-300">/</span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center"><Tag size={15} className="text-white"/></div>
            <h1 className="text-xl font-bold text-gray-900">Coupon Codes</h1>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">
          <Plus size={15}/> New Coupon
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Create New Coupon</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Code *</label>
              <input className={inputCls} placeholder="e.g. WEDDING20" value={form.code}
                onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})} required/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Type *</label>
              <select className={inputCls} value={form.type} onChange={(e) => setForm({...form, type: e.target.value as "percent" | "flat"})}>
                <option value="percent">Percentage (%)</option>
                <option value="flat">Flat amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Value * {form.type === "percent" ? "(%)" : "(₹)"}</label>
              <input type="number" className={inputCls} placeholder={form.type === "percent" ? "e.g. 20" : "e.g. 200"}
                value={form.value} onChange={(e) => setForm({...form, value: e.target.value})} required min="1" max={form.type === "percent" ? "100" : undefined}/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Min Order (₹)</label>
              <input type="number" className={inputCls} placeholder="0 = no minimum"
                value={form.minOrderAmount} onChange={(e) => setForm({...form, minOrderAmount: e.target.value})} min="0"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Max Uses (0 = unlimited)</label>
              <input type="number" className={inputCls} placeholder="0"
                value={form.maxUses} onChange={(e) => setForm({...form, maxUses: e.target.value})} min="0"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Expires At (optional)</label>
              <input type="date" className={inputCls} value={form.expiresAt}
                onChange={(e) => setForm({...form, expiresAt: e.target.value})}/>
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-emerald-600 font-medium">✓ {success}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-50">
              {saving ? <Loader2 size={14} className="animate-spin"/> : <Check size={14}/>} Create Coupon
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-5 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Coupons table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">All Coupons</h2>
          <span className="text-sm text-gray-400">{coupons.length} total</span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-gray-400"/></div>
        ) : coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Tag size={32} className="text-gray-200 mb-3"/>
            <p className="text-sm text-gray-400">No coupons yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-wider border-b bg-gray-50">
                  <th className="text-left px-6 py-3 font-medium">Code</th>
                  <th className="text-left px-4 py-3 font-medium">Discount</th>
                  <th className="text-left px-4 py-3 font-medium">Min Order</th>
                  <th className="text-left px-4 py-3 font-medium">Usage</th>
                  <th className="text-left px-4 py-3 font-medium">Expires</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-6 py-3 font-medium">Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <span className="font-mono font-semibold text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded">{c.code}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {c.type === "percent" ? `${c.value}%` : `₹${c.value}`} off
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {c.minOrderAmount > 0 ? `₹${c.minOrderAmount.toLocaleString("en-IN")}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {c.usedCount}/{c.maxUses === 0 ? "∞" : c.maxUses}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${c.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button onClick={() => toggleActive(c)} className="text-gray-400 hover:text-gray-700 transition-colors">
                        {c.isActive ? <ToggleRight size={22} className="text-emerald-500"/> : <ToggleLeft size={22}/>}
                      </button>
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