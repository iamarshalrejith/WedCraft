"use client";

import { useEffect, useState, useRef } from "react";
import { CoupleDetails } from "@/types/invite";
import { formatWeddingDate } from "@/lib/invite-utils";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Calendar, Clock } from "lucide-react";
import RSVPForm from "@/components/rsvp/RSVPForm";

interface RusticBloomProps { couple: CoupleDetails; }

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
          <div style={{ width:60, height:60, background:"rgba(255,255,255,0.6)", border:"2px solid #C4855A", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Playfair Display',serif", fontSize:26, color:"#5C3317", marginBottom:6, boxShadow:"2px 2px 0 rgba(139,90,60,0.2)" }}>
            {String(v).padStart(2,"0")}
          </div>
          <span style={{ fontSize:10, letterSpacing:"0.2em", color:"#8B6950", textTransform:"uppercase" as const, fontFamily:"sans-serif" }}>{l}</span>
        </div>
      ))}
    </div>
  );
}

function Reveal({ children, delay=0 }: { children:React.ReactNode; delay?:number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-50px" });
  return <motion.div ref={ref} initial={{ opacity:0, y:20 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:0.8, delay, ease:[0.22,1,0.36,1] }}>{children}</motion.div>;
}

// Rough twine divider
const TwineDivider = () => (
  <div style={{ display:"flex", alignItems:"center", gap:12, margin:"28px 0" }}>
    <div style={{ flex:1, height:2, background:"repeating-linear-gradient(90deg, #C4855A 0px, #C4855A 4px, transparent 4px, transparent 8px)", opacity:0.5 }}/>
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path d="M12 2 L14 9 L22 9 L16 14 L18 22 L12 17 L6 22 L8 14 L2 9 L10 9 Z" fill="#C4855A" opacity="0.7"/>
    </svg>
    <div style={{ flex:1, height:2, background:"repeating-linear-gradient(90deg, #C4855A 0px, #C4855A 4px, transparent 4px, transparent 8px)", opacity:0.5 }}/>
  </div>
);

// Watercolor flower
const WatercolorFlower = ({ x, y, size=60, rotate=0, opacity=0.25 }: { x:number|string; y:number|string; size?:number; rotate?:number; opacity?:number }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ position:"absolute", left:x, top:y, transform:`rotate(${rotate}deg)`, opacity, pointerEvents:"none" }}>
    {[0,60,120,180,240,300].map((a,i) => (
      <ellipse key={i} cx="30" cy="30" rx="8" ry="18" transform={`rotate(${a} 30 30)`} fill={i%2===0?"#E8916A":"#D4A574"} opacity="0.7"/>
    ))}
    <circle cx="30" cy="30" r="6" fill="#F5C5A3"/>
    <circle cx="30" cy="30" r="3" fill="#C4855A"/>
  </svg>
);

// Wood grain texture
const WoodTag = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", padding:"10px 24px", background:"#C4855A", color:"#FFF8F0", fontFamily:"'Playfair Display',serif", fontSize:14, borderRadius:4, position:"relative", boxShadow:"2px 2px 0 rgba(100,60,30,0.3)" }}>
    <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, opacity:0.05, backgroundImage:"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 3px)", borderRadius:4 }}/>
    {children}
  </div>
);

