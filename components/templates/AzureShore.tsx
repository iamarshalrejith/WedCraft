"use client";

import { useEffect, useState, useRef } from "react";
import { CoupleDetails } from "@/types/invite";
import { formatWeddingDate } from "@/lib/invite-utils";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Calendar, Clock, Waves } from "lucide-react";

interface AzureShoreProps {
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{
        width: 68, height: 68,
        borderRadius: 16,
        background: "rgba(255,255,255,0.15)",
        border: "1px solid rgba(255,255,255,0.3)",
        backdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Josefin Sans', sans-serif",
        fontSize: 28, fontWeight: 700,
        color: "#fff",
      }}>
        {String(v).padStart(2, "0")}
      </div>
      <span style={{ fontSize: 10, letterSpacing: "0.25em", color: "rgba(255,255,255,0.65)", textTransform: "uppercase" as const, fontFamily: "'Josefin Sans', sans-serif" }}>
        {l}
      </span>
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
      <Box v={t.d} l="Days" />
      <Box v={t.h} l="Hours" />
      <Box v={t.m} l="Mins" />
      <Box v={t.s} l="Secs" />
    </div>
  );
}

// ─── Scroll reveal ────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Wave divider SVG ─────────────────────────────────────────────────────
const WaveDivider = ({ flip = false, color = "rgba(255,255,255,0.08)" }: { flip?: boolean; color?: string }) => (
  <div style={{ transform: flip ? "scaleY(-1)" : "none", lineHeight: 0 }}>
    <svg viewBox="0 0 1200 80" width="100%" preserveAspectRatio="none" style={{ display: "block" }}>
      <path
        d="M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 L1200,80 L0,80 Z"
        fill={color}
      />
    </svg>
  </div>
);

// ─── Animated wave lines ──────────────────────────────────────────────────
const AnimatedWaves = () => (
  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, overflow: "hidden", lineHeight: 0 }}>
    <svg viewBox="0 0 1200 120" width="100%" preserveAspectRatio="none" style={{ display: "block" }}>
      <motion.path
        d="M0,60 C150,100 350,20 600,60 C850,100 1050,20 1200,60 L1200,120 L0,120 Z"
        fill="rgba(255,255,255,0.06)"
        animate={{ d: [
          "M0,60 C150,100 350,20 600,60 C850,100 1050,20 1200,60 L1200,120 L0,120 Z",
          "M0,70 C200,30 400,90 600,50 C800,10 1000,70 1200,50 L1200,120 L0,120 Z",
          "M0,60 C150,100 350,20 600,60 C850,100 1050,20 1200,60 L1200,120 L0,120 Z",
        ]}}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M0,80 C200,40 400,100 600,70 C800,40 1000,90 1200,65 L1200,120 L0,120 Z"
        fill="rgba(255,255,255,0.04)"
        animate={{ d: [
          "M0,80 C200,40 400,100 600,70 C800,40 1000,90 1200,65 L1200,120 L0,120 Z",
          "M0,65 C180,95 380,40 600,80 C820,120 1020,50 1200,75 L1200,120 L0,120 Z",
          "M0,80 C200,40 400,100 600,70 C800,40 1000,90 1200,65 L1200,120 L0,120 Z",
        ]}}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </svg>
  </div>
);

// ─── Seashell / compass SVG motif ─────────────────────────────────────────
const CompassRose = ({ size = 60, opacity = 0.25 }: { size?: number; opacity?: number }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ opacity }}>
    <circle cx="30" cy="30" r="28" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
    <circle cx="30" cy="30" r="20" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
    <circle cx="30" cy="30" r="3" fill="rgba(255,255,255,0.8)" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <line key={i}
        x1="30" y1="30"
        x2={30 + 20 * Math.sin((angle * Math.PI) / 180)}
        y2={30 - 20 * Math.cos((angle * Math.PI) / 180)}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth={i % 2 === 0 ? "1" : "0.5"}
      />
    ))}
    {/* N S E W labels */}
    <text x="30" y="7" textAnchor="middle" fill="rgba(255,255,255,0.8)" style={{ fontSize: 7, fontFamily: "sans-serif" }}>N</text>
    <text x="30" y="56" textAnchor="middle" fill="rgba(255,255,255,0.5)" style={{ fontSize: 6, fontFamily: "sans-serif" }}>S</text>
    <text x="53" y="33" textAnchor="middle" fill="rgba(255,255,255,0.5)" style={{ fontSize: 6, fontFamily: "sans-serif" }}>E</text>
    <text x="7" y="33" textAnchor="middle" fill="rgba(255,255,255,0.5)" style={{ fontSize: 6, fontFamily: "sans-serif" }}>W</text>
  </svg>
);

