"use client";

import { useEffect, useState, useRef } from "react";
import { CoupleDetails } from "@/types/invite";
import { formatWeddingDate } from "@/lib/invite-utils";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Calendar, Clock } from "lucide-react";
import RSVPForm from "@/components/rsvp/RSVPForm";
import MusicPlayer from "@/components/MusicPlayer";
import Image from "next/image";

interface OnyxGoldProps {
  couple: CoupleDetails;
}

// ─── Countdown ────────────────────────────────────────────────────────────────
function Countdown({ targetDate }: { targetDate: string }) {
  const [t, setT] = useState({ d:0, h:0, m:0, s:0 });
  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return;
      setT({ d:Math.floor(diff/86400000), h:Math.floor((diff%86400000)/3600000), m:Math.floor((diff%3600000)/60000), s:Math.floor((diff%60000)/1000) });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, [targetDate]);

  const Box = ({ v, l }: { v:number; l:string }) => (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
      <div style={{ width:72, height:72, background:"#0A0A0A", border:"1px solid rgba(212,175,55,0.6)", borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:400, color:"#D4AF37", letterSpacing:"0.05em", boxShadow:"0 0 20px rgba(212,175,55,0.08)" }}>
        {String(v).padStart(2,"0")}
      </div>
      <span style={{ fontSize:9, letterSpacing:"0.3em", color:"rgba(212,175,55,0.4)", textTransform:"uppercase" as const, fontFamily:"'Montserrat',sans-serif" }}>{l}</span>
    </div>
  );

  return <div style={{ display:"flex", gap:20, justifyContent:"center" }}><Box v={t.d} l="Days"/><Box v={t.h} l="Hours"/><Box v={t.m} l="Mins"/><Box v={t.s} l="Secs"/></div>;
}