export default function RusticBloom({ couple }: RusticBloomProps) {
  const allEvents = couple.events?.length > 0 ? couple.events : [{ name:"Wedding Ceremony", date:couple.weddingDate, time:couple.weddingTime, venue:couple.venue }];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400&family=Sacramento&display=swap" rel="stylesheet"/>
      <style>{`@keyframes sway { 0%,100%{transform:rotate(-2deg)} 50%{transform:rotate(2deg)} }`}</style>

      <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#FDF5E8 0%,#F5E8D0 40%,#EDD8B8 100%)", fontFamily:"'Lato',sans-serif", overflowX:"hidden" }}
        onContextMenu={e=>e.preventDefault()}>

        {/* Watercolor flowers */}
        <WatercolorFlower x={-20} y={60} size={100} rotate={-15} opacity={0.2}/>
        <WatercolorFlower x="80%" y={20} size={80} rotate={20} opacity={0.18}/>
        <WatercolorFlower x="10%" y="60%" size={70} rotate={-30} opacity={0.15}/>
        <WatercolorFlower x="85%" y="55%" size={90} rotate={10} opacity={0.17}/>

        {/* ── SECTION 1 — Hero ─── */}
        <section style={{ position:"relative", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 24px 100px", textAlign:"center" }}>

          <Reveal>
            <p style={{ fontFamily:"'Lato',sans-serif", fontWeight:300, fontSize:10, letterSpacing:"0.5em", color:"#8B6950", textTransform:"uppercase" as const, marginBottom:20 }}>
              Together with their families
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 style={{ fontFamily:"'Sacramento',cursive", fontSize:"clamp(4rem,13vw,7.5rem)", color:"#5C3317", lineHeight:1, marginBottom:0 }}>
              {couple.groomName}
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{ display:"flex", alignItems:"center", gap:16, margin:"8px 0" }}>
              <div style={{ height:1, width:48, background:"rgba(196,133,90,0.5)" }}/>
              <svg width="28" height="28" viewBox="0 0 28 28">
                <path d="M14 4 C10 4 6 8 6 14 C6 14 10 10 14 12 C18 10 22 14 22 14 C22 8 18 4 14 4Z" fill="#C4855A" opacity="0.8"/>
                <path d="M14 24 C10 24 6 20 6 14 C6 14 10 18 14 16 C18 18 22 14 22 14 C22 20 18 24 14 24Z" fill="#E8916A" opacity="0.8"/>
              </svg>
              <div style={{ height:1, width:48, background:"rgba(196,133,90,0.5)" }}/>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <h1 style={{ fontFamily:"'Sacramento',cursive", fontSize:"clamp(4rem,13vw,7.5rem)", color:"#8B4513", lineHeight:1, marginBottom:28 }}>
              {couple.brideName}
            </h1>
          </Reveal>

          <Reveal delay={0.4}>
            <WoodTag>
              <Calendar size={13} style={{ marginRight:8 }}/>{formatWeddingDate(couple.weddingDate)} · {couple.weddingTime}
            </WoodTag>
          </Reveal>

          <Reveal delay={0.5}>
            <p style={{ fontSize:13, color:"#8B6950", marginTop:12, fontFamily:"'Lato',sans-serif" }}>{couple.venue}</p>
          </Reveal>

          <motion.div animate={{ y:[0,8,0] }} transition={{ duration:2.2, repeat:Infinity }} style={{ position:"absolute", bottom:32, color:"#C4855A", opacity:0.5, fontSize:20 }}>↓</motion.div>
        </section>

        {/* ── SECTION 2 — Message ─── */}
        <section style={{ padding:"40px 24px 60px", maxWidth:520, margin:"0 auto", textAlign:"center" }}>
          <Reveal>
            <TwineDivider/>
            <p style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:20, color:"#5C3317", lineHeight:1.9 }}>
              {couple.personalMessage
                ? `"${couple.personalMessage}"`
                : `"Love is patient, love is kind. Beneath the open sky and surrounded by wildflowers, two hearts become one."`}
            </p>
            <TwineDivider/>
          </Reveal>
        </section>

        {/* ── SECTION 3 — Events ─── */}
        <section style={{ padding:"20px 24px 60px", maxWidth:560, margin:"0 auto" }}>
          <Reveal>
            <p style={{ fontFamily:"'Lato',sans-serif", fontWeight:400, fontSize:10, letterSpacing:"0.4em", color:"#8B6950", textTransform:"uppercase" as const, textAlign:"center", marginBottom:28 }}>The Day</p>
          </Reveal>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {allEvents.map((event,i) => (
              <Reveal key={i} delay={i*0.1}>
                <div style={{ background:"rgba(255,255,255,0.6)", border:"1px solid rgba(196,133,90,0.25)", borderRadius:12, padding:"22px 24px", boxShadow:"2px 2px 0 rgba(196,133,90,0.1)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:3, height:40, background:"#C4855A", borderRadius:2, flexShrink:0 }}/>
                    <div style={{ flex:1 }}>
                      <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:"#5C3317", marginBottom:8 }}>{event.name}</h3>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:12 }}>
                        <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:"#8B6950" }}><Calendar size={12} color="#C4855A"/>{formatWeddingDate(event.date)}</span>
                        <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:"#8B6950" }}><Clock size={12} color="#C4855A"/>{event.time}</span>
                        {event.venue && <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#A0826E" }}><MapPin size={12} color="#C4855A"/>{event.venue}</span>}
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
            <div style={{ background:"rgba(255,255,255,0.6)", border:"1px solid rgba(196,133,90,0.25)", borderRadius:12, padding:"32px 24px", boxShadow:"2px 2px 0 rgba(196,133,90,0.1)" }}>
              <MapPin size={20} color="#C4855A" style={{ margin:"0 auto 12px", display:"block" }}/>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:"#5C3317", marginBottom:6 }}>{couple.venue}</h3>
              {couple.venueAddress && <p style={{ fontSize:13, color:"#8B6950", lineHeight:1.8, marginBottom:18 }}>{couple.venueAddress}</p>}
              {couple.mapLink && (
                <a href={couple.mapLink} target="_blank" rel="noopener noreferrer"
                  style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"10px 24px", background:"#C4855A", borderRadius:6, color:"#FFF8F0", fontSize:12, fontFamily:"'Lato',sans-serif", letterSpacing:"0.1em", textDecoration:"none", textTransform:"uppercase" as const, boxShadow:"2px 2px 0 rgba(100,60,30,0.3)" }}>
                  <MapPin size={12}/> Get Directions
                </a>
              )}
            </div>
          </Reveal>
        </section>

        {/* ── SECTION 5 — Countdown ─── */}
        <section style={{ padding:"20px 24px 60px", textAlign:"center" }}>
          <Reveal>
            <p style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:18, color:"#8B6950", marginBottom:28 }}>Counting down to our day</p>
            <Countdown targetDate={couple.weddingDate}/>
          </Reveal>
        </section>

        {/* ── SECTION 6 — RSVP ─── */}
        <section style={{ padding:"20px 24px 80px", maxWidth:520, margin:"0 auto", textAlign:"center" }}>
          <Reveal>
            <TwineDivider/>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:"#5C3317", marginBottom:8 }}>Join our celebration</h2>
            <p style={{ fontFamily:"'Lato',sans-serif", fontSize:14, color:"#8B6950", lineHeight:1.8, marginBottom:28 }}>
              Your presence would mean the world to us.
            </p>
            <div style={{ textAlign:"left", marginBottom:16 }}>
              <RSVPForm inviteSlug={
    couple.slug ??
    `${couple.groomName.toLowerCase().replace(/\s+/g,"-")}-weds-${couple.brideName.toLowerCase().replace(/\s+/g,"-")}`
  } coupleName={`${couple.groomName} & ${couple.brideName}`} accentColor="#C4855A" theme="light"/>
            </div>
            {couple.phone && (
              <button onClick={()=>{const p=couple.phone?.replace(/\D/g,"");window.open(`https://wa.me/${p}?text=${encodeURIComponent(`Hi! We'd love to join the wedding of ${couple.groomName} & ${couple.brideName}.`)}`,"_blank");}}
                style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"9px 20px", background:"transparent", border:"1px solid rgba(196,133,90,0.4)", borderRadius:6, color:"#8B6950", fontFamily:"'Lato',sans-serif", fontSize:12, cursor:"pointer" }}>
                <Phone size={12}/> Also WhatsApp us
              </button>
            )}
            <TwineDivider/>
            <p style={{ fontFamily:"'Sacramento',cursive", fontSize:26, color:"#8B6950" }}>{couple.groomName} & {couple.brideName}</p>
            <p style={{ fontSize:10, color:"#C4A882", letterSpacing:"0.2em", textTransform:"uppercase" as const, marginTop:8 }}>Made with WedCraft</p>
          </Reveal>
        </section>
      </div>
    </>
  );
}