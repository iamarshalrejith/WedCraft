"use client";

import { useEffect, useState, useRef } from "react";
import { CoupleDetails } from "@/types/invite";
import { formatWeddingDate } from "@/lib/invite-utils";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Calendar, Clock, Heart } from "lucide-react";
import RSVPForm from "@/components/rsvp/RSVPForm";
import Image from "next/image";
import MusicPlayer from "@/components/MusicPlayer";

interface SunsetMandapProps {
  couple: CoupleDetails;
}

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  bg:        "#1C0A00",
  bg2:       "#2A1000",
  terracotta:"#C15A1B",
  marigold:  "#E8961E",
  cream:     "#FAF0DC",
  dimCream:  "rgba(250,240,220,0.65)",
  dimOrange: "rgba(232,150,30,0.5)",
  border:    "rgba(232,150,30,0.22)",
  borderBright: "rgba(232,150,30,0.55)",
};

// ─── Countdown ──────────────────────────────────────────────────────────────
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

  return (
    <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
      {[{ v: t.d, l: "Days" }, { v: t.h, l: "Hours" }, { v: t.m, l: "Mins" }, { v: t.s, l: "Secs" }].map(({ v, l }) => (
        <div key={l} style={{ textAlign: "center" }}>
          <div style={{
            width: 62, height: 62,
            background: "rgba(193,90,27,0.15)",
            border: `1px solid ${C.borderBright}`,
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Philosopher',serif", fontSize: 24, fontWeight: 700,
            color: C.marigold, marginBottom: 5,
          }}>
            {String(v).padStart(2, "0")}
          </div>
          <span style={{ fontSize: 9, letterSpacing: "0.2em", color: C.dimOrange, textTransform: "uppercase" as const }}>
            {l}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Reveal on scroll ────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
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

// ─── Kolam / rangoli divider SVG ─────────────────────────────────────────────
const KolamDivider = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, margin: "28px 0", padding: "0 24px" }}>
    <div style={{ flex: 1, height: "0.5px", background: `linear-gradient(to right, transparent, ${C.borderBright})` }} />
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="5" stroke={C.marigold} strokeWidth="1" opacity="0.8" />
      <circle cx="16" cy="16" r="10" stroke={C.marigold} strokeWidth="0.5" opacity="0.4" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 16 + 6 * Math.cos(rad);
        const y1 = 16 + 6 * Math.sin(rad);
        const x2 = 16 + 14 * Math.cos(rad);
        const y2 = 16 + 14 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.marigold} strokeWidth="0.5" opacity="0.5" />;
      })}
      <circle cx="16" cy="16" r="2" fill={C.marigold} opacity="0.9" />
    </svg>
    <div style={{ flex: 1, height: "0.5px", background: `linear-gradient(to left, transparent, ${C.borderBright})` }} />
  </div>
);

// ─── Decorative top arch ─────────────────────────────────────────────────────
const MandapArch = ({ width = 280 }: { width?: number }) => (
  <svg width={width} height={width * 0.55} viewBox="0 0 280 154" fill="none">
    <path d="M4 154 L4 70 Q4 4 140 4 Q276 4 276 70 L276 154" stroke={C.marigold} strokeWidth="1.2" fill="none" opacity="0.35" />
    <path d="M20 154 L20 76 Q20 24 140 24 Q260 24 260 76 L260 154" stroke={C.marigold} strokeWidth="0.5" fill="none" opacity="0.2" />
    {/* Top petals */}
    {[-60, -30, 0, 30, 60].map((offset, i) => (
      <ellipse key={i} cx={140 + offset} cy={10} rx={8} ry={12} stroke={C.terracotta} strokeWidth="0.5" fill="none" opacity={0.4} />
    ))}
    {/* Side lamps */}
    <rect x="0" y="68" width="8" height="16" rx="2" fill={C.marigold} opacity="0.4" />
    <rect x="272" y="68" width="8" height="16" rx="2" fill={C.marigold} opacity="0.4" />
    <circle cx="4" cy="64" r="4" fill={C.marigold} opacity="0.6" />
    <circle cx="276" cy="64" r="4" fill={C.marigold} opacity="0.6" />
  </svg>
);

