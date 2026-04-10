"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTemplateBySlug } from "@/data/templates";
import { WeddingEvent, FamilyMember } from "@/types/invite";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import FileUpload from "@/components/FileUpload";
import {
  ArrowLeft,
  Plus,
  Trash2,
  CreditCard,
  Loader2,
  ShieldCheck,
  Star,
} from "lucide-react";

interface CheckoutPageProps {
  params: Promise<{ slug: string }>;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: { name?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
interface RazorpayInstance {
  open(): void;
}

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-colors placeholder:text-gray-400";

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const template = getTemplateBySlug(slug);
  if (!template) notFound();

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [isFirstTime, setIsFirstTime] = useState(false);
  const [firstTimeBanner, setFirstTimeBanner] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [discount, setDiscount] = useState(0);
  const finalPrice = Math.max(1, template.price - discount);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/coupon/firsttime?price=${template.price}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.isFirstTime) {
          setIsFirstTime(true);
          setDiscount(data.discountAmount);
          setCouponCode(data.couponCode);
          setCouponSuccess(data.message);
          setFirstTimeBanner(data.message);
        }
      })
      .catch(() => {});
  }, [user, template.price]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    if (isFirstTime && couponCode === "WELCOME10") return;
    setCouponLoading(true);
    setCouponError("");
    setCouponSuccess("");
    try {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, templatePrice: template.price }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error);
        setDiscount(0);
      } else {
        setDiscount(data.discountAmount);
        setCouponSuccess(data.message);
      }
    } catch {
      setCouponError("Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const [form, setForm] = useState({
    groomName: "",
    brideName: "",
    weddingDate: "",
    weddingTime: "7:00 PM",
    venue: "",
    venueAddress: "",
    mapLink: "",
    phone: "",
    personalMessage: "",
    couplePhotoUrl: "",
    bgMusicUrl: "",
    groomFatherName: "",
    groomMotherName: "",
    brideFatherName: "",
    brideMotherName: "",
    relatives: [] as FamilyMember[],
  });

  const [events, setEvents] = useState<WeddingEvent[]>([
    { name: "Wedding", date: "", time: "", venue: "" },
  ]);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const addEvent = () =>
    setEvents((prev) => [...prev, { name: "", date: "", time: "", venue: "" }]);

  const removeEvent = (i: number) =>
    setEvents((prev) => prev.filter((_, idx) => idx !== i));

  const updateEvent = (i: number, field: keyof WeddingEvent, value: string) =>
    setEvents((prev) =>
      prev.map((e, idx) => (idx === i ? { ...e, [field]: value } : e))
    );

  const isStep1Valid =
    form.groomName.trim() &&
    form.brideName.trim() &&
    form.weddingDate &&
    form.venue.trim();

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    try {
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalPrice,
          templateSlug: template.slug,
          groomName: form.groomName,
          brideName: form.brideName,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Order creation failed");

      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Failed to load payment gateway");

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: orderData.amount,
        currency: "INR",
        name: "WedCraft",
        description: `${template.name} — Wedding Invitation`,
        order_id: orderData.orderId,
        prefill: {
          name: `${form.groomName} & ${form.brideName}`,
          contact: form.phone,
        },
        theme: { color: "#000000" },
        handler: async (response: RazorpayResponse) => {
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) throw new Error("Payment verification failed");

          const saveRes = await fetch("/api/save-invite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              templateId: template.id,
              templateSlug: template.slug,
              coupleDetails: { ...form, events },
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: verifyData.paymentId,
              userId: user?.id || null,
            }),
          });
          const saveData = await saveRes.json();
          if (!saveRes.ok) throw new Error("Failed to create invite");

          const inviteUrl = `${window.location.origin}/invite/${saveData.slug}`;
          fetch("/api/email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "purchase",
              groomName: form.groomName,
              brideName: form.brideName,
              inviteUrl,
              buyerEmail: user?.email ?? null,
              templateName: template.name,
            }),
          }).catch(() => {});

          router.push(`/dashboard?slug=${saveData.slug}`);
        },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Payment failed";
      setError(message);
      setLoading(false);
    }
  };

  // Which templates support the family section
  const hasFamilySection =
    template.slug === "mangal-utsav" ||
    template.slug === "royal-durbar" ||
    template.slug === "sunset-mandap" ||
    template.slug === "kasi-yatra" ||
    template.slug === "bold-union";

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 mt-10">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/preview/${slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-black mb-4 transition-colors"
        >
          <ArrowLeft size={15} /> Back to preview
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Complete Your Order</h1>
        <p className="text-gray-500 mt-1">
          Fill in your details below — your invitation will be live in minutes.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {[
          { n: 1, label: "Your Details" },
          { n: 2, label: "Review & Pay" },
        ].map(({ n, label }) => (
          <div key={n} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= n ? "bg-black text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {n}
            </div>
            <span className={`text-sm font-medium ${step >= n ? "text-gray-900" : "text-gray-400"}`}>
              {label}
            </span>
            {n < 2 && <div className="w-8 h-px bg-gray-300 ml-1" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
              <h2 className="font-semibold text-gray-900 text-lg">Couple Details</h2>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Groom's Name" required>
                  <input className={inputCls} placeholder="e.g. Rahul" value={form.groomName} onChange={(e) => update("groomName", e.target.value)} />
                </Field>
                <Field label="Bride's Name" required>
                  <input className={inputCls} placeholder="e.g. Priya" value={form.brideName} onChange={(e) => update("brideName", e.target.value)} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Wedding Date" required>
                  <input type="date" className={inputCls} value={form.weddingDate} onChange={(e) => update("weddingDate", e.target.value)} />
                </Field>
                <Field label="Wedding Time" required>
                  <input className={inputCls} placeholder="e.g. 7:00 PM" value={form.weddingTime} onChange={(e) => update("weddingTime", e.target.value)} />
                </Field>
              </div>

              <Field label="Venue Name" required>
                <input className={inputCls} placeholder="e.g. Grand Palace Banquet Hall" value={form.venue} onChange={(e) => update("venue", e.target.value)} />
              </Field>

              <Field label="Venue Address">
                <input className={inputCls} placeholder="e.g. 123 MG Road, Mumbai, Maharashtra" value={form.venueAddress} onChange={(e) => update("venueAddress", e.target.value)} />
              </Field>

              <Field label="Google Maps Link">
                <input className={inputCls} placeholder="https://maps.google.com/..." value={form.mapLink} onChange={(e) => update("mapLink", e.target.value)} />
              </Field>

              <Field label="WhatsApp / Phone for RSVP">
                <input className={inputCls} placeholder="+91 98765 43210" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </Field>

              {/* ── PARENTS — shown only for templates with family section ── */}
              {hasFamilySection && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Parents&apos; Names</p>
                    <p className="text-xs text-gray-400 mt-0.5">Shown in the family blessings section of your invite</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Groom's Father">
                      <input className={inputCls} placeholder="e.g. Ramasamy" value={form.groomFatherName} onChange={(e) => update("groomFatherName", e.target.value)} />
                    </Field>
                    <Field label="Groom's Mother">
                      <input className={inputCls} placeholder="e.g. Lakshmi" value={form.groomMotherName} onChange={(e) => update("groomMotherName", e.target.value)} />
                    </Field>
                    <Field label="Bride's Father">
                      <input className={inputCls} placeholder="e.g. Subramanian" value={form.brideFatherName} onChange={(e) => update("brideFatherName", e.target.value)} />
                    </Field>
                    <Field label="Bride's Mother">
                      <input className={inputCls} placeholder="e.g. Kalyani" value={form.brideMotherName} onChange={(e) => update("brideMotherName", e.target.value)} />
                    </Field>
                  </div>
                </div>
              )}

              {/* ── RELATIVES — shown only for templates with family section ── */}
              {hasFamilySection && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Relatives &amp; Family</p>
                      <p className="text-xs text-gray-400 mt-0.5">Shown on the sides of the family section</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          relatives: [
                            ...prev.relatives,
                            { name: "", relation: "", side: "groom", spouseName: "" },
                          ],
                        }))
                      }
                      className="flex items-center gap-1 text-xs border border-gray-200 px-2.5 py-1 rounded-lg hover:bg-gray-50"
                    >
                      <Plus size={12} /> Add
                    </button>
                  </div>

                  {form.relatives.length === 0 && (
                    <p className="text-sm text-gray-400">Add relatives like Uncle, Mama, Chithappa...</p>
                  )}

                  <div className="space-y-2">
                    {form.relatives.map((rel, i) => (
                      <div key={i} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-3 rounded-xl">
                        <input
                          className={`${inputCls} col-span-3`}
                          placeholder="Name"
                          value={rel.name}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              relatives: prev.relatives.map((r, idx) =>
                                idx === i ? { ...r, name: e.target.value } : r
                              ),
                            }))
                          }
                        />
                        <input
                          className={`${inputCls} col-span-3`}
                          placeholder="Relation"
                          value={rel.relation}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              relatives: prev.relatives.map((r, idx) =>
                                idx === i ? { ...r, relation: e.target.value } : r
                              ),
                            }))
                          }
                        />
                        <input
                          className={`${inputCls} col-span-3`}
                          placeholder="Spouse (optional)"
                          value={rel.spouseName || ""}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              relatives: prev.relatives.map((r, idx) =>
                                idx === i ? { ...r, spouseName: e.target.value } : r
                              ),
                            }))
                          }
                        />
                        <select
                          className={`${inputCls} col-span-2`}
                          value={rel.side}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              relatives: prev.relatives.map((r, idx) =>
                                idx === i ? { ...r, side: e.target.value as "groom" | "bride" } : r
                              ),
                            }))
                          }
                        >
                          <option value="groom">Groom</option>
                          <option value="bride">Bride</option>
                        </select>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              relatives: prev.relatives.filter((_, idx) => idx !== i),
                            }))
                          }
                          className="col-span-1 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Events */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">Wedding Events</label>
                  <button
                    onClick={addEvent}
                    className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-black border border-gray-200 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <Plus size={12} /> Add Event
                  </button>
                </div>
                <div className="space-y-3">
                  {events.map((event, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-start p-3 bg-gray-50 rounded-xl">
                      <input className={`${inputCls} col-span-3`} placeholder="Event name" value={event.name} onChange={(e) => updateEvent(i, "name", e.target.value)} />
                      <input type="date" className={`${inputCls} col-span-3`} value={event.date} onChange={(e) => updateEvent(i, "date", e.target.value)} />
                      <input className={`${inputCls} col-span-2`} placeholder="Time" value={event.time} onChange={(e) => updateEvent(i, "time", e.target.value)} />
                      <input className={`${inputCls} col-span-3`} placeholder="Venue (optional)" value={event.venue || ""} onChange={(e) => updateEvent(i, "venue", e.target.value)} />
                      <button onClick={() => removeEvent(i)} className="col-span-1 p-2.5 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <Field label="Personal Message (optional)">
                <textarea
                  className={`${inputCls} resize-none`}
                  rows={3}
                  placeholder="A short note to your guests..."
                  value={form.personalMessage}
                  onChange={(e) => update("personalMessage", e.target.value)}
                />
              </Field>

              {/* Premium & Luxury — Couple photo + Background music */}
              {(template.tier === "Premium" || template.tier === "Luxury") && (
                <div className="space-y-5 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                      {template.tier} feature
                    </span>
                  </div>
                  <Field label="Couple Photo (optional)">
                    <FileUpload type="photo" value={form.couplePhotoUrl} onChange={(url) => update("couplePhotoUrl", url)} />
                  </Field>
                  <Field label="Background Music (optional)">
                    <FileUpload type="music" value={form.bgMusicUrl} onChange={(url) => update("bgMusicUrl", url)} />
                  </Field>
                </div>
              )}

              {/* First-time buyer banner */}
              {isFirstTime && (
                <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3.5">
                  <span className="text-lg leading-none mt-0.5">🎁</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-emerald-800">First order discount applied!</p>
                    <p className="text-xs text-emerald-600 mt-0.5">10% off has been automatically applied to your order. Welcome to WedCraft!</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg shrink-0">−10%</span>
                </div>
              )}

              {/* Coupon Code */}
              {!isFirstTime && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Coupon Code</label>
                  <div className="flex gap-2">
                    <input
                      className={inputCls + " flex-1"}
                      placeholder="e.g. WEDDING20"
                      value={couponCode}
                      onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); setCouponSuccess(""); setDiscount(0); }}
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 disabled:opacity-40 transition-colors shrink-0"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-red-500 mt-1.5">{couponError}</p>}
                  {couponSuccess && <p className="text-xs text-emerald-600 mt-1.5 font-medium">✓ {couponSuccess}</p>}
                </div>
              )}

              <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={() => { setShowAuthModal(false); setStep(2); }}
                redirectMessage="Sign in to complete your purchase"
              />

              <button
                onClick={() => {
                  if (!user) { setShowAuthModal(true); return; }
                  setStep(2);
                }}
                disabled={!isStep1Valid}
                className="w-full py-3 bg-black text-white rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
              >
                {user ? "Continue to Payment →" : "Sign In to Continue →"}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 text-lg">Review Your Details</h2>
                <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-black underline">Edit</button>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Couple</span>
                  <span className="font-medium">{form.groomName} & {form.brideName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{form.weddingDate} at {form.weddingTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Venue</span>
                  <span className="font-medium">{form.venue}</span>
                </div>
                {form.phone && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">RSVP Phone</span>
                    <span className="font-medium">{form.phone}</span>
                  </div>
                )}
                {hasFamilySection && (form.groomFatherName || form.brideFatherName) && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Family section</span>
                    <span className="font-medium text-emerald-600">✓ Filled</span>
                  </div>
                )}
                {hasFamilySection && form.relatives.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Relatives</span>
                    <span className="font-medium">{form.relatives.length} added</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Events</span>
                  <span className="font-medium">{events.length} event(s)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-4 py-3 rounded-xl">
                <ShieldCheck size={16} className="shrink-0" />
                Your payment is secured by Razorpay. We never store card details.
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</div>
              )}

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-3.5 bg-black text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-60 transition-colors"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Processing...</>
                ) : (
                  <><CreditCard size={16} /> Pay ₹{finalPrice.toLocaleString("en-IN")} via Razorpay</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-36 bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>

            <div className={`h-28 rounded-xl bg-gradient-to-br ${template.previewBg} mb-4 flex items-center justify-center`}>
              <div className="w-16 h-20 bg-white/40 rounded-lg backdrop-blur-sm border border-white/50" />
            </div>

            <p className="font-semibold text-gray-900">{template.name}</p>
            <p className="text-sm text-gray-500 mb-1">{template.tier} Template</p>

            <div className="flex items-center gap-1 mb-4">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span className="text-xs text-gray-600">{template.rating} ({template.reviewCount} reviews)</span>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Template</span>
                <span>₹{template.price.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Hosting</span>
                <span className="text-emerald-600">Free</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600 font-medium">
                  <span>Coupon ({couponCode})</span>
                  <span>- ₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 border-t pt-2 mt-2">
                <span>Total</span>
                <span>₹{finalPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <ul className="mt-4 space-y-1.5">
              {template.features.slice(0, 4).map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-gray-500">
                  <span className="text-emerald-500 mt-0.5">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}