export default function AzureShore({ couple }: AzureShoreProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const handleWhatsAppRSVP = () => {
    const phone = couple.phone?.replace(/\D/g, "");
    const msg = encodeURIComponent(
      `Hey! 🌊 We would love to attend the wedding of ${couple.groomName} & ${couple.brideName} on ${formatWeddingDate(couple.weddingDate)}.`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  const allEvents = couple.events?.length > 0
    ? couple.events
    : [{ name: "Wedding Ceremony", date: couple.weddingDate, time: couple.weddingTime, venue: couple.venue }];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Parisienne&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes bubbleRise {
          0%   { transform: translateY(0) scale(1); opacity: 0.6; }
          100% { transform: translateY(-110vh) scale(0.3); opacity: 0; }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.8; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", fontFamily: "'Josefin Sans', sans-serif", overflowX: "hidden" }}
        onContextMenu={(e) => e.preventDefault()}>

        {/* ── SECTION 1 — Hero ─────────────────────────────────── */}
        <section style={{
          position: "relative",
          minHeight: "100vh",
          background: "linear-gradient(175deg, #0A3D5C 0%, #0E5C82 25%, #1A7FA6 50%, #0D9488 80%, #065F46 100%)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "80px 24px 120px",
          textAlign: "center",
          overflow: "hidden",
        }}>
          {/* Bubble particles */}
          {mounted && Array.from({ length: 14 }).map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              bottom: -20,
              left: `${4 + i * 6.8}%`,
              width: 4 + (i % 4) * 3,
              height: 4 + (i % 4) * 3,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
              animation: `bubbleRise ${4 + (i % 5)}s ease-in ${i * 0.5}s infinite`,
              pointerEvents: "none",
            }} />
          ))}

          {/* Compass decoration */}
          <div style={{ position: "absolute", top: 20, right: 20 }}>
            <CompassRose size={80} opacity={0.2} />
          </div>
          <div style={{ position: "absolute", bottom: 100, left: 16 }}>
            <CompassRose size={50} opacity={0.12} />
          </div>

          <Reveal>
            <div style={{ marginBottom: 20 }}>
              <Waves size={28} color="rgba(255,255,255,0.5)" />
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <p style={{ fontSize: 11, letterSpacing: "0.45em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase" as const, marginBottom: 20 }}>
              Destination Wedding
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <h1 style={{
              fontFamily: "'Parisienne', cursive",
              fontSize: "clamp(3rem, 10vw, 5.5rem)",
              color: "#fff",
              lineHeight: 1,
              marginBottom: 0,
              textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            }}>
              {couple.groomName}
            </h1>
          </Reveal>

          <Reveal delay={0.22}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "10px 0" }}>
              <div style={{ height: 1, width: 40, background: "rgba(255,255,255,0.3)" }} />
              <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, letterSpacing: "0.4em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase" as const }}>
                & 
              </span>
              <div style={{ height: 1, width: 40, background: "rgba(255,255,255,0.3)" }} />
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <h1 style={{
              fontFamily: "'Parisienne', cursive",
              fontSize: "clamp(3rem, 10vw, 5.5rem)",
              color: "#7FDBCA",
              lineHeight: 1,
              marginBottom: 32,
              textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            }}>
              {couple.brideName}
            </h1>
          </Reveal>

          <Reveal delay={0.4}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 24px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 40,
              backdropFilter: "blur(10px)",
            }}>
              <Calendar size={13} color="rgba(255,255,255,0.7)" />
              <span style={{ fontSize: 14, color: "#fff", letterSpacing: "0.05em" }}>
                {formatWeddingDate(couple.weddingDate)}
              </span>
              <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{couple.weddingTime}</span>
            </div>
          </Reveal>

          <Reveal delay={0.5}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 10 }}>
              {couple.venue}
            </p>
          </Reveal>

          <AnimatedWaves />
        </section>

        {/* ── SECTION 2 — Message ───────────────────────────────── */}
        <section style={{
          background: "linear-gradient(180deg, #0A3D5C 0%, #0C3048 100%)",
          padding: "60px 24px",
          textAlign: "center",
          maxWidth: 520,
          margin: "0 auto",
        }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 28 }}>
              <div style={{ height: 1, flex: 1, background: "linear-gradient(to right, transparent, rgba(127,219,202,0.3))" }} />
              <Waves size={18} color="rgba(127,219,202,0.5)" />
              <div style={{ height: 1, flex: 1, background: "linear-gradient(to left, transparent, rgba(127,219,202,0.3))" }} />
            </div>

            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.8)",
              lineHeight: 1.9,
            }}>
              {couple.personalMessage
                ? `"${couple.personalMessage}"`
                : `"With the ocean as our witness and love as our compass, we invite you to celebrate the beginning of our forever."`}
            </p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 28 }}>
              <div style={{ height: 1, flex: 1, background: "linear-gradient(to right, transparent, rgba(127,219,202,0.3))" }} />
              <Waves size={18} color="rgba(127,219,202,0.5)" />
              <div style={{ height: 1, flex: 1, background: "linear-gradient(to left, transparent, rgba(127,219,202,0.3))" }} />
            </div>
          </Reveal>
        </section>

        {/* ── SECTION 3 — Events ───────────────────────────────── */}
        <section style={{
          background: "#071E2E",
          padding: "60px 24px",
          maxWidth: 560,
          margin: "0 auto",
        }}>
          <Reveal>
            <h2 style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontSize: 11, letterSpacing: "0.4em",
              color: "rgba(127,219,202,0.7)", textTransform: "uppercase" as const,
              textAlign: "center", marginBottom: 36,
            }}>
              The Itinerary
            </h2>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {allEvents.map((event, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(127,219,202,0.15)",
                  borderRadius: 18,
                  padding: "24px 24px",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: 16,
                  alignItems: "start",
                }}>
                  {/* Number badge */}
                  <div style={{
                    width: 36, height: 36,
                    borderRadius: "50%",
                    background: "rgba(127,219,202,0.1)",
                    border: "1px solid rgba(127,219,202,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontSize: 13, fontWeight: 700,
                    color: "#7FDBCA",
                    flexShrink: 0,
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 600, fontSize: 16, color: "#fff", marginBottom: 8, letterSpacing: "0.05em" }}>
                      {event.name.toUpperCase()}
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <Calendar size={12} color="rgba(127,219,202,0.6)" />
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{formatWeddingDate(event.date)}</span>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <Clock size={12} color="rgba(127,219,202,0.6)" />
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{event.time}</span>
                      </div>
                      {event.venue && (
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <MapPin size={12} color="rgba(127,219,202,0.6)" />
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{event.venue}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── SECTION 4 — Venue ────────────────────────────────── */}
        <section style={{ background: "#071E2E", padding: "20px 24px 60px", maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <h2 style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, letterSpacing: "0.4em", color: "rgba(127,219,202,0.7)", textTransform: "uppercase" as const, marginBottom: 24 }}>
              Location
            </h2>
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(127,219,202,0.15)",
              borderRadius: 22,
              padding: "32px 24px",
            }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(127,219,202,0.1)", border: "1px solid rgba(127,219,202,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <MapPin size={18} color="#7FDBCA" />
              </div>
              <h3 style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 600, fontSize: 18, color: "#fff", marginBottom: 8 }}>
                {couple.venue}
              </h3>
              {couple.venueAddress && (
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, marginBottom: 20 }}>
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
                    padding: "10px 24px",
                    background: "transparent",
                    border: "1px solid rgba(127,219,202,0.5)",
                    borderRadius: 40,
                    color: "#7FDBCA",
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textDecoration: "none",
                    textTransform: "uppercase" as const,
                  }}
                >
                  <MapPin size={12} /> Get Directions
                </a>
              )}
            </div>
          </Reveal>
        </section>

        {/* ── SECTION 5 — Countdown ────────────────────────────── */}
        <section style={{
          background: "linear-gradient(180deg, #071E2E 0%, #0A3D5C 100%)",
          padding: "60px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <WaveDivider color="rgba(255,255,255,0.04)" />
          <Reveal>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 20, color: "rgba(255,255,255,0.6)", marginBottom: 32 }}>
              Setting sail for forever in
            </p>
            <Countdown targetDate={couple.weddingDate} />
          </Reveal>
        </section>

        {/* ── SECTION 6 — RSVP ─────────────────────────────────── */}
        <section style={{
          background: "linear-gradient(180deg, #0A3D5C 0%, #0A2A3F 100%)",
          padding: "60px 24px 80px",
          textAlign: "center",
          maxWidth: 480,
          margin: "0 auto",
        }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <CompassRose size={60} opacity={0.3} />
            </div>

            <h2 style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 700, fontSize: 22, letterSpacing: "0.15em", color: "#fff", marginBottom: 10 }}>
              RSVP
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: 28 }}>
              Come sail away with us.<br />
              Let us know you&apos;re coming.
            </p>

            {couple.phone && (
              <button
                onClick={handleWhatsAppRSVP}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "15px 36px",
                  background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
                  borderRadius: 50,
                  border: "none",
                  color: "#fff",
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: 12,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase" as const,
                  cursor: "pointer",
                  boxShadow: "0 8px 24px rgba(13,148,136,0.3)",
                }}
              >
                <Phone size={14} />
                RSVP via WhatsApp
              </button>
            )}

            <div style={{ marginTop: 48 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 12 }}>
                <div style={{ height: 1, width: 28, background: "rgba(127,219,202,0.2)" }} />
                <Waves size={14} color="rgba(127,219,202,0.4)" />
                <div style={{ height: 1, width: 28, background: "rgba(127,219,202,0.2)" }} />
              </div>
              <p style={{ fontFamily: "'Parisienne', cursive", fontSize: 22, color: "#7FDBCA" }}>
                {couple.groomName} & {couple.brideName}
              </p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: "0.25em", textTransform: "uppercase" as const, marginTop: 8 }}>
                Made with WedCraft
              </p>
            </div>
          </Reveal>
        </section>
      </div>
    </>
  );
}