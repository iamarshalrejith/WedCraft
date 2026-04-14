"use client";

import { useEffect, useState, useRef } from "react";
import { CoupleDetails } from "@/types/invite";
import { formatWeddingDate } from "@/lib/invite-utils";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Calendar, Clock } from "lucide-react";
import RSVPForm from "@/components/rsvp/RSVPForm";

interface SacredVowsProps {
  couple: CoupleDetails;
}

function Countdown({ targetDate }: { targetDate: string }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return;
      setT({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const Box = ({ v, l }: { v: number; l: string }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ width: 64, height: 64, background: "rgba(255,255,255,0.85)", border: "1px solid rgba(180,160,130,0.3)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'EB Garamond',serif", fontSize: 26, fontWeight: 500, color: "#4A3728", boxShadow: "0 2px 12px rgba(180,160,130,0.15)" }}>
        {String(v).padStart(2, "0")}
      </div>
      <span style={{ fontSize: 10, letterSpacing: "0.2em", color: "#8B7355", textTransform: "uppercase" as const, fontFamily: "'Lato',sans-serif" }}>{l}</span>
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
      <Box v={t.d} l="Days" /><Box v={t.h} l="Hours" /><Box v={t.m} l="Mins" /><Box v={t.s} l="Secs" />
    </div>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

// Simple cross ornament
const Cross = ({ size = 32, color = "#8B7355", opacity = 0.7 }: { size?: number; color?: string; opacity?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ opacity }}>
    <rect x="14" y="2" width="4" height="28" rx="2" fill={color} />
    <rect x="4" y="10" width="24" height="4" rx="2" fill={color} />
  </svg>
);

// Floral corner SVG
const FloralCorner = ({ opacity = 0.12 }: { opacity?: number }) => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" style={{ opacity }}>
    <path d="M5 5 Q20 5 20 20 Q20 5 35 5" stroke="#6B8F5E" strokeWidth="1.5" fill="none" />
    <path d="M5 5 Q5 20 20 20 Q5 20 5 35" stroke="#6B8F5E" strokeWidth="1.5" fill="none" />
    <circle cx="20" cy="20" r="4" fill="#6B8F5E" opacity="0.5" />
    <circle cx="12" cy="12" r="2" fill="#C4956A" opacity="0.6" />
    <circle cx="30" cy="8" r="1.5" fill="#C4956A" opacity="0.5" />
    <circle cx="8" cy="30" r="1.5" fill="#C4956A" opacity="0.5" />
    <path d="M25 15 Q30 10 35 15 Q30 20 25 15Z" fill="#6B8F5E" opacity="0.4" />
    <path d="M15 25 Q10 30 15 35 Q20 30 15 25Z" fill="#6B8F5E" opacity="0.4" />
  </svg>
);

const SageDivider = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, margin: "28px 0" }}>
    <div style={{ height: "0.5px", flex: 1, background: "linear-gradient(to right, transparent, rgba(107,143,94,0.5))" }} />
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path d="M12 2 C8 2 4 6 4 10 C4 14 8 18 12 22 C16 18 20 14 20 10 C20 6 16 2 12 2Z" fill="#6B8F5E" opacity="0.5" />
      <circle cx="12" cy="12" r="2" fill="#C4956A" opacity="0.7" />
    </svg>
    <div style={{ height: "0.5px", flex: 1, background: "linear-gradient(to left, transparent, rgba(107,143,94,0.5))" }} />
  </div>
);


