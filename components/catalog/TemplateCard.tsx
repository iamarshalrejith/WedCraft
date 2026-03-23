"use client";

import Link from "next/link";
import { Star, Zap } from "lucide-react";
import { Template } from "@/data/templates";
import { motion } from "framer-motion";

interface TemplateCardProps {
  template: Template;
  index?: number;
}

const tierColors: Record<string, string> = {
  Basic: "bg-gray-100 text-gray-700",
  Premium: "bg-amber-100 text-amber-800",
  Luxury: "bg-zinc-900 text-yellow-400",
};

// These templates have light/white backgrounds — mock card needs dark elements
const LIGHT_BG_SLUGS = [
  "eternal-bloom",
  "sacred-vows",
  "paper-and-petals",
  "rustic-bloom",
  "zen-garden",
  "azure-shore",
  "mangal-utsav",
  "anand-karaj"
];

export const TemplateCard = ({ template, index = 0 }: TemplateCardProps) => {
  const isLight = LIGHT_BG_SLUGS.includes(template.slug);
  const accent = template.colors[0] ?? "#888888";

  // Mock card inner elements — adapt based on background lightness
  const mockCircle   = isLight ? { background: `${accent}55` }             : { background: "rgba(255,255,255,0.55)" };
  const mockLineWide = isLight ? { background: `${accent}40` }             : { background: "rgba(255,255,255,0.65)" };
  const mockLineThin = isLight ? { background: `${accent}30` }             : { background: "rgba(255,255,255,0.40)" };
  const mockButton   = isLight ? { background: `${accent}50` }             : { background: "rgba(255,255,255,0.55)" };
  const mockCard     = isLight
    ? { background: "rgba(255,255,255,0.80)", border: `1px solid ${accent}25`, boxShadow: `0 4px 20px ${accent}20` }
    : { background: "rgba(255,255,255,0.22)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/preview/${template.slug}`} className="group block">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300">

          {/* Thumbnail */}
          <div className={`relative h-52 bg-gradient-to-br ${template.previewBg} flex items-center justify-center overflow-hidden`}>

            {/* Color dots */}
            <div className="absolute top-3 left-3 flex gap-1.5">
              {template.colors.map((color, i) => (
                <div key={i} className="w-4 h-4 rounded-full shadow-sm"
                  style={{ backgroundColor: color, border: isLight ? "2px solid rgba(0,0,0,0.12)" : "2px solid rgba(255,255,255,0.6)" }}
                />
              ))}
            </div>

            {/* Tier + New badges */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tierColors[template.tier]}`}>
                {template.tier}
              </span>
              {template.isNew && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <Zap size={10} /> New
                </span>
              )}
            </div>

            {/* Invite mock card — now adaptive */}
            <div
              className="w-32 h-44 rounded-xl flex flex-col items-center justify-center gap-2 group-hover:scale-105 transition-transform duration-300"
              style={mockCard}
            >
              <div className="w-9 h-9 rounded-full" style={mockCircle} />
              <div className="w-20 h-1.5 rounded-full" style={mockLineWide} />
              <div className="w-16 h-1 rounded-full"  style={mockLineThin} />
              <div className="w-14 h-1 rounded-full"  style={mockLineThin} />
              <div className="w-12 h-6 rounded-lg mt-1" style={mockButton} />
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-black text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                Preview →
              </span>
            </div>
          </div>

          {/* Card info */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 text-base leading-snug">{template.name}</h3>
              <span className="text-base font-bold text-gray-900 shrink-0">₹{template.price.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex items-center gap-1 mb-2">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-gray-700">{template.rating}</span>
              <span className="text-xs text-gray-400">({template.reviewCount})</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">{template.religion}</span>
              {template.themes.slice(0, 2).map((theme) => (
                <span key={theme} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{theme}</span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};