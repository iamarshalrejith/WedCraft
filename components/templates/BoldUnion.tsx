"use client";

import { useEffect, useState, useRef } from "react";
import { CoupleDetails } from "@/types/invite";
import { formatWeddingDate } from "@/lib/invite-utils";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Calendar, Clock } from "lucide-react";
import RSVPForm from "@/components/rsvp/RSVPForm";
import Image from "next/image";
import MusicPlayer from "@/components/MusicPlayer";

interface BoldUnionProps { couple: CoupleDetails; }

// ─── Neo Brutalism palette ─────────────────────────────────────────────────────
const B = {
  bg:      "#FFFEF0",   // off-white warm
  black:   "#0A0A0A",
  yellow:  "#FFE600",
  pink:    "#FF2D78",
  blue:    "#0057FF",
  green:   "#00C853",
  white:   "#FFFFFF",
  border:  "3px solid #0A0A0A",
  shadow:  "4px 4px 0px #0A0A0A",
  shadowLg:"6px 6px 0px #0A0A0A",
  shadowXl:"8px 8px 0px #0A0A0A",
};

// ─── Scroll slam-in ───────────────────────────────────────────────────────────
function Slam({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, rotate: -1 }}
      animate={inView ? { opacity: 1, y: 0, rotate: 0 } : {}}
      transition={{ duration: 0.4, delay, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Countdown ─────────────────────────────────────────────────────────────────
function Countdown({ targetDate }: { targetDate: string }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return;
      setT({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, [targetDate]);

  const boxes = [
    { v: t.d, l: "DAYS", bg: B.yellow },
    { v: t.h, l: "HRS",  bg: B.pink   },
    { v: t.m, l: "MIN",  bg: B.blue   },
    { v: t.s, l: "SEC",  bg: B.green  },
  ];

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
      {boxes.map(({ v, l, bg }) => (
        <div key={l} style={{ textAlign: "center" }}>
          <div style={{
            width: 72, height: 72, background: bg,
            border: B.border, boxShadow: B.shadowLg,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 800, color: B.black,
          }}>
            {String(v).padStart(2, "0")}
          </div>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: B.black, marginTop: 4 }}>{l}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Brutalist divider ────────────────────────────────────────────────────────
const BrutalDivider = ({ color = B.yellow }: { color?: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "36px 0" }}>
    <div style={{ flex: 1, height: 3, background: B.black }} />
    <div style={{ width: 16, height: 16, background: color, border: B.border, transform: "rotate(45deg)", flexShrink: 0, margin: "0 -8px" }} />
    <div style={{ flex: 1, height: 3, background: B.black }} />
  </div>
);

// ─── Family Section ───────────────────────────────────────────────────────────
function FamilySection({ couple }: { couple: CoupleDetails }) {
  const hasParents = couple.groomFatherName || couple.groomMotherName || couple.brideFatherName || couple.brideMotherName;
  const hasRelatives = couple.relatives && couple.relatives.length > 0;
  if (!hasParents && !hasRelatives) return null;

  const groomRelatives = couple.relatives?.filter((r) => r.side === "groom") ?? [];
  const brideRelatives = couple.relatives?.filter((r) => r.side === "bride") ?? [];

  const ParentsCard = ({ label, fatherName, motherName, accent, delay }: { label: string; fatherName?: string; motherName?: string; accent: string; delay: number }) => (
    <Slam delay={delay}>
      <div style={{ background: accent, border: B.border, boxShadow: B.shadowLg, padding: "20px 16px" }}>
        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: "0.25em", color: B.black, textTransform: "uppercase", marginBottom: 14, borderBottom: `2px solid ${B.black}`, paddingBottom: 8 }}>
          {label}
        </p>
        {fatherName && (
          <div style={{ marginBottom: motherName ? 10 : 0 }}>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700, color: B.black, lineHeight: 1.2 }}>{fatherName}</p>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, fontWeight: 600, color: B.black, opacity: 0.6, letterSpacing: "0.15em", marginTop: 2 }}>FATHER</p>
          </div>
        )}
        {fatherName && motherName && <div style={{ height: 2, background: B.black, margin: "10px 0", opacity: 0.2 }} />}
        {motherName && (
          <div>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700, color: B.black, lineHeight: 1.2 }}>{motherName}</p>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, fontWeight: 600, color: B.black, opacity: 0.6, letterSpacing: "0.15em", marginTop: 2 }}>MOTHER</p>
          </div>
        )}
      </div>
    </Slam>
  );

  const RelativeCard = ({ rel, accent, delay }: { rel: { name: string; relation: string; spouseName?: string }; accent: string; delay: number }) => (
    <Slam delay={delay}>
      <div style={{ background: B.white, border: B.border, boxShadow: "3px 3px 0 #0A0A0A", padding: "10px 12px", borderLeft: `4px solid ${accent}` }}>
        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: accent === B.yellow ? B.black : accent, textTransform: "uppercase", marginBottom: 4 }}>{rel.relation}</p>
        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 700, color: B.black, lineHeight: 1.2 }}>{rel.name}</p>
        {rel.spouseName && (
          <>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, color: B.black, opacity: 0.5, margin: "2px 0" }}>& </p>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, fontWeight: 600, color: B.black, lineHeight: 1.2 }}>{rel.spouseName}</p>
          </>
        )}
      </div>
    </Slam>
  );

  return (
    <section style={{ padding: "20px 20px 52px", maxWidth: 600, margin: "0 auto" }}>
      <Slam>
        <div style={{ background: B.blue, border: B.border, boxShadow: B.shadowXl, padding: "10px 20px", marginBottom: 24, display: "inline-block" }}>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: "0.3em", color: B.white, textTransform: "uppercase" }}>
            OUR FAMILIES
          </p>
        </div>
      </Slam>

      {/* ── PARENTS — 2-col full width ── */}
      {hasParents && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: hasRelatives ? 28 : 0 }}>
          {(couple.groomFatherName || couple.groomMotherName) && (
            <ParentsCard label={`${couple.groomName}'s Parents`} fatherName={couple.groomFatherName} motherName={couple.groomMotherName} accent={B.yellow} delay={0.05} />
          )}
          {(couple.brideFatherName || couple.brideMotherName) && (
            <ParentsCard label={`${couple.brideName}'s Parents`} fatherName={couple.brideFatherName} motherName={couple.brideMotherName} accent={B.pink} delay={0.1} />
          )}
        </div>
      )}

      {/* ── RELATIVES — own section below ── */}
      {hasRelatives && (
        <>
          <Slam delay={0.12}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 16px" }}>
              <div style={{ height: 2, flex: 1, background: B.black }} />
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 8, fontWeight: 800, letterSpacing: "0.3em", color: B.black, textTransform: "uppercase", whiteSpace: "nowrap" }}>EXTENDED FAMILY</p>
              <div style={{ height: 2, flex: 1, background: B.black }} />
            </div>
          </Slam>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {groomRelatives.length > 0 && (
                <>
                  <Slam delay={0.14}>
                    <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: B.black, textTransform: "uppercase", textAlign: "center", marginBottom: 4 }}>
                      {couple.groomName}&apos;s Side
                    </p>
                  </Slam>
                  {groomRelatives.map((rel, i) => <RelativeCard key={i} rel={rel} accent={B.blue} delay={0.16 + i * 0.06} />)}
                </>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {brideRelatives.length > 0 && (
                <>
                  <Slam delay={0.14}>
                    <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: B.black, textTransform: "uppercase", textAlign: "center", marginBottom: 4 }}>
                      {couple.brideName}&apos;s Side
                    </p>
                  </Slam>
                  {brideRelatives.map((rel, i) => <RelativeCard key={i} rel={rel} accent={B.pink} delay={0.16 + i * 0.06} />)}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

