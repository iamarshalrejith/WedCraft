"use client";

import { useState, useMemo } from "react";
import { templates, Religion, Theme, Tier } from "@/data/templates";
import { TemplateCard } from "@/components/catalog/TemplateCard";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { SlidersHorizontal, X } from "lucide-react";

interface Filters {
  religions: Religion[];
  themes: Theme[];
  tiers: Tier[];
  maxPrice: number;
}

const defaultFilters: Filters = {
  religions: [],
  themes: [],
  tiers: [],
  maxPrice: 2000,
};

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

export default function CatalogPage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...templates];

    if (filters.religions.length > 0) {
      result = result.filter((t) => filters.religions.includes(t.religion));
    }
    if (filters.themes.length > 0) {
      result = result.filter((t) =>
        t.themes.some((theme) => filters.themes.includes(theme))
      );
    }
    if (filters.tiers.length > 0) {
      result = result.filter((t) => filters.tiers.includes(t.tier));
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a) => (a.isNew ? -1 : 1));
        break;
      default:
        result.sort((a) => (a.isFeatured ? -1 : 1));
    }

    return result;
  }, [filters, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Browse Templates
        </h1>
        <p className="text-gray-500">
          Choose your design. Customise with your details. Share in minutes.
        </p>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="flex items-center justify-between mb-4 md:hidden">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 text-sm font-medium border border-gray-300 px-4 py-2 rounded-lg"
        >
          <SlidersHorizontal size={16} />
          Filters
          {(filters.religions.length +
            filters.themes.length +
            filters.tiers.length) >
            0 && (
            <span className="bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {filters.religions.length +
                filters.themes.length +
                filters.tiers.length}
            </span>
          )}
        </button>
        <select
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-gray-900">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              totalCount={filtered.length}
            />
          </div>
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-56 shrink-0">
          <div className="sticky top-36">
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              totalCount={filtered.length}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Desktop Sort */}
          <div className="hidden md:flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              {filtered.length} template{filtered.length !== 1 ? "s" : ""} found
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No templates match your filters
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Try adjusting or clearing your filters.
              </p>
              <button
                onClick={() => setFilters(defaultFilters)}
                className="text-sm font-medium underline text-gray-700"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((template, i) => (
                <TemplateCard key={template.id} template={template} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}