"use client";

import { useEffect, useState, useRef } from "react";
import { CoupleDetails } from "@/types/invite";
import { formatWeddingDate } from "@/lib/invite-utils";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Calendar, Clock } from "lucide-react";
import RSVPForm from "@/components/rsvp/RSVPForm";
import Image from "next/image";
import MusicPlayer from "@/components/MusicPlayer";

interface MidnightRoseProps { couple: CoupleDetails; }

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
  return (
    <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
      {[{v:t.d,l:"Days"},{v:t.h,l:"Hours"},{v:t.m,l:"Mins"},{v:t.s,l:"Secs"}].map(({v,l}) => (
        <div key={l} style={{ textAlign:"center" }}>
          <div style={{ width:62, height:62, background:"rgba(180,140,60,0.1)", border:"1px solid rgba(180,140,60,0.5)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Cormorant Garamond',serif", fontSize:26, color:"#E8C97A", marginBottom:6 }}>
            {String(v).padStart(2,"0")}
          </div>
          <span style={{ fontSize:10, letterSpacing:"0.2em", color:"rgba(200,180,130,0.5)", textTransform:"uppercase" as const, fontFamily:"sans-serif" }}>{l}</span>
        </div>
      ))}
    </div>
  );
}

function Reveal({ children, delay=0 }: { children:React.ReactNode; delay?:number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-50px" });
  return <motion.div ref={ref} initial={{ opacity:0, y:20 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:1, delay, ease:[0.22,1,0.36,1] }}>{children}</motion.div>;
}

// Gold rose SVG
const GoldRose = ({ size=80, x=0, y=0, rotate=0, opacity=0.2 }: { size?:number; x?:number|string; y?:number|string; rotate?:number; opacity?:number }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" style={{ position:"absolute", left:x, top:y, transform:`rotate(${rotate}deg)`, opacity, pointerEvents:"none" }}>
    <circle cx="40" cy="40" r="10" fill="#B8860B"/>
    {[0,45,90,135,180,225,270,315].map((a,i) => (
      <ellipse key={i} cx="40" cy="40" rx={6+i*0.5} ry={12+i*1.5} transform={`rotate(${a} 40 40) translate(0,-${14+i*2})`} fill={i%2===0?"#DAA520":"#B8860B"} opacity={0.8-i*0.05}/>
    ))}
    <path d="M40 70 C35 60 25 55 20 75" stroke="#2D5A27" strokeWidth="1.5" fill="none"/>
    <path d="M30 62 C28 56 22 54 20 60" stroke="#2D5A27" strokeWidth="1" fill="#2D5A27" opacity="0.8"/>
    <path d="M45 68 C47 62 53 60 55 66" stroke="#2D5A27" strokeWidth="1" fill="#2D5A27" opacity="0.8"/>
  </svg>
);

// Ornate border frame
const OrnateCorner = ({ flip=false }: { flip?:boolean }) => (
  <svg width="70" height="70" viewBox="0 0 70 70" style={{ opacity:0.25, transform:flip?"scale(-1,1)":"none" }}>
    <path d="M5 5 L30 5 L30 8 L8 8 L8 30 L5 30 Z" fill="#B8860B"/>
    <path d="M5 5 L5 5" stroke="#B8860B" strokeWidth="0.5"/>
    <circle cx="5" cy="5" r="2.5" fill="#B8860B"/>
    <path d="M12 5 Q18 5 18 12 Q18 5 25 5" stroke="#B8860B" strokeWidth="0.8" fill="none"/>
    <path d="M5 12 Q5 18 12 18 Q5 18 5 25" stroke="#B8860B" strokeWidth="0.8" fill="none"/>
    <circle cx="18" cy="18" r="1.5" fill="#B8860B" opacity="0.6"/>
  </svg>
);

const GoldDivider = () => (
  <div style={{ display:"flex", alignItems:"center", gap:12, margin:"28px 0" }}>
    <div style={{ flex:1, height:"0.5px", background:"linear-gradient(to right,transparent,rgba(184,134,11,0.5))" }}/>
    <svg width="28" height="16" viewBox="0 0 28 16">
      <path d="M14 1 L26 8 L14 15 L2 8 Z" fill="none" stroke="#B8860B" strokeWidth="0.8" opacity="0.7"/>
      <circle cx="14" cy="8" r="2" fill="#B8860B" opacity="0.8"/>
    </svg>
    <div style={{ flex:1, height:"0.5px", background:"linear-gradient(to left,transparent,rgba(184,134,11,0.5))" }}/>
  </div>
);

export default function MidnightRose({ couple }: MidnightRoseProps) {
  const allEvents = couple.events?.length > 0 ? couple.events : [{ name:"Wedding Ceremony", date:couple.weddingDate, time:couple.weddingTime, venue:couple.venue }];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Raleway:wght@300;400&display=swap" rel="stylesheet"/>
      <style>{`@keyframes roseSway { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }`}</style>

      <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0A1A0A 0%,#0F2010 30%,#0A1A0A 60%,#060D06 100%)", fontFamily:"'Raleway',sans-serif", overflowX:"hidden" }}
        onContextMenu={e=>e.preventDefault()}>

        {/* Gold roses */}
        <GoldRose x="-30" y={80} size={110} rotate={-20} opacity={0.22}/>
        <GoldRose x="78%" y={40} size={90} rotate={25} opacity={0.18}/>
        <GoldRose x="-10" y="55%" size={80} rotate={15} opacity={0.15}/>
        <GoldRose x="82%" y="58%" size={100} rotate={-30} opacity={0.20}/>

        {/* ── SECTION 1 — Hero ─── */}
        <section style={{ position:"relative", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 24px 100px", textAlign:"center", overflow:"hidden" }}>

          {/* Corner ornaments */}
          <div style={{ position:"absolute", top:20, left:20 }}><OrnateCorner/></div>
          <div style={{ position:"absolute", top:20, right:20 }}><OrnateCorner flip/></div>
          <div style={{ position:"absolute", bottom:20, left:20, transform:"scaleY(-1)" }}><OrnateCorner/></div>
          <div style={{ position:"absolute", bottom:20, right:20, transform:"scale(-1,1) scaleY(-1)" }}><OrnateCorner/></div>

          {/* Subtle radial */}
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center, rgba(30,60,20,0.3) 0%, transparent 70%)", pointerEvents:"none" }}/>

          <Reveal>
            <p style={{ fontFamily:"'Raleway',sans-serif", fontWeight:300, fontSize:10, letterSpacing:"0.5em", color:"rgba(184,134,11,0.5)", textTransform:"uppercase" as const, marginBottom:28 }}>With love and joy</p>
          </Reveal>

          <Reveal delay={0.15}>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:"clamp(3rem,10vw,5.5rem)", color:"#F5F0E8", letterSpacing:"0.1em", lineHeight:1, marginBottom:4 }}>
              {couple.groomName}
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{ display:"flex", alignItems:"center", gap:16, margin:"10px 0" }}>
              <div style={{ height:"0.5px", width:48, background:"rgba(184,134,11,0.5)" }}/>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M10 2 C7 2 4 5 4 8 C4 8 6 6 10 8 C14 6 16 8 16 8 C16 5 13 2 10 2Z" fill="#B8860B" opacity="0.8"/>
                <path d="M10 18 C7 18 4 15 4 12 C4 12 6 14 10 12 C14 14 16 12 16 12 C16 15 13 18 10 18Z" fill="#DAA520" opacity="0.8"/>
              </svg>
              <div style={{ height:"0.5px", width:48, background:"rgba(184,134,11,0.5)" }}/>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:"clamp(3rem,10vw,5.5rem)", color:"#E8C97A", letterSpacing:"0.1em", lineHeight:1, marginBottom:36 }}>
              {couple.brideName}
            </h1>
          </Reveal>

          {couple.couplePhotoUrl && (
  <Reveal delay={0.3}>
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          display: "inline-block",
          padding: "4px",
          borderRadius: "12px",
          background: "rgba(184,134,11,0.25)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
        }}
      >
        <Image
          src={couple.couplePhotoUrl}
          alt="Couple"
          width={200}
          height={240}
          style={{
            objectFit: "cover",
            borderRadius: "10px",
            filter: "brightness(0.95) contrast(1.05)",
          }}
        />
      </div>
    </div>
  </Reveal>
)}

          <Reveal delay={0.35}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"12px 28px", background:"rgba(184,134,11,0.08)", border:"1px solid rgba(184,134,11,0.3)", borderRadius:3 }}>
              <Calendar size={13} color="#B8860B"/>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, color:"#F5F0E8", letterSpacing:"0.05em" }}>{formatWeddingDate(couple.weddingDate)}</span>
              <span style={{ color:"rgba(184,134,11,0.4)" }}>·</span>
              <span style={{ fontSize:13, color:"rgba(232,201,122,0.7)" }}>{couple.weddingTime}</span>
            </div>
          </Reveal>

          <Reveal delay={0.45}>
            <p style={{ fontSize:12, color:"rgba(200,180,130,0.4)", marginTop:10, letterSpacing:"0.1em" }}>{couple.venue}</p>
          </Reveal>

          <motion.div animate={{ y:[0,8,0] }} transition={{ duration:2.5, repeat:Infinity }} style={{ position:"absolute", bottom:32, color:"rgba(184,134,11,0.4)", fontSize:20 }}>↓</motion.div>
        </section>

        {/* ── SECTION 2 — Message ─── */}
        <section style={{ padding:"40px 24px 60px", maxWidth:520, margin:"0 auto", textAlign:"center" }}>
          <Reveal>
            <GoldDivider/>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontWeight:300, fontSize:21, color:"rgba(245,240,232,0.7)", lineHeight:1.9 }}>
              {couple.personalMessage
                ? `"${couple.personalMessage}"`
                : `"Like a rose that blooms in the darkest night, our love found each other. Come celebrate as two become one."`}
            </p>
            <GoldDivider/>
          </Reveal>
        </section>

        {/* ── SECTION 3 — Events ─── */}
        <section style={{ padding:"20px 24px 60px", maxWidth:560, margin:"0 auto" }}>
          <Reveal>
            <p style={{ fontFamily:"'Raleway',sans-serif", fontWeight:300, fontSize:10, letterSpacing:"0.5em", color:"rgba(184,134,11,0.5)", textTransform:"uppercase" as const, textAlign:"center", marginBottom:28 }}>Celebrations</p>
          </Reveal>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {allEvents.map((event,i) => (
              <Reveal key={i} delay={i*0.1}>
                <div style={{ background:"rgba(184,134,11,0.05)", border:"1px solid rgba(184,134,11,0.18)", borderRadius:4, padding:"24px 24px" }}>
                  <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                    <div style={{ width:2, minHeight:50, background:"linear-gradient(to bottom,#B8860B,rgba(184,134,11,0.2))", flexShrink:0, marginTop:4 }}/>
                    <div style={{ flex:1 }}>
                      <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:400, fontSize:20, color:"#F5F0E8", marginBottom:10 }}>{event.name}</h3>
                      <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                        <span style={{ display:"flex", alignItems:"center", gap:7, fontSize:13, color:"rgba(232,201,122,0.75)" }}><Calendar size={12} color="#B8860B"/>{formatWeddingDate(event.date)}</span>
                        <span style={{ display:"flex", alignItems:"center", gap:7, fontSize:13, color:"rgba(232,201,122,0.75)" }}><Clock size={12} color="#B8860B"/>{event.time}</span>
                        {event.venue && <span style={{ display:"flex", alignItems:"center", gap:7, fontSize:12, color:"rgba(200,180,130,0.4)" }}><MapPin size={12} color="#B8860B"/>{event.venue}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── SECTION 4 — Venue ─── */}
        <section style={{ padding:"20px 24px 60px", maxWidth:520, margin:"0 auto", textAlign:"center" }}>
          <Reveal>
            <div style={{ background:"rgba(184,134,11,0.05)", border:"1px solid rgba(184,134,11,0.18)", borderRadius:4, padding:"32px 24px" }}>
              <MapPin size={20} color="#B8860B" style={{ margin:"0 auto 14px", display:"block" }}/>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:400, fontSize:22, color:"#F5F0E8", marginBottom:8 }}>{couple.venue}</h3>
              {couple.venueAddress && <p style={{ fontSize:13, color:"rgba(200,180,130,0.5)", lineHeight:1.9, marginBottom:18 }}>{couple.venueAddress}</p>}
              {couple.mapLink && (
                <a href={couple.mapLink} target="_blank" rel="noopener noreferrer"
                  style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"10px 24px", border:"1px solid rgba(184,134,11,0.4)", borderRadius:3, color:"#E8C97A", fontSize:11, fontFamily:"'Raleway',sans-serif", letterSpacing:"0.15em", textDecoration:"none", textTransform:"uppercase" as const }}>
                  <MapPin size={11}/> Get Directions
                </a>
              )}
            </div>
          </Reveal>
        </section>

        {/* ── SECTION 5 — Countdown ─── */}
        <section style={{ padding:"20px 24px 60px", textAlign:"center" }}>
          <Reveal>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontWeight:300, fontSize:20, color:"rgba(245,240,232,0.4)", marginBottom:28 }}>Until our forever begins</p>
            <Countdown targetDate={couple.weddingDate}/>
          </Reveal>
        </section>

        {/* ── SECTION 6 — RSVP ─── */}
        <section style={{ padding:"20px 24px 80px", maxWidth:520, margin:"0 auto", textAlign:"center" }}>
          <Reveal>
            <GoldDivider/>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:28, color:"#F5F0E8", marginBottom:8 }}>Will you join us?</h2>
            <p style={{ fontFamily:"'Raleway',sans-serif", fontWeight:300, fontSize:13, color:"rgba(200,180,130,0.55)", lineHeight:1.8, marginBottom:28 }}>
              Your presence will make our night truly complete
            </p>
            <div style={{ textAlign:"left", marginBottom:16 }}>
              <RSVPForm  inviteSlug={
    couple.slug ??
    `${couple.groomName.toLowerCase().replace(/\s+/g,"-")}-weds-${couple.brideName.toLowerCase().replace(/\s+/g,"-")}`
  } coupleName={`${couple.groomName} & ${couple.brideName}`} accentColor="#B8860B" theme="dark"/>
            </div>
            {couple.phone && (
              <button onClick={()=>{const p=couple.phone?.replace(/\D/g,"");window.open(`https://wa.me/${p}?text=${encodeURIComponent(`Hello! We would love to celebrate with ${couple.groomName} & ${couple.brideName}.`)}`,"_blank");}}
                style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"9px 22px", background:"transparent", border:"1px solid rgba(184,134,11,0.3)", borderRadius:3, color:"rgba(232,201,122,0.6)", fontFamily:"'Raleway',sans-serif", fontSize:11, cursor:"pointer", letterSpacing:"0.12em", textTransform:"uppercase" as const }}>
                <Phone size={11}/> Also WhatsApp us
              </button>
            )}
            <GoldDivider/>
            <div>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontWeight:300, fontSize:20, color:"rgba(232,201,122,0.4)" }}>{couple.groomName} & {couple.brideName}</p>
              <p style={{ fontSize:10, color:"rgba(184,134,11,0.2)", letterSpacing:"0.3em", textTransform:"uppercase" as const, marginTop:8 }}>Made with WedCraft</p>
            </div>
          </Reveal>
        </section>
      </div>

      {couple.bgMusicUrl && (
  <MusicPlayer
    src={couple.bgMusicUrl}
    dark
    accentColor="#B8860B"
  />
)}
    </>
  );
}