// ─── Reveal ───────────────────────────────────────────────────────────────────
function Reveal({ children, delay=0, className="" }: { children:React.ReactNode; delay?:number; className?:string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-40px" });
  return <motion.div ref={ref} initial={{ opacity:0, y:20 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:1, delay, ease:[0.16,1,0.3,1] }} className={className}>{children}</motion.div>;
}

// ─── Gold line divider ────────────────────────────────────────────────────────
const GoldLine = () => (
  <div style={{ display:"flex", alignItems:"center", gap:16, margin:"32px 0" }}>
    <div style={{ flex:1, height:"0.5px", background:"linear-gradient(to right, transparent, rgba(212,175,55,0.5))" }}/>
    <div style={{ width:6, height:6, background:"#D4AF37", transform:"rotate(45deg)", opacity:0.7 }}/>
    <div style={{ width:4, height:4, border:"1px solid rgba(212,175,55,0.5)", transform:"rotate(45deg)" }}/>
    <div style={{ width:6, height:6, background:"#D4AF37", transform:"rotate(45deg)", opacity:0.7 }}/>
    <div style={{ flex:1, height:"0.5px", background:"linear-gradient(to left, transparent, rgba(212,175,55,0.5))" }}/>
  </div>
);

// ─── Corner ornament SVG ──────────────────────────────────────────────────────
const CornerOrnament = ({ flip=false }: { flip?: boolean }) => (
  <svg width="80" height="80" viewBox="0 0 80 80" style={{ opacity:0.3, transform: flip ? "scaleX(-1)" : "none" }}>
    <path d="M4 4 L40 4 L40 8 L8 8 L8 40 L4 40 Z" fill="#D4AF37"/>
    <path d="M4 4 L20 20" stroke="#D4AF37" strokeWidth="0.5"/>
    <circle cx="4" cy="4" r="2" fill="#D4AF37"/>
    <circle cx="20" cy="20" r="1" fill="#D4AF37" opacity="0.5"/>
    <path d="M8 8 L14 14 M12 8 L16 12 M8 12 L12 16" stroke="#D4AF37" strokeWidth="0.5" opacity="0.5"/>
  </svg>
);

export default function OnyxGold({ couple }: OnyxGoldProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleWhatsApp = () => {
    const phone = couple.phone?.replace(/\D/g,"");
    const msg = encodeURIComponent(`Hello! We are delighted to RSVP for the wedding of ${couple.groomName} & ${couple.brideName} on ${formatWeddingDate(couple.weddingDate)}.`);
    window.open(`https://wa.me/${phone}?text=${msg}`,"_blank");
  };

  const allEvents = couple.events?.length > 0
    ? couple.events
    : [{ name:"Wedding Ceremony", date:couple.weddingDate, time:couple.weddingTime, venue:couple.venue }];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@300;400;500&family=Cinzel:wght@400;500&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes goldPulse { 0%,100%{opacity:0.3} 50%{opacity:0.7} }
        @keyframes lineGrow { from{scaleX:0} to{scaleX:1} }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#050505", fontFamily:"'Cormorant Garamond',serif", overflowX:"hidden" }} onContextMenu={(e) => e.preventDefault()}>

        {/* ── SECTION 1 — Hero ──────────────────────────────────── */}
        <section style={{ position:"relative", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 24px 100px", textAlign:"center", overflow:"hidden" }}>

          {/* Subtle gold radial glow */}
          <div style={{ position:"absolute", top:"40%", left:"50%", transform:"translate(-50%,-50%)", width:500, height:500, background:"radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)", pointerEvents:"none" }}/>

          {/* Corner ornaments */}
          <div style={{ position:"absolute", top:24, left:24 }}><CornerOrnament/></div>
          <div style={{ position:"absolute", top:24, right:24 }}><CornerOrnament flip/></div>
          <div style={{ position:"absolute", bottom:24, left:24, transform:"scaleY(-1)" }}><CornerOrnament/></div>
          <div style={{ position:"absolute", bottom:24, right:24, transform:"scale(-1)" }}><CornerOrnament flip/></div>

          {/* Animated thin horizontal lines */}
          {mounted && [20,40,60,80].map((pct) => (
            <motion.div key={pct}
              initial={{ scaleX:0 }} animate={{ scaleX:1 }}
              transition={{ duration:1.5, delay:pct/100, ease:"easeOut" }}
              style={{ position:"absolute", top:`${pct}%`, left:0, right:0, height:"0.5px", background:`rgba(212,175,55,${0.04 + pct*0.001})`, transformOrigin:"left" }}
            />
          ))}

          <Reveal>
            <p style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:300, fontSize:10, letterSpacing:"0.6em", color:"rgba(212,175,55,0.4)", textTransform:"uppercase" as const, marginBottom:40 }}>
              A Black Tie Wedding
            </p>
          </Reveal>

          {/* Decorative monogram ring */}
          <Reveal delay={0.1}>
            <div style={{ position:"relative", width:80, height:80, margin:"0 auto 32px" }}>
              <svg width="80" height="80" viewBox="0 0 80 80" style={{ position:"absolute", inset:0 }}>
                <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(212,175,55,0.25)" strokeWidth="0.5"/>
                <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="0.5"/>
                {[0,45,90,135].map((a,i) => (
                  <line key={i} x1="40" y1="4" x2="40" y2="10" stroke="rgba(212,175,55,0.4)" strokeWidth="1" transform={`rotate(${a} 40 40)`}/>
                ))}
              </svg>
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Cinzel',serif", fontSize:22, color:"#D4AF37", fontWeight:400 }}>
                {couple.groomName.charAt(0)}{couple.brideName.charAt(0)}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:"clamp(3rem,10vw,6rem)", color:"#FAFAFA", letterSpacing:"0.15em", lineHeight:1, marginBottom:4, textShadow:"0 0 40px rgba(212,175,55,0.1)" }}>
              {couple.groomName.toUpperCase()}
            </h1>
          </Reveal>

          <Reveal delay={0.25}>
            <div style={{ display:"flex", alignItems:"center", gap:20, margin:"12px 0" }}>
              <div style={{ height:"0.5px", width:56, background:"rgba(212,175,55,0.4)" }}/>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:18, color:"rgba(212,175,55,0.6)" }}>&</span>
              <div style={{ height:"0.5px", width:56, background:"rgba(212,175,55,0.4)" }}/>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:"clamp(3rem,10vw,6rem)", color:"#D4AF37", letterSpacing:"0.15em", lineHeight:1, marginBottom:36, textShadow:"0 0 40px rgba(212,175,55,0.2)" }}>
              {couple.brideName.toUpperCase()}
            </h1>
          </Reveal>

          {couple.couplePhotoUrl && (
  <Reveal delay={0.35}>
    <div style={{ marginBottom: 32 }}>
      <div
        style={{
          display: "inline-block",
          padding: "4px",
          border: "0.5px solid rgba(212,175,55,0.4)",
          background: "#050505",
        }}
      >
        <Image
          src={couple.couplePhotoUrl}
          alt="Couple"
          width={200}
          height={240}
          style={{
            objectFit: "cover",
            filter: "grayscale(10%) contrast(1.05)",
          }}
        />
      </div>
    </div>
  </Reveal>
)}

          <Reveal delay={0.4}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:16, padding:"14px 32px", border:"0.5px solid rgba(212,175,55,0.3)", borderRadius:2, background:"rgba(212,175,55,0.04)" }}>
              <span style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:300, fontSize:12, letterSpacing:"0.2em", color:"rgba(255,255,255,0.7)", textTransform:"uppercase" as const }}>
                {formatWeddingDate(couple.weddingDate)}
              </span>
              <div style={{ width:"0.5px", height:14, background:"rgba(212,175,55,0.3)" }}/>
              <span style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:300, fontSize:12, letterSpacing:"0.15em", color:"rgba(212,175,55,0.6)", textTransform:"uppercase" as const }}>
                {couple.weddingTime}
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.5}>
            <p style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:300, fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:12, letterSpacing:"0.15em", textTransform:"uppercase" as const }}>
              {couple.venue}
            </p>
          </Reveal>

          <motion.div animate={{ y:[0,8,0] }} transition={{ duration:2.5, repeat:Infinity }} style={{ position:"absolute", bottom:32, color:"rgba(212,175,55,0.3)", fontSize:20 }}>↓</motion.div>
        </section>

        {/* ── SECTION 2 — Message ───────────────────────────────── */}
        <section style={{ padding:"60px 24px", maxWidth:560, margin:"0 auto", textAlign:"center" }}>
          <Reveal>
            <GoldLine/>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontWeight:300, fontSize:22, color:"rgba(255,255,255,0.65)", lineHeight:1.9, letterSpacing:"0.02em" }}>
              {couple.personalMessage
                ? `"${couple.personalMessage}"`
                : `"To love is nothing. To be loved is something. To love and be loved is everything."`}
            </p>
            <GoldLine/>
          </Reveal>
        </section>

        {/* ── SECTION 3 — Events ───────────────────────────────── */}
        <section style={{ padding:"20px 24px 60px", maxWidth:600, margin:"0 auto" }}>
          <Reveal>
            <p style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:300, fontSize:9, letterSpacing:"0.5em", color:"rgba(212,175,55,0.4)", textTransform:"uppercase" as const, textAlign:"center", marginBottom:36 }}>
              The Programme
            </p>
          </Reveal>
          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
            {allEvents.map((event, i) => (
              <Reveal key={i} delay={i*0.08}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 0.5px 1fr", gap:0, alignItems:"center", padding:"24px 0", borderBottom:"0.5px solid rgba(212,175,55,0.1)" }}>
                  <div style={{ textAlign:"right", paddingRight:24 }}>
                    <p style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:300, fontSize:11, letterSpacing:"0.15em", color:"rgba(212,175,55,0.5)", textTransform:"uppercase" as const, marginBottom:4 }}>
                      {formatWeddingDate(event.date)}
                    </p>
                    <p style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:300, fontSize:11, color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em" }}>
                      {event.time}
                    </p>
                  </div>
                  <div style={{ width:"0.5px", height:40, background:"rgba(212,175,55,0.2)", margin:"0 auto" }}/>
                  <div style={{ paddingLeft:24 }}>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:"#FAFAFA", marginBottom:2 }}>{event.name}</p>
                    {event.venue && <p style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:300, fontSize:11, color:"rgba(255,255,255,0.3)", letterSpacing:"0.08em" }}>{event.venue}</p>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── SECTION 4 — Venue ────────────────────────────────── */}
        <section style={{ padding:"20px 24px 60px", maxWidth:520, margin:"0 auto", textAlign:"center" }}>
          <Reveal>
            <p style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:300, fontSize:9, letterSpacing:"0.5em", color:"rgba(212,175,55,0.4)", textTransform:"uppercase" as const, marginBottom:24 }}>Location</p>
            <div style={{ border:"0.5px solid rgba(212,175,55,0.2)", borderRadius:2, padding:"36px 28px", background:"rgba(212,175,55,0.02)" }}>
              <MapPin size={18} color="rgba(212,175,55,0.5)" style={{ margin:"0 auto 14px", display:"block" }}/>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:22, color:"#FAFAFA", marginBottom:8, letterSpacing:"0.05em" }}>{couple.venue}</h3>
              {couple.venueAddress && <p style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:300, fontSize:12, color:"rgba(255,255,255,0.3)", lineHeight:1.8, letterSpacing:"0.05em", marginBottom:20 }}>{couple.venueAddress}</p>}
              {couple.mapLink && (
                <a href={couple.mapLink} target="_blank" rel="noopener noreferrer"
                  style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"10px 24px", border:"0.5px solid rgba(212,175,55,0.35)", borderRadius:2, color:"rgba(212,175,55,0.7)", fontSize:10, fontFamily:"'Montserrat',sans-serif", fontWeight:400, letterSpacing:"0.2em", textDecoration:"none", textTransform:"uppercase" as const }}>
                  <MapPin size={11}/> Get Directions
                </a>
              )}
            </div>
          </Reveal>
        </section>

        {/* ── SECTION 5 — Countdown ────────────────────────────── */}
        <section style={{ padding:"20px 24px 60px", textAlign:"center" }}>
          <Reveal>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontWeight:300, fontSize:20, color:"rgba(255,255,255,0.35)", marginBottom:32 }}>
              The countdown to forever
            </p>
            <Countdown targetDate={couple.weddingDate}/>
          </Reveal>
        </section>

        {/* ── SECTION 6 — RSVP ─────────────────────────────────── */}
        <section style={{ padding:"20px 24px 80px", maxWidth:520, margin:"0 auto", textAlign:"center" }}>
          <Reveal>
            <GoldLine/>
            <p style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:300, fontSize:9, letterSpacing:"0.5em", color:"rgba(212,175,55,0.4)", textTransform:"uppercase" as const, marginBottom:8 }}>RSVP</p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontWeight:300, fontSize:20, color:"rgba(255,255,255,0.45)", lineHeight:1.8, marginBottom:28 }}>
              Kindly respond at your earliest convenience
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
              <button onClick={handleWhatsApp} style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"10px 24px", background:"transparent", border:"0.5px solid rgba(212,175,55,0.3)", borderRadius:2, color:"rgba(212,175,55,0.5)", fontFamily:"'Montserrat',sans-serif", fontWeight:300, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase" as const, cursor:"pointer" }}>
                <Phone size={11}/> Also WhatsApp us
              </button>
            )}
            <GoldLine/>
            <div style={{ marginTop:8 }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:18, color:"rgba(212,175,55,0.4)" }}>
                {couple.groomName} & {couple.brideName}
              </p>
              <p style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:300, fontSize:9, color:"rgba(212,175,55,0.2)", letterSpacing:"0.3em", textTransform:"uppercase" as const, marginTop:8 }}>
                Made with WedCraft
              </p>
            </div>
          </Reveal>
        </section>

      </div>
      {couple.bgMusicUrl && (
  <MusicPlayer
    src={couple.bgMusicUrl}
    dark
    accentColor="#D4AF37"
  />
)}
    </>
  );
}