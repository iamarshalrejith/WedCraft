"use client";

import { useEffect, useState, useRef } from "react";
import { CoupleDetails } from "@/types/invite";
import { formatWeddingDate } from "@/lib/invite-utils";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Calendar, Clock } from "lucide-react";
import RSVPForm from "@/components/rsvp/RSVPForm";
import Image from "next/image";
import MusicPlayer from "@/components/MusicPlayer";

interface KasiYatraProps { couple: CoupleDetails; }

// ─── Palette — bright cream/ivory, forest green, kumkum red ──────────────────
const K = {
  bg:  "#FFF6E5",
  bg2: "#FDEBD2",
  green:       "#1B5E20",
  green2:      "#2E7D32",
  lightGreen:  "#388E3C",
  kumkum:      "#B71C1C",
  kumkumLight: "#C62828",
  gold:        "#A67C00",
  goldBright:  "#C9960C",
  text:        "#1A1200",
  textMid:     "#3D2B00",
  textDim:     "rgba(61,43,0,0.55)",
  border:      "rgba(27,94,32,0.2)",
  borderBright:"rgba(27,94,32,0.45)",
  borderGold:  "rgba(166,124,0,0.35)",
  bgCard: "rgba(212,175,55,0.08)",
};

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

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
  return (
    <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
      {[{ v: t.d, l: "நாட்கள்" }, { v: t.h, l: "மணி" }, { v: t.m, l: "நிமிடம்" }, { v: t.s, l: "வினாடி" }].map(({ v, l }) => (
        <div key={l} style={{ textAlign: "center" }}>
          <div style={{ width: 64, height: 64, background: K.bgCard, border: `1.5px solid ${K.borderBright}`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Noto Serif Tamil',serif", fontSize: 26, fontWeight: 700, color: K.green, marginBottom: 6 }}>
            {String(v).padStart(2, "0")}
          </div>
          <span style={{ fontSize: 9, letterSpacing: "0.08em", color: K.textDim, fontFamily: "'Lato',sans-serif" }}>{l}</span>
        </div>
      ))}
    </div>
  );
}

const BananaLeafDivider = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, margin: "32px 0", padding: "0 24px" }}>
    <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${K.borderBright})` }} />
    <svg width="44" height="28" viewBox="0 0 44 28" fill="none">
      <path d="M22 14 Q12 2 2 8 Q8 14 22 14Z" fill={K.green} opacity="0.55" />
      <path d="M22 14 Q12 26 2 20 Q8 14 22 14Z" fill={K.green} opacity="0.35" />
      <path d="M22 14 Q32 2 42 8 Q36 14 22 14Z" fill={K.green} opacity="0.55" />
      <path d="M22 14 Q32 26 42 20 Q36 14 22 14Z" fill={K.green} opacity="0.35" />
      <circle cx="22" cy="14" r="3.5" fill={K.kumkum} opacity="0.85" />
      <circle cx="22" cy="14" r="1.5" fill={K.kumkumLight} />
    </svg>
    <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${K.borderBright})` }} />
  </div>
);

const KolamStrip = () => (
  <div style={{ width: "100%", height: 8, position: "relative", overflow: "hidden" }}>
    <svg width="100%" height="8" preserveAspectRatio="none" viewBox="0 0 400 8">
      {Array.from({ length: 50 }).map((_, i) => (
        <g key={i}>
          <circle cx={i * 8 + 4} cy="4" r="2" fill={K.green} opacity="0.22" />
          <circle cx={i * 8 + 8} cy="4" r="1" fill={K.kumkum} opacity="0.28" />
        </g>
      ))}
    </svg>
  </div>
);

