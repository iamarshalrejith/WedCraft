"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Loader2, Heart, X } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called after successful login/signup so the parent can continue to checkout */
  onSuccess: () => void;
  /** Which tab to show first */
  defaultTab?: "login" | "signup";
   redirectMessage?: string;
}

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-colors placeholder:text-gray-400";

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  defaultTab = "login",
  redirectMessage,
}: AuthModalProps) {
  const { refresh } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);
  const overlayRef = useRef<HTMLDivElement>(null);

  // ── Login state ──────────────────────────────────────────────────────────
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // ── Signup state ─────────────────────────────────────────────────────────
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPw, setShowSignupPw] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setTab(defaultTab);
      setLoginError("");
      setSignupError("");
    }
  }, [isOpen, defaultTab]);

  // Trap scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  // ── Login submit ─────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setLoginError(data.error || "Login failed"); return; }
      await refresh();
      onSuccess();
    } catch {
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // ── Signup submit ─────────────────────────────────────────────────────────
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setSignupError(data.error || "Signup failed"); return; }
      await refresh();
      onSuccess();
    } catch {
      setSignupError("Something went wrong. Please try again.");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-sm px-4 py-6"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <div className="sticky top-0 flex justify-end p-4 bg-white z-10"><button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button></div>
        

        {/* Header */}
        <div className="px-8 pt-8 pb-0 text-center">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-black mb-3">
            <Heart size={20} className="text-white fill-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {tab === "login" ? "Sign in to continue" : "Create your account"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {redirectMessage
  ? redirectMessage
  : tab === "login"
  ? "Your purchased invitations will be saved to your dashboard."
  : "Join WedCraft and save all your invitations in one place."}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex mx-8 mt-5 bg-gray-100 rounded-xl p-1 gap-1">
          {(["login", "signup"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                tab === t
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <div className="px-8 pb-8 pt-5">
          {/* Google OAuth */}
          <a
            href="/api/auth/google"
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FcGoogle size={20} />
            Continue with Google
          </a>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or continue with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* ── LOGIN FORM ─────────────────────────────────────────────── */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  className={inputCls}
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showLoginPw ? "text" : "password"}
                    className={`${inputCls} pr-10`}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPw(!showLoginPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showLoginPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {loginError && (
                <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{loginError}</p>
              )}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-black text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {loginLoading && <Loader2 size={16} className="animate-spin" />}
                Sign In & Continue
              </button>
              <p className="text-center text-xs text-gray-400">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setTab("signup")}
                  className="text-black font-semibold hover:underline"
                >
                  Sign up free
                </button>
              </p>
            </form>
          )}

          {/* ── SIGNUP FORM ────────────────────────────────────────────── */}
          {tab === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="Your name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  className={inputCls}
                  placeholder="you@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showSignupPw ? "text" : "password"}
                    className={`${inputCls} pr-10`}
                    placeholder="Min. 8 characters"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPw(!showSignupPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showSignupPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {signupError && (
                <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{signupError}</p>
              )}
              <button
                type="submit"
                disabled={signupLoading}
                className="w-full py-3 bg-black text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {signupLoading && <Loader2 size={16} className="animate-spin" />}
                Create Account & Continue
              </button>
              <p className="text-center text-xs text-gray-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="text-black font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}