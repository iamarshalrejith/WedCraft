"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { InviteRecord, CoupleDetails } from "@/types/invite";
import { Heart } from "lucide-react";
import MangalUtsav from "@/components/templates/MangalUtsav";
import EternalBloom from "@/components/templates/EternalBloom";
import AzureShore from "@/components/templates/AzureShore";
import NikahNazm from "@/components/templates/NikahNazm";
import OnyxGold from "@/components/templates/OnyxGold";
import AnandKaraj from "@/components/templates/AnandKaraj";
import SacredVows from "@/components/templates/SacredVows";
import PaperPetals from "@/components/templates/PaperPetals";
import CelestialDream from "@/components/templates/CelestialDream";
import RusticBloom from "@/components/templates/RusticBloom";
import ZenGarden from "@/components/templates/ZenGarden";
import MidnightRose from "@/components/templates/MidnightRose";
import RoyalDurbar from "@/components/templates/RoyalDurbar";
import UrbanChic from "@/components/templates/UrbanChic";
import TropicalParadise from "@/components/templates/TropicalParadise";
import IndianClassic from "@/components/templates/IndianClassic";
import BengaliClassic from "@/components/templates/BengaliClassic";
import SilverScreen from "@/components/templates/SilverScreen";
import GardenParty from "@/components/templates/GardenParty";
import IvoryManuscript from "@/components/templates/IvoryManuscript";
import NeonVows from "@/components/templates/NeonVows";
import VelvetHaveli from "@/components/templates/VelvetHaveli";
import NordicFrost from "@/components/templates/NordicFrost";

interface InvitePageProps { params: Promise<{ slug: string }>; }

function renderTemplate(templateSlug: string, couple: CoupleDetails) {
  switch (templateSlug) {
    case "mangal-utsav":      return <MangalUtsav couple={couple} />;
    case "eternal-bloom":     return <EternalBloom couple={couple} />;
    case "azure-shore":       return <AzureShore couple={couple} />;
    case "nikah-nazm":        return <NikahNazm couple={couple} />;
    case "onyx-and-gold":     return <OnyxGold couple={couple} />;
    case "anand-karaj":       return <AnandKaraj couple={couple} />;
    case "sacred-vows":       return <SacredVows couple={couple} />;
    case "paper-and-petals":  return <PaperPetals couple={couple} />;
    case "celestial-dream":   return <CelestialDream couple={couple} />;
    case "rustic-bloom":      return <RusticBloom couple={couple} />;
    case "zen-garden":        return <ZenGarden couple={couple} />;
    case "midnight-rose":     return <MidnightRose couple={couple} />;
    case "royal-durbar":      return <RoyalDurbar couple={couple} />;
    case "urban-chic":        return <UrbanChic couple={couple} />;
    case "tropical-paradise": return <TropicalParadise couple={couple} />;
    case "indian-classic":    return <IndianClassic couple={couple} />;
    case "bengali-classic":   return <BengaliClassic couple={couple} />;
    case "silver-screen":     return <SilverScreen couple={couple} />;
    case "garden-party":      return <GardenParty couple={couple} />;
    case "ivory-manuscript":  return <IvoryManuscript couple={couple} />;
    case "neon-vows":         return <NeonVows couple={couple} />;
    case "velvet-haveli":     return <VelvetHaveli couple={couple} />;
    case "nordic-frost":      return <NordicFrost couple={couple} />;
    default:                  return <MangalUtsav couple={couple} />;
  }
}

export default function InvitePage({ params }: InvitePageProps) {
  const { slug } = use(params);
  const [invite, setInvite] = useState<InviteRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/save-invite?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.id) {
          data.coupleDetails.slug = data.slug;
          setInvite(data);
          // Track this view (fire and forget)
          fetch("/api/analytics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug }),
          }).catch(() => {});
        } else {
          setInvite(null);
        }
      })
      .catch(() => setInvite(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Heart size={32} className="text-yellow-600 fill-yellow-600 animate-pulse" />
    </div>
  );

  if (!invite) notFound();

  // ── Expiry check — show expired screen if past expiresAt date ───────────────
  if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-5">
            <Heart size={28} className="text-gray-300" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            This invitation has expired
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            The invite for{" "}
            <span className="font-medium text-gray-700">
              {invite.coupleDetails.groomName} & {invite.coupleDetails.brideName}
            </span>{" "}
            is no longer active. The hosting period included in their plan has ended.
          </p>
          <a
            href="https://wedcraft.in"
            className="inline-block bg-black text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Create your own invite →
          </a>
          <p className="text-xs text-gray-400 mt-4">WedCraft · wedcraft.in</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "auto", zIndex: 100 }}>
      {renderTemplate(invite.templateSlug, invite.coupleDetails)}
    </div>
  );
}