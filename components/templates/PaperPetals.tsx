"use client";

import { useEffect, useState, useRef } from "react";
import { CoupleDetails } from "@/types/invite";
import { formatWeddingDate } from "@/lib/invite-utils";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Calendar } from "lucide-react";
import RSVPForm from "@/components/rsvp/RSVPForm";

interface PaperPetalsProps {
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

  return (
    <div style={{ display: "flex", gap: 0, justifyContent: "center", borderTop: "1px solid #E8E4DF", borderBottom: "1px solid #E8E4DF", padding: "20px 0" }}>
      {[{ v: t.d, l: "Days" }, { v: t.h, l: "Hrs" }, { v: t.m, l: "Min" }, { v: t.s, l: "Sec" }].map(({ v, l }, i) => (
        <div key={l} style={{ flex: 1, textAlign: "center", borderRight: i < 3 ? "1px solid #E8E4DF" : "none", padding: "8px 0" }}>
          <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 32, color: "#1A1A1A", lineHeight: 1 }}>{String(v).padStart(2, "0")}</div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: "#999", letterSpacing: "0.15em", textTransform: "uppercase" as const, marginTop: 4 }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

// Minimal ruled line
const Rule = ({ margin = "32px 0" }: { margin?: string }) => (
  <div style={{ borderTop: "1px solid #E8E4DF", margin }} />
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
      <div style={{ background:"rgba(255,255,255,0.9)", border:"1px solid rgba(200,185,165,0.3)", borderRadius:8, padding:"22px 16px", textAlign:"center", height:"100%" }}>
        <p style={{ fontSize:8, letterSpacing:"0.32em", color:"rgba(120,100,85,0.55)", textTransform:"uppercase" as const, marginBottom:14 }}>{sideLabel}</p>
        {fatherName && (<div style={{ marginBottom: motherName ? 12 : 0 }}>
          <p style={{ fontFamily:"'DM Serif Display',serif", fontSize:16, color:"#1A1A1A", lineHeight:1.3 }}>{fatherName}</p>
          <p style={{ fontSize:9, color:"rgba(120,100,85,0.55)", letterSpacing:"0.15em", textTransform:"uppercase" as const, marginTop:2 }}>Father</p>
        </div>)}
        {fatherName && motherName && <div style={{ height:"0.5px", background:"rgba(200,185,165,0.3)", margin:"10px auto", width:36 }} />}
        {motherName && (<div>
          <p style={{ fontFamily:"'DM Serif Display',serif", fontSize:16, color:"#1A1A1A", lineHeight:1.3 }}>{motherName}</p>
          <p style={{ fontSize:9, color:"rgba(120,100,85,0.55)", letterSpacing:"0.15em", textTransform:"uppercase" as const, marginTop:2 }}>Mother</p>
        </div>)}
      </div>
    </Reveal>
  );

  const RelativeCard = ({ rel, delay }: { rel: { name: string; relation: string; spouseName?: string }; delay: number }) => (
    <Reveal delay={delay}>
      <div style={{ background:"rgba(255,255,255,0.9)", border:"1px solid rgba(200,185,165,0.3)", borderRadius:6, padding:"11px", textAlign:"center", borderLeft:"2px solid rgba(200,185,165,0.3)" }}>
        <p style={{ fontSize:8, letterSpacing:"0.2em", color:"rgba(120,100,85,0.55)", textTransform:"uppercase" as const, marginBottom:6 }}>{rel.relation}</p>
        <p style={{ fontFamily:"'DM Serif Display',serif", fontSize:14, color:"#1A1A1A", lineHeight:1.3 }}>{rel.name}</p>
        {rel.spouseName && (<>
          <div style={{ display:"flex", alignItems:"center", gap:5, justifyContent:"center", margin:"4px 0" }}>
            <div style={{ height:"0.5px", flex:1, background:"rgba(200,185,165,0.3)" }} />
            <span style={{ fontSize:9, color:"rgba(120,100,85,0.55)" }}>&amp;</span>
            <div style={{ height:"0.5px", flex:1, background:"rgba(200,185,165,0.3)" }} />
          </div>
          <p style={{ fontFamily:"'DM Serif Display',serif", fontSize:13, color:"#1A1A1A", lineHeight:1.3, opacity:0.7 }}>{rel.spouseName}</p>
        </>)}
      </div>
    </Reveal>
  );

  return (
    <section style={{ padding:"20px 20px 52px", maxWidth:580, margin:"0 auto" }}>
      <Reveal>
        <div style={{ textAlign:"center", marginBottom:26 }}>
          <p style={{ fontSize:9, letterSpacing:"0.4em", color:"rgba(120,100,85,0.55)", textTransform:"uppercase" as const, marginBottom:6 }}>With Family Blessings</p>
          <p style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:"#1A1A1A" }}>Our Families</p>
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
              <div style={{ flex:1, height:"0.5px", background:"rgba(200,185,165,0.3)" }} />
              <p style={{ fontSize:8, letterSpacing:"0.28em", color:"rgba(120,100,85,0.55)", textTransform:"uppercase" as const, whiteSpace:"nowrap" as const }}>Extended Family</p>
              <div style={{ flex:1, height:"0.5px", background:"rgba(200,185,165,0.3)" }} />
            </div>
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {groomRelatives.length > 0 && (<>
                <Reveal delay={0.28}><p style={{ fontSize:7, letterSpacing:"0.22em", color:"rgba(120,100,85,0.55)", textTransform:"uppercase" as const, textAlign:"center", marginBottom:4 }}>{couple.groomName}&apos;s Side</p></Reveal>
                {groomRelatives.map((rel, i) => <RelativeCard key={i} rel={rel} delay={0.3 + i * 0.07} />)}
              </>)}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {brideRelatives.length > 0 && (<>
                <Reveal delay={0.28}><p style={{ fontSize:7, letterSpacing:"0.22em", color:"rgba(120,100,85,0.55)", textTransform:"uppercase" as const, textAlign:"center", marginBottom:4 }}>{couple.brideName}&apos;s Side</p></Reveal>
                {brideRelatives.map((rel, i) => <RelativeCard key={i} rel={rel} delay={0.3 + i * 0.07} />)}
              </>)}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default function PaperPetals({ couple }: PaperPetalsProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleWhatsApp = () => {
    const phone = couple.phone?.replace(/\D/g, "");
    const msg = encodeURIComponent(`Hi! We would love to attend the wedding of ${couple.groomName} & ${couple.brideName} on ${formatWeddingDate(couple.weddingDate)}.`);
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  const allEvents = couple.events?.length > 0
    ? couple.events
    : [{ name: "Wedding Ceremony", date: couple.weddingDate, time: couple.weddingTime, venue: couple.venue }];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes drift { 0%{transform:translateY(-10px) rotate(0deg);opacity:.5} 100%{transform:translateY(105vh) rotate(270deg);opacity:0} }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#FAFAF8", fontFamily: "'DM Sans',sans-serif", overflowX: "hidden" }}
        onContextMenu={(e) => e.preventDefault()}>

        {/* Very subtle drifting specks */}
        {mounted && Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ position: "fixed", top: -10, left: `${8 + i * 11}%`, width: 4, height: 4, borderRadius: "50%", background: i % 2 === 0 ? "#D4C5B0" : "#C8D4B8", opacity: 0.6, animation: `drift ${7 + (i % 3)}s linear ${i * 0.8}s infinite`, pointerEvents: "none", zIndex: 1 }} />
        ))}

        <div style={{ maxWidth: 540, margin: "0 auto", padding: "0 24px" }}>

          {/* ── SECTION 1 — Hero ──────────────────────────────── */}
          <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 0 60px", position: "relative" }}>

            <Reveal>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 300, fontSize: 10, letterSpacing: "0.5em", color: "#999", textTransform: "uppercase" as const, marginBottom: 48 }}>
                We are getting married
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(3.2rem,11vw,6rem)", color: "#1A1A1A", lineHeight: 1, fontWeight: 400, marginBottom: 0 }}>
                {couple.groomName}
              </h1>
            </Reveal>

            <Reveal delay={0.15}>
              <div style={{ margin: "16px 0", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ height: "0.5px", width: 40, background: "#D4C5B0" }} />
                <span style={{ fontFamily: "'DM Serif Display',serif", fontStyle: "italic", fontSize: 18, color: "#999" }}>&</span>
                <div style={{ height: "0.5px", width: 40, background: "#D4C5B0" }} />
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(3.2rem,11vw,6rem)", color: "#1A1A1A", lineHeight: 1, fontWeight: 400, marginBottom: 48 }}>
                {couple.brideName}
              </h1>
            </Reveal>

            <Reveal delay={0.3}>
              <Rule margin="0 0 28px 0" />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 300, fontSize: 14, color: "#555", letterSpacing: "0.05em" }}>
                  {formatWeddingDate(couple.weddingDate)} · {couple.weddingTime}
                </p>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 300, fontSize: 13, color: "#999" }}>
                  {couple.venue}
                </p>
              </div>
              <Rule margin="28px 0 0 0" />
            </Reveal>

            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2.5, repeat: Infinity }} style={{ position: "absolute", bottom: 32, color: "#CCC", fontSize: 18 }}>↓</motion.div>
          </section>

          {/* ── SECTION 2 — Message ───────────────────────────── */}
          {couple.personalMessage && (
            <section style={{ padding: "20px 0 48px", textAlign: "center" }}>
              <Reveal>
                <p style={{ fontFamily: "'DM Serif Display',serif", fontStyle: "italic", fontSize: 20, color: "#555", lineHeight: 1.9 }}>
                  &ldquo;{couple.personalMessage}&rdquo;
                </p>
              </Reveal>
              <Rule />
            </section>
          )}

        {/* ── SECTION 2.5 — Family ── */}
        <FamilySection couple={couple} />
        {(couple.groomFatherName || couple.groomMotherName || couple.brideFatherName || couple.brideMotherName || (couple.relatives && couple.relatives.length > 0)) && (
          <div style={{ display:"flex", alignItems:"center", gap:12, padding:"0 20px", margin:"0 0 8px" }}>
            <div style={{ flex:1, height:"0.5px", background:"rgba(180,180,180,0.3)" }} />
            <span style={{ fontSize:14, opacity:0.35 }}>✦</span>
            <div style={{ flex:1, height:"0.5px", background:"rgba(180,180,180,0.3)" }} />
          </div>
        )}

          {/* ── SECTION 3 — Events ───────────────────────────── */}
          <section style={{ padding: "20px 0 48px" }}>
            <Reveal>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 300, fontSize: 10, letterSpacing: "0.5em", color: "#999", textTransform: "uppercase" as const, marginBottom: 28 }}>
                The Programme
              </p>
            </Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {allEvents.map((event, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", gap: 0, padding: "20px 0", borderBottom: "1px solid #E8E4DF" }}>
                    <div style={{ paddingRight: 24, textAlign: "right" }}>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 300, fontSize: 12, color: "#999", marginBottom: 2 }}>{formatWeddingDate(event.date)}</p>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 300, fontSize: 12, color: "#BBB" }}>{event.time}</p>
                    </div>
                    <div style={{ width: 1, background: "#E8E4DF", margin: "0 auto" }} />
                    <div style={{ paddingLeft: 24 }}>
                      <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: 18, color: "#1A1A1A", marginBottom: 2 }}>{event.name}</p>
                      {event.venue && <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 300, fontSize: 12, color: "#999" }}>{event.venue}</p>}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ── SECTION 4 — Venue ────────────────────────────── */}
          <section style={{ padding: "20px 0 48px", textAlign: "center" }}>
            <Reveal>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 300, fontSize: 10, letterSpacing: "0.5em", color: "#999", textTransform: "uppercase" as const, marginBottom: 24 }}>
                Location
              </p>
              <div style={{ background: "#F5F3EF", borderRadius: 16, padding: "28px 24px" }}>
                <MapPin size={18} color="#999" style={{ margin: "0 auto 12px", display: "block" }} />
                <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, color: "#1A1A1A", marginBottom: 6 }}>{couple.venue}</h3>
                {couple.venueAddress && <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 300, fontSize: 13, color: "#777", lineHeight: 1.8, marginBottom: 16 }}>{couple.venueAddress}</p>}
                {couple.mapLink && (
                  <a href={couple.mapLink} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 22px", border: "1px solid #CCC", borderRadius: 40, color: "#555", fontSize: 11, fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.1em", textDecoration: "none", textTransform: "uppercase" as const }}>
                    <MapPin size={11} /> Get Directions
                  </a>
                )}
              </div>
            </Reveal>
          </section>

          {/* ── SECTION 5 — Countdown ────────────────────────── */}
          <section style={{ padding: "20px 0 48px" }}>
            <Reveal>
              <p style={{ fontFamily: "'DM Serif Display',serif", fontStyle: "italic", fontSize: 18, color: "#777", textAlign: "center", marginBottom: 20 }}>Counting the days</p>
              <Countdown targetDate={couple.weddingDate} />
            </Reveal>
          </section>

          {/* ── SECTION 6 — RSVP ─────────────────────────────── */}
          <section style={{ padding: "20px 0 80px" }}>
            <Reveal>
              <Rule margin="0 0 28px 0" />
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 300, fontSize: 10, letterSpacing: "0.5em", color: "#999", textTransform: "uppercase" as const, textAlign: "center", marginBottom: 8 }}>
                RSVP
              </p>
              <p style={{ fontFamily: "'DM Serif Display',serif", fontStyle: "italic", fontSize: 20, color: "#555", textAlign: "center", marginBottom: 28 }}>
                Kindly let us know you&apos;re coming
              </p>
              <RSVPForm
                 inviteSlug={
    couple.slug ??
    `${couple.groomName.toLowerCase().replace(/\s+/g, "-")}-weds-${couple.brideName.toLowerCase().replace(/\s+/g, "-")}`
  }
                coupleName={`${couple.groomName} & ${couple.brideName}`}
                accentColor="#555555"
                theme="light"
              />
              {couple.phone && (
                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <button onClick={handleWhatsApp}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", background: "transparent", border: "1px solid #CCC", borderRadius: 40, color: "#777", fontFamily: "'DM Sans',sans-serif", fontSize: 11, cursor: "pointer", letterSpacing: "0.08em" }}>
                    <Phone size={11} /> Also WhatsApp us
                  </button>
                </div>
              )}
              <Rule margin="40px 0 24px 0" />
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "'DM Serif Display',serif", fontStyle: "italic", fontSize: 22, color: "#555" }}>
                  {couple.groomName} & {couple.brideName}
                </p>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 300, fontSize: 10, color: "#CCC", letterSpacing: "0.3em", textTransform: "uppercase" as const, marginTop: 8 }}>
                  Made with WedCraft
                </p>
              </div>
            </Reveal>
          </section>
        </div>
      </div>
    </>
  );
}