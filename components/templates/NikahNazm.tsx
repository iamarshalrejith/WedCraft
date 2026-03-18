"use client";

import { useEffect, useState, useRef } from "react";
import { CoupleDetails } from "@/types/invite";
import { formatWeddingDate } from "@/lib/invite-utils";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Calendar, Clock } from "lucide-react";
import RSVPForm from "@/components/rsvp/RSVPForm";

interface NikahNazmProps {
  couple: CoupleDetails;
}

// ─── Countdown ────────────────────────────────────────────────────────────────
function Countdown({ targetDate }: { targetDate: string }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return;
      setT({ d: Math.floor(diff/86400000), h: Math.floor((diff%86400000)/3600000), m: Math.floor((diff%3600000)/60000), s: Math.floor((diff%60000)/1000) });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, [targetDate]);
  const Box = ({ v, l }: { v: number; l: string }) => (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
      <div style={{ width:64, height:64, background:"rgba(212,175,55,0.12)", border:"1px solid rgba(212,175,55,0.5)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Cinzel',serif", fontSize:26, fontWeight:700, color:"#D4AF37" }}>
        {String(v).padStart(2,"0")}
      </div>
      <span style={{ fontSize:10, letterSpacing:"0.2em", color:"rgba(212,175,55,0.6)", textTransform:"uppercase" as const, fontFamily:"sans-serif" }}>{l}</span>
    </div>
  );
  return <div style={{ display:"flex", gap:16, justifyContent:"center" }}><Box v={t.d} l="Days"/><Box v={t.h} l="Hours"/><Box v={t.m} l="Mins"/><Box v={t.s} l="Secs"/></div>;
}

// ─── Scroll reveal ─────────────────────────────────────────────────────────────
function Reveal({ children, delay=0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-50px" });
  return <motion.div ref={ref} initial={{ opacity:0, y:24 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:0.8, delay, ease:[0.22,1,0.36,1] }}>{children}</motion.div>;
}

// ─── Islamic geometric SVG pattern ────────────────────────────────────────────
const GeometricPattern = ({ opacity=0.08 }: { opacity?: number }) => (
  <svg width="120" height="120" viewBox="0 0 120 120" style={{ opacity }}>
    <defs>
      <pattern id="geo" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill="none" stroke="#D4AF37" strokeWidth="0.8"/>
        <polygon points="20,8 32,14 32,26 20,32 8,26 8,14" fill="none" stroke="#D4AF37" strokeWidth="0.5"/>
        <circle cx="20" cy="20" r="3" fill="none" stroke="#D4AF37" strokeWidth="0.5"/>
      </pattern>
    </defs>
    <rect width="120" height="120" fill="url(#geo)"/>
  </svg>
);

// ─── Star/crescent motif ──────────────────────────────────────────────────────
const CrescentStar = ({ size=48, color="#D4AF37", opacity=0.8 }: { size?: number; color?: string; opacity?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ opacity }}>
    <path d="M24 6 C14 6 6 14 6 24 C6 34 14 42 24 42 C18 36 16 28 20 22 C24 16 32 14 38 16 C35 10 30 6 24 6Z" fill={color}/>
    <polygon points="34,8 35.5,12 40,12 36.5,14.5 38,19 34,16 30,19 31.5,14.5 28,12 32.5,12" fill={color}/>
  </svg>
);

// ─── Arabic-style divider ─────────────────────────────────────────────────────
const ArabicDivider = () => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, margin:"28px 0" }}>
    <div style={{ height:1, flex:1, background:"linear-gradient(to right, transparent, rgba(212,175,55,0.4))" }}/>
    <svg width="32" height="20" viewBox="0 0 32 20">
      <path d="M16 2 L28 10 L16 18 L4 10 Z" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.6"/>
      <circle cx="16" cy="10" r="3" fill="#D4AF37" opacity="0.6"/>
    </svg>
    <div style={{ height:1, flex:1, background:"linear-gradient(to left, transparent, rgba(212,175,55,0.4))" }}/>
  </div>
);

