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
import NikahNazm from "@/components/templates/NikahNazm";
import OnyxGold from "@/components/templates/OnyxGold";
import AnandKaraj from "@/components/templates/AnandKaraj";
import SacredVows from "@/components/templates/SacredVows";
import PaperPetals from "@/components/templates/PaperPetals";
import { CoupleDetails } from "@/types/invite";

interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

// Light-background templates need dark watermark text
const LIGHT_BG_TEMPLATES = ["eternal-bloom", "sacred-vows", "paper-and-petals"];

const WatermarkOverlay = ({ lightBg = false }: { lightBg?: boolean }) => (
  <div className="fixed inset-0 z-20 pointer-events-none overflow-hidden select-none" aria-hidden="true">
    {Array.from({ length: 14 }).map((_, row) =>
      Array.from({ length: 10 }).map((_, col) => (
        <div key={`${row}-${col}`} className="absolute"
          style={{ top: `${row * 140 - 40}px`, left: `${col * 260 - 20}px`, transform: "rotate(-35deg)" }}>
          <span style={{ display: "block", fontSize: 22, fontWeight: 700, letterSpacing: "0.2em", whiteSpace: "nowrap", color: "#000", opacity: lightBg ? 0.12 : 0.05 }}>
            WEDCRAFT PREVIEW
          </span>
          <span style={{ display: "block", fontSize: 22, fontWeight: 700, letterSpacing: "0.2em", whiteSpace: "nowrap", color: "#fff", opacity: lightBg ? 0.04 : 0.12, marginTop: -26 }}>
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

// Demo data for each template style
const hinduDemo: CoupleDetails = { groomName: "Aravind", brideName: "Aarathi", weddingDate: "2026-12-12", weddingTime: "7:00 PM", venue: "Grand Palace Banquet Hall", venueAddress: "NH-16, Bayyavaram, Anakapalli", mapLink: "https://maps.google.com", phone: "+919876543210", personalMessage: "Two souls, one heartbeat. We are overjoyed to begin this journey together.", events: [{ name: "Mehendi & Haldi", date: "2026-12-10", time: "4:00 PM", venue: "Bride's Residence" }, { name: "Sangeet Night", date: "2026-12-11", time: "7:00 PM", venue: "Grand Palace - Hall B" }, { name: "Wedding Ceremony", date: "2026-12-12", time: "7:00 PM", venue: "Grand Palace - Main Hall" }] };
const modernDemo: CoupleDetails = { groomName: "Arjun", brideName: "Meera", weddingDate: "2026-11-20", weddingTime: "5:30 PM", venue: "The Ivy Gardens", venueAddress: "12 Blossom Lane, Bangalore", mapLink: "https://maps.google.com", phone: "+919876543210", personalMessage: "Two hearts, one love. We invite you to share in the beginning of our greatest adventure.", events: [{ name: "Bridal Shower", date: "2026-11-18", time: "3:00 PM", venue: "Bride's Home" }, { name: "Cocktail Evening", date: "2026-11-19", time: "6:00 PM", venue: "The Ivy Terrace" }, { name: "Wedding Ceremony", date: "2026-11-20", time: "5:30 PM", venue: "The Ivy Gardens" }] };
const beachDemo: CoupleDetails = { groomName: "Kiran", brideName: "Nadia", weddingDate: "2027-01-15", weddingTime: "4:00 PM", venue: "Tide & Palms Beach Resort", venueAddress: "Beachfront Road, Goa", mapLink: "https://maps.google.com", phone: "+919876543210", personalMessage: "With the ocean as our witness and love as our compass, we invite you to celebrate our forever.", events: [{ name: "Welcome Sundowner", date: "2027-01-14", time: "6:00 PM", venue: "Pool Deck" }, { name: "Beach Ceremony", date: "2027-01-15", time: "4:00 PM", venue: "Beachfront Gazebo" }, { name: "Reception Dinner", date: "2027-01-15", time: "8:00 PM", venue: "Palm Garden" }] };
const nikahDemo: CoupleDetails = { groomName: "Zaid", brideName: "Ayesha", weddingDate: "2026-10-10", weddingTime: "11:00 AM", venue: "Al Noor Convention Hall", venueAddress: "Banjara Hills, Hyderabad", mapLink: "https://maps.google.com", phone: "+919876543210", personalMessage: "And of His signs is that He created for you mates that you may find tranquillity in them.", events: [{ name: "Nikah Ceremony", date: "2026-10-10", time: "11:00 AM", venue: "Al Noor Convention Hall" }, { name: "Walima Reception", date: "2026-10-11", time: "7:00 PM", venue: "Al Noor Banquet" }] };
const luxuryDemo: CoupleDetails = { groomName: "Rohan", brideName: "Ananya", weddingDate: "2027-02-14", weddingTime: "7:30 PM", venue: "The Leela Palace", venueAddress: "MG Road, Bengaluru", mapLink: "https://maps.google.com", phone: "+919876543210", personalMessage: "To love and be loved is everything. We invite you to witness the most beautiful chapter of our story.", events: [{ name: "Cocktail Reception", date: "2027-02-14", time: "6:00 PM", venue: "The Leela Terrace" }, { name: "Wedding Ceremony", date: "2027-02-14", time: "7:30 PM", venue: "The Grand Ballroom" }, { name: "Dinner & Dancing", date: "2027-02-14", time: "9:30 PM", venue: "The Grand Ballroom" }] };
const sikhDemo: CoupleDetails = { groomName: "Harpreet", brideName: "Simran", weddingDate: "2026-11-05", weddingTime: "10:00 AM", venue: "Guru Nanak Darbar Gurdwara", venueAddress: "Sector 17, Chandigarh", mapLink: "https://maps.google.com", phone: "+919876543210", personalMessage: "With Waheguru's blessings, we joyfully invite you to celebrate our Anand Karaj.", events: [{ name: "Vatna Ceremony", date: "2026-11-04", time: "5:00 PM", venue: "Groom's Residence" }, { name: "Anand Karaj", date: "2026-11-05", time: "10:00 AM", venue: "Guru Nanak Darbar Gurdwara" }, { name: "Reception", date: "2026-11-05", time: "7:00 PM", venue: "Celebration Banquet" }] };
const christianDemo: CoupleDetails = { groomName: "Thomas", brideName: "Grace", weddingDate: "2027-03-20", weddingTime: "3:00 PM", venue: "St. Mary's Church", venueAddress: "Church Road, Kochi, Kerala", mapLink: "https://maps.google.com", phone: "+919876543210", personalMessage: "In God's grace, two hearts become one. We invite you to celebrate with us.", events: [{ name: "Holy Matrimony", date: "2027-03-20", time: "3:00 PM", venue: "St. Mary's Church" }, { name: "Reception Dinner", date: "2027-03-20", time: "7:00 PM", venue: "Royal Garden Convention" }] };
const minimalDemo: CoupleDetails = { groomName: "Vikram", brideName: "Priya", weddingDate: "2026-09-15", weddingTime: "6:00 PM", venue: "The Studio, Bangalore", venueAddress: "Indiranagar, Bangalore", mapLink: "https://maps.google.com", phone: "+919876543210", personalMessage: "Simple. Beautiful. Ours.", events: [{ name: "Wedding Ceremony", date: "2026-09-15", time: "6:00 PM", venue: "The Studio" }, { name: "Dinner Reception", date: "2026-09-15", time: "8:00 PM", venue: "The Rooftop" }] };

function getPreview(slug: string) {
  switch (slug) {
    case "mangal-utsav":     return <MangalUtsav couple={hinduDemo} />;
    case "eternal-bloom":    return <EternalBloom couple={modernDemo} />;
    case "azure-shore":      return <AzureShore couple={beachDemo} />;
    case "nikah-nazm":       return <NikahNazm couple={nikahDemo} />;
    case "onyx-and-gold":    return <OnyxGold couple={luxuryDemo} />;
    case "anand-karaj":      return <AnandKaraj couple={sikhDemo} />;
    case "sacred-vows":      return <SacredVows couple={christianDemo} />;
    case "paper-and-petals": return <PaperPetals couple={minimalDemo} />;
    default:                 return <MangalUtsav couple={hinduDemo} />;
  }
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const { id } = use(params);
  const template = getTemplateBySlug(id);
  if (!template) notFound();

  return (
    <div className="relative">
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
        <span className="hidden sm:block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full shrink-0">🔒 Watermarked preview</span>
      </div>

      <WatermarkOverlay lightBg={LIGHT_BG_TEMPLATES.includes(id)} />

      <div  onContextMenu={(e) => e.preventDefault()}>
        {getPreview(id)}
      </div>

      <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-500">{template.name} · {template.tier}</p>
            <p className="text-xl font-bold text-gray-900">₹{template.price.toLocaleString("en-IN")}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {["No watermark", "Live URL", "WhatsApp share"].map((f) => (
                <span key={f} className="text-xs text-emerald-700 flex items-center gap-0.5"><Check size={10} /> {f}</span>
              ))}
            </div>
          </div>
          <Link href={`/checkout/${template.slug}`}
            className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 active:scale-95 transition-all shrink-0">
            <ShoppingCart size={16} /> Buy Now
          </Link>
        </div>
      </motion.div>
      <div className="h-32" />
    </div>
  );
}