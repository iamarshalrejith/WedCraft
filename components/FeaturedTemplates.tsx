"use client";

import Link from "next/link";
import { getFeaturedTemplates } from "@/data/templates";
import { TemplateCard } from "@/components/catalog/TemplateCard";
import { ArrowRight } from "lucide-react";

export const FeaturedTemplates = () => {
  // getFeaturedTemplates already slices to 8 max
  const featured = getFeaturedTemplates();

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-16" id="featured">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
            Popular Designs
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Featured Templates
          </h2>
        </div>
        <Link
          href="/catalog"
          className="hidden md:flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-black transition-colors"
        >
          View all <ArrowRight size={16} />
        </Link>
      </div>

      {/* 4-column grid — 8 templates = 2 clean rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {featured.map((template, i) => (
          <TemplateCard key={template.id} template={template} index={i} />
        ))}
      </div>

      <div className="mt-8 flex justify-center md:hidden">
        <Link
          href="/catalog"
          className="flex items-center gap-2 border border-gray-300 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Browse all templates <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
};