const GopuramSilhouette = ({ width = 220 }: { width?: number }) => (
  <svg width={width} height={width * 0.7} viewBox="0 0 220 154" fill="none">
    <rect x="80" y="100" width="60" height="54" fill={K.green} opacity="0.1" />
    <rect x="72" y="80" width="76" height="22" rx="1" fill={K.green} opacity="0.12" />
    <rect x="80" y="62" width="60" height="20" rx="1" fill={K.green} opacity="0.14" />
    <rect x="88" y="46" width="44" height="18" rx="1" fill={K.green} opacity="0.16" />
    <rect x="96" y="32" width="28" height="16" rx="1" fill={K.green} opacity="0.18" />
    <rect x="102" y="20" width="16" height="14" rx="1" fill={K.green} opacity="0.2" />
    <ellipse cx="110" cy="18" rx="6" ry="3" fill={K.goldBright} opacity="0.5" />
    <ellipse cx="110" cy="15" rx="4" ry="2" fill={K.goldBright} opacity="0.6" />
    <circle cx="110" cy="12" r="3" fill={K.kumkum} opacity="0.75" />
    <line x1="110" y1="12" x2="110" y2="2" stroke={K.kumkum} strokeWidth="0.8" opacity="0.5" />
    <path d="M110 2 L118 5 L110 8Z" fill={K.kumkum} opacity="0.55" />
    <rect x="30" y="110" width="36" height="44" fill={K.green} opacity="0.07" />
    <rect x="26" y="94" width="44" height="18" rx="1" fill={K.green} opacity="0.09" />
    <rect x="32" y="80" width="32" height="16" rx="1" fill={K.green} opacity="0.11" />
    <ellipse cx="48" cy="77" rx="4" ry="2.5" fill={K.goldBright} opacity="0.35" />
    <circle cx="48" cy="74" r="2.5" fill={K.kumkum} opacity="0.45" />
    <rect x="154" y="110" width="36" height="44" fill={K.green} opacity="0.07" />
    <rect x="150" y="94" width="44" height="18" rx="1" fill={K.green} opacity="0.09" />
    <rect x="156" y="80" width="32" height="16" rx="1" fill={K.green} opacity="0.11" />
    <ellipse cx="172" cy="77" rx="4" ry="2.5" fill={K.goldBright} opacity="0.35" />
    <circle cx="172" cy="74" r="2.5" fill={K.kumkum} opacity="0.45" />
    <rect x="0" y="152" width="220" height="2" fill={K.green} opacity="0.12" />
    <rect x="60" y="148" width="100" height="4" rx="1" fill={K.green} opacity="0.1" />
  </svg>
);

const JasmineRow = () => (
  <div style={{ display: "flex", justifyContent: "center", gap: 5, flexWrap: "wrap", margin: "0 0 18px" }}>
    {["✿","❀","✿","❀","✿","❀","✿","❀","✿"].map((f, i) => (
      <span key={i} style={{ fontSize: 14, color: i % 2 === 0 ? K.green : K.kumkum, opacity: 0.65 }}>{f}</span>
    ))}
  </div>
);