export default function NikahNazm({ couple }: NikahNazmProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleWhatsApp = () => {
    const phone = couple.phone?.replace(/\D/g,"");
    const msg = encodeURIComponent(`Assalamu Alaikum! We would be honoured to attend the Nikah of ${couple.groomName} & ${couple.brideName} on ${formatWeddingDate(couple.weddingDate)}. 🌙`);
    window.open(`https://wa.me/${phone}?text=${msg}`,"_blank");
  };

  const allEvents = couple.events?.length > 0
    ? couple.events
    : [{ name:"Nikah Ceremony", date:couple.weddingDate, time:couple.weddingTime, venue:couple.venue }];

  const bgStyle: React.CSSProperties = {
    minHeight:"100vh",
    background:"linear-gradient(160deg, #0A2A2A 0%, #0D3535 30%, #0A2A2A 60%, #071E1E 100%)",
    fontFamily:"'Cormorant Garamond', serif",
    overflowX:"hidden",
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes rotateSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%,100%{opacity:0.4} 50%{opacity:1} }
      `}</style>

      <div style={bgStyle} onContextMenu={(e) => e.preventDefault()}>

        {/* ── SECTION 1 — Hero ─────────────────────────────────── */}
        <section style={{ position:"relative", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 24px 100px", textAlign:"center", overflow:"hidden" }}>

          {/* Geometric pattern corners */}
          <div style={{ position:"absolute", top:0, left:0, transform:"rotate(180deg)" }}><GeometricPattern opacity={0.12}/></div>
          <div style={{ position:"absolute", top:0, right:0, transform:"scaleX(-1) rotate(180deg)" }}><GeometricPattern opacity={0.12}/></div>
          <div style={{ position:"absolute", bottom:0, left:0 }}><GeometricPattern opacity={0.08}/></div>
          <div style={{ position:"absolute", bottom:0, right:0, transform:"scaleX(-1)" }}><GeometricPattern opacity={0.08}/></div>

          {/* Rotating large geometric */}
          {mounted && (
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", opacity:0.04, animation:"rotateSlow 60s linear infinite", pointerEvents:"none" }}>
              <svg width="400" height="400" viewBox="0 0 400 400">
                {[0,30,60,90,120,150].map((angle,i) => (
                  <polygon key={i} points="200,20 380,200 200,380 20,200" fill="none" stroke="#D4AF37" strokeWidth="1"
                    transform={`rotate(${angle} 200 200)`} opacity={0.5}/>
                ))}
              </svg>
            </div>
          )}

          <Reveal>
            <div style={{ marginBottom:20 }}>
              <CrescentStar size={52} color="#D4AF37" opacity={0.9}/>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <p style={{ fontFamily:"'Amiri', serif", fontSize:20, color:"rgba(212,175,55,0.7)", marginBottom:8, letterSpacing:"0.1em" }}>
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <p style={{ fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:"0.4em", color:"rgba(212,175,55,0.5)", textTransform:"uppercase" as const, marginBottom:24 }}>
              In the name of Allah, the Most Gracious
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(2.8rem,9vw,5rem)", color:"#F5E6C8", letterSpacing:"0.1em", lineHeight:1.1, marginBottom:6 }}>
              {couple.groomName.toUpperCase()}
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{ display:"flex", alignItems:"center", gap:16, margin:"8px 0" }}>
              <div style={{ height:1, width:48, background:"rgba(212,175,55,0.4)" }}/>
              <CrescentStar size={20} color="#D4AF37" opacity={0.7}/>
              <div style={{ height:1, width:48, background:"rgba(212,175,55,0.4)" }}/>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(2.8rem,9vw,5rem)", color:"#D4AF37", letterSpacing:"0.1em", lineHeight:1.1, marginBottom:28 }}>
              {couple.brideName.toUpperCase()}
            </h1>
          </Reveal>

          <Reveal delay={0.35}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"11px 26px", background:"rgba(212,175,55,0.08)", border:"1px solid rgba(212,175,55,0.3)", borderRadius:40 }}>
              <Calendar size={13} color="rgba(212,175,55,0.7)"/>
              <span style={{ fontFamily:"'Cinzel',serif", fontSize:14, color:"#F5E6C8", letterSpacing:"0.06em" }}>{formatWeddingDate(couple.weddingDate)}</span>
              <span style={{ color:"rgba(212,175,55,0.3)" }}>·</span>
              <span style={{ fontSize:13, color:"rgba(212,175,55,0.7)" }}>{couple.weddingTime}</span>
            </div>
          </Reveal>

          <Reveal delay={0.45}>
            <p style={{ fontSize:13, color:"rgba(212,175,55,0.4)", marginTop:10, letterSpacing:"0.08em" }}>{couple.venue}</p>
          </Reveal>

          <motion.div animate={{ y:[0,8,0] }} transition={{ duration:2.2, repeat:Infinity }} style={{ position:"absolute", bottom:32, color:"#D4AF37", opacity:0.4, fontSize:20 }}>↓</motion.div>
        </section>

        {/* ── SECTION 2 — Blessing ─────────────────────────────── */}
        <section style={{ padding:"60px 24px", maxWidth:520, margin:"0 auto", textAlign:"center" }}>
          <Reveal>
            <ArabicDivider/>
            <p style={{ fontFamily:"'Amiri',serif", fontSize:22, fontStyle:"italic", color:"rgba(245,230,200,0.75)", lineHeight:1.9 }}>
              {couple.personalMessage
                ? `"${couple.personalMessage}"`
                : `"And of His signs is that He created for you mates that you may find tranquillity in them, and He placed between you affection and mercy." — Quran 30:21`}
            </p>
            <ArabicDivider/>
          </Reveal>
        </section>

        {/* ── SECTION 3 — Events ───────────────────────────────── */}
        <section style={{ padding:"20px 24px 60px", maxWidth:560, margin:"0 auto" }}>
          <Reveal>
            <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:"0.4em", color:"rgba(212,175,55,0.6)", textTransform:"uppercase" as const, textAlign:"center", marginBottom:32 }}>
              Celebrations
            </h2>
          </Reveal>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {allEvents.map((event, i) => (
              <Reveal key={i} delay={i*0.1}>
                <div style={{ background:"rgba(212,175,55,0.05)", border:"1px solid rgba(212,175,55,0.2)", borderRadius:20, padding:"26px 28px", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:0, left:0, width:3, height:"100%", background:"linear-gradient(to bottom, #D4AF37, rgba(212,175,55,0.2))", borderRadius:"3px 0 0 3px" }}/>
                  <h3 style={{ fontFamily:"'Amiri',serif", fontSize:22, color:"#F5E6C8", marginBottom:12 }}>{event.name}</h3>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}><Calendar size={13} color="rgba(212,175,55,0.6)"/><span style={{ fontSize:15, color:"rgba(245,230,200,0.75)" }}>{formatWeddingDate(event.date)}</span></div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}><Clock size={13} color="rgba(212,175,55,0.6)"/><span style={{ fontSize:15, color:"rgba(245,230,200,0.75)" }}>{event.time}</span></div>
                    {event.venue && <div style={{ display:"flex", alignItems:"center", gap:8 }}><MapPin size={13} color="rgba(212,175,55,0.6)"/><span style={{ fontSize:13, color:"rgba(245,230,200,0.5)" }}>{event.venue}</span></div>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── SECTION 4 — Venue ────────────────────────────────── */}
        <section style={{ padding:"20px 24px 60px", maxWidth:520, margin:"0 auto", textAlign:"center" }}>
          <Reveal>
            <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:"0.4em", color:"rgba(212,175,55,0.6)", textTransform:"uppercase" as const, marginBottom:24 }}>Venue</h2>
            <div style={{ background:"rgba(212,175,55,0.05)", border:"1px solid rgba(212,175,55,0.2)", borderRadius:22, padding:"36px 28px" }}>
              <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(212,175,55,0.1)", border:"1px solid rgba(212,175,55,0.3)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
                <MapPin size={18} color="#D4AF37"/>
              </div>
              <h3 style={{ fontFamily:"'Amiri',serif", fontSize:22, color:"#F5E6C8", marginBottom:8 }}>{couple.venue}</h3>
              {couple.venueAddress && <p style={{ fontSize:14, color:"rgba(212,175,55,0.5)", lineHeight:1.8, marginBottom:20 }}>{couple.venueAddress}</p>}
              {couple.mapLink && (
                <a href={couple.mapLink} target="_blank" rel="noopener noreferrer"
                  style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"11px 26px", border:"1px solid rgba(212,175,55,0.4)", borderRadius:40, color:"#D4AF37", fontSize:11, fontFamily:"'Cinzel',serif", letterSpacing:"0.15em", textDecoration:"none", textTransform:"uppercase" as const }}>
                  <MapPin size={12}/> View on Maps
                </a>
              )}
            </div>
          </Reveal>
        </section>

        {/* ── SECTION 5 — Countdown ─────────────────────────────── */}
        <section style={{ padding:"20px 24px 60px", textAlign:"center" }}>
          <Reveal>
            <p style={{ fontFamily:"'Amiri',serif", fontStyle:"italic", fontSize:20, color:"rgba(245,230,200,0.5)", marginBottom:32 }}>Counting down to the blessed day</p>
            <Countdown targetDate={couple.weddingDate}/>
          </Reveal>
        </section>

        {/* ── SECTION 6 — RSVP ─────────────────────────────────── */}
        <section style={{ padding:"20px 24px 80px", maxWidth:520, margin:"0 auto", textAlign:"center" }}>
          <Reveal>
            <ArabicDivider/>
            <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:13, letterSpacing:"0.35em", color:"rgba(212,175,55,0.7)", textTransform:"uppercase" as const, marginBottom:8 }}>
              You Are Invited
            </h2>
            <p style={{ fontFamily:"'Amiri',serif", fontSize:18, color:"rgba(245,230,200,0.55)", lineHeight:1.8, marginBottom:28 }}>
              Your presence and prayers would make this occasion truly blessed
            </p>
            <div style={{ textAlign:"left", marginBottom:20 }}>
              <RSVPForm
                inviteSlug={`${couple.groomName.toLowerCase().replace(/\s+/g,"-")}-weds-${couple.brideName.toLowerCase().replace(/\s+/g,"-")}`}
                coupleName={`${couple.groomName} & ${couple.brideName}`}
                accentColor="#D4AF37"
                theme="dark"
              />
            </div>
            {couple.phone && (
              <button onClick={handleWhatsApp} style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"9px 22px", background:"transparent", borderRadius:40, border:"1px solid rgba(212,175,55,0.3)", color:"rgba(212,175,55,0.7)", fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:"0.15em", cursor:"pointer", textTransform:"uppercase" as const }}>
                <Phone size={12}/> Also WhatsApp us
              </button>
            )}
            <ArabicDivider/>
            <div style={{ marginTop:16 }}>
              <CrescentStar size={36} color="#D4AF37" opacity={0.4}/>
              <p style={{ fontFamily:"'Cinzel',serif", fontSize:13, color:"rgba(212,175,55,0.4)", marginTop:8, letterSpacing:"0.1em" }}>
                {couple.groomName} & {couple.brideName} · {new Date(couple.weddingDate).getFullYear()}
              </p>
              <p style={{ fontSize:10, color:"rgba(212,175,55,0.2)", letterSpacing:"0.2em", textTransform:"uppercase" as const, marginTop:6 }}>Made with WedCraft</p>
            </div>
          </Reveal>
        </section>
      </div>
    </>
  );
}