"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { InviteRecord } from "@/types/invite";
import { getTemplateById } from "@/data/templates";
import { formatWeddingDate, daysUntil } from "@/lib/invite-utils";
import { MapPin, Calendar, Clock, Phone, Heart, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface InvitePageProps {
  params: Promise<{ slug: string }>;
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0,
  });

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calculate();
    const id = setInterval(calculate, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const Box = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
        <span className="text-2xl font-bold tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs mt-1.5 uppercase tracking-widest opacity-70">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex gap-3 justify-center">
      <Box value={timeLeft.days} label="Days" />
      <Box value={timeLeft.hours} label="Hours" />
      <Box value={timeLeft.minutes} label="Mins" />
      <Box value={timeLeft.seconds} label="Secs" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// The actual rendered invitation — styled based on template
// ---------------------------------------------------------------------------
function InviteView({ invite }: { invite: InviteRecord }) {
  const template = getTemplateById(invite.templateId);
  const { coupleDetails } = invite;
  const primaryColor = template?.colors[0] || "#000000";
  const days = daysUntil(coupleDetails.weddingDate);

  const handleRSVP = () => {
    if (coupleDetails.phone) {
      const msg = encodeURIComponent(
        `Hi! I'm RSVPing for ${coupleDetails.groomName} & ${coupleDetails.brideName}'s wedding on ${formatWeddingDate(coupleDetails.weddingDate)}.`
      );
      window.open(`https://wa.me/${coupleDetails.phone.replace(/\D/g, "")}?text=${msg}`, "_blank");
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${primaryColor}15, #ffffff, ${primaryColor}08)` }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Decorative background circles */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: primaryColor }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: primaryColor }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-lg mx-auto px-6 py-12 text-center">
        {/* Top flourish */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div
            className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4"
            style={{ background: `${primaryColor}20` }}
          >
            <Heart size={28} style={{ color: primaryColor }} className="fill-current" />
          </div>
          <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-1">
            Together with their families
          </p>
          <p className="text-xs text-gray-400 italic">
            joyfully invite you to celebrate the wedding of
          </p>
        </motion.div>

        {/* Names */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-none mb-2">
            {coupleDetails.groomName}
          </h1>
          <p className="text-2xl text-gray-400 font-light my-2">&</p>
          <h1 className="text-5xl md:text-6xl font-bold leading-none" style={{ color: primaryColor }}>
            {coupleDetails.brideName}
          </h1>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <Heart size={14} style={{ color: primaryColor }} className="fill-current opacity-40" />
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Date & Venue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8 space-y-3"
        >
          <div className="flex items-center justify-center gap-2 text-gray-700">
            <Calendar size={16} style={{ color: primaryColor }} />
            <span className="font-semibold">
              {formatWeddingDate(coupleDetails.weddingDate)}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Clock size={16} style={{ color: primaryColor }} />
            <span>{coupleDetails.weddingTime}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <MapPin size={16} style={{ color: primaryColor }} />
            <div className="text-center">
              <p className="font-medium">{coupleDetails.venue}</p>
              {coupleDetails.venueAddress && (
                <p className="text-sm text-gray-400">{coupleDetails.venueAddress}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Countdown */}
        {days > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl p-6 mb-8 text-white"
            style={{ background: primaryColor }}
          >
            <p className="text-xs tracking-widest uppercase opacity-80 mb-4">
              Countdown to our big day
            </p>
            <CountdownTimer targetDate={coupleDetails.weddingDate} />
          </motion.div>
        )}

        {/* Personal message */}
        {coupleDetails.personalMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 mb-8 border border-white/40"
          >
            <p className="text-gray-600 italic text-sm leading-relaxed">
              "{coupleDetails.personalMessage}"
            </p>
          </motion.div>
        )}

        {/* Events */}
        {coupleDetails.events.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 mb-8 border border-white/40 text-left"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 text-center">
              Events Schedule
            </p>
            <div className="space-y-3">
              {coupleDetails.events.map((event, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ background: primaryColor }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{event.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatWeddingDate(event.date)} · {event.time}
                      {event.venue && ` · ${event.venue}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* RSVP & Map Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col gap-3"
        >
          {coupleDetails.phone && (
            <button
              onClick={handleRSVP}
              className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: primaryColor }}
            >
              <Phone size={16} />
              RSVP via WhatsApp
            </button>
          )}
          {coupleDetails.mapLink && (
            <a
              href={coupleDetails.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-2xl border-2 font-semibold text-sm flex items-center justify-center gap-2 transition-colors hover:bg-gray-50"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              <MapPin size={16} />
              Get Directions
            </a>
          )}
        </motion.div>

        {/* Powered by WedCraft */}
        <div className="mt-12 flex items-center justify-center gap-2 text-xs text-gray-300">
          <Heart size={10} className="fill-current" />
          <span>Made with WedCraft</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page wrapper — fetches invite data then renders
// ---------------------------------------------------------------------------
export default function InvitePage({ params }: InvitePageProps) {
  const { slug } = use(params);
  const [invite, setInvite] = useState<InviteRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/save-invite?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.id) setInvite(data);
        else setInvite(null);
      })
      .catch(() => setInvite(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Heart size={32} className="text-rose-400 fill-rose-400 animate-pulse" />
      </div>
    );
  }

  if (!invite) notFound();

  return <InviteView invite={invite} />;
}