"use client";

import { useEffect, useState, useRef } from "react";
import { CoupleDetails } from "@/types/invite";
import { formatWeddingDate } from "@/lib/invite-utils";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Calendar, Clock } from "lucide-react";
import RSVPForm from "@/components/rsvp/RSVPForm";

interface AnandKarajProps {
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
      <div style={{ width: 64, height: 64, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 600, color: "#fff" }}>
        {String(v).padStart(2, "0")}
      </div>
      <span style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase" as const, fontFamily: "sans-serif" }}>{l}</span>
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
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

// Khanda SVG symbol
const Khanda = ({ size = 56, opacity = 0.9 }: { size?: number; opacity?: number }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none" style={{ opacity }}>
    <circle cx="28" cy="28" r="26" stroke="#F5C518" strokeWidth="1" fill="none" opacity="0.4" />
    <path d="M28 6 L28 50" stroke="#F5C518" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M14 16 C10 20 10 32 14 36 L28 30 L42 36 C46 32 46 20 42 16 L28 10 Z" stroke="#F5C518" strokeWidth="1.5" fill="rgba(245,197,24,0.15)" />
    <circle cx="28" cy="28" r="6" stroke="#F5C518" strokeWidth="1.5" fill="none" />
    <path d="M10 28 L18 28" stroke="#F5C518" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M38 28 L46 28" stroke="#F5C518" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Phulkari-inspired border pattern
const PhulkariBorder = () => (
  <div style={{ height: 8, background: "repeating-linear-gradient(90deg, #D4317A 0px, #D4317A 8px, #F5C518 8px, #F5C518 16px, #2E8B57 16px, #2E8B57 24px, #FF6B35 24px, #FF6B35 32px)", opacity: 0.8, width: "100%" }} />
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
      <div style={{ background:"rgba(245,197,24,0.07)", border:"1px solid rgba(245,197,24,0.25)", borderRadius:16, padding:"22px 16px", textAlign:"center", height:"100%" }}>
        <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:8, letterSpacing:"0.35em", color:"rgba(245,197,24,0.55)", textTransform:"uppercase" as const, marginBottom:14 }}>{sideLabel}</p>
        {fatherName && (<div style={{ marginBottom: motherName ? 12 : 0 }}>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:"#FFFDE7", lineHeight:1.3 }}>{fatherName}</p>
          <p style={{ fontSize:9, color:"rgba(245,197,24,0.4)", letterSpacing:"0.15em", textTransform:"uppercase" as const, marginTop:2 }}>Father</p>
        </div>)}
        {fatherName && motherName && <div style={{ height:"0.5px", background:"rgba(245,197,24,0.18)", margin:"10px auto", width:36 }} />}
        {motherName && (<div>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:"#FFFDE7", lineHeight:1.3 }}>{motherName}</p>
          <p style={{ fontSize:9, color:"rgba(245,197,24,0.4)", letterSpacing:"0.15em", textTransform:"uppercase" as const, marginTop:2 }}>Mother</p>
        </div>)}
      </div>
    </Reveal>
  );

  const RelativeCard = ({ rel, delay }: { rel: { name: string; relation: string; spouseName?: string }; delay: number }) => (
    <Reveal delay={delay}>
      <div style={{ background:"rgba(245,197,24,0.04)", border:"1px solid rgba(245,197,24,0.14)", borderRadius:10, padding:"12px", textAlign:"center" }}>
        <p style={{ fontSize:8, letterSpacing:"0.2em", color:"rgba(212,49,122,0.65)", textTransform:"uppercase" as const, marginBottom:7 }}>{rel.relation}</p>
        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:14, color:"#FFFDE7", lineHeight:1.3 }}>{rel.name}</p>
        {rel.spouseName && (<>
          <div style={{ display:"flex", alignItems:"center", gap:5, justifyContent:"center", margin:"5px 0" }}>
            <div style={{ height:"0.5px", flex:1, background:"rgba(245,197,24,0.18)" }} />
            <span style={{ fontSize:9, color:"rgba(245,197,24,0.5)" }}>&amp;</span>
            <div style={{ height:"0.5px", flex:1, background:"rgba(245,197,24,0.18)" }} />
          </div>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:13, color:"rgba(255,253,231,0.7)", lineHeight:1.3 }}>{rel.spouseName}</p>
        </>)}
      </div>
    </Reveal>
  );

  return (
    <section style={{ padding:"20px 20px 52px", maxWidth:580, margin:"0 auto" }}>
      <Reveal>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:9, letterSpacing:"0.4em", color:"rgba(245,197,24,0.5)", textTransform:"uppercase" as const, marginBottom:6 }}>ਵਾਹਿਗੁਰੂ ਦੀ ਮਿਹਰ ਨਾਲ</p>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"#FFFDE7" }}>Our Families</p>
        </div>
      </Reveal>

      {hasParents && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom: hasRelatives ? 28 : 0 }}>
          {(couple.groomFatherName || couple.groomMotherName) && (
            <ParentsCard sideLabel={`${couple.groomName}\'s Parents`} fatherName={couple.groomFatherName} motherName={couple.groomMotherName} delay={0.1} />
          )}
          {(couple.brideFatherName || couple.brideMotherName) && (
            <ParentsCard sideLabel={`${couple.brideName}\'s Parents`} fatherName={couple.brideFatherName} motherName={couple.brideMotherName} delay={0.2} />
          )}
        </div>
      )}

      {hasRelatives && (
        <>
          <Reveal delay={0.25}>
            <div style={{ display:"flex", alignItems:"center", gap:10, margin:"4px 0 20px" }}>
              <div style={{ flex:1, height:"0.5px", background:"rgba(245,197,24,0.2)" }} />
              <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:8, letterSpacing:"0.3em", color:"rgba(245,197,24,0.4)", textTransform:"uppercase" as const, whiteSpace:"nowrap" as const }}>Extended Family</p>
              <div style={{ flex:1, height:"0.5px", background:"rgba(245,197,24,0.2)" }} />
            </div>
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {groomRelatives.length > 0 && (<>
                <Reveal delay={0.28}><p style={{ fontFamily:"'Poppins',sans-serif", fontSize:7, letterSpacing:"0.22em", color:"rgba(245,197,24,0.35)", textTransform:"uppercase" as const, textAlign:"center", marginBottom:4 }}>{couple.groomName}&apos;s Side</p></Reveal>
                {groomRelatives.map((rel, i) => <RelativeCard key={i} rel={rel} delay={0.3 + i * 0.07} />)}
              </>)}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {brideRelatives.length > 0 && (<>
                <Reveal delay={0.28}><p style={{ fontFamily:"'Poppins',sans-serif", fontSize:7, letterSpacing:"0.22em", color:"rgba(245,197,24,0.35)", textTransform:"uppercase" as const, textAlign:"center", marginBottom:4 }}>{couple.brideName}&apos;s Side</p></Reveal>
                {brideRelatives.map((rel, i) => <RelativeCard key={i} rel={rel} delay={0.3 + i * 0.07} />)}
              </>)}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default function AnandKaraj({ couple }: AnandKarajProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleWhatsApp = () => {
    const phone = couple.phone?.replace(/\D/g, "");
    const msg = encodeURIComponent(`Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh! 🙏 We are honoured to attend the Anand Karaj of ${couple.groomName} & ${couple.brideName} on ${formatWeddingDate(couple.weddingDate)}.`);
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  const allEvents = couple.events?.length > 0
    ? couple.events
    : [{ name: "Anand Karaj", date: couple.weddingDate, time: couple.weddingTime, venue: couple.venue }];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Poppins:wght@300;400;500&family=Yatra+One&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes petalFall { 0%{transform:translateY(-20px) rotate(0deg);opacity:.8} 100%{transform:translateY(110vh) rotate(360deg);opacity:0} }
        @keyframes glow { 0%,100%{opacity:.6} 50%{opacity:1} }
      `}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #1a0a2e 0%, #2d1b4e 40%, #1a0a2e 100%)", fontFamily: "'Poppins',sans-serif", overflowX: "hidden" }}
        onContextMenu={(e) => e.preventDefault()}>

        {/* Phulkari borders */}
        <PhulkariBorder />

        {/* Falling flower petals */}
        {mounted && Array.from({ length: 14 }).map((_, i) => (
          <div key={i} style={{ position: "fixed", top: -20, left: `${4 + i * 6.8}%`, width: i % 3 === 0 ? 10 : 7, height: i % 3 === 0 ? 14 : 10, borderRadius: "50% 0 50% 0", background: i % 4 === 0 ? "#D4317A" : i % 4 === 1 ? "#F5C518" : i % 4 === 2 ? "#FF6B35" : "#2E8B57", opacity: 0.7, animation: `petalFall ${4 + (i % 4)}s linear ${i * 0.45}s infinite`, pointerEvents: "none", zIndex: 1 }} />
        ))}

        {/* ── SECTION 1 — Hero ────────────────────────────────── */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px 100px", textAlign: "center", overflow: "hidden" }}>

          {/* Background radial glow */}
          <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", width: 400, height: 400, background: "radial-gradient(circle, rgba(212,49,122,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

          <Reveal>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 300, fontSize: 11, letterSpacing: "0.4em", color: "rgba(245,197,24,0.7)", textTransform: "uppercase" as const, marginBottom: 20 }}>
              ੴ ਸਤਿ ਨਾਮੁ
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{ marginBottom: 20 }}>
              <Khanda size={64} opacity={0.95} />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 300, fontSize: 11, letterSpacing: "0.3em", color: "rgba(245,197,24,0.5)", textTransform: "uppercase" as const, marginBottom: 24 }}>
              Together in Waheguru&apos;s Grace
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 600, fontSize: "clamp(2.8rem,9vw,5rem)", color: "#fff", letterSpacing: "0.08em", lineHeight: 1.1, marginBottom: 6 }}>
              {couple.groomName.toUpperCase()}
            </h1>
          </Reveal>

          <Reveal delay={0.25}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "10px 0" }}>
              <div style={{ height: 1, width: 48, background: "rgba(245,197,24,0.5)" }} />
              <span style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 20, color: "#F5C518" }}>weds</span>
              <div style={{ height: 1, width: 48, background: "rgba(245,197,24,0.5)" }} />
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 600, fontSize: "clamp(2.8rem,9vw,5rem)", color: "#D4317A", letterSpacing: "0.08em", lineHeight: 1.1, marginBottom: 32 }}>
              {couple.brideName.toUpperCase()}
            </h1>
          </Reveal>

          <Reveal delay={0.4}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 26px", background: "rgba(245,197,24,0.1)", border: "1px solid rgba(245,197,24,0.35)", borderRadius: 40 }}>
              <Calendar size={13} color="#F5C518" />
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: "#fff" }}>{formatWeddingDate(couple.weddingDate)}</span>
              <span style={{ color: "rgba(245,197,24,0.4)" }}>·</span>
              <span style={{ fontSize: 13, color: "rgba(245,197,24,0.7)" }}>{couple.weddingTime}</span>
            </div>
          </Reveal>

          <Reveal delay={0.5}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 10 }}>{couple.venue}</p>
          </Reveal>

          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.2, repeat: Infinity }} style={{ position: "absolute", bottom: 32, color: "#F5C518", opacity: 0.4, fontSize: 20 }}>↓</motion.div>
        </section>

        <PhulkariBorder />

        {/* ── SECTION 2 — Blessing ─────────────────────────────── */}
        <section style={{ padding: "60px 24px", maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 28 }}>
              <div style={{ height: 1, flex: 1, background: "linear-gradient(to right, transparent, rgba(245,197,24,0.4))" }} />
              <Khanda size={24} opacity={0.7} />
              <div style={{ height: 1, flex: 1, background: "linear-gradient(to left, transparent, rgba(245,197,24,0.4))" }} />
            </div>
            <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 20, color: "rgba(255,255,255,0.75)", lineHeight: 1.9 }}>
              {couple.personalMessage
                ? `"${couple.personalMessage}"`
                : `"In the union of two souls, the Guru's grace shines. We humbly invite you to witness and bless this sacred Anand Karaj."`}
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 28 }}>
              <div style={{ height: 1, flex: 1, background: "linear-gradient(to right, transparent, rgba(245,197,24,0.4))" }} />
              <Khanda size={24} opacity={0.7} />
              <div style={{ height: 1, flex: 1, background: "linear-gradient(to left, transparent, rgba(245,197,24,0.4))" }} />
            </div>
          </Reveal>
        </section>

        {/* ── SECTION 2.5 — Family ─────────────────────────────── */}
        <FamilySection couple={couple} />
        {(couple.groomFatherName || couple.groomMotherName || couple.brideFatherName || couple.brideMotherName || (couple.relatives && couple.relatives.length > 0)) && (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, margin:"0 0 8px", padding:"0 24px" }}>
            <div style={{ height:1, flex:1, background:"linear-gradient(to right, transparent, rgba(245,197,24,0.4))" }}/>
            <span style={{ fontSize:18, color:"#F5C518", opacity:0.6 }}>ੴ</span>
            <div style={{ height:1, flex:1, background:"linear-gradient(to left, transparent, rgba(245,197,24,0.4))" }}/>
          </div>
        )}

        {/* ── SECTION 3 — Events ───────────────────────────────── */}
        <section style={{ padding: "20px 24px 60px", maxWidth: 560, margin: "0 auto" }}>
          <Reveal>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 500, fontSize: 11, letterSpacing: "0.4em", color: "rgba(245,197,24,0.6)", textTransform: "uppercase" as const, textAlign: "center", marginBottom: 32 }}>
              Celebrations
            </h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {allEvents.map((event, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(245,197,24,0.2)", borderRadius: 20, padding: "26px 28px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: "linear-gradient(to bottom, #D4317A, #F5C518)", borderRadius: "4px 0 0 4px" }} />
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: "#fff", marginBottom: 12 }}>{event.name}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Calendar size={13} color="rgba(245,197,24,0.6)" /><span style={{ fontSize: 14, color: "rgba(255,255,255,0.75)" }}>{formatWeddingDate(event.date)}</span></div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Clock size={13} color="rgba(245,197,24,0.6)" /><span style={{ fontSize: 14, color: "rgba(255,255,255,0.75)" }}>{event.time}</span></div>
                    {event.venue && <div style={{ display: "flex", alignItems: "center", gap: 8 }}><MapPin size={13} color="rgba(245,197,24,0.6)" /><span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{event.venue}</span></div>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── SECTION 4 — Venue ────────────────────────────────── */}
        <section style={{ padding: "20px 24px 60px", maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 500, fontSize: 11, letterSpacing: "0.4em", color: "rgba(245,197,24,0.6)", textTransform: "uppercase" as const, marginBottom: 24 }}>Venue</h2>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(245,197,24,0.2)", borderRadius: 22, padding: "36px 28px" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(245,197,24,0.1)", border: "1px solid rgba(245,197,24,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <MapPin size={18} color="#F5C518" />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#fff", marginBottom: 8 }}>{couple.venue}</h3>
              {couple.venueAddress && <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, marginBottom: 20 }}>{couple.venueAddress}</p>}
              {couple.mapLink && (
                <a href={couple.mapLink} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 26px", border: "1px solid rgba(245,197,24,0.4)", borderRadius: 40, color: "#F5C518", fontSize: 11, fontFamily: "'Poppins',sans-serif", letterSpacing: "0.15em", textDecoration: "none", textTransform: "uppercase" as const }}>
                  <MapPin size={12} /> View on Maps
                </a>
              )}
            </div>
          </Reveal>
        </section>

        {/* ── SECTION 5 — Countdown ─────────────────────────────── */}
        <section style={{ padding: "20px 24px 60px", textAlign: "center" }}>
          <Reveal>
            <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 20, color: "rgba(255,255,255,0.5)", marginBottom: 32 }}>Counting down to the blessed day</p>
            <Countdown targetDate={couple.weddingDate} />
          </Reveal>
        </section>

        <PhulkariBorder />

        {/* ── SECTION 6 — RSVP ─────────────────────────────────── */}
        <section style={{ padding: "40px 24px 80px", maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Khanda size={40} opacity={0.6} />
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 500, fontSize: 13, letterSpacing: "0.35em", color: "rgba(245,197,24,0.7)", textTransform: "uppercase" as const, marginTop: 16, marginBottom: 8 }}>Join Our Celebration</h2>
            <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 18, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: 28 }}>
              Your presence and blessings would make this day truly complete
            </p>
            <div style={{ textAlign: "left", marginBottom: 20 }}>
              <RSVPForm
                 inviteSlug={
    couple.slug ??
    `${couple.groomName.toLowerCase().replace(/\s+/g, "-")}-weds-${couple.brideName.toLowerCase().replace(/\s+/g, "-")}`
  }
                coupleName={`${couple.groomName} & ${couple.brideName}`}
                accentColor="#F5C518"
                theme="dark"
              />
            </div>
            {couple.phone && (
              <button onClick={handleWhatsApp}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 22px", background: "transparent", borderRadius: 40, border: "1px solid rgba(245,197,24,0.3)", color: "rgba(245,197,24,0.7)", fontFamily: "'Poppins',sans-serif", fontSize: 11, letterSpacing: "0.15em", cursor: "pointer", textTransform: "uppercase" as const }}>
                <Phone size={12} /> Also WhatsApp us
              </button>
            )}
            <div style={{ marginTop: 40 }}>
              <Khanda size={32} opacity={0.3} />
              <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 16, color: "rgba(245,197,24,0.35)", marginTop: 8 }}>
                {couple.groomName} & {couple.brideName} · {new Date(couple.weddingDate).getFullYear()}
              </p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", letterSpacing: "0.25em", textTransform: "uppercase" as const, marginTop: 6 }}>Made with WedCraft</p>
            </div>
          </Reveal>
        </section>

        <PhulkariBorder />
      </div>
    </>
  );
}