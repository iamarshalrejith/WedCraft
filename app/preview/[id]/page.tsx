"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTemplateBySlug } from "@/data/templates";
import { Star, ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { motion } from "framer-motion";
import MangalUtsav from "@/components/templates/MangalUtsav";
import EternalBloom from "@/components/templates/EternalBloom";
import AzureShore from "@/components/templates/AzureShore";
import { CoupleDetails } from "@/types/invite";

interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

// Watermark overlay
const WatermarkOverlay = () => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  const rows = isMobile ? 5 : 8;
  const cols = isMobile ? 3 : 6;

  return (
    <div className="fixed inset-0 z-20 pointer-events-none overflow-hidden select-none">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: cols }).map((_, col) => (
          <div
            key={`${row}-${col}`}
            className="absolute"
            style={{
              top: `${(row / rows) * 100}%`,
              left: `${(col / cols) * 100}%`,
              transform: "rotate(-35deg)",
              opacity: 0.08,
            }}
          >
            <span className="text-white font-bold text-sm sm:text-xl tracking-widest whitespace-nowrap">
              WEDCRAFT PREVIEW
            </span>
          </div>
        ))
      )}

      <div className="fixed top-20 left-4 bg-black/70 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm z-30">
        🔒 Preview Mode
      </div>
    </div>
  );
};

// Demo data — different flavor per template
const hindoDemo: CoupleDetails = {
  groomName: "Aravind", brideName: "Aarathi",
  weddingDate: "2026-12-12", weddingTime: "7:00 PM",
  venue: "Grand Palace Banquet Hall", venueAddress: "NH-16, Bayyavaram, Anakapalli",
  mapLink: "https://maps.google.com", phone: "+919876543210",
  personalMessage: "Two souls, one heartbeat. We are overjoyed to begin this journey together.",
  events: [
    { name: "Mehendi & Haldi", date: "2026-12-10", time: "4:00 PM", venue: "Bride's Residence" },
    { name: "Sangeet Night", date: "2026-12-11", time: "7:00 PM", venue: "Grand Palace - Hall B" },
    { name: "Wedding Ceremony", date: "2026-12-12", time: "7:00 PM", venue: "Grand Palace - Main Hall" },
  ],
};

const modernDemo: CoupleDetails = {
  groomName: "Arjun", brideName: "Meera",
  weddingDate: "2026-11-20", weddingTime: "5:30 PM",
  venue: "The Ivy Gardens", venueAddress: "12 Blossom Lane, Bangalore",
  mapLink: "https://maps.google.com", phone: "+919876543210",
  personalMessage: "Two hearts, one love. We invite you to share in the beginning of our greatest adventure.",
  events: [
    { name: "Bridal Shower", date: "2026-11-18", time: "3:00 PM", venue: "Bride's Home" },
    { name: "Cocktail Evening", date: "2026-11-19", time: "6:00 PM", venue: "The Ivy Terrace" },
    { name: "Wedding Ceremony", date: "2026-11-20", time: "5:30 PM", venue: "The Ivy Gardens" },
  ],
};

const beachDemo: CoupleDetails = {
  groomName: "Kiran", brideName: "Nadia",
  weddingDate: "2027-01-15", weddingTime: "4:00 PM",
  venue: "Tide & Palms Beach Resort", venueAddress: "Beachfront Road, Goa",
  mapLink: "https://maps.google.com", phone: "+919876543210",
  personalMessage: "With the ocean as our witness and love as our compass, we invite you to celebrate our forever.",
  events: [
    { name: "Welcome Sundowner", date: "2027-01-14", time: "6:00 PM", venue: "Pool Deck" },
    { name: "Beach Ceremony", date: "2027-01-15", time: "4:00 PM", venue: "Beachfront Gazebo" },
    { name: "Reception Dinner", date: "2027-01-15", time: "8:00 PM", venue: "Palm Garden" },
  ],
};

function getPreview(slug: string) {
  if (slug === "mangal-utsav" || slug === "anand-karaj" || slug === "nikah-nazm")
    return <MangalUtsav couple={hindoDemo} />;
  if (slug === "eternal-bloom" || slug === "sacred-vows" || slug === "paper-and-petals")
    return <EternalBloom couple={modernDemo} />;
  if (slug === "azure-shore" || slug === "onyx-and-gold")
    return <AzureShore couple={beachDemo} />;
  return <MangalUtsav couple={hindoDemo} />;
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const { id } = use(params);
  const template = getTemplateBySlug(id);
  if (!template) notFound();

  return (
    <div className="relative">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center gap-4 h-[72px]">
        <Link href="/catalog" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-black transition-colors shrink-0">
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{template.name}</p>
          <div className="flex items-center gap-1">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span className="text-xs text-gray-500">{template.rating} · {template.reviewCount} reviews</span>
          </div>
        </div>
        <span className="hidden sm:block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full shrink-0">
          🔒 Watermarked preview
        </span>
      </div>

      <WatermarkOverlay />

      <div className="pt-[72px]" onContextMenu={(e) => e.preventDefault()}>
        {getPreview(id)}
      </div>

      {/* Sticky Buy Now */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-500">{template.name} · {template.tier}</p>
            <p className="text-xl font-bold text-gray-900">₹{template.price.toLocaleString("en-IN")}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {["No watermark", "Live URL", "WhatsApp share"].map((f) => (
                <span key={f} className="text-xs text-emerald-700 flex items-center gap-0.5">
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

      <div className="h-32" />
    </div>
  );
}