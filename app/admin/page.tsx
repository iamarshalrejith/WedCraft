"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Template } from "@/data/templates";
import {
  Plus, Pencil, Trash2, Star, Loader2, ShieldCheck, LayoutGrid,
  Eye, TrendingUp, Tag, ShoppingBag, Search, ChevronLeft, ChevronRight,
  IndianRupee, ExternalLink, Copy, Check, Mail, Calendar, Package,
  X, Users,
} from "lucide-react";

interface Purchase {
  id: string; slug: string;
  groomName: string; brideName: string;
  userName: string; userEmail: string; userId: string | null;
  templateSlug: string; templateName: string; templateTier: string;
  amountPaid: number | null;
  razorpayPaymentId: string | null; razorpayOrderId: string | null;
  purchasedAt: string; viewCount: number;
}
interface PurchasesResponse {
  purchases: Purchase[];
  pagination: { page: number; limit: number; total: number; pages: number };
  stats: { totalPurchases: number; totalRevenue: number };
}

const tierColors: Record<string, string> = {
  Basic: "bg-gray-100 text-gray-600",
  Standard: "bg-blue-50 text-blue-700",
  Premium: "bg-amber-100 text-amber-800",
  Luxury: "bg-zinc-900 text-yellow-400",
};

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function formatDateShort(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <button onClick={copy} className="p-1 text-gray-300 hover:text-gray-600 transition-colors">
      {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
    </button>
  );
}

