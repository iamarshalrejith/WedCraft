"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTemplateBySlug } from "@/data/templates";
import { Star, ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { motion } from "framer-motion";

interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

// Watermark overlay — fixed, pointer-events none, impossible to remove via devtools
// without breaking the layout. Diagonal repeated text pattern.
const WatermarkOverlay = () => (
  <div
    className="absolute inset-0 z-20 pointer-events-none overflow-hidden select-none"
    aria-hidden="true"
  >
    {/* Diagonal repeating watermark tiles */}
    {Array.from({ length: 8 }).map((_, row) =>
      Array.from({ length: 4 }).map((_, col) => (
        <div
          key={`${row}-${col}`}
          className="absolute"
          style={{
            top: `${row * 140 - 40}px`,
            left: `${col * 260 - 20}px`,
            transform: "rotate(-35deg)",
            opacity: 0.12,
          }}
        >
          <span className="text-gray-900 font-bold text-2xl tracking-widest whitespace-nowrap">
            WEDCRAFT PREVIEW
          </span>
        </div>
      ))
    )}
    {/* Corner badges */}
    <div className="absolute top-4 left-4 bg-black/70 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
      🔒 Preview Mode
    </div>
  </div>
);

// Placeholder for actual template rendering. 
// In production this would be the real template iframe/component.
const TemplatePlaceholder = ({
  previewBg,
  name,
  colors,
}: {
  previewBg: string;
  name: string;
  colors: string[];
}) => (
  <div
    className={`min-h-screen w-full bg-gradient-to-br ${previewBg} flex flex-col items-center justify-center gap-8 py-20 px-6`}
    onContextMenu={(e) => e.preventDefault()}
  >
    {/* Simulated invite content */}
    <div className="max-w-md w-full text-center space-y-6">
      {/* Color palette */}
      <div className="flex justify-center gap-2 mb-4">
        {colors.map((c, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/40">
        <p className="text-sm tracking-widest uppercase text-gray-500 mb-4">
          Together with their families
        </p>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Rahul & Priya
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          invite you to celebrate their wedding
        </p>
        <div className="w-16 h-0.5 bg-gray-300 mx-auto mb-6" />
        <div className="space-y-1 text-gray-700">
          <p className="font-semibold">12th December 2026</p>
          <p>Saturday at 7:00 PM</p>
          <p className="text-gray-500">Grand Palace Banquet, Mumbai</p>
        </div>
        <button
          className="mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition"
          style={{ backgroundColor: colors[0] }}
        >
          RSVP Now
        </button>
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
          Events
        </p>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>Mehendi</span>
            <span>10 Dec • 5 PM</span>
          </div>
          <div className="flex justify-between">
            <span>Sangeet</span>
            <span>11 Dec • 7 PM</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Wedding</span>
            <span>12 Dec • 7 PM</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 italic">
        Template: {name} — Powered by WedCraft
      </p>
    </div>
  </div>
);

export default function PreviewPage({ params }: PreviewPageProps) {
  const { id } = use(params);
  const template = getTemplateBySlug(id);

  if (!template) notFound();

  return (
    <div className="relative min-h-screen">
      {/* Back + info bar */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center gap-4">
        <Link
          href="/catalog"
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-black transition-colors shrink-0"
        >
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {template.name}
          </p>
          <div className="flex items-center gap-1">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span className="text-xs text-gray-500">
              {template.rating} · {template.reviewCount} reviews
            </span>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <span className="hidden sm:block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            🔒 Watermarked preview
          </span>
        </div>
      </div>

      {/* Preview area with watermark */}
      <div className="relative">
        <WatermarkOverlay />
        <TemplatePlaceholder
          previewBg={template.previewBg}
          name={template.name}
          colors={template.colors}
        />
      </div>

      {/* Sticky Buy Now CTA */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-500">
              {template.name} · {template.tier}
            </p>
            <p className="text-xl font-bold text-gray-900">
              ₹{template.price.toLocaleString("en-IN")}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              {["No watermark", "Shareable URL"].map((f) => (
                <span
                  key={f}
                  className="text-xs text-emerald-700 flex items-center gap-0.5"
                >
                  <Check size={10} /> {f}
                </span>
              ))}
            </div>
          </div>
          <Link
            href={`/checkout/${template.slug}`}
            className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 active:scale-95 transition-all shrink-0"
          >
            <ShoppingCart size={16} />
            Buy Now
          </Link>
        </div>
      </motion.div>

      {/* Bottom padding so content isn't hidden behind CTA */}
      <div className="h-32" />
    </div>
  );
}