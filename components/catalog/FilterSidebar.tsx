"use client";

import { Religion, Theme, Tier, allReligions, allThemes, allTiers } from "@/data/templates";
import { X } from "lucide-react";

interface Filters {
  religions: Religion[];
  themes: Theme[];
  tiers: Tier[];
  maxPrice: number;
}

interface FilterSidebarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  totalCount: number;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-semibold text-gray-900 mb-3">{children}</h3>
);

export const FilterSidebar = ({
  filters,
  onChange,
  totalCount,
}: FilterSidebarProps) => {
  const toggle = <T extends string>(
    key: keyof Filters,
    value: T,
    current: T[]
  ) => {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  const hasActiveFilters =
    filters.religions.length > 0 ||
    filters.themes.length > 0 ||
    filters.tiers.length > 0 ||
    filters.maxPrice < 2000;

  const clearAll = () =>
    onChange({ religions: [], themes: [], tiers: [], maxPrice: 2000 });

  const CheckItem = ({
    label,
    checked,
    onToggle,
  }: {
    label: string;
    checked: boolean;
    onToggle: () => void;
  }) => (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        onClick={onToggle}
        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
          checked
            ? "bg-black border-black"
            : "border-gray-300 group-hover:border-gray-500"
        }`}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 5l2.5 2.5L8 3"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span
        className={`text-sm ${checked ? "text-gray-900 font-medium" : "text-gray-600"}`}
      >
        {label}
      </span>
    </label>
  );

  return (
    <aside className="w-full">
      <div className="flex items-center justify-between mb-5">
        <span className="text-sm text-gray-500">{totalCount} designs</span>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-black transition-colors"
          >
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      {/* Tier / Price Range */}
      <div className="mb-6">
        <SectionTitle>Budget</SectionTitle>
        <div className="flex flex-col gap-2">
          {allTiers.map((tier) => (
            <CheckItem
              key={tier}
              label={
                tier === "Basic"
                  ? "Basic — up to ₹499"
                  : tier === "Premium"
                    ? "Premium — ₹799–₹999"
                    : "Luxury — ₹1999+"
              }
              checked={filters.tiers.includes(tier)}
              onToggle={() => toggle("tiers", tier, filters.tiers)}
            />
          ))}
        </div>
      </div>

      {/* Religion */}
      <div className="mb-6">
        <SectionTitle>Religion / Culture</SectionTitle>
        <div className="flex flex-col gap-2">
          {allReligions.map((religion) => (
            <CheckItem
              key={religion}
              label={religion}
              checked={filters.religions.includes(religion)}
              onToggle={() => toggle("religions", religion, filters.religions)}
            />
          ))}
        </div>
      </div>

      {/* Themes */}
      <div className="mb-6">
        <SectionTitle>Theme</SectionTitle>
        <div className="flex flex-col gap-2">
          {allThemes.map((theme) => (
            <CheckItem
              key={theme}
              label={theme}
              checked={filters.themes.includes(theme)}
              onToggle={() => toggle("themes", theme, filters.themes)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};