// ─── Main Template ─────────────────────────────────────────────────────────────
export default function BoldUnion({ couple }: BoldUnionProps) {
  const allEvents = couple.events?.length > 0
    ? couple.events
    : [{ name: "Wedding Ceremony", date: couple.weddingDate, time: couple.weddingTime, venue: couple.venue }];

  const slug = couple.slug ?? `${couple.groomName.toLowerCase().replace(/\s+/g, "-")}-weds-${couple.brideName.toLowerCase().replace(/\s+/g, "-")}`;

  // Cycle accent colors for events
  const eventColors = [B.yellow, B.pink, B.blue, B.green];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes wobble { 0%,100%{transform:rotate(-1deg)} 50%{transform:rotate(1deg)} }
        @keyframes pulse-border { 0%,100%{box-shadow:4px 4px 0 #0A0A0A} 50%{box-shadow:6px 6px 0 #0A0A0A} }
      `}</style>

      <div style={{ minHeight: "100vh", background: B.bg, fontFamily: "'Space Grotesk',sans-serif", overflowX: "hidden" }} onContextMenu={e => e.preventDefault()}>

        {/* ── TOP BAR ── */}
        <div style={{ background: B.black, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {["★", "WE'RE", "GETTING", "MARRIED", "★"].map((w, i) => (
            <span key={i} style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, fontWeight: 800, color: i % 2 === 0 ? B.yellow : B.white, letterSpacing: "0.15em" }}>{w}</span>
          ))}
        </div>

        {/* ── HERO ── */}
        <section style={{ position: "relative", minHeight: "95vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px 80px", textAlign: "center", overflow: "hidden" }}>

          {/* Big background LOVE text */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(100px,30vw,220px)", fontWeight: 800, color: B.yellow, opacity: 0.12, userSelect: "none", whiteSpace: "nowrap", pointerEvents: "none", letterSpacing: "-0.05em" }}>
            LOVE
          </div>

          {/* Floating geometric accents */}
          <div style={{ position: "absolute", top: 80, left: 20, width: 40, height: 40, background: B.pink, border: B.border, animation: "wobble 3s ease-in-out infinite" }} />
          <div style={{ position: "absolute", top: 120, right: 24, width: 28, height: 28, background: B.blue, border: B.border, borderRadius: "50%", animation: "wobble 2.5s ease-in-out 0.5s infinite" }} />
          <div style={{ position: "absolute", bottom: 100, left: 30, width: 20, height: 20, background: B.green, border: B.border, transform: "rotate(45deg)", animation: "wobble 3.5s ease-in-out 1s infinite" }} />
          <div style={{ position: "absolute", bottom: 80, right: 18, width: 36, height: 36, background: B.yellow, border: B.border, animation: "wobble 2.8s ease-in-out 0.3s infinite" }} />

          <Slam>
            <div style={{ background: B.pink, border: B.border, boxShadow: B.shadowLg, padding: "6px 18px", marginBottom: 28, display: "inline-block", transform: "rotate(-1.5deg)" }}>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.35em", color: B.white, textTransform: "uppercase" }}>
                SAVE THE DATE
              </p>
            </div>
          </Slam>

          <Slam delay={0.08}>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(3rem,12vw,6rem)", fontWeight: 800, color: B.black, lineHeight: 0.9, letterSpacing: "-0.03em", marginBottom: 0 }}>
              {couple.groomName}
            </h1>
          </Slam>

          <Slam delay={0.13}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
              <div style={{ height: 3, width: 40, background: B.black }} />
              <div style={{ background: B.yellow, border: B.border, boxShadow: "2px 2px 0 #0A0A0A", padding: "4px 14px" }}>
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 800, color: B.black }}>×</span>
              </div>
              <div style={{ height: 3, width: 40, background: B.black }} />
            </div>
          </Slam>

          <Slam delay={0.18}>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(3rem,12vw,6rem)", fontWeight: 800, color: B.pink, lineHeight: 0.9, letterSpacing: "-0.03em", marginBottom: 28 }}>
              {couple.brideName}
            </h1>
          </Slam>

          {couple.couplePhotoUrl && (
            <Slam delay={0.22}>
              <div style={{ marginBottom: 28, position: "relative", display: "inline-block" }}>
                <div style={{ position: "absolute", top: 6, left: 6, width: "100%", height: "100%", background: B.yellow, border: B.border, zIndex: 0 }} />
                <div style={{ position: "relative", zIndex: 1, border: B.border }}>
                  <Image src={couple.couplePhotoUrl} alt="Couple" width={200} height={260} style={{ objectFit: "cover", display: "block", filter: "contrast(1.05)" }} />
                </div>
              </div>
            </Slam>
          )}

          <Slam delay={0.26}>
            <div style={{ background: B.blue, border: B.border, boxShadow: B.shadowLg, padding: "12px 24px", display: "inline-flex", alignItems: "center", gap: 10 }}>
              <Calendar size={14} color={B.white} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 700, color: B.white }}>{formatWeddingDate(couple.weddingDate)}</span>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>·</span>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{couple.weddingTime}</span>
            </div>
          </Slam>

          <Slam delay={0.3}>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, fontWeight: 600, color: B.black, marginTop: 10, opacity: 0.6, letterSpacing: "0.05em" }}>
              {couple.venue}
            </p>
          </Slam>

          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }} style={{ position: "absolute", bottom: 24, fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 800, color: B.black, opacity: 0.4 }}>↓</motion.div>
        </section>

        {/* ── MESSAGE ── */}
        <section style={{ padding: "0 20px 20px", maxWidth: 560, margin: "0 auto" }}>
          <BrutalDivider color={B.pink} />
          <Slam>
            <div style={{ background: B.yellow, border: B.border, boxShadow: B.shadowXl, padding: "28px 24px", position: "relative" }}>
              {/* Corner staple marks */}
              {["topLeft","topRight","bottomLeft","bottomRight"].map((pos) => (
                <div key={pos} style={{ position: "absolute", [pos.includes("top") ? "top" : "bottom"]: 8, [pos.includes("Left") ? "left" : "right"]: 8, width: 8, height: 8, border: `2px solid ${B.black}`, borderRadius: "50%" }} />
              ))}
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 17, fontWeight: 500, color: B.black, lineHeight: 1.8, textAlign: "center" }}>
                {couple.personalMessage
                  ? `"${couple.personalMessage}"`
                  : `"Two people. One wild adventure. You're invited to witness the best day of our lives."`}
              </p>
            </div>
          </Slam>
        </section>

        {/* ── FAMILY ── */}
        <BrutalDivider color={B.blue} />
        <FamilySection couple={couple} />

        {/* ── EVENTS ── */}
        {(couple.groomFatherName || couple.groomMotherName || couple.brideFatherName || couple.brideMotherName || (couple.relatives && couple.relatives.length > 0)) && (
          <BrutalDivider color={B.green} />
        )}
        <section style={{ padding: "0 20px 52px", maxWidth: 560, margin: "0 auto" }}>
          <Slam>
            <div style={{ background: B.black, border: B.border, padding: "8px 18px", marginBottom: 20, display: "inline-block" }}>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: "0.3em", color: B.yellow, textTransform: "uppercase" }}>THE SCHEDULE</p>
            </div>
          </Slam>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {allEvents.map((event, i) => (
              <Slam key={i} delay={i * 0.08}>
                <div style={{ background: eventColors[i % eventColors.length], border: B.border, boxShadow: B.shadowLg, padding: "18px 20px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ background: B.black, color: eventColors[i % eventColors.length], fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 18, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 800, color: B.black, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.02em" }}>{event.name}</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, fontWeight: 600, color: B.black }}><Calendar size={12} color={B.black} />{formatWeddingDate(event.date)}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, fontWeight: 600, color: B.black }}><Clock size={12} color={B.black} />{event.time}</span>
                      {event.venue && <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, fontWeight: 500, color: B.black, opacity: 0.7 }}><MapPin size={11} color={B.black} />{event.venue}</span>}
                    </div>
                  </div>
                </div>
              </Slam>
            ))}
          </div>
        </section>

        <BrutalDivider color={B.yellow} />

        {/* ── VENUE ── */}
        <section style={{ padding: "0 20px 52px", maxWidth: 560, margin: "0 auto" }}>
          <Slam>
            <div style={{ background: B.green, border: B.border, boxShadow: B.shadowXl, padding: "28px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ background: B.black, padding: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MapPin size={18} color={B.green} />
                </div>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.25em", color: B.black, textTransform: "uppercase" }}>WHERE IT HAPPENS</p>
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 800, color: B.black, marginBottom: 6, textTransform: "uppercase" }}>{couple.venue}</h3>
              {couple.venueAddress && <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 500, color: B.black, opacity: 0.7, lineHeight: 1.6, marginBottom: 16 }}>{couple.venueAddress}</p>}
              {couple.mapLink && (
                <a href={couple.mapLink} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", background: B.black, color: B.yellow, fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textDecoration: "none", textTransform: "uppercase", border: B.border, boxShadow: "3px 3px 0 #0A0A0A" }}>
                  <MapPin size={11} /> GET DIRECTIONS
                </a>
              )}
            </div>
          </Slam>
        </section>

        <BrutalDivider color={B.pink} />

        {/* ── COUNTDOWN ── */}
        <section style={{ padding: "0 20px 52px", textAlign: "center" }}>
          <Slam>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", color: B.black, textTransform: "uppercase", marginBottom: 24, opacity: 0.6 }}>
              COUNTING DOWN TO THE BIG DAY
            </p>
            <Countdown targetDate={couple.weddingDate} />
          </Slam>
        </section>

        <BrutalDivider color={B.blue} />

        {/* ── RSVP ── */}
        <section style={{ padding: "0 20px 80px", maxWidth: 540, margin: "0 auto" }}>
          <Slam>
            <div style={{ background: B.pink, border: B.border, boxShadow: B.shadowXl, padding: "8px 18px", marginBottom: 20, display: "inline-block", transform: "rotate(0.8deg)" }}>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: "0.3em", color: B.white, textTransform: "uppercase" }}>ARE YOU COMING?</p>
            </div>
          </Slam>
          <Slam delay={0.06}>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 800, color: B.black, marginBottom: 6, textTransform: "uppercase", letterSpacing: "-0.02em" }}>
              JOIN THE PARTY
            </h2>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 500, color: B.black, opacity: 0.6, marginBottom: 24 }}>
              Tell us you&apos;re coming. We saved a seat for you.
            </p>
          </Slam>

          <Slam delay={0.1}>
            <div style={{ border: B.border, boxShadow: B.shadowXl, background: B.white, padding: "20px", marginBottom: 16 }}>
              <RSVPForm inviteSlug={slug} coupleName={`${couple.groomName} & ${couple.brideName}`} accentColor={B.blue} theme="light" />
            </div>
          </Slam>

          {couple.phone && (
            <Slam delay={0.14}>
              <button
                onClick={() => { const p = couple.phone?.replace(/\D/g, ""); window.open(`https://wa.me/${p}?text=${encodeURIComponent(`Hey! We'll be at ${couple.groomName} & ${couple.brideName}'s wedding!`)}`, "_blank"); }}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background: B.green, border: B.border, boxShadow: B.shadow, color: B.black, fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}
              >
                <Phone size={12} /> WHATSAPP US
              </button>
            </Slam>
          )}

          <BrutalDivider color={B.black} />

          <Slam delay={0.18}>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 700, color: B.black, textAlign: "center", letterSpacing: "0.05em" }}>
              {couple.groomName} × {couple.brideName}
            </p>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, fontWeight: 600, color: B.black, opacity: 0.35, letterSpacing: "0.25em", textTransform: "uppercase", textAlign: "center", marginTop: 6 }}>
              MADE WITH WEDCRAFT
            </p>
          </Slam>
        </section>

        {/* ── BOTTOM BAR ── */}
        <div style={{ background: B.black, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {["♥", couple.groomName.toUpperCase(), "WEDS", couple.brideName.toUpperCase(), "♥"].map((w, i) => (
            <span key={i} style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, fontWeight: 800, color: i % 2 === 0 ? B.pink : B.white, letterSpacing: "0.1em" }}>{w}</span>
          ))}
        </div>
      </div>

      {couple.bgMusicUrl && <MusicPlayer src={couple.bgMusicUrl} dark={false} accentColor={B.blue} />}
    </>
  );
}