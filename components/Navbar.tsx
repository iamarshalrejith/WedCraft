"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, Menu, X } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";

const Navbar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Templates", path: "/templates" },
    { name: "How it Works", path: "/how-it-works" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="w-full bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Image
            src="/images/logo.png"
            alt="WedCraft Logo"
            width={144}
            height={40}
            className="w-32 md:w-36"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:block">
          <ul
            className="flex items-center gap-3 px-4 py-2 
          bg-white/20 backdrop-blur-xl border border-white/30 
          rounded-full shadow-lg text-gray-800 font-medium"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`px-4 py-2 rounded-full transition
                    ${
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

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Login (desktop only) */}
          <button className="hidden md:flex text-gray-700 hover:text-black cursor-pointer">
            <LogIn />
          </button>

          {/* Browse Templates (desktop only) */}
          <button className="hidden md:block bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition cursor-pointer">
            Browse Templates
          </button>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <X size={28} className="text-gray-300 bg-black rounded-xl p-2" />
            ) : (
              <Menu size={28} className="text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-6">
          <ul className="flex flex-col gap-4 bg-white shadow-lg rounded-xl p-6">
            {navItems.map((item) => {
              const isActive = pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`block py-2 font-medium
                    ${
                      isActive ? "text-black" : "text-gray-600 hover:text-black"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}

            <div className="flex items-center gap-4 pt-4 border-t">
              <button className="text-gray-700 hover:text-black flex items-center gap-2">
                <LogIn size={18} />
              </button>

              <button className="bg-black text-white px-4 py-2 rounded-lg">
                Browse Templates
              </button>
            </div>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
