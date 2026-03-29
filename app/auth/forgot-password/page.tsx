"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Heart, Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [sent, setSent]       = useState(false);

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-colors placeholder:text-gray-400";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-14 min-h-[80vh] flex items-center justify-center px-4 pb-15">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-black mb-4">
            <Heart size={22} className="text-white fill-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
          <p className="text-gray-500 text-sm mt-1">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          {sent ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 mb-4">
                <CheckCircle size={28} className="text-emerald-500" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Check your email</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                If an account exists for <strong>{email}</strong>, we&apos;ve sent a
                password reset link. It expires in <strong>1 hour</strong>.
              </p>
              <p className="text-xs text-gray-400 mb-6">
                Didn&apos;t get it? Check your spam folder, or{" "}
                <button
                  onClick={() => { setSent(false); setError(""); }}
                  className="text-black underline font-medium"
                >
                  try again
                </button>
                .
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                <ArrowLeft size={14} /> Back to login
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    type="email"
                    className={`${inputCls} pl-10`}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    required
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full py-3 bg-black text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                {loading ? "Sending..." : "Send reset link"}
              </button>

              <div className="text-center pt-1">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors"
                >
                  <ArrowLeft size={13} /> Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}