function PurchaseDrawer({ purchase: p, onClose }: { purchase: Purchase; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
          <h3 className="font-semibold text-gray-900">Purchase Detail</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><X size={18} className="text-gray-500" /></button>
        </div>
        <div className="p-6 space-y-6 flex-1">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Couple</p>
            <p className="text-xl font-bold text-gray-900">{p.groomName} & {p.brideName}</p>
            <a href={`/invite/${p.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1">
              /invite/{p.slug} <ExternalLink size={10} />
            </a>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Buyer</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-sm font-bold">{p.userName.charAt(0).toUpperCase()}</div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{p.userName}</p>
                <div className="flex items-center gap-1"><p className="text-xs text-gray-500">{p.userEmail}</p>{p.userEmail !== "—" && <CopyBtn text={p.userEmail} />}</div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Template</p>
            <div className="flex items-center justify-between">
              <div><p className="font-semibold text-gray-900">{p.templateName}</p><p className="text-xs text-gray-500">{p.templateSlug}</p></div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tierColors[p.templateTier] || "bg-gray-100 text-gray-600"}`}>{p.templateTier}</span>
            </div>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Amount Paid</p>
            <p className="text-3xl font-bold text-emerald-700">₹{p.amountPaid?.toLocaleString("en-IN") ?? "—"}</p>
          </div>
          {(p.razorpayPaymentId || p.razorpayOrderId) && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Payment IDs</p>
              <div className="space-y-2">
                {p.razorpayPaymentId && (
                  <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-xl">
                    <div><p className="text-xs text-gray-400">Payment ID</p><p className="text-xs font-mono text-gray-700">{p.razorpayPaymentId}</p></div>
                    <CopyBtn text={p.razorpayPaymentId} />
                  </div>
                )}
                {p.razorpayOrderId && (
                  <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-xl">
                    <div><p className="text-xs text-gray-400">Order ID</p><p className="text-xs font-mono text-gray-700">{p.razorpayOrderId}</p></div>
                    <CopyBtn text={p.razorpayOrderId} />
                  </div>
                )}
              </div>
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Timeline</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Purchased</span><span className="text-gray-900 font-medium">{formatDate(p.purchasedAt)}</span></div>
              <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Views</span><span className="text-gray-900 font-medium">{p.viewCount} views</span></div>
            </div>
          </div>
          <div className="flex gap-3">
            <a href={`/invite/${p.slug}`} target="_blank" rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Eye size={14} /> View Invite
            </a>
            {p.userEmail !== "—" && (
              <a href={`mailto:${p.userEmail}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
                <Mail size={14} /> Email Buyer
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"templates" | "purchases">("templates");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [templatesError, setTemplatesError] = useState("");
  const [purchasesData, setPurchasesData] = useState<PurchasesResponse | null>(null);
  const [purchasesLoading, setPurchasesLoading] = useState(false);
  const [purchasesPage, setPurchasesPage] = useState(1);
  const [purchaseSearch, setPurchaseSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [purchasesError, setPurchasesError] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) router.replace("/auth/login");
  }, [user, authLoading, router]);

  const fetchTemplates = useCallback(async () => {
    setTemplatesLoading(true); setTemplatesError("");
    try {
      const res = await fetch("/api/admin/templates");
      const data = await res.json();
      setTemplates(Array.isArray(data) ? data : []);
    } catch { setTemplatesError("Failed to load templates"); }
    finally { setTemplatesLoading(false); }
  }, []);

  const fetchPurchases = useCallback(async () => {
    setPurchasesLoading(true); setPurchasesError("");
    try {
      const params = new URLSearchParams({ page: String(purchasesPage), limit: "15", ...(purchaseSearch ? { search: purchaseSearch } : {}) });
      const res = await fetch(`/api/admin/purchases?${params}`);
      if (!res.ok) throw new Error();
      setPurchasesData(await res.json());
    } catch { setPurchasesError("Failed to load purchases"); }
    finally { setPurchasesLoading(false); }
  }, [purchasesPage, purchaseSearch]);

  useEffect(() => { if (user?.role === "admin") fetchTemplates(); }, [user, fetchTemplates]);
  useEffect(() => { if (user?.role === "admin" && activeTab === "purchases") fetchPurchases(); }, [user, activeTab, fetchPurchases]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/templates/${id}`, { method: "DELETE" });
      if (res.ok) setTemplates((prev) => prev.filter((t) => t.id !== id));
      else setTemplatesError("Failed to delete template");
    } catch { setTemplatesError("Failed to delete template"); }
    finally { setDeletingId(null); }
  };

  const handleSearch = () => { setPurchaseSearch(searchInput.trim()); setPurchasesPage(1); };
  const clearSearch = () => { setSearchInput(""); setPurchaseSearch(""); setPurchasesPage(1); };

  if (authLoading || (!user && !authLoading)) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 size={32} className="animate-spin text-gray-400" /></div>;
  }

  const tStats = {
    total: templates.length,
    featured: templates.filter(t => t.isFeatured).length,
    newBadge: templates.filter(t => t.isNew).length,
    avgRating: templates.length ? (templates.reduce((s, t) => s + t.rating, 0) / templates.length).toFixed(1) : "—",
  };

  return (
    <div className="min-h-screen pt-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shrink-0"><ShieldCheck size={20} className="text-white" /></div>
            <div><h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1><p className="text-sm text-gray-500">WedCraft management console</p></div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link href="/admin/coupons" className="flex items-center gap-2 border border-gray-200 bg-white text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
              <Tag size={15} /> Coupons
            </Link>
            <Link href="/admin/templates/new" className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">
              <Plus size={15} /> Add Template
            </Link>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Templates", value: tStats.total, icon: LayoutGrid, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Featured", value: tStats.featured, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Total Purchases", value: purchasesData?.stats.totalPurchases ?? "—", icon: ShoppingBag, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Total Revenue", value: purchasesData?.stats.totalRevenue != null ? `₹${purchasesData.stats.totalRevenue.toLocaleString("en-IN")}` : "—", icon: IndianRupee, color: "text-amber-600", bg: "bg-amber-50" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}><Icon size={15} className={color} /></div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
          {([{ key: "templates", label: "Templates", icon: LayoutGrid }, { key: "purchases", label: "Purchases", icon: ShoppingBag }] as const).map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              <Icon size={15} /> {label}
              {key === "purchases" && purchasesData && (
                <span className="bg-black text-white text-xs rounded-full px-1.5 py-0.5 leading-none">{purchasesData.stats.totalPurchases}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── TEMPLATES TAB ── */}
        {activeTab === "templates" && (
          <>
            {templatesError && <div className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{templatesError}</div>}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[{ label: "Total", value: tStats.total }, { label: "Featured", value: tStats.featured }, { label: "New Badges", value: tStats.newBadge }, { label: "Avg Rating", value: tStats.avgRating }].map(({ label, value }) => (
                <div key={label} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="font-bold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">All Templates</h2>
                <span className="text-sm text-gray-500">{templates.length} total</span>
              </div>
              {templatesLoading ? (
                <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-gray-400" /></div>
              ) : templates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <LayoutGrid size={36} className="text-gray-300 mb-3" />
                  <p className="text-gray-500 mb-4">No templates yet</p>
                  <Link href="/admin/templates/new" className="text-sm font-medium bg-black text-white px-4 py-2 rounded-xl">Add your first template</Link>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden md:block overflow-x-auto">
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
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.previewBg} shrink-0`} />
                                <div><p className="font-medium text-gray-900 text-sm">{t.name}</p><p className="text-xs text-gray-400">{t.slug}</p></div>
                              </div>
                            </td>
                            <td className="px-4 py-4"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tierColors[t.tier]}`}>{t.tier}</span></td>
                            <td className="px-4 py-4"><span className="text-sm text-gray-600">{t.religion}</span></td>
                            <td className="px-4 py-4"><span className="text-sm font-semibold text-gray-900">₹{t.price.toLocaleString("en-IN")}</span></td>
                            <td className="px-4 py-4"><div className="flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" /><span className="text-sm text-gray-700">{t.rating}</span></div></td>
                            <td className="px-4 py-4">
                              <div className="flex gap-1.5 flex-wrap">
                                {t.isFeatured && <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">Featured</span>}
                                {t.isNew && <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">New</span>}
                                {!t.isFeatured && !t.isNew && <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">Active</span>}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <Link href={`/preview/${t.slug}`} target="_blank" className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Preview"><Eye size={15} /></Link>
                                <Link href={`/admin/templates/${t.id}/edit`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Pencil size={15} /></Link>
                                <button onClick={() => handleDelete(t.id, t.name)} disabled={deletingId === t.id} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" title="Delete">
                                  {deletingId === t.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Mobile cards */}
                  <div className="md:hidden divide-y divide-gray-100">
                    {templates.map((t) => (
                      <div key={t.id} className="p-4 flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.previewBg} shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div><p className="font-semibold text-gray-900 text-sm">{t.name}</p><p className="text-xs text-gray-400">{t.slug}</p></div>
                            <span className="font-bold text-sm text-gray-900 shrink-0">₹{t.price.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tierColors[t.tier]}`}>{t.tier}</span>
                            <span className="text-xs text-gray-500">{t.religion}</span>
                            <div className="flex items-center gap-0.5"><Star size={10} className="fill-amber-400 text-amber-400" /><span className="text-xs text-gray-600">{t.rating}</span></div>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex gap-1">
                              {t.isFeatured && <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">Featured</span>}
                              {t.isNew && <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">New</span>}
                            </div>
                            <div className="flex items-center gap-1">
                              <Link href={`/preview/${t.slug}`} target="_blank" className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><Eye size={14} /></Link>
                              <Link href={`/admin/templates/${t.id}/edit`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={14} /></Link>
                              <button onClick={() => handleDelete(t.id, t.name)} disabled={deletingId === t.id} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50">
                                {deletingId === t.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* ── PURCHASES TAB ── */}
        {activeTab === "purchases" && (
          <>
            {purchasesError && <div className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{purchasesError}</div>}

            {purchasesData && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Total Orders", value: purchasesData.stats.totalPurchases },
                  { label: "Total Revenue", value: `₹${purchasesData.stats.totalRevenue.toLocaleString("en-IN")}` },
                  { label: "Avg Order Value", value: purchasesData.stats.totalPurchases > 0 ? `₹${Math.round(purchasesData.stats.totalRevenue / purchasesData.stats.totalPurchases).toLocaleString("en-IN")}` : "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white border border-gray-200 rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-500 mb-1">{label}</p>
                    <p className="font-bold text-gray-900 text-lg">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Search */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search by name, template or invite slug..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-colors" />
                {searchInput && <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={14} /></button>}
              </div>
              <button onClick={handleSearch} className="px-4 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">Search</button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">
                  Purchase History {purchaseSearch && <span className="ml-2 text-sm font-normal text-gray-400">for &ldquo;{purchaseSearch}&rdquo;</span>}
                </h2>
                <span className="text-sm text-gray-500">{purchasesData ? `${purchasesData.pagination.total} orders` : ""}</span>
              </div>

              {purchasesLoading ? (
                <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-gray-400" /></div>
              ) : !purchasesData || purchasesData.purchases.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ShoppingBag size={36} className="text-gray-300 mb-3" />
                  <p className="text-gray-500">{purchaseSearch ? "No purchases match your search." : "No purchases yet."}</p>
                  {purchaseSearch && <button onClick={clearSearch} className="mt-3 text-sm text-blue-600 hover:underline">Clear search</button>}
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-xs text-gray-500 uppercase tracking-wider border-b bg-gray-50">
                          <th className="text-left px-6 py-3 font-medium">Couple</th>
                          <th className="text-left px-4 py-3 font-medium">Buyer Name</th>
                          <th className="text-left px-4 py-3 font-medium">Email</th>
                          <th className="text-left px-4 py-3 font-medium">Template</th>
                          <th className="text-left px-4 py-3 font-medium">Amount Paid</th>
                          <th className="text-left px-4 py-3 font-medium">Purchase Date</th>
                          <th className="text-left px-4 py-3 font-medium">Views</th>
                          <th className="text-right px-6 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {purchasesData.purchases.map((p) => (
                          <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{p.groomName} & {p.brideName}</p>
                                <p className="text-xs text-gray-400 font-mono">{p.slug}</p>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">{p.userName.charAt(0).toUpperCase()}</div>
                                <span className="text-sm text-gray-700">{p.userName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-1">
                                <span className="text-sm text-gray-600 max-w-[180px] truncate">{p.userEmail}</span>
                                {p.userEmail !== "—" && <CopyBtn text={p.userEmail} />}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div>
                                <p className="text-sm font-medium text-gray-800">{p.templateName}</p>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tierColors[p.templateTier] || "bg-gray-100 text-gray-500"}`}>{p.templateTier}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="font-bold text-gray-900 text-sm">{p.amountPaid != null ? `₹${p.amountPaid.toLocaleString("en-IN")}` : "—"}</span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-sm text-gray-600 whitespace-nowrap">{formatDateShort(p.purchasedAt)}</span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-1"><Eye size={12} className="text-gray-300" /><span className="text-sm text-gray-600">{p.viewCount}</span></div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <a href={`/invite/${p.slug}`} target="_blank" rel="noreferrer" className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="View invite"><ExternalLink size={14} /></a>
                                <button onClick={() => setSelectedPurchase(p)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Details"><Eye size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="lg:hidden divide-y divide-gray-100">
                    {purchasesData.purchases.map((p) => (
                      <button key={p.id} className="w-full text-left p-4 hover:bg-gray-50 transition-colors" onClick={() => setSelectedPurchase(p)}>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">{p.groomName} & {p.brideName}</p>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">{p.slug}</p>
                          </div>
                          <span className="font-bold text-gray-900 text-sm shrink-0">{p.amountPaid != null ? `₹${p.amountPaid.toLocaleString("en-IN")}` : "—"}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-y-1.5 text-xs">
                          <div className="flex items-center gap-1.5 text-gray-600"><Users size={11} className="text-gray-400 shrink-0" /><span className="truncate">{p.userName}</span></div>
                          <div className="flex items-center gap-1.5 text-gray-600"><Mail size={11} className="text-gray-400 shrink-0" /><span className="truncate">{p.userEmail}</span></div>
                          <div className="flex items-center gap-1.5 text-gray-600"><Package size={11} className="text-gray-400 shrink-0" /><span className="truncate">{p.templateName}</span></div>
                          <div className="flex items-center gap-1.5 text-gray-600"><Calendar size={11} className="text-gray-400 shrink-0" /><span>{formatDateShort(p.purchasedAt)}</span></div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1 text-xs text-gray-400"><Eye size={11} /><span>{p.viewCount} views</span></div>
                          <span className="text-xs text-blue-600 font-medium">Details →</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Pagination */}
                  {purchasesData.pagination.pages > 1 && (
                    <div className="px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
                      <p className="text-sm text-gray-500">Page {purchasesData.pagination.page} of {purchasesData.pagination.pages} · {purchasesData.pagination.total} total</p>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setPurchasesPage(p => Math.max(1, p - 1))} disabled={purchasesPage === 1 || purchasesLoading}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                          <ChevronLeft size={15} /> Prev
                        </button>
                        <button onClick={() => setPurchasesPage(p => p + 1)} disabled={purchasesPage >= purchasesData.pagination.pages || purchasesLoading}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                          Next <ChevronRight size={15} />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>

      {selectedPurchase && <PurchaseDrawer purchase={selectedPurchase} onClose={() => setSelectedPurchase(null)} />}
    </div>
  );
}