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
    { name: "Catalog", path: "/catalog" },
    { name: "How it Works", path: "/how-it-works" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 w-full h-32 bg-gray-100 z-50 ">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6  relative">
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
        <nav className="hidden md:flex flex-1 justify-center">
          <ul
            className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2
  bg-white/20 backdrop-blur-xl border border-white/30 
  rounded-full shadow-lg text-gray-700 text-sm md:text-base font-medium"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full transition text-sm md:text-base
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
          <button className="hidden lg:block bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition cursor-pointer">
            Browse Templates
          </button>

          {/* Mobile / Tablet Menu Button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <X size={28} className="text-gray-300 bg-black rounded-lg p-2" />
            ) : (
              <Menu size={28} className="text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Menu */}
      {menuOpen && (
        <div className="lg:hidden px-6 pb-6">
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
                Login
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
