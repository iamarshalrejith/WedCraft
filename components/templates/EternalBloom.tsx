"use client";

import { useEffect, useState, useRef } from "react";
import { CoupleDetails } from "@/types/invite";
import { formatWeddingDate } from "@/lib/invite-utils";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Calendar, Clock } from "lucide-react";
import RSVPForm from "@/components/rsvp/RSVPForm";

interface EternalBloomProps {
  couple: CoupleDetails;
}

// ─── Countdown ────────────────────────────────────────────────────────────
function Countdown({ targetDate }: { targetDate: string }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return;
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const Box = ({ v, l }: { v: number; l: string }) => (
    <div className="flex flex-col items-center gap-2">
      <div style={{
        background: "rgba(255,255,255,0.9)",
        border: "1px solid rgba(180,140,120,0.3)",
        borderRadius: 16,
        width: 64, height: 64,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Playfair Display', serif",
        fontSize: 26, fontWeight: 500,
        color: "#7C4D3A",
        boxShadow: "0 4px 20px rgba(180,140,120,0.12)",
      }}>
        {String(v).padStart(2, "0")}
      </div>
      <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, letterSpacing: "0.2em", color: "#A0816E", textTransform: "uppercase" as const }}>
        {l}
      </span>
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
      <Box v={t.d} l="Days" />
      <Box v={t.h} l="Hours" />
      <Box v={t.m} l="Mins" />
      <Box v={t.s} l="Secs" />
    </div>
  );
}

// ─── Fade in on scroll ────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Botanical leaf SVG decoration ────────────────────────────────────────
const LeafLeft = ({ opacity = 0.15 }: { opacity?: number }) => (
  <svg width="120" height="160" viewBox="0 0 120 160" fill="none" style={{ opacity }}>
    <path d="M60 150 C20 120, 5 80, 10 40 C15 10, 40 5, 60 20 C80 5, 105 10, 110 40 C115 80, 100 120, 60 150Z"
      fill="#6B8F6B" />
    <path d="M60 150 L60 20" stroke="#4A6741" strokeWidth="1" />
    <path d="M60 80 C40 70, 25 55, 15 40" stroke="#4A6741" strokeWidth="0.8" fill="none" />
    <path d="M60 80 C80 70, 95 55, 105 40" stroke="#4A6741" strokeWidth="0.8" fill="none" />
    <path d="M60 110 C45 100, 30 88, 22 75" stroke="#4A6741" strokeWidth="0.8" fill="none" />
    <path d="M60 110 C75 100, 90 88, 98 75" stroke="#4A6741" strokeWidth="0.8" fill="none" />
  </svg>
);

const FloralDivider = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, margin: "28px 0" }}>
    <div style={{ height: 1, flex: 1, background: "linear-gradient(to right, transparent, rgba(180,140,120,0.4))" }} />
    <svg width="28" height="28" viewBox="0 0 28 28">
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <ellipse key={i} cx="14" cy="14" rx="4" ry="8"
          transform={`rotate(${angle} 14 14)`}
          fill="#D4917A" opacity="0.6" />
      ))}
      <circle cx="14" cy="14" r="3" fill="#C47860" />
    </svg>
    <div style={{ height: 1, flex: 1, background: "linear-gradient(to left, transparent, rgba(180,140,120,0.4))" }} />
  </div>
);

