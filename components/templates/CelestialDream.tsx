"use client";

import { useEffect, useState, useRef } from "react";
import { CoupleDetails } from "@/types/invite";
import { formatWeddingDate } from "@/lib/invite-utils";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Calendar, Clock } from "lucide-react";
import RSVPForm from "@/components/rsvp/RSVPForm";
import MusicPlayer from "@/components/MusicPlayer";
import Image from "next/image";

interface CelestialDreamProps { couple: CoupleDetails; }

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
  return (
    <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
      {[{v:t.d,l:"Days"},{v:t.h,l:"Hours"},{v:t.m,l:"Mins"},{v:t.s,l:"Secs"}].map(({v,l}) => (
        <div key={l} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
          <div style={{ width:62, height:62, background:"rgba(147,112,219,0.15)", border:"1px solid rgba(147,112,219,0.5)", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Crimson Text',serif", fontSize:28, color:"#E8D5FF", boxShadow:"0 0 12px rgba(147,112,219,0.2)" }}>
            {String(v).padStart(2,"0")}
          </div>
          <span style={{ fontSize:10, letterSpacing:"0.2em", color:"rgba(200,180,255,0.6)", textTransform:"uppercase" as const, fontFamily:"sans-serif" }}>{l}</span>
        </div>
      ))}
    </div>
  );
}

function Reveal({ children, delay=0 }: { children:React.ReactNode; delay?:number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-50px" });
  return <motion.div ref={ref} initial={{ opacity:0, y:20 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:0.9, delay, ease:[0.22,1,0.36,1] }}>{children}</motion.div>;
}

// Constellation lines SVG
const Constellation = ({ x, y, opacity=0.15 }: { x:number; y:number; opacity?:number }) => {
  const pts = [[0,0],[40,15],[70,-10],[90,30],[50,50],[20,40]];
  return (
    <svg width="100" height="70" viewBox="0 0 100 70" style={{ position:"absolute", left:x, top:y, opacity, pointerEvents:"none" }}>
      {pts.map(([px,py],i) => i<pts.length-1 && <line key={i} x1={px} y1={py} x2={pts[i+1][0]} y2={pts[i+1][1]} stroke="#9370DB" strokeWidth="0.5"/>)}
      {pts.map(([px,py],i) => <circle key={i} cx={px} cy={py} r={i===0||i===3?2:1} fill="#E8D5FF" opacity="0.9"/>)}
    </svg>
  );
};

// Moon SVG
const MoonPhase = ({ size=48 }: { size?:number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(232,213,255,0.4)" strokeWidth="0.5"/>
    <path d="M24 6 C14 6 6 14 6 24 C6 34 14 42 24 42 C20 36 18 30 18 24 C18 18 20 12 24 6Z" fill="#E8D5FF" opacity="0.9"/>
    <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(147,112,219,0.6)" strokeWidth="1"/>
  </svg>
);

// Twinkling star
const Star = ({ size=4, x=0, y=0, delay=0 }: { size?:number; x?:number; y?:number; delay?:number }) => (
  <motion.div animate={{ opacity:[0.3,1,0.3], scale:[0.8,1.2,0.8] }} transition={{ duration:2+delay, repeat:Infinity, delay }}
    style={{ position:"absolute", left:x, top:y, width:size, height:size, borderRadius:"50%", background:"#E8D5FF", boxShadow:`0 0 ${size*2}px rgba(232,213,255,0.8)` }}/>
);

export default function CelestialDream({ couple }: CelestialDreamProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const stars = Array.from({length:60}, (_,i) => ({ x: (i*137.5)%100, y: (i*97.3)%100, size: i%5===0?3:i%3===0?2:1.5, delay: (i*0.3)%3 }));

  const allEvents = couple.events?.length > 0 ? couple.events : [{ name:"Wedding Ceremony", date:couple.weddingDate, time:couple.weddingTime, venue:couple.venue }];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes shootingStar { 0%{transform:translateX(0) translateY(0);opacity:1} 100%{transform:translateX(200px) translateY(100px);opacity:0} }
        @keyframes rotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      <div style={{ minHeight:"100vh", background:"linear-gradient(170deg,#060818 0%,#0D1035 30%,#130D2E 60%,#060818 100%)", fontFamily:"'Jost',sans-serif", overflowX:"hidden" }}
        onContextMenu={e=>e.preventDefault()}>

        {/* Star field */}
        {mounted && (
          <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden" }}>
            {stars.map((s,i) => <Star key={i} size={s.size} x={s.x*window.innerWidth/100} y={s.y*window.innerHeight/100} delay={s.delay}/>)}
            {/* Shooting stars */}
            {[0,1,2].map(i => (
              <motion.div key={i} animate={{ x:["-5vw","110vw"], y:["10vh","60vh"], opacity:[0,1,0] }}
                transition={{ duration:3, delay:i*5+3, repeat:Infinity, repeatDelay:8 }}
                style={{ position:"absolute", width:80, height:1, background:"linear-gradient(to right, transparent, #E8D5FF)", transform:"rotate(-20deg)" }}/>
            ))}
          </div>
        )}

        {/* Constellations */}
        <Constellation x={20} y={80} opacity={0.12}/>
        <Constellation x={60} y={200} opacity={0.10}/>

        {/* ── SECTION 1 — Hero ─── */}
        <section style={{ position:"relative", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 24px 100px", textAlign:"center" }}>

          {/* Rotating cosmic ring */}
          {mounted && (
            <motion.div animate={{ rotate:360 }} transition={{ duration:120, repeat:Infinity, ease:"linear" }}
              style={{ position:"absolute", width:400, height:400, border:"1px solid rgba(147,112,219,0.08)", borderRadius:"50%", top:"50%", left:"50%", marginTop:-200, marginLeft:-200 }}>
              <div style={{ position:"absolute", top:-3, left:"50%", width:6, height:6, borderRadius:"50%", background:"#9370DB", marginLeft:-3 }}/>
            </motion.div>
          )}

          <Reveal>
            <MoonPhase size={56}/>
          </Reveal>

          <Reveal delay={0.1}>
            <p style={{ fontFamily:"'Jost',sans-serif", fontWeight:300, fontSize:10, letterSpacing:"0.5em", color:"rgba(200,180,255,0.5)", textTransform:"uppercase" as const, marginTop:16, marginBottom:28 }}>
              Written in the stars
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <h1 style={{ fontFamily:"'Crimson Text',serif", fontSize:"clamp(3rem,10vw,5.5rem)", color:"#F0E8FF", letterSpacing:"0.08em", lineHeight:1, marginBottom:4 }}>
              {couple.groomName}
            </h1>
          </Reveal>

          <Reveal delay={0.25}>
            <div style={{ display:"flex", alignItems:"center", gap:16, margin:"10px 0" }}>
              <div style={{ height:"0.5px", width:48, background:"rgba(147,112,219,0.5)" }}/>
              <span style={{ fontSize:22, color:"#9370DB" }}>✦</span>
              <div style={{ height:"0.5px", width:48, background:"rgba(147,112,219,0.5)" }}/>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <h1 style={{ fontFamily:"'Crimson Text',serif", fontSize:"clamp(3rem,10vw,5.5rem)", color:"#C9A0FF", letterSpacing:"0.08em", lineHeight:1, marginBottom:36 }}>
              {couple.brideName}
            </h1>
          </Reveal>

          {couple.couplePhotoUrl && (
  <Reveal delay={0.35}>
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          display: "inline-block",
          padding: "6px",
          borderRadius: "20px",
          background: "rgba(147,112,219,0.15)",
          boxShadow: "0 0 30px rgba(147,112,219,0.25)",
        }}
      >
        <Image
          src={couple.couplePhotoUrl}
          alt="Couple"
          width={200}
          height={240}
          style={{
            objectFit: "cover",
            borderRadius: "16px",
            filter: "brightness(1.05) contrast(1.02)",
          }}
        />
      </div>
    </div>
  </Reveal>
)}

          <Reveal delay={0.4}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"12px 28px", background:"rgba(147,112,219,0.08)", border:"1px solid rgba(147,112,219,0.3)", borderRadius:40 }}>
              <Calendar size={13} color="#9370DB"/>
              <span style={{ fontFamily:"'Crimson Text',serif", fontSize:16, color:"#E8D5FF" }}>{formatWeddingDate(couple.weddingDate)}</span>
              <span style={{ color:"rgba(147,112,219,0.4)" }}>·</span>
              <span style={{ fontSize:13, color:"rgba(200,180,255,0.7)" }}>{couple.weddingTime}</span>
            </div>
          </Reveal>

          <Reveal delay={0.5}>
            <p style={{ fontSize:12, color:"rgba(200,180,255,0.4)", marginTop:10, letterSpacing:"0.1em" }}>{couple.venue}</p>
          </Reveal>

          <motion.div animate={{ y:[0,8,0] }} transition={{ duration:2.5, repeat:Infinity }} style={{ position:"absolute", bottom:32, color:"rgba(147,112,219,0.5)", fontSize:20 }}>↓</motion.div>
        </section>

        {/* ── SECTION 2 — Message ─── */}
        <section style={{ padding:"40px 24px 60px", maxWidth:520, margin:"0 auto", textAlign:"center" }}>
          <Reveal>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:28 }}>
              <div style={{ height:"0.5px", flex:1, background:"linear-gradient(to right,transparent,rgba(147,112,219,0.4))" }}/>
              <span style={{ fontSize:16, color:"#9370DB" }}>✦ ✦ ✦</span>
              <div style={{ height:"0.5px", flex:1, background:"linear-gradient(to left,transparent,rgba(147,112,219,0.4))" }}/>
            </div>
            <p style={{ fontFamily:"'Crimson Text',serif", fontStyle:"italic", fontSize:20, color:"rgba(232,213,255,0.75)", lineHeight:1.9 }}>
              {couple.personalMessage
                ? `"${couple.personalMessage}"`
                : `"Two souls, aligned by the universe, bound by love. The stars have led us to this moment, and we invite you to share it with us."`}
            </p>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginTop:28 }}>
              <div style={{ height:"0.5px", flex:1, background:"linear-gradient(to right,transparent,rgba(147,112,219,0.4))" }}/>
              <span style={{ fontSize:16, color:"#9370DB" }}>✦ ✦ ✦</span>
              <div style={{ height:"0.5px", flex:1, background:"linear-gradient(to left,transparent,rgba(147,112,219,0.4))" }}/>
            </div>
          </Reveal>
        </section>

        {/* ── SECTION 3 — Events ─── */}
        <section style={{ padding:"20px 24px 60px", maxWidth:560, margin:"0 auto" }}>
          <Reveal>
            <p style={{ fontFamily:"'Jost',sans-serif", fontWeight:300, fontSize:10, letterSpacing:"0.5em", color:"rgba(200,180,255,0.5)", textTransform:"uppercase" as const, textAlign:"center", marginBottom:32 }}>Celebrations</p>
          </Reveal>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {allEvents.map((event,i) => (
              <Reveal key={i} delay={i*0.1}>
                <div style={{ background:"rgba(147,112,219,0.06)", border:"1px solid rgba(147,112,219,0.2)", borderRadius:20, padding:"26px 28px", position:"relative" }}>
                  <div style={{ position:"absolute", top:20, right:20, fontSize:18, opacity:0.3 }}>✦</div>
                  <h3 style={{ fontFamily:"'Crimson Text',serif", fontSize:20, color:"#F0E8FF", marginBottom:12 }}>{event.name}</h3>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}><Calendar size={13} color="rgba(147,112,219,0.7)"/><span style={{ fontSize:14, color:"rgba(232,213,255,0.75)" }}>{formatWeddingDate(event.date)}</span></div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}><Clock size={13} color="rgba(147,112,219,0.7)"/><span style={{ fontSize:14, color:"rgba(232,213,255,0.75)" }}>{event.time}</span></div>
                    {event.venue && <div style={{ display:"flex", alignItems:"center", gap:8 }}><MapPin size={13} color="rgba(147,112,219,0.7)"/><span style={{ fontSize:13, color:"rgba(200,180,255,0.5)" }}>{event.venue}</span></div>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── SECTION 4 — Venue ─── */}
        <section style={{ padding:"20px 24px 60px", maxWidth:520, margin:"0 auto", textAlign:"center" }}>
          <Reveal>
            <p style={{ fontFamily:"'Jost',sans-serif", fontWeight:300, fontSize:10, letterSpacing:"0.5em", color:"rgba(200,180,255,0.5)", textTransform:"uppercase" as const, marginBottom:24 }}>Location</p>
            <div style={{ background:"rgba(147,112,219,0.06)", border:"1px solid rgba(147,112,219,0.2)", borderRadius:22, padding:"36px 28px" }}>
              <MapPin size={20} color="#9370DB" style={{ margin:"0 auto 14px", display:"block" }}/>
              <h3 style={{ fontFamily:"'Crimson Text',serif", fontSize:22, color:"#F0E8FF", marginBottom:8 }}>{couple.venue}</h3>
              {couple.venueAddress && <p style={{ fontSize:14, color:"rgba(200,180,255,0.5)", lineHeight:1.8, marginBottom:20 }}>{couple.venueAddress}</p>}
              {couple.mapLink && (
                <a href={couple.mapLink} target="_blank" rel="noopener noreferrer"
                  style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"11px 26px", border:"1px solid rgba(147,112,219,0.4)", borderRadius:40, color:"#C9A0FF", fontSize:11, fontFamily:"'Jost',sans-serif", letterSpacing:"0.15em", textDecoration:"none", textTransform:"uppercase" as const }}>
                  <MapPin size={12}/> View on Maps
                </a>
              )}
            </div>
          </Reveal>
        </section>

        {/* ── SECTION 5 — Countdown ─── */}
        <section style={{ padding:"20px 24px 60px", textAlign:"center" }}>
          <Reveal>
            <p style={{ fontFamily:"'Crimson Text',serif", fontStyle:"italic", fontSize:20, color:"rgba(232,213,255,0.5)", marginBottom:32 }}>Until our stars align</p>
            <Countdown targetDate={couple.weddingDate}/>
          </Reveal>
        </section>

        {/* ── SECTION 6 — RSVP ─── */}
        <section style={{ padding:"20px 24px 80px", maxWidth:520, margin:"0 auto", textAlign:"center" }}>
          <Reveal>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:24 }}>
              <div style={{ height:"0.5px", flex:1, background:"linear-gradient(to right,transparent,rgba(147,112,219,0.4))" }}/>
              <MoonPhase size={28}/>
              <div style={{ height:"0.5px", flex:1, background:"linear-gradient(to left,transparent,rgba(147,112,219,0.4))" }}/>
            </div>
            <h2 style={{ fontFamily:"'Crimson Text',serif", fontSize:28, color:"#F0E8FF", marginBottom:8 }}>Join us under the stars</h2>
            <p style={{ fontFamily:"'Jost',sans-serif", fontWeight:300, fontSize:14, color:"rgba(200,180,255,0.55)", lineHeight:1.8, marginBottom:28 }}>Let us know you&apos;re coming — the universe awaits</p>
            <div style={{ textAlign:"left", marginBottom:20 }}>
              <RSVPForm inviteSlug={`${couple.groomName.toLowerCase().replace(/\s+/g,"-")}-weds-${couple.brideName.toLowerCase().replace(/\s+/g,"-")}`} coupleName={`${couple.groomName} & ${couple.brideName}`} accentColor="#9370DB" theme="dark"/>
            </div>
            {couple.phone && (
              <button onClick={() => { const p=couple.phone?.replace(/\D/g,""); window.open(`https://wa.me/${p}?text=${encodeURIComponent(`Greetings! We'd love to attend the wedding of ${couple.groomName} & ${couple.brideName}.`)}`,"_blank"); }}
                style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"9px 22px", background:"transparent", borderRadius:40, border:"1px solid rgba(147,112,219,0.3)", color:"rgba(200,180,255,0.7)", fontFamily:"'Jost',sans-serif", fontSize:11, cursor:"pointer", textTransform:"uppercase" as const, letterSpacing:"0.15em" }}>
                <Phone size={12}/> Also WhatsApp us
              </button>
            )}
            <div style={{ marginTop:40 }}>
              <span style={{ fontSize:24, color:"rgba(147,112,219,0.4)" }}>✦</span>
              <p style={{ fontFamily:"'Crimson Text',serif", fontStyle:"italic", fontSize:18, color:"rgba(200,180,255,0.35)", marginTop:8 }}>{couple.groomName} & {couple.brideName}</p>
              <p style={{ fontSize:10, color:"rgba(200,180,255,0.15)", letterSpacing:"0.3em", textTransform:"uppercase" as const, marginTop:6 }}>Made with WedCraft</p>
            </div>
          </Reveal>
        </section>
      </div>
      {couple.bgMusicUrl && (
  <MusicPlayer
    src={couple.bgMusicUrl}
    dark
    accentColor="#9370DB"
  />
)}
    </>
  );
}