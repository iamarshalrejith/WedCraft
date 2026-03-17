"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { InviteRecord } from "@/types/invite";
import { Heart } from "lucide-react";
import MangalUtsav from "@/components/templates/MangalUtsav";
import EternalBloom from "@/components/templates/EternalBloom";
import AzureShore from "@/components/templates/AzureShore";
import { CoupleDetails } from "@/types/invite";

interface InvitePageProps {
  params: Promise<{ slug: string }>;
}

function renderTemplate(templateSlug: string, couple: CoupleDetails) {
  switch (templateSlug) {
    case "mangal-utsav":    return <MangalUtsav couple={couple} />;
    case "eternal-bloom":   return <EternalBloom couple={couple} />;
    case "azure-shore":     return <AzureShore couple={couple} />;
    case "anand-karaj":     return <MangalUtsav couple={couple} />;
    case "nikah-nazm":      return <MangalUtsav couple={couple} />;
    case "sacred-vows":     return <EternalBloom couple={couple} />;
    case "onyx-and-gold":   return <AzureShore couple={couple} />;
    case "paper-and-petals":return <EternalBloom couple={couple} />;
    default:                return <MangalUtsav couple={couple} />;
  }
}

export default function InvitePage({ params }: InvitePageProps) {
  const { slug } = use(params);
  const [invite, setInvite] = useState<InviteRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/save-invite?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => { if (data.id) setInvite(data); else setInvite(null); })
      .catch(() => setInvite(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Heart size={32} className="text-yellow-600 fill-yellow-600 animate-pulse" />
      </div>
    );
  }

  if (!invite) notFound();

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "auto", zIndex: 100 }}>
      {renderTemplate(invite.templateSlug, invite.coupleDetails)}
    </div>
  );
}