export default function EternalBloom({ couple }: EternalBloomProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const handleWhatsAppRSVP = () => {
    const phone = couple.phone?.replace(/\D/g, "");
    const msg = encodeURIComponent(
      `Hello! 🌸 We'd love to attend the wedding of ${couple.groomName} & ${couple.brideName} on ${formatWeddingDate(couple.weddingDate)}.`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  const allEvents = couple.events?.length > 0
    ? couple.events
    : [{ name: "Wedding Ceremony", date: couple.weddingDate, time: couple.weddingTime, venue: couple.venue }];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Lato:wght@300;400&family=Cormorant+Garamond:ital,wght@0,300;1,400&family=Great+Vibes&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes floatUp { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes petalDrift {
          0%   { transform: translateY(-10px) rotate(0deg) translateX(0); opacity: 0.8; }
          100% { transform: translateY(105vh) rotate(540deg) translateX(40px); opacity: 0; }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #FDF8F4 0%, #FAF0E8 30%, #F5EBE0 60%, #EEE5D8 100%)",
          fontFamily: "'Lato', sans-serif",
          overflowX: "hidden",
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* ── Floating petals ─────────────────────────────────────────── */}
        {mounted && Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{
            position: "fixed",
            top: -20,
            left: `${5 + i * 9}%`,
            width: i % 3 === 0 ? 12 : 8,
            height: i % 3 === 0 ? 16 : 11,
            borderRadius: "50% 0 50% 0",
            background: i % 2 === 0 ? "#F2B8A8" : "#E8A090",
            opacity: 0.55,
            animation: `petalDrift ${5 + (i % 4)}s linear ${i * 0.6}s infinite`,
            pointerEvents: "none",
            zIndex: 1,
          }} />
        ))}

        {/* ── SECTION 1 — Hero ────────────────────────────────────────── */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px 60px", textAlign: "center" }}>

          {/* Corner botanical decorations */}
          <div style={{ position: "absolute", top: 0, left: 0, transform: "rotate(0deg)" }}>
            <LeafLeft opacity={0.18} />
          </div>
          <div style={{ position: "absolute", top: 0, right: 0, transform: "scaleX(-1)" }}>
            <LeafLeft opacity={0.18} />
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, transform: "rotate(180deg) scaleX(-1)" }}>
            <LeafLeft opacity={0.12} />
          </div>
          <div style={{ position: "absolute", bottom: 0, right: 0, transform: "rotate(180deg)" }}>
            <LeafLeft opacity={0.12} />
          </div>

          {/* Together since */}
          <Reveal>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, letterSpacing: "0.35em", color: "#A0816E", textTransform: "uppercase", marginBottom: 20 }}>
              Together Forever
            </p>
          </Reveal>

          {/* Groom name */}
          <Reveal delay={0.1}>
            <h1 style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: "clamp(3rem, 10vw, 5.5rem)",
              color: "#5C3D2E",
              lineHeight: 1.1,
              marginBottom: 4,
            }}>
              {couple.groomName}
            </h1>
          </Reveal>

          {/* & */}
          <Reveal delay={0.2}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "8px 0" }}>
              <div style={{ height: 1, width: 48, background: "rgba(180,140,120,0.4)" }} />
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#C47860", fontStyle: "italic" }}>
                and
              </span>
              <div style={{ height: 1, width: 48, background: "rgba(180,140,120,0.4)" }} />
            </div>
          </Reveal>

          {/* Bride name */}
          <Reveal delay={0.3}>
            <h1 style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: "clamp(3rem, 10vw, 5.5rem)",
              color: "#C47860",
              lineHeight: 1.1,
              marginBottom: 28,
            }}>
              {couple.brideName}
            </h1>
          </Reveal>

          {/* Date pill */}
          <Reveal delay={0.4}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 28px",
              background: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(180,140,120,0.25)",
              borderRadius: 40,
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 24px rgba(180,140,120,0.1)",
            }}>
              <Calendar size={14} color="#A0816E" />
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "#7C4D3A" }}>
                {formatWeddingDate(couple.weddingDate)}
              </span>
              <span style={{ color: "rgba(160,129,110,0.4)", fontSize: 12 }}>·</span>
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#A0816E" }}>
                {couple.weddingTime}
              </span>
            </div>
          </Reveal>

          {/* Venue sub */}
          <Reveal delay={0.5}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#B09080", marginTop: 12 }}>
              {couple.venue}
            </p>
          </Reveal>

          {/* Scroll cue */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            style={{ position: "absolute", bottom: 32, color: "#C47860", opacity: 0.5, fontSize: 20 }}
          >
            ↓
          </motion.div>
        </section>

        {/* ── SECTION 2 — Personal message ─────────────────────────── */}
        <section style={{ padding: "60px 24px", maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <FloralDivider />
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20,
              fontStyle: "italic",
              color: "#7C4D3A",
              lineHeight: 1.9,
            }}>
              {couple.personalMessage
                ? `"${couple.personalMessage}"`
                : `"Two hearts, one love. With full hearts and great joy, we invite you to share in the beginning of our greatest adventure."`}
            </p>
            <FloralDivider />
          </Reveal>
        </section>

        {/* ── SECTION 3 — Events ───────────────────────────────────── */}
        <section style={{ padding: "40px 24px 60px", maxWidth: 560, margin: "0 auto" }}>
          <Reveal>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 13, letterSpacing: "0.3em",
              color: "#A0816E", textTransform: "uppercase" as const,
              textAlign: "center", marginBottom: 36,
            }}>
              Celebrations
            </h2>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {allEvents.map((event, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{
                  background: "rgba(255,255,255,0.75)",
                  border: "1px solid rgba(180,140,120,0.2)",
                  borderRadius: 20,
                  padding: "28px 28px",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 4px 24px rgba(180,140,120,0.08)",
                  display: "flex",
                  gap: 20,
                  alignItems: "flex-start",
                }}>
                  {/* Left accent line */}
                  <div style={{ width: 3, borderRadius: 4, background: "linear-gradient(to bottom, #D4917A, #C47860)", minHeight: 60, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, color: "#5C3D2E", marginBottom: 10 }}>
                      {event.name}
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Calendar size={13} color="#A0816E" />
                        <span style={{ fontSize: 14, color: "#7C4D3A" }}>{formatWeddingDate(event.date)}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Clock size={13} color="#A0816E" />
                        <span style={{ fontSize: 14, color: "#7C4D3A" }}>{event.time}</span>
                      </div>
                      {event.venue && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <MapPin size={13} color="#A0816E" />
                          <span style={{ fontSize: 13, color: "#A0816E" }}>{event.venue}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── SECTION 4 — Venue ────────────────────────────────────── */}
        <section style={{ padding: "20px 24px 60px", maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 13, letterSpacing: "0.3em",
              color: "#A0816E", textTransform: "uppercase" as const,
              marginBottom: 28,
            }}>
              Venue
            </h2>

            <div style={{
              background: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(180,140,120,0.2)",
              borderRadius: 24,
              padding: "36px 28px",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(180,140,120,0.1)",
            }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(212,145,122,0.12)", border: "1px solid rgba(196,120,96,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <MapPin size={20} color="#C47860" />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#5C3D2E", marginBottom: 8 }}>
                {couple.venue}
              </h3>
              {couple.venueAddress && (
                <p style={{ fontSize: 14, color: "#A0816E", lineHeight: 1.8, marginBottom: 20 }}>
                  {couple.venueAddress}
                </p>
              )}
              {couple.mapLink && (
                <a
                  href={couple.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "11px 26px",
                    background: "#C47860",
                    borderRadius: 40,
                    color: "#fff",
                    fontSize: 12,
                    fontFamily: "'Lato', sans-serif",
                    letterSpacing: "0.12em",
                    textDecoration: "none",
                    textTransform: "uppercase" as const,
                  }}
                >
                  <MapPin size={13} /> View on Maps
                </a>
              )}
            </div>
          </Reveal>
        </section>

        {/* ── SECTION 5 — Countdown ─────────────────────────────────── */}
        <section style={{ padding: "20px 24px 60px", textAlign: "center" }}>
          <Reveal>
            <div style={{ maxWidth: 480, margin: "0 auto" }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 22, color: "#7C4D3A", marginBottom: 32 }}>
                Counting the days until &ldquo;I do&rdquo;
              </p>
              <Countdown targetDate={couple.weddingDate} />
            </div>
          </Reveal>
        </section>

        {/* ── SECTION 6 — RSVP ─────────────────────────────────────── */}
        <section style={{ padding: "20px 24px 80px", textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
          <Reveal>
            <FloralDivider />

            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#5C3D2E", marginBottom: 12 }}>
              Will you join us?
            </h2>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 14, color: "#A0816E", lineHeight: 1.8, marginBottom: 28 }}>
              Your presence would mean the world to us.<br />
              Please let us know you&apos;re coming.
            </p>

            <div style={{ textAlign: "left", marginBottom: 20 }}>
              <RSVPForm
                inviteSlug={couple.groomName.toLowerCase().replace(/\s+/g,"-") + "-weds-" + couple.brideName.toLowerCase().replace(/\s+/g,"-")}
                coupleName={`${couple.groomName} & ${couple.brideName}`}
                accentColor="#C47860"
                theme="light"
              />
            </div>

            {couple.phone && (
              <button
                onClick={handleWhatsAppRSVP}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 20px",
                  background: "transparent",
                  borderRadius: 50,
                  border: "1px solid rgba(196,120,96,0.4)",
                  color: "#C47860",
                  fontFamily: "'Lato', sans-serif",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                }}
              >
                <Phone size={12} />
                Also WhatsApp us
              </button>
            )}

            <FloralDivider />

            {/* Footer */}
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <div style={{ height: 1, width: 32, background: "rgba(180,140,120,0.3)" }} />
                <span style={{ fontSize: 16, color: "#D4917A" }}>❀</span>
                <div style={{ height: 1, width: 32, background: "rgba(180,140,120,0.3)" }} />
              </div>
              <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 22, color: "#C47860" }}>
                {couple.groomName} & {couple.brideName}
              </p>
              <p style={{ fontSize: 11, color: "#C4A090", letterSpacing: "0.2em", textTransform: "uppercase" as const, marginTop: 6 }}>
                Made with WedCraft
              </p>
            </div>
          </Reveal>
        </section>
      </div>
    </>
  );
}