function FamilySection({ couple }: { couple: CoupleDetails }) {
  const hasParents = couple.groomFatherName || couple.groomMotherName || couple.brideFatherName || couple.brideMotherName;
  const hasRelatives = couple.relatives && couple.relatives.length > 0;
  if (!hasParents && !hasRelatives) return null;

  const groomRelatives = couple.relatives?.filter((r) => r.side === "groom") ?? [];
  const brideRelatives = couple.relatives?.filter((r) => r.side === "bride") ?? [];

  const ParentsCard = ({ sideLabel, fatherName, motherName, delay }: { sideLabel: string; fatherName?: string; motherName?: string; delay: number }) => (
    <Reveal delay={delay}>
      <div style={{ background: "rgba(27,94,32,0.05)", border: `1.5px solid ${K.borderBright}`, borderRadius: 6, padding: "20px 16px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 12, right: 12, height: 2, background: `linear-gradient(90deg, transparent, ${K.green}, transparent)`, opacity: 0.4, borderRadius: 1 }} />
        <p style={{ fontFamily: "'Lato',sans-serif", fontSize: 8, letterSpacing: "0.35em", color: K.textDim, textTransform: "uppercase" as const, marginBottom: 14 }}>{sideLabel}</p>
        {fatherName && (
          <div style={{ marginBottom: motherName ? 10 : 0 }}>
            <p style={{ fontFamily: "'Noto Serif Tamil',serif", fontSize: 15, color: K.text, fontWeight: 700, lineHeight: 1.3 }}>{fatherName}</p>
            <p style={{ fontSize: 9, color: K.green, letterSpacing: "0.15em", textTransform: "uppercase" as const, marginTop: 2 }}>அப்பா</p>
          </div>
        )}
        {fatherName && motherName && <div style={{ height: 1, background: K.border, margin: "8px auto", width: 32 }} />}
        {motherName && (
          <div>
            <p style={{ fontFamily: "'Noto Serif Tamil',serif", fontSize: 15, color: K.text, fontWeight: 700, lineHeight: 1.3 }}>{motherName}</p>
            <p style={{ fontSize: 9, color: K.green, letterSpacing: "0.15em", textTransform: "uppercase" as const, marginTop: 2 }}>அம்மா</p>
          </div>
        )}
        <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", width: 5, height: 5, borderRadius: "50%", background: K.kumkum, opacity: 0.45 }} />
      </div>
    </Reveal>
  );

  const RelativeCard = ({ rel, delay }: { rel: { name: string; relation: string; spouseName?: string }; delay: number }) => (
    <Reveal delay={delay}>
      <div style={{ background: "rgba(27,94,32,0.03)", border: `1px solid ${K.border}`, borderRadius: 5, padding: "11px 12px", textAlign: "center" }}>
        <p style={{ fontSize: 8, letterSpacing: "0.2em", color: K.lightGreen, textTransform: "uppercase" as const, marginBottom: 7, fontFamily: "'Lato',sans-serif" }}>{rel.relation}</p>
        <p style={{ fontFamily: "'Noto Serif Tamil',serif", fontSize: 13, color: K.text, fontWeight: 700, lineHeight: 1.3 }}>{rel.name}</p>
        {rel.spouseName && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "center", margin: "5px 0" }}>
              <div style={{ height: 1, flex: 1, background: K.border }} />
              <span style={{ fontSize: 9, color: K.kumkum, opacity: 0.7 }}>&amp;</span>
              <div style={{ height: 1, flex: 1, background: K.border }} />
            </div>
            <p style={{ fontFamily: "'Noto Serif Tamil',serif", fontSize: 12, color: K.textMid, lineHeight: 1.3, opacity: 0.8 }}>{rel.spouseName}</p>
          </>
        )}
      </div>
    </Reveal>
  );

  return (
    <section style={{ padding: "16px 14px 44px", maxWidth: 620, margin: "0 auto" }}>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <p style={{ fontFamily: "'Lato',sans-serif", fontSize: 9, letterSpacing: "0.5em", color: K.textDim, textTransform: "uppercase" as const, marginBottom: 6 }}>குடும்பத்தினர் ஆசியுடன்</p>
          <p style={{ fontFamily: "'Noto Serif Tamil',serif", fontSize: 21, color: K.green, fontWeight: 700 }}>நம் இரு குடும்பங்கள்</p>
        </div>
      </Reveal>

      {/* ── PARENTS — 2-col, full width ── */}
      {hasParents && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: hasRelatives ? 28 : 0 }}>
          {(couple.groomFatherName || couple.groomMotherName) && (
            <ParentsCard sideLabel={`${couple.groomName}'s Parents`} fatherName={couple.groomFatherName} motherName={couple.groomMotherName} delay={0.1} />
          )}
          {(couple.brideFatherName || couple.brideMotherName) && (
            <ParentsCard sideLabel={`${couple.brideName}'s Parents`} fatherName={couple.brideFatherName} motherName={couple.brideMotherName} delay={0.2} />
          )}
        </div>
      )}

      {/* ── RELATIVES — own section below, 2-col groom|bride ── */}
      {hasRelatives && (
        <>
          <Reveal delay={0.25}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0 20px" }}>
              <div style={{ flex: 1, height: 1, background: K.border }} />
              <p style={{ fontFamily: "'Lato',sans-serif", fontSize: 8, letterSpacing: "0.3em", color: K.textDim, textTransform: "uppercase" as const, whiteSpace: "nowrap" as const }}>உறவினர்கள்</p>
              <div style={{ flex: 1, height: 1, background: K.border }} />
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {groomRelatives.length > 0 && (<>
                <Reveal delay={0.28}><p style={{ fontFamily: "'Lato',sans-serif", fontSize: 8, letterSpacing: "0.25em", color: K.textDim, textTransform: "uppercase" as const, textAlign: "center", marginBottom: 4 }}>{couple.groomName}&apos;s Side</p></Reveal>
                {groomRelatives.map((rel, i) => <RelativeCard key={i} rel={rel} delay={0.3 + i * 0.07} />)}
              </>)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {brideRelatives.length > 0 && (<>
                <Reveal delay={0.28}><p style={{ fontFamily: "'Lato',sans-serif", fontSize: 8, letterSpacing: "0.25em", color: K.textDim, textTransform: "uppercase" as const, textAlign: "center", marginBottom: 4 }}>{couple.brideName}&apos;s Side</p></Reveal>
                {brideRelatives.map((rel, i) => <RelativeCard key={i} rel={rel} delay={0.3 + i * 0.07} />)}
              </>)}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default function KasiYatra({ couple }: KasiYatraProps) {
  const allEvents = couple.events?.length > 0 ? couple.events : [{ name: "Muhurtham", date: couple.weddingDate, time: couple.weddingTime, venue: couple.venue }];
  const slug = couple.slug ?? `${couple.groomName.toLowerCase().replace(/\s+/g, "-")}-weds-${couple.brideName.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Tamil:wght@400;600;700&family=Lato:wght@300;400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      <style>{`@keyframes sway{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}`}</style>

      <div style={{ minHeight: "100vh", background: `linear-gradient(180deg,${K.bg} 0%,${K.bg2} 50%,${K.bg} 100%)`, fontFamily: "'Lato',sans-serif", overflowX: "hidden" }} onContextMenu={e => e.preventDefault()}>

        <KolamStrip />

        {/* ── HERO ── */}
        <section style={{ position: "relative", minHeight: "92vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px 80px", textAlign: "center", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(27,94,32,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* Swaying banana leaves */}
          <div style={{ position: "absolute", left: -20, top: "15%", animation: "sway 4s ease-in-out infinite", transformOrigin: "bottom center", opacity: 0.15, pointerEvents: "none" }}>
            <svg width="80" height="200" viewBox="0 0 80 200">
              <path d="M40 200 Q20 160 10 120 Q0 80 20 40 Q30 20 40 0 Q50 20 60 40 Q80 80 70 120 Q60 160 40 200Z" fill={K.green} />
              <line x1="40" y1="0" x2="40" y2="200" stroke={K.bg} strokeWidth="1.5" opacity="0.4" />
            </svg>
          </div>
          <div style={{ position: "absolute", right: -20, top: "10%", animation: "sway 3.5s ease-in-out 1s infinite", transformOrigin: "bottom center", opacity: 0.12, transform: "scaleX(-1)", pointerEvents: "none" }}>
            <svg width="80" height="200" viewBox="0 0 80 200">
              <path d="M40 200 Q20 160 10 120 Q0 80 20 40 Q30 20 40 0 Q50 20 60 40 Q80 80 70 120 Q60 160 40 200Z" fill={K.green} />
              <line x1="40" y1="0" x2="40" y2="200" stroke={K.bg} strokeWidth="1.5" opacity="0.4" />
            </svg>
          </div>

          <Reveal><div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><GopuramSilhouette width={200} /></div></Reveal>

          <Reveal delay={0.08}>
            <p style={{ fontFamily: "'Lato',sans-serif", fontSize: 10, letterSpacing: "0.6em", color: K.green, textTransform: "uppercase" as const, marginBottom: 16, fontWeight: 700 }}>✦ ஓம் நமசிவாய ✦</p>
          </Reveal>

          <Reveal delay={0.14}><JasmineRow /></Reveal>

          <Reveal delay={0.18}>
            <h1 style={{ fontFamily: "'Noto Serif Tamil',serif", fontSize: "clamp(2.8rem,9vw,5rem)", color: K.text, fontWeight: 700, lineHeight: 1.08, marginBottom: 0 }}>
              {couple.groomName}
            </h1>
          </Reveal>

          <Reveal delay={0.25}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, margin: "14px 0" }}>
              <svg width="32" height="16" viewBox="0 0 32 16">
                <path d="M16 8 Q8 0 0 4 Q6 8 16 8Z" fill={K.green} opacity="0.5" />
                <path d="M16 8 Q8 16 0 12 Q6 8 16 8Z" fill={K.green} opacity="0.3" />
              </svg>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ height: 1, width: 28, background: K.borderGold }} />
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: K.kumkum, opacity: 0.8 }} />
                <div style={{ height: 1, width: 28, background: K.borderGold }} />
              </div>
              <svg width="32" height="16" viewBox="0 0 32 16" style={{ transform: "scaleX(-1)" }}>
                <path d="M16 8 Q8 0 0 4 Q6 8 16 8Z" fill={K.green} opacity="0.5" />
                <path d="M16 8 Q8 16 0 12 Q6 8 16 8Z" fill={K.green} opacity="0.3" />
              </svg>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <h1 style={{ fontFamily: "'Noto Serif Tamil',serif", fontSize: "clamp(2.8rem,9vw,5rem)", color: K.kumkum, fontWeight: 700, lineHeight: 1.08, marginBottom: 28 }}>
              {couple.brideName}
            </h1>
          </Reveal>

          {couple.couplePhotoUrl && (
            <Reveal delay={0.36}>
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "inline-block", padding: 3, background: `linear-gradient(135deg,${K.green},${K.goldBright},${K.kumkum})`, borderRadius: 6, boxShadow: "0 8px 36px rgba(27,94,32,0.18)" }}>
                  <div style={{ padding: 5, background: K.bg, borderRadius: 4 }}>
                    <Image src={couple.couplePhotoUrl} alt="Couple photo" width={200} height={260} style={{ objectFit: "cover", borderRadius: 3, display: "block" }} />
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          <Reveal delay={0.4}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "11px 26px", background: "rgba(27,94,32,0.07)", border: `1.5px solid ${K.borderBright}`, borderRadius: 4 }}>
              <Calendar size={13} color={K.green} />
              <span style={{ fontFamily: "'Noto Serif Tamil',serif", fontSize: 14, color: K.text, fontWeight: 600 }}>{formatWeddingDate(couple.weddingDate)}</span>
              <span style={{ color: K.border }}>·</span>
              <span style={{ fontSize: 13, color: K.textDim }}>{couple.weddingTime}</span>
            </div>
          </Reveal>

          <Reveal delay={0.46}>
            <p style={{ fontSize: 12, color: K.textDim, marginTop: 10, letterSpacing: "0.08em" }}>{couple.venue}</p>
          </Reveal>

          <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 2.2, repeat: Infinity }} style={{ position: "absolute", bottom: 24, color: K.green, fontSize: 18, opacity: 0.5 }}>↓</motion.div>
        </section>

        <BananaLeafDivider />

        {/* ── MESSAGE ── */}
        <section style={{ padding: "32px 28px 32px", maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ padding: "28px 24px", background: "rgba(27,94,32,0.04)", border: `1px solid ${K.border}`, borderRadius: 8, position: "relative" }}>
              {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h],i) => (
                <div key={i} style={{ position: "absolute" as const, [v]: 8, [h]: 8, width: 12, height: 12, borderTop: v==="top" ? `1.5px solid ${K.green}` : undefined, borderBottom: v==="bottom" ? `1.5px solid ${K.green}` : undefined, borderLeft: h==="left" ? `1.5px solid ${K.green}` : undefined, borderRight: h==="right" ? `1.5px solid ${K.green}` : undefined, opacity: 0.4 }} />
              ))}
              <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 17, color: K.textMid, lineHeight: 2 }}>
                {couple.personalMessage ? `"${couple.personalMessage}"` : `"இரு மனங்கள் ஒன்றாகும் இந்த மங்கல நாளில் நீங்கள் கலந்து கொண்டு ஆசி வழங்குமாறு அன்போடு அழைக்கிறோம்"`}
              </p>
            </div>
          </Reveal>
        </section>

        <BananaLeafDivider />

        {/* ── FAMILY ── */}
        <FamilySection couple={couple} />
        {(couple.groomFatherName || couple.groomMotherName || couple.brideFatherName || couple.brideMotherName || (couple.relatives && couple.relatives.length > 0)) && <BananaLeafDivider />}

        {/* ── EVENTS ── */}
        <section style={{ padding: "20px 24px 52px", maxWidth: 540, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontFamily: "'Lato',sans-serif", fontSize: 10, letterSpacing: "0.45em", color: K.green, textTransform: "uppercase" as const, textAlign: "center", marginBottom: 24, fontWeight: 700 }}>நிகழ்ச்சிகள்</p>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {allEvents.map((event, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ background: "rgba(27,94,32,0.04)", border: `1px solid ${K.border}`, borderRadius: 6, padding: "20px 20px", display: "flex", gap: 16 }}>
                  <div style={{ width: 3, minHeight: 48, background: i % 2 === 0 ? K.green : K.kumkum, flexShrink: 0, borderRadius: 2, opacity: 0.7 }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: "'Noto Serif Tamil',serif", fontSize: 17, color: K.text, fontWeight: 700, marginBottom: 10 }}>{event.name}</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: K.textMid }}><Calendar size={12} color={K.green} />{formatWeddingDate(event.date)}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: K.textMid }}><Clock size={12} color={K.green} />{event.time}</span>
                      {event.venue && <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: K.textDim }}><MapPin size={12} color={K.green} />{event.venue}</span>}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <BananaLeafDivider />

        {/* ── VENUE ── */}
        <section style={{ padding: "20px 24px 52px", maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, opacity: 0.35 }}><GopuramSilhouette width={140} /></div>
            <div style={{ background: "rgba(27,94,32,0.04)", border: `1.5px solid ${K.borderBright}`, borderRadius: 6, padding: "28px 22px", marginTop: -36, position: "relative", zIndex: 1 }}>
              <MapPin size={18} color={K.green} style={{ margin: "0 auto 12px", display: "block" }} />
              <h3 style={{ fontFamily: "'Noto Serif Tamil',serif", fontSize: 20, color: K.text, fontWeight: 700, marginBottom: 6 }}>{couple.venue}</h3>
              {couple.venueAddress && <p style={{ fontSize: 13, color: K.textDim, lineHeight: 1.8, marginBottom: 16 }}>{couple.venueAddress}</p>}
              {couple.mapLink && (
                <a href={couple.mapLink} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 24px", background: K.green, borderRadius: 4, color: "#fff", fontSize: 11, fontFamily: "'Lato',sans-serif", fontWeight: 700, letterSpacing: "0.15em", textDecoration: "none", textTransform: "uppercase" as const }}>
                  <MapPin size={11} /> வழி காட்டு
                </a>
              )}
            </div>
          </Reveal>
        </section>

        <BananaLeafDivider />

        {/* ── COUNTDOWN ── */}
        <section style={{ padding: "20px 24px 52px", textAlign: "center" }}>
          <Reveal>
            <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 17, color: K.textDim, marginBottom: 26 }}>மங்கல விழாவிற்கு இன்னும்...</p>
            <Countdown targetDate={couple.weddingDate} />
          </Reveal>
        </section>

        <BananaLeafDivider />

        {/* ── RSVP ── */}
        <section style={{ padding: "20px 24px 80px", maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <JasmineRow />
            <h2 style={{ fontFamily: "'Noto Serif Tamil',serif", fontSize: 24, color: K.green, fontWeight: 700, marginBottom: 8 }}>அன்பு அழைப்பு</h2>
            <p style={{ fontFamily: "'Lato',sans-serif", fontWeight: 300, fontSize: 13, color: K.textDim, lineHeight: 1.8, marginBottom: 26 }}>உங்கள் வருகை எங்களுக்கு மிகவும் மகிழ்ச்சி</p>
            <div style={{ textAlign: "left", marginBottom: 16 }}>
              <RSVPForm inviteSlug={slug} coupleName={`${couple.groomName} & ${couple.brideName}`} accentColor={K.green} theme="light" />
            </div>
            {couple.phone && (
              <button onClick={() => { const p = couple.phone?.replace(/\D/g, ""); window.open(`https://wa.me/${p}?text=${encodeURIComponent(`வணக்கம்! ${couple.groomName} & ${couple.brideName} திருமணத்திற்கு வருகிறோம்.`)}`, "_blank"); }} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 22px", background: "transparent", border: `1.5px solid ${K.borderBright}`, borderRadius: 4, color: K.green, fontFamily: "'Lato',sans-serif", fontSize: 11, cursor: "pointer", letterSpacing: "0.15em", textTransform: "uppercase" as const, marginTop: 12, fontWeight: 700 }}>
                <Phone size={11} /> WhatsApp
              </button>
            )}
            <BananaLeafDivider />
            <p style={{ fontFamily: "'Noto Serif Tamil',serif", fontStyle: "italic", fontSize: 17, color: K.textDim }}>{couple.groomName} & {couple.brideName}</p>
            <p style={{ fontSize: 10, color: `rgba(61,43,0,0.28)`, letterSpacing: "0.25em", textTransform: "uppercase" as const, marginTop: 8 }}>Made with WedCraft</p>
          </Reveal>
        </section>

        <KolamStrip />
      </div>

      {couple.bgMusicUrl && <MusicPlayer src={couple.bgMusicUrl} dark={false} accentColor={K.green} />}
    </>
  );
}