// ─── Family Section ──────────────────────────────────────────────────────────
function FamilySection({ couple }: { couple: CoupleDetails }) {
  const hasParents =
    couple.groomFatherName || couple.groomMotherName ||
    couple.brideFatherName || couple.brideMotherName;
  const hasRelatives = couple.relatives && couple.relatives.length > 0;
  if (!hasParents && !hasRelatives) return null;

  const groomRelatives = couple.relatives?.filter((r) => r.side === "groom") ?? [];
  const brideRelatives = couple.relatives?.filter((r) => r.side === "bride") ?? [];

  const Corners = () => (
    <>
      <div style={{ position:"absolute", top:8, left:8, width:10, height:10, borderTop:`1px solid ${C.marigold}`, borderLeft:`1px solid ${C.marigold}`, opacity:0.5 }} />
      <div style={{ position:"absolute", top:8, right:8, width:10, height:10, borderTop:`1px solid ${C.marigold}`, borderRight:`1px solid ${C.marigold}`, opacity:0.5 }} />
      <div style={{ position:"absolute", bottom:8, left:8, width:10, height:10, borderBottom:`1px solid ${C.marigold}`, borderLeft:`1px solid ${C.marigold}`, opacity:0.5 }} />
      <div style={{ position:"absolute", bottom:8, right:8, width:10, height:10, borderBottom:`1px solid ${C.marigold}`, borderRight:`1px solid ${C.marigold}`, opacity:0.5 }} />
    </>
  );

  const ParentsCard = ({ sideLabel, fatherName, motherName, delay }: { sideLabel: string; fatherName?: string; motherName?: string; delay: number }) => (
    <Reveal delay={delay}>
      <div style={{ background:"rgba(193,90,27,0.09)", border:`1px solid ${C.borderBright}`, borderRadius:6, padding:"22px 18px", position:"relative", overflow:"hidden", textAlign:"center", height:"100%" }}>
        <Corners />
        <p style={{ fontFamily:"'Philosopher',serif", fontSize:9, letterSpacing:"0.35em", color:C.dimOrange, textTransform:"uppercase" as const, marginBottom:16 }}>{sideLabel}</p>
        {fatherName && (<div style={{ marginBottom: motherName ? 14 : 0 }}>
          <p style={{ fontFamily:"'Philosopher',serif", fontSize:17, color:C.cream, fontWeight:700, lineHeight:1.2 }}>{fatherName}</p>
          <p style={{ fontSize:9, color:C.dimOrange, letterSpacing:"0.15em", textTransform:"uppercase" as const, marginTop:2 }}>Father</p>
        </div>)}
        {fatherName && motherName && <div style={{ height:"0.5px", background:C.border, margin:"10px auto", width:40 }} />}
        {motherName && (<div>
          <p style={{ fontFamily:"'Philosopher',serif", fontSize:17, color:C.cream, fontWeight:700, lineHeight:1.2 }}>{motherName}</p>
          <p style={{ fontSize:9, color:C.dimOrange, letterSpacing:"0.15em", textTransform:"uppercase" as const, marginTop:2 }}>Mother</p>
        </div>)}
      </div>
    </Reveal>
  );

  const RelativeCard = ({ rel, delay }: { rel: { name: string; relation: string; spouseName?: string }; delay: number }) => (
    <Reveal delay={delay}>
      <div style={{ background:"rgba(193,90,27,0.05)", border:`1px solid ${C.border}`, borderRadius:5, padding:"14px", textAlign:"center" }}>
        <p style={{ fontSize:8, letterSpacing:"0.25em", color:C.dimOrange, textTransform:"uppercase" as const, marginBottom:10 }}>{rel.relation}</p>
        <p style={{ fontFamily:"'Philosopher',serif", fontSize:14, color:C.cream, fontWeight:700, lineHeight:1.2 }}>{rel.name}</p>
        {rel.spouseName && (<>
          <div style={{ display:"flex", alignItems:"center", gap:6, justifyContent:"center", margin:"6px 0" }}>
            <div style={{ height:"0.5px", flex:1, background:C.border }} />
            <span style={{ fontSize:9, color:C.terracotta, opacity:0.7 }}>&amp;</span>
            <div style={{ height:"0.5px", flex:1, background:C.border }} />
          </div>
          <p style={{ fontFamily:"'Philosopher',serif", fontSize:14, color:C.dimCream, lineHeight:1.2 }}>{rel.spouseName}</p>
        </>)}
      </div>
    </Reveal>
  );

  return (
    <section style={{ padding:"20px 14px 48px", maxWidth:620, margin:"0 auto" }}>
      <Reveal>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <p style={{ fontFamily:"'Philosopher',serif", fontSize:10, letterSpacing:"0.45em", color:C.dimOrange, textTransform:"uppercase" as const, marginBottom:8 }}>With the blessings of</p>
          <p style={{ fontFamily:"'Philosopher',serif", fontSize:22, color:C.cream, fontWeight:700 }}>Our Beloved Families</p>
        </div>
      </Reveal>

      {/* ── PARENTS — 2-col, full width ── */}
      {hasParents && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom: hasRelatives ? 28 : 0 }}>
          {(couple.groomFatherName || couple.groomMotherName) && (
            <ParentsCard sideLabel={`${couple.groomName}'s Parents`} fatherName={couple.groomFatherName} motherName={couple.groomMotherName} delay={0.1} />
          )}
          {(couple.brideFatherName || couple.brideMotherName) && (
            <ParentsCard sideLabel={`${couple.brideName}'s Parents`} fatherName={couple.brideFatherName} motherName={couple.brideMotherName} delay={0.2} />
          )}
        </div>
      )}

      {/* ── RELATIVES — own section below, 2-col ── */}
      {hasRelatives && (
        <>
          <Reveal delay={0.25}>
            <div style={{ display:"flex", alignItems:"center", gap:10, margin:"4px 0 20px" }}>
              <div style={{ flex:1, height:"0.5px", background:C.border }} />
              <p style={{ fontFamily:"'Philosopher',serif", fontSize:9, letterSpacing:"0.3em", color:C.dimOrange, textTransform:"uppercase" as const, whiteSpace:"nowrap" as const }}>Extended Family</p>
              <div style={{ flex:1, height:"0.5px", background:C.border }} />
            </div>
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {groomRelatives.length > 0 && (<>
                <Reveal delay={0.28}>
                  <p style={{ fontFamily:"'Philosopher',serif", fontSize:9, letterSpacing:"0.3em", color:C.dimOrange, textTransform:"uppercase" as const, textAlign:"center", marginBottom:4 }}>{couple.groomName}&apos;s Side</p>
                </Reveal>
                {groomRelatives.map((rel, i) => <RelativeCard key={i} rel={rel} delay={0.3 + i * 0.07} />)}
              </>)}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {brideRelatives.length > 0 && (<>
                <Reveal delay={0.28}>
                  <p style={{ fontFamily:"'Philosopher',serif", fontSize:9, letterSpacing:"0.3em", color:C.dimOrange, textTransform:"uppercase" as const, textAlign:"center", marginBottom:4 }}>{couple.brideName}&apos;s Side</p>
                </Reveal>
                {brideRelatives.map((rel, i) => <RelativeCard key={i} rel={rel} delay={0.3 + i * 0.07} />)}
              </>)}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

// ─── Main Template ───────────────────────────────────────────────────────────

export default function SunsetMandap({ couple }: SunsetMandapProps) {
  const allEvents =
    couple.events?.length > 0
      ? couple.events
      : [{ name: "Wedding Ceremony", date: couple.weddingDate, time: couple.weddingTime, venue: couple.venue }];

  const slug =
    couple.slug ??
    `${couple.groomName.toLowerCase().replace(/\s+/g, "-")}-weds-${couple.brideName.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Philosopher:ital,wght@0,400;0,700;1,400&family=Josefin+Sans:wght@300;400;600&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes floatDiya { 0%,100%{transform:translateY(0) scale(1);opacity:.75} 50%{transform:translateY(-6px) scale(1.08);opacity:1} }
        @keyframes petals { 0%{transform:translateY(-10px) rotate(0deg);opacity:0} 10%{opacity:.7} 90%{opacity:.5} 100%{transform:translateY(100vh) rotate(360deg);opacity:0} }
      `}</style>

      <div
        style={{ minHeight: "100vh", background: `linear-gradient(175deg, ${C.bg} 0%, ${C.bg2} 40%, ${C.bg} 100%)`, fontFamily: "'Josefin Sans',sans-serif", overflowX: "hidden" }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Floating diya decorations */}
        {[8, 22, 50, 78, 92].map((pct, i) => (
          <div key={i} style={{
            position: "fixed", top: 0, left: `${pct}%`,
            animation: `floatDiya ${2 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`,
            pointerEvents: "none", zIndex: 1,
          }}>
            <div style={{ width: 1, height: 55, background: "rgba(232,150,30,0.25)", margin: "0 auto" }} />
            <div style={{
              width: 14, height: 18,
              background: "radial-gradient(circle at 50% 25%, #FFDA6A, #E8961E, #C15A1B)",
              borderRadius: "50% 50% 55% 55%",
              margin: "0 auto",
              boxShadow: "0 0 16px #E8961E, 0 0 30px rgba(232,150,30,0.4)",
            }} />
          </div>
        ))}

        {/* ── HERO ── */}
        <section style={{
          position: "relative", minHeight: "90vh",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "80px 24px 80px", textAlign: "center",
          overflow: "hidden",
        }}>
          {/* Radial glow */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at center top, rgba(193,90,27,0.18) 0%, transparent 65%)",
            pointerEvents: "none",
          }} />

          {/* Arch decoration */}
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: -20, opacity: 0.6 }}>
              <MandapArch width={260} />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p style={{
              fontFamily: "'Josefin Sans',sans-serif", fontSize: 10,
              letterSpacing: "0.5em", color: C.dimOrange,
              textTransform: "uppercase" as const, marginBottom: 22,
            }}>
              ✦ With divine blessings ✦
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <h1 style={{
              fontFamily: "'Philosopher',serif",
              fontSize: "clamp(3rem,10vw,5.5rem)",
              color: C.cream, fontWeight: 700,
              letterSpacing: "0.04em", lineHeight: 1.05,
              textShadow: `0 0 50px rgba(232,150,30,0.18)`,
              marginBottom: 0,
            }}>
              {couple.groomName}
            </h1>
          </Reveal>

          <Reveal delay={0.22}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "12px 0" }}>
              <div style={{ height: "0.5px", width: 50, background: C.borderBright }} />
              <Heart size={16} fill={C.terracotta} color={C.terracotta} />
              <div style={{ height: "0.5px", width: 50, background: C.borderBright }} />
            </div>
          </Reveal>

          <Reveal delay={0.28}>
            <h1 style={{
              fontFamily: "'Philosopher',serif",
              fontSize: "clamp(3rem,10vw,5.5rem)",
              color: C.marigold, fontWeight: 700,
              letterSpacing: "0.04em", lineHeight: 1.05,
              textShadow: `0 0 50px rgba(232,150,30,0.25)`,
              marginBottom: 28,
            }}>
              {couple.brideName}
            </h1>
          </Reveal>

          {couple.couplePhotoUrl && (
            <Reveal delay={0.33}>
              <div style={{ marginBottom: 30 }}>
                <div style={{
                  display: "inline-block",
                  padding: 3,
                  background: `linear-gradient(135deg, ${C.marigold}, ${C.terracotta}, ${C.marigold})`,
                  borderRadius: 6,
                  boxShadow: "0 12px 50px rgba(0,0,0,0.5)",
                }}>
                  <div style={{ padding: 6, background: C.bg, borderRadius: 4 }}>
                    <Image
                      src={couple.couplePhotoUrl}
                      alt="Couple photo"
                      width={200} height={260}
                      style={{ objectFit: "cover", borderRadius: 3, display: "block" }}
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          <Reveal delay={0.38}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "11px 26px",
              background: "rgba(193,90,27,0.12)",
              border: `1px solid ${C.borderBright}`,
              borderRadius: 4,
            }}>
              <Calendar size={12} color={C.marigold} />
              <span style={{ fontFamily: "'Philosopher',serif", fontSize: 15, color: C.cream }}>
                {formatWeddingDate(couple.weddingDate)}
              </span>
              <span style={{ color: C.border }}>·</span>
              <span style={{ fontSize: 13, color: C.dimOrange }}>{couple.weddingTime}</span>
            </div>
          </Reveal>

          <Reveal delay={0.46}>
            <p style={{ fontSize: 12, color: C.dimOrange, marginTop: 10, letterSpacing: "0.08em" }}>
              {couple.venue}
            </p>
          </Reveal>

          <motion.div
            animate={{ y: [0, 9, 0] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            style={{ position: "absolute", bottom: 24, color: C.dimOrange, fontSize: 20 }}
          >
            ↓
          </motion.div>
        </section>

        <KolamDivider />

        {/* ── MESSAGE ── */}
        <section style={{ padding: "10px 24px 40px", maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <p style={{
              fontFamily: "'Philosopher',serif", fontStyle: "italic",
              fontSize: 19, color: C.dimCream, lineHeight: 1.9,
            }}>
              {couple.personalMessage
                ? `"${couple.personalMessage}"`
                : `"Two families united by love and tradition. We joyfully invite you to celebrate this auspicious union with your heartfelt blessings."`}
            </p>
          </Reveal>
        </section>

        <KolamDivider />

        {/* ── FAMILY ── */}
        <FamilySection couple={couple} />

        {(couple.groomFatherName || couple.groomMotherName ||
          couple.brideFatherName || couple.brideMotherName ||
          (couple.relatives && couple.relatives.length > 0)) && <KolamDivider />}

        {/* ── EVENTS ── */}
        <section style={{ padding: "10px 20px 50px", maxWidth: 580, margin: "0 auto" }}>
          <Reveal>
            <p style={{
              fontFamily: "'Josefin Sans',sans-serif", fontSize: 10,
              letterSpacing: "0.45em", color: C.dimOrange,
              textTransform: "uppercase" as const, textAlign: "center", marginBottom: 28,
            }}>
              Celebrations
            </p>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {allEvents.map((event, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{
                  background: "rgba(193,90,27,0.07)",
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  padding: "20px 22px",
                  display: "flex", gap: 16,
                }}>
                  <div style={{
                    width: "2px", minHeight: 48,
                    background: `linear-gradient(to bottom, ${C.marigold}, rgba(232,150,30,0.15))`,
                    flexShrink: 0,
                  }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontFamily: "'Philosopher',serif", fontSize: 19,
                      color: C.cream, fontWeight: 700, marginBottom: 10,
                    }}>
                      {event.name}
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: C.dimCream }}>
                        <Calendar size={12} color={C.marigold} />
                        {formatWeddingDate(event.date)}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: C.dimCream }}>
                        <Clock size={12} color={C.marigold} />
                        {event.time}
                      </span>
                      {event.venue && (
                        <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: C.dimOrange }}>
                          <MapPin size={12} color={C.marigold} />
                          {event.venue}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <KolamDivider />

        {/* ── VENUE ── */}
        <section style={{ padding: "10px 20px 50px", maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{
              background: "rgba(193,90,27,0.07)",
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              padding: "30px 24px",
            }}>
              <MapPin size={20} color={C.marigold} style={{ margin: "0 auto 12px", display: "block" }} />
              <h3 style={{ fontFamily: "'Philosopher',serif", fontSize: 22, color: C.cream, fontWeight: 700, marginBottom: 6 }}>
                {couple.venue}
              </h3>
              {couple.venueAddress && (
                <p style={{ fontSize: 13, color: C.dimOrange, lineHeight: 1.8, marginBottom: 18 }}>
                  {couple.venueAddress}
                </p>
              )}
              {couple.mapLink && (
                <a
                  href={couple.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "9px 22px",
                    border: `1px solid ${C.borderBright}`,
                    borderRadius: 3, color: C.marigold,
                    fontSize: 10, fontFamily: "'Josefin Sans',sans-serif",
                    letterSpacing: "0.2em", textDecoration: "none",
                    textTransform: "uppercase" as const,
                  }}
                >
                  <MapPin size={11} /> View on Maps
                </a>
              )}
            </div>
          </Reveal>
        </section>

        {/* ── COUNTDOWN ── */}
        <section style={{ padding: "10px 24px 50px", textAlign: "center" }}>
          <Reveal>
            <p style={{
              fontFamily: "'Philosopher',serif", fontStyle: "italic",
              fontSize: 17, color: C.dimOrange, marginBottom: 26,
            }}>
              The auspicious moment awaits
            </p>
            <Countdown targetDate={couple.weddingDate} />
          </Reveal>
        </section>

        <KolamDivider />

        {/* ── RSVP ── */}
        <section style={{ padding: "10px 20px 80px", maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 16 }}>
              {["🌺", "🪔", "🌸"].map((e, i) => (
                <span key={i} style={{ fontSize: 22 }}>{e}</span>
              ))}
            </div>
            <h2 style={{
              fontFamily: "'Philosopher',serif", fontSize: 26,
              color: C.cream, fontWeight: 700, marginBottom: 8,
            }}>
              You are warmly invited
            </h2>
            <p style={{
              fontFamily: "'Josefin Sans',sans-serif", fontWeight: 300,
              fontSize: 14, color: C.dimOrange, lineHeight: 1.8, marginBottom: 28,
            }}>
              Your presence will make this day truly complete
            </p>
            <div style={{ textAlign: "left", marginBottom: 16 }}>
              <RSVPForm
                inviteSlug={slug}
                coupleName={`${couple.groomName} & ${couple.brideName}`}
                accentColor={C.marigold}
                theme="dark"
              />
            </div>
            {couple.phone && (
              <button
                onClick={() => {
                  const p = couple.phone?.replace(/\D/g, "");
                  window.open(
                    `https://wa.me/${p}?text=${encodeURIComponent(`Vanakkam! We are delighted to attend the wedding of ${couple.groomName} & ${couple.brideName}.`)}`,
                    "_blank"
                  );
                }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "9px 22px",
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  borderRadius: 3,
                  color: C.dimOrange,
                  fontFamily: "'Josefin Sans',sans-serif",
                  fontSize: 11, cursor: "pointer",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase" as const,
                }}
              >
                <Phone size={11} /> WhatsApp Us
              </button>
            )}

            <KolamDivider />

            <p style={{
              fontFamily: "'Philosopher',serif", fontStyle: "italic",
              fontSize: 17, color: "rgba(232,150,30,0.35)",
            }}>
              {couple.groomName} & {couple.brideName}
            </p>
            <p style={{
              fontSize: 9, color: "rgba(232,150,30,0.15)",
              letterSpacing: "0.3em", textTransform: "uppercase" as const, marginTop: 8,
            }}>
              Made with WedCraft
            </p>
          </Reveal>
        </section>
      </div>

      {couple.bgMusicUrl && (
        <MusicPlayer src={couple.bgMusicUrl} dark accentColor={C.marigold} />
      )}
    </>
  );
}