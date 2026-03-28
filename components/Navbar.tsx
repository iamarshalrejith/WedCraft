"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  ChevronDown,
  LayoutGrid,
  LogIn,
  UserPlus,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";
const Navbar = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, loading, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("hero");
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");

  const openAuthModal = (tab: "login" | "signup") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const navItems = [
    { name: "Home", path: "/", section: "hero" },
    { name: "How it Works", path: "/#how-it-works", section: "how-it-works" },
    { name: "Catalog", path: "/#featured", section: "featured" },
    { name: "Pricing", path: "/#pricing", section: "pricing" },
    { name: "Contact", path: "/#contact", section: "contact" },
  ];

  useEffect(() => {
    const sections = ["hero", "featured", "how-it-works", "pricing", "contact"];

    const handleScroll = () => {
      if (window.scrollY < 200) {
        setActiveSection("hero");
        return;
      }

      let current = "hero";
      let minDistance = Number.POSITIVE_INFINITY;

      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const distance = Math.abs(rect.top - 140);
          if (distance < minDistance) {
            minDistance = distance;
            current = id;
          }
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "auto" });
      setActiveSection("hero");
    }
  }, [pathname]);

  const avatarInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="fixed top-0 w-full h-24 md:h-28 lg:h-32 bg-gray-100 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 relative h-full">
        <Link
          href="/"
          scroll={false}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setActiveSection("hero");
          }}
        >
          <Image
            src="/images/logo.png"
            alt="WedCraft Logo"
            width={144}
            height={40}
            style={{ width: "120px", height: "auto", cursor: "pointer" }}
            loading="eager"
          />
        </Link>

        <nav className="hidden md:flex lg:hidden justify-center max-w-md mx-auto">
          <ul className="flex items-center gap-2 px-3 py-2 bg-white/30 backdrop-blur-md border border-white/40 shadow-sm rounded-full text-sm font-medium">
            {navItems.slice(0, 3).map((item) => {
              const sectionId = item.section;
              const isActive =
                (pathname === "/" && activeSection === sectionId) ||
                (pathname !== "/" && item.path === pathname);

              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`px-3 py-1.5 rounded-full transition ${
                      isActive ? "bg-black text-white" : "hover:bg-white/50"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <nav className="hidden lg:flex xl:hidden flex-1 justify-center">
          <ul className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-lg border border-white/30 rounded-full text-sm font-medium">
            {navItems.slice(0, 4).map((item) => {
              const sectionId = item.section;
              const isActive =
                (pathname === "/" && activeSection === sectionId) ||
                (pathname !== "/" && item.path === pathname);

              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`px-3 py-1.5 rounded-full transition ${
                      isActive ? "bg-black text-white" : "hover:bg-white/40"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <nav className="hidden xl:flex flex-1 justify-center">
          <ul className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full shadow-lg text-gray-700 text-sm md:text-base font-medium">
            {navItems.map((item) => {
              const sectionId = item.section;
              const isActive =
                (pathname === "/" && activeSection === sectionId) ||
                (pathname !== "/" && item.path === pathname);
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full transition text-sm md:text-base ${
                      isActive
                        ? "bg-black text-white"
                        : "hover:bg-white/40 hover:text-black"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {/* Laptop (lg) icon actions */}
          {!user && (
            <div className="hidden lg:flex xl:hidden items-center gap-2">
              <button
                onClick={() => openAuthModal("login")}
                className="p-2 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:scale-105 active:scale-95"
                title="Login"
              >
                <LogIn size={18} />
              </button>

              <button
                onClick={() => openAuthModal("signup")}
                className="p-2 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:scale-105 active:scale-95"
                title="Sign up"
              >
                <UserPlus size={18} />
              </button>

              <Link
                href="/catalog"
                className="p-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95"
                title="Browse templates"
              >
                <LayoutGrid size={18} />
              </Link>
            </div>
          )}
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          ) : user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="hidden xl:flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5 hover:border-gray-300 transition-colors"
              >
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-semibold">
                    {avatarInitials}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-800 max-w-[100px] truncate">
                  {user.name.split(" ")[0]}
                </span>
                <ChevronDown size={14} className="text-gray-500" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2.5 border-b">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <LayoutDashboard size={14} /> My Dashboard
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <ShieldCheck size={14} /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden xl:flex items-center gap-2">
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-black px-3 py-2 transition-colors"
              >
                <LogIn size={16} /> Login
              </Link>
              <Link
                href="/auth/signup"
                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}

          <Link
            href="/catalog"
            className="hidden xl:block bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
          >
            Browse Templates
          </Link>

          <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <X size={28} className="text-gray-300 bg-black rounded-lg p-2" />
            ) : (
              <Menu size={28} className="text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden px-6 pb-6">
          <ul className="flex flex-col gap-4 bg-white shadow-lg rounded-xl p-6">
            {navItems.map((item) => {
              const sectionId = item.section;
              const isActive =
                (pathname === "/" && activeSection === sectionId) ||
                (pathname !== "/" && item.path === pathname);
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`block py-2 font-medium transition-colors ${
                      isActive
                        ? "text-black font-semibold"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}

            <li>
              <Link
                href="/catalog"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 w-full bg-black text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <LayoutGrid size={16} />
                Browse Templates
              </Link>
            </li>

            <div className="flex flex-col gap-3 pt-4 border-t">
              {user ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-black text-white text-xs flex items-center justify-center font-semibold">
                      {avatarInitials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm text-gray-700 flex items-center gap-2"
                  >
                    <LayoutDashboard size={14} /> My Dashboard
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="text-sm text-gray-700 flex items-center gap-2"
                    >
                      <ShieldCheck size={14} /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="text-sm text-red-600 flex items-center gap-2"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/auth/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-700 hover:text-black flex items-center gap-2 text-sm font-medium"
                  >
                    <LogIn size={16} /> Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMenuOpen(false)}
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </ul>
        </div>
      )}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => setAuthOpen(false)}
        defaultTab={authTab}
      />
    </header>
  );
};

export default Navbar;