// ─── Family Section ───────────────────────────────────────────────────────────
function FamilySection({ couple }: { couple: CoupleDetails }) {
  const hasParents = couple.groomFatherName || couple.groomMotherName || couple.brideFatherName || couple.brideMotherName;
  const hasRelatives = couple.relatives && couple.relatives.length > 0;
  if (!hasParents && !hasRelatives) return null;

  const groomRelatives = couple.relatives?.filter((r) => r.side === "groom") ?? [];
  const brideRelatives = couple.relatives?.filter((r) => r.side === "bride") ?? [];

  const ParentsCard = ({ sideLabel, fatherName, motherName, delay }: { sideLabel: string; fatherName?: string; motherName?: string; delay: number }) => (
    <Reveal delay={delay}>
      <div style={{ background:"rgba(255,255,255,0.8)", border:"1px solid rgba(180,160,130,0.28)", borderRadius:12, padding:"22px 16px", textAlign:"center", height:"100%", boxShadow:"0 2px 12px rgba(139,115,85,0.08)" }}>
        <p style={{ fontFamily:"'Lato',sans-serif", fontSize:8, letterSpacing:"0.32em", color:"rgba(139,115,85,0.6)", textTransform:"uppercase" as const, marginBottom:14 }}>{sideLabel}</p>
        {fatherName && (<div style={{ marginBottom: motherName ? 12 : 0 }}>
          <p style={{ fontFamily:"'EB Garamond',serif", fontSize:16, color:"#4A3728", lineHeight:1.3 }}>{fatherName}</p>
          <p style={{ fontSize:9, color:"rgba(107,143,94,0.7)", letterSpacing:"0.15em", textTransform:"uppercase" as const, marginTop:2 }}>Father</p>
        </div>)}
        {fatherName && motherName && <div style={{ height:"0.5px", background:"rgba(180,160,130,0.3)", margin:"10px auto", width:36 }} />}
        {motherName && (<div>
          <p style={{ fontFamily:"'EB Garamond',serif", fontSize:16, color:"#4A3728", lineHeight:1.3 }}>{motherName}</p>
          <p style={{ fontSize:9, color:"rgba(107,143,94,0.7)", letterSpacing:"0.15em", textTransform:"uppercase" as const, marginTop:2 }}>Mother</p>
        </div>)}
      </div>
    </Reveal>
  );

  const RelativeCard = ({ rel, delay }: { rel: { name: string; relation: string; spouseName?: string }; delay: number }) => (
    <Reveal delay={delay}>
      <div style={{ background:"rgba(255,255,255,0.7)", border:"1px solid rgba(180,160,130,0.2)", borderRadius:8, padding:"11px", textAlign:"center", borderLeft:"2px solid rgba(107,143,94,0.45)" }}>
        <p style={{ fontSize:8, letterSpacing:"0.2em", color:"rgba(107,143,94,0.7)", textTransform:"uppercase" as const, marginBottom:6, fontFamily:"'Lato',sans-serif" }}>{rel.relation}</p>
        <p style={{ fontFamily:"'EB Garamond',serif", fontSize:14, color:"#4A3728", lineHeight:1.3 }}>{rel.name}</p>
        {rel.spouseName && (<>
          <div style={{ display:"flex", alignItems:"center", gap:5, justifyContent:"center", margin:"4px 0" }}>
            <div style={{ height:"0.5px", flex:1, background:"rgba(180,160,130,0.3)" }} />
            <span style={{ fontSize:9, color:"rgba(139,115,85,0.5)" }}>&amp;</span>
            <div style={{ height:"0.5px", flex:1, background:"rgba(180,160,130,0.3)" }} />
          </div>
          <p style={{ fontFamily:"'EB Garamond',serif", fontSize:13, color:"rgba(74,55,40,0.65)", lineHeight:1.3 }}>{rel.spouseName}</p>
        </>)}
      </div>
    </Reveal>
  );

  return (
    <section style={{ padding:"20px 20px 48px", maxWidth:580, margin:"0 auto" }}>
      <Reveal>
        <div style={{ textAlign:"center", marginBottom:26 }}>
          <p style={{ fontFamily:"'Lato',sans-serif", fontSize:9, letterSpacing:"0.4em", color:"rgba(139,115,85,0.6)", textTransform:"uppercase" as const, marginBottom:6 }}>With Family Blessings</p>
          <p style={{ fontFamily:"'EB Garamond',serif", fontSize:22, color:"#4A3728" }}>Our Beloved Families</p>
        </div>
      </Reveal>

      {hasParents && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom: hasRelatives ? 26 : 0 }}>
          {(couple.groomFatherName || couple.groomMotherName) && (
            <ParentsCard sideLabel={`${couple.groomName}'s Parents`} fatherName={couple.groomFatherName} motherName={couple.groomMotherName} delay={0.1} />
          )}
          {(couple.brideFatherName || couple.brideMotherName) && (
            <ParentsCard sideLabel={`${couple.brideName}'s Parents`} fatherName={couple.brideFatherName} motherName={couple.brideMotherName} delay={0.2} />
          )}
        </div>
      )}

      {hasRelatives && (
        <>
          <Reveal delay={0.25}>
            <div style={{ display:"flex", alignItems:"center", gap:10, margin:"4px 0 18px" }}>
              <div style={{ flex:1, height:"0.5px", background:"rgba(107,143,94,0.3)" }} />
              <p style={{ fontFamily:"'Lato',sans-serif", fontSize:8, letterSpacing:"0.28em", color:"rgba(139,115,85,0.5)", textTransform:"uppercase" as const, whiteSpace:"nowrap" as const }}>Extended Family</p>
              <div style={{ flex:1, height:"0.5px", background:"rgba(107,143,94,0.3)" }} />
            </div>
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {groomRelatives.length > 0 && (<>
                <Reveal delay={0.28}><p style={{ fontFamily:"'Lato',sans-serif", fontSize:7, letterSpacing:"0.22em", color:"rgba(139,115,85,0.45)", textTransform:"uppercase" as const, textAlign:"center", marginBottom:4 }}>{couple.groomName}&apos;s Side</p></Reveal>
                {groomRelatives.map((rel, i) => <RelativeCard key={i} rel={rel} delay={0.3 + i * 0.07} />)}
              </>)}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {brideRelatives.length > 0 && (<>
                <Reveal delay={0.28}><p style={{ fontFamily:"'Lato',sans-serif", fontSize:7, letterSpacing:"0.22em", color:"rgba(139,115,85,0.45)", textTransform:"uppercase" as const, textAlign:"center", marginBottom:4 }}>{couple.brideName}&apos;s Side</p></Reveal>
                {brideRelatives.map((rel, i) => <RelativeCard key={i} rel={rel} delay={0.3 + i * 0.07} />)}
              </>)}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default function SacredVows({ couple }: SacredVowsProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleWhatsApp = () => {
    const phone = couple.phone?.replace(/\D/g, "");
    const msg = encodeURIComponent(`Praise the Lord! 🙏 We are delighted to attend the wedding of ${couple.groomName} & ${couple.brideName} on ${formatWeddingDate(couple.weddingDate)}.`);
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  const allEvents = couple.events?.length > 0
    ? couple.events
    : [{ name: "Wedding Ceremony", date: couple.weddingDate, time: couple.weddingTime, venue: couple.venue }];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Lato:wght@300;400&family=Tangerine:wght@400;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes petalFloat { 0%{transform:translateY(-10px) rotate(0deg);opacity:.6} 100%{transform:translateY(105vh) rotate(480deg);opacity:0} }
      `}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #FAF7F0 0%, #F5EFE4 40%, #EDE6D6 100%)", fontFamily: "'Lato',sans-serif", overflowX: "hidden" }}
        onContextMenu={(e) => e.preventDefault()}>

        {/* Floating petals */}
        {mounted && Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{ position: "fixed", top: -15, left: `${5 + i * 9}%`, width: 7, height: 10, borderRadius: "50% 0 50% 0", background: i % 2 === 0 ? "#D4E6C3" : "#C4956A", opacity: 0.5, animation: `petalFloat ${5 + (i % 4)}s linear ${i * 0.6}s infinite`, pointerEvents: "none", zIndex: 1 }} />
        ))}

        {/* ── SECTION 1 — Hero ────────────────────────────────── */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px 100px", textAlign: "center" }}>

          {/* Corner florals */}
          <div style={{ position: "absolute", top: 0, left: 0 }}><FloralCorner /></div>
          <div style={{ position: "absolute", top: 0, right: 0, transform: "scaleX(-1)" }}><FloralCorner /></div>
          <div style={{ position: "absolute", bottom: 0, left: 0, transform: "scaleY(-1)" }}><FloralCorner /></div>
          <div style={{ position: "absolute", bottom: 0, right: 0, transform: "scale(-1)" }}><FloralCorner /></div>

          <Reveal>
            <Cross size={40} color="#8B7355" opacity={0.8} />
          </Reveal>

          <Reveal delay={0.1}>
            <p style={{ fontFamily: "'Lato',sans-serif", fontWeight: 300, fontSize: 11, letterSpacing: "0.4em", color: "#8B7355", textTransform: "uppercase" as const, marginTop: 16, marginBottom: 24 }}>
              United in God&apos;s Love
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <h1 style={{ fontFamily: "'Tangerine',cursive", fontWeight: 700, fontSize: "clamp(4rem,12vw,7rem)", color: "#4A3728", lineHeight: 1, marginBottom: 4 }}>
              {couple.groomName}
            </h1>
          </Reveal>

          <Reveal delay={0.25}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "8px 0" }}>
              <div style={{ height: "0.5px", width: 48, background: "rgba(139,115,85,0.4)" }} />
              <span style={{ fontFamily: "'EB Garamond',serif", fontStyle: "italic", fontSize: 18, color: "#6B8F5E" }}>and</span>
              <div style={{ height: "0.5px", width: 48, background: "rgba(139,115,85,0.4)" }} />
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <h1 style={{ fontFamily: "'Tangerine',cursive", fontWeight: 700, fontSize: "clamp(4rem,12vw,7rem)", color: "#6B8F5E", lineHeight: 1, marginBottom: 28 }}>
              {couple.brideName}
            </h1>
          </Reveal>

          <Reveal delay={0.4}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 26px", background: "rgba(255,255,255,0.8)", border: "1px solid rgba(139,115,85,0.25)", borderRadius: 40, backdropFilter: "blur(8px)" }}>
              <Calendar size={13} color="#8B7355" />
              <span style={{ fontFamily: "'EB Garamond',serif", fontSize: 15, color: "#4A3728" }}>{formatWeddingDate(couple.weddingDate)}</span>
              <span style={{ color: "rgba(139,115,85,0.4)" }}>·</span>
              <span style={{ fontSize: 13, color: "#8B7355" }}>{couple.weddingTime}</span>
            </div>
          </Reveal>

          <Reveal delay={0.5}>
            <p style={{ fontFamily: "'Lato',sans-serif", fontSize: 13, color: "#A08060", marginTop: 10 }}>{couple.venue}</p>
          </Reveal>

          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.2, repeat: Infinity }} style={{ position: "absolute", bottom: 32, color: "#8B7355", opacity: 0.4, fontSize: 20 }}>↓</motion.div>
        </section>

        {/* ── SECTION 2 — Scripture / Message ─────────────────── */}
        <section style={{ padding: "60px 24px", maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <SageDivider />
            <p style={{ fontFamily: "'EB Garamond',serif", fontStyle: "italic", fontSize: 20, color: "#4A3728", lineHeight: 1.9 }}>
              {couple.personalMessage
                ? `"${couple.personalMessage}"`
                : `"And now these three remain: faith, hope and love. But the greatest of these is love." — 1 Corinthians 13:13`}
            </p>
            <SageDivider />
          </Reveal>
        </section>

        {/* ── SECTION 2.5 — Family ─────────────────────────────── */}
        <FamilySection couple={couple} />
        {(couple.groomFatherName || couple.groomMotherName || couple.brideFatherName || couple.brideMotherName || (couple.relatives && couple.relatives.length > 0)) && (
          <div style={{ padding:"0 24px", marginBottom:8 }}><SageDivider /></div>
        )}

        {/* ── SECTION 3 — Events ───────────────────────────────── */}
        <section style={{ padding: "20px 24px 60px", maxWidth: 560, margin: "0 auto" }}>
          <Reveal>
            <h2 style={{ fontFamily: "'Lato',sans-serif", fontWeight: 400, fontSize: 11, letterSpacing: "0.3em", color: "#8B7355", textTransform: "uppercase" as const, textAlign: "center", marginBottom: 32 }}>
              Celebrations
            </h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {allEvents.map((event, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ background: "rgba(255,255,255,0.75)", border: "1px solid rgba(139,115,85,0.18)", borderRadius: 20, padding: "26px 28px", backdropFilter: "blur(8px)", display: "flex", gap: 20 }}>
                  <div style={{ width: 3, borderRadius: 4, background: "linear-gradient(to bottom, #6B8F5E, #C4956A)", minHeight: 56, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: "'EB Garamond',serif", fontSize: 20, color: "#4A3728", marginBottom: 10 }}>{event.name}</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Calendar size={13} color="#8B7355" /><span style={{ fontSize: 14, color: "#6B5040" }}>{formatWeddingDate(event.date)}</span></div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Clock size={13} color="#8B7355" /><span style={{ fontSize: 14, color: "#6B5040" }}>{event.time}</span></div>
                      {event.venue && <div style={{ display: "flex", alignItems: "center", gap: 8 }}><MapPin size={13} color="#8B7355" /><span style={{ fontSize: 13, color: "#8B7355" }}>{event.venue}</span></div>}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── SECTION 4 — Venue ────────────────────────────────── */}
        <section style={{ padding: "20px 24px 60px", maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <h2 style={{ fontFamily: "'Lato',sans-serif", fontWeight: 400, fontSize: 11, letterSpacing: "0.3em", color: "#8B7355", textTransform: "uppercase" as const, marginBottom: 24 }}>Venue</h2>
            <div style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(139,115,85,0.18)", borderRadius: 24, padding: "36px 28px", backdropFilter: "blur(10px)" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(107,143,94,0.1)", border: "1px solid rgba(107,143,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <MapPin size={18} color="#6B8F5E" />
              </div>
              <h3 style={{ fontFamily: "'EB Garamond',serif", fontSize: 22, color: "#4A3728", marginBottom: 8 }}>{couple.venue}</h3>
              {couple.venueAddress && <p style={{ fontSize: 14, color: "#8B7355", lineHeight: 1.8, marginBottom: 20 }}>{couple.venueAddress}</p>}
              {couple.mapLink && (
                <a href={couple.mapLink} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 26px", background: "#6B8F5E", borderRadius: 40, color: "#fff", fontSize: 12, fontFamily: "'Lato',sans-serif", letterSpacing: "0.12em", textDecoration: "none", textTransform: "uppercase" as const }}>
                  <MapPin size={13} /> View on Maps
                </a>
              )}
            </div>
          </Reveal>
        </section>

        {/* ── SECTION 5 — Countdown ─────────────────────────────── */}
        <section style={{ padding: "20px 24px 60px", textAlign: "center" }}>
          <Reveal>
            <p style={{ fontFamily: "'EB Garamond',serif", fontStyle: "italic", fontSize: 20, color: "#6B5040", marginBottom: 32 }}>Counting the days until &ldquo;I do&rdquo;</p>
            <Countdown targetDate={couple.weddingDate} />
          </Reveal>
        </section>

        {/* ── SECTION 6 — RSVP ─────────────────────────────────── */}
        <section style={{ padding: "20px 24px 80px", maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <SageDivider />
            <Cross size={28} color="#6B8F5E" opacity={0.6} />
            <h2 style={{ fontFamily: "'EB Garamond',serif", fontSize: 26, color: "#4A3728", marginTop: 12, marginBottom: 8 }}>Will you join us?</h2>
            <p style={{ fontFamily: "'Lato',sans-serif", fontSize: 14, color: "#8B7355", lineHeight: 1.8, marginBottom: 28 }}>
              Your presence would be our greatest blessing.
            </p>
            <div style={{ textAlign: "left", marginBottom: 20 }}>
              <RSVPForm
                inviteSlug={
    couple.slug ??
    `${couple.groomName.toLowerCase().replace(/\s+/g, "-")}-weds-${couple.brideName.toLowerCase().replace(/\s+/g, "-")}`
  }
                coupleName={`${couple.groomName} & ${couple.brideName}`}
                accentColor="#6B8F5E"
                theme="light"
              />
            </div>
            {couple.phone && (
              <button onClick={handleWhatsApp}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 20px", background: "transparent", borderRadius: 40, border: "1px solid rgba(107,143,94,0.4)", color: "#6B8F5E", fontFamily: "'Lato',sans-serif", fontSize: 12, cursor: "pointer" }}>
                <Phone size={12} /> Also WhatsApp us
              </button>
            )}
            <SageDivider />
            <div>
              <p style={{ fontFamily: "'Tangerine',cursive", fontWeight: 700, fontSize: 26, color: "#8B7355" }}>
                {couple.groomName} & {couple.brideName}
              </p>
              <p style={{ fontSize: 10, color: "#B0A090", letterSpacing: "0.2em", textTransform: "uppercase" as const, marginTop: 6 }}>Made with WedCraft</p>
            </div>
          </Reveal>
        </section>
      </div>
    </>
  );
}