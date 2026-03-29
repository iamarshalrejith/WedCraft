"use client";

import Link from "next/link";
import Image from "next/image";
import {   Mail } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import React from "react";

const Footer = () => {
  const navItems = [
  { name: "Home", path: "/#hero" },
  { name: "Catalog", path: "/#featured" },
  { name: "How it Works", path: "/#how-it-works" },
  { name: "Pricing", path: "/#pricing" },
  { name: "Contact", path: "/contact" },
];

 const socialLinks = [
  { icon: FaInstagram, href: "https://instagram.com/this_is_wedcraft" },
  { icon: Mail, href: "mailto:teamwedcraft@gmail.com" },
];

  return (
     <section >
   <footer className="relative border-t pt-24 z-50 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Logo + Description */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="WedCraft Logo"
                width={144}
                height={40}
                className="w-32"
              />
            </Link>

            <p className="mt-4 text-gray-600 text-sm leading-relaxed max-w-sm">
              Create beautiful digital wedding invitations effortlessly.
              Browse templates, customize your design, and share your special
              day with loved ones.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm text-gray-600">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="hover:text-black transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Social */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              Contact
            </h3>

            <p className="text-gray-600 text-sm mb-5">
              Have questions? Reach out to us anytime.
            </p>

            <div className="flex gap-3">
              {socialLinks.map((s, i) => {
                const Icon = s.icon;

                return (
                  <a
  key={i}
  href={s.href}
  target="_blank"
  rel="noopener noreferrer"
  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 transition"
>
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">

          <p>
            © {new Date().getFullYear()} WedCraft. All rights reserved.
          </p>

          <div className="flex gap-6 mt-3 md:mt-0">
            <Link href="/privacy" className="hover:text-black transition">
              Privacy Policy
            </Link>

            <Link href="/terms" className="hover:text-black transition">
              Terms of Service
            </Link>
          </div>

        </div>
      </div>
    </footer>
   </section>
  );
};

export default Footer;