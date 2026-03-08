"use client";

import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaFacebook, FaXTwitter } from "react-icons/fa6";
import {Mail} from "lucide-react"
import React from "react";

const Footer = () => {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Catalog", path: "/catalog" },
    { name: "How it Works", path: "/how-it-works" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <footer className="bg-gray-100 border-t mt-24">
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

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

            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
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

            <ul className="space-y-3 text-gray-600">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="hover:text-black transition"
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

            <p className="text-gray-600 text-sm mb-4">
              Have questions? Reach out to us anytime.
            </p>

            <div className="flex items-center gap-4">
              

              <a className="text-gray-600 hover:text-black">
                 <FaInstagram size={20} />
              </a>

            

              <a className="text-gray-600 hover:text-black">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">

          <p>
            © {new Date().getFullYear()} WedCraft. All rights reserved.
          </p>

          <div className="flex gap-6 mt-3 md:mt-0">
            <Link href="/privacy" className="hover:text-black">
              Privacy Policy
            </Link>

            <Link href="/terms" className="hover:text-black">
              Terms of Service
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;