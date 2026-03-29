"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Heart, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

function ResetPasswordForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const token        = searchParams.get("token");

  const [password, setPassword]         = useState("");
  const [confirmPw, setConfirmPw]       = useState("");
  const [showPw, setShowPw]             = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [success, setSuccess]           = useState(false);

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-colors placeholder:text-gray-400";

  // No token in URL — invalid link
  if (!token) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mb-4">
          <XCircle size={28} className="text-red-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Invalid reset link</h2>
        <p className="text-sm text-gray-500 mb-6">
          This link is missing or broken. Please request a new password reset.
        </p>
        <Link
          href="/auth/forgot-password"
          className="inline-block py-2.5 px-6 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          Request new link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPw) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
      // Redirect to login after 2.5 seconds
      setTimeout(() => router.push("/auth/login"), 2500);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 mb-4">
          <CheckCircle size={28} className="text-emerald-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Password updated!</h2>
        <p className="text-sm text-gray-500 mb-1">
          Your password has been changed successfully.
        </p>
        <p className="text-xs text-gray-400">Redirecting you to login...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* New password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          New password
        </label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            className={`${inputCls} pr-10`}
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            required
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Confirm password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Confirm new password
        </label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            className={`${inputCls} pr-10`}
            placeholder="Repeat your password"
            value={confirmPw}
            onChange={(e) => { setConfirmPw(e.target.value); setError(""); }}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Match indicator */}
        {confirmPw.length > 0 && (
          <p className={`text-xs mt-1.5 ${password === confirmPw ? "text-emerald-600" : "text-red-500"}`}>
            {password === confirmPw ? "✓ Passwords match" : "✗ Passwords don't match"}
          </p>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !password || !confirmPw}
        className="w-full py-3 bg-black text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 transition-colors"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {loading ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <div className="pt-14 min-h-[80vh] flex items-center justify-center px-4 pb-15">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-black mb-4">
              <Heart size={22} className="text-white fill-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Set new password</h1>
            <p className="text-gray-500 text-sm mt-1">
              Choose a strong password for your account
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <ResetPasswordForm />
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Remember it now?{" "}
            <Link href="/auth/login" className="text-black font-medium hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </Suspense>
  );
}