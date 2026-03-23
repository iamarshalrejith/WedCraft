"use client";

import { useEffect, useState, useRef } from "react";
import { CoupleDetails } from "@/types/invite";
import { formatWeddingDate } from "@/lib/invite-utils";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Calendar, Clock } from "lucide-react";
import RSVPForm from "@/components/rsvp/RSVPForm";

interface ZenGardenProps { couple: CoupleDetails; }

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
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", borderTop:"1px solid #E0D8D0", borderBottom:"1px solid #E0D8D0" }}>
      {[{v:t.d,l:"日 Days"},{v:t.h,l:"時 Hours"},{v:t.m,l:"分 Mins"},{v:t.s,l:"秒 Secs"}].map(({v,l},i) => (
        <div key={l} style={{ textAlign:"center", padding:"20px 0", borderRight:i<3?"1px solid #E0D8D0":"none" }}>
          <div style={{ fontFamily:"'Noto Serif JP',serif", fontSize:32, color:"#1A1A1A", lineHeight:1 }}>{String(v).padStart(2,"0")}</div>
          <div style={{ fontFamily:"sans-serif", fontSize:9, color:"#999", letterSpacing:"0.1em", textTransform:"uppercase" as const, marginTop:6 }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

function Reveal({ children, delay=0 }: { children:React.ReactNode; delay?:number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-40px" });
  return <motion.div ref={ref} initial={{ opacity:0, x:-12 }} animate={inView?{opacity:1,x:0}:{}} transition={{ duration:1, delay, ease:[0.22,1,0.36,1] }}>{children}</motion.div>;
}

// Ink brush stroke SVG
const BrushStroke = ({ width=200, color="#1A1A1A", opacity=0.06, y=0 }: { width?:number; color?:string; opacity?:number; y?:number }) => (
  <svg width={width} height="20" viewBox={`0 0 ${width} 20`} style={{ display:"block", opacity }}>
    <path d={`M0 10 Q${width*0.3} ${y<0?5:15} ${width*0.5} 10 Q${width*0.7} ${y<0?15:5} ${width} 10`} stroke={color} strokeWidth="8" fill="none" strokeLinecap="round"/>
  </svg>
);

// Cherry blossom
const Sakura = ({ x, y, size=40, rotate=0, opacity=0.15 }: { x:number|string; y:number|string; size?:number; rotate?:number; opacity?:number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ position:"absolute", left:x, top:y, transform:`rotate(${rotate}deg)`, opacity, pointerEvents:"none" }}>
    {[0,72,144,216,288].map((a,i) => (
      <ellipse key={i} cx="20" cy="20" rx="5" ry="11" transform={`rotate(${a} 20 20)`} fill="#E8B4C0"/>
    ))}
    <circle cx="20" cy="20" r="4" fill="#F5E0E5"/>
    <circle cx="20" cy="20" r="2" fill="#D4849A"/>
  </svg>
);

// Red seal stamp
const RedSeal = ({ text="愛" }: { text?:string }) => (
  <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:52, height:52, background:"#CC2936", borderRadius:4, transform:"rotate(-8deg)", boxShadow:"inset 0 0 8px rgba(0,0,0,0.3)" }}>
    <span style={{ fontFamily:"'Noto Serif JP',serif", fontSize:28, color:"rgba(255,255,255,0.95)", lineHeight:1 }}>{text}</span>
  </div>
);

export default function ZenGarden({ couple }: ZenGardenProps) {
  const allEvents = couple.events?.length > 0 ? couple.events : [{ name:"Wedding Ceremony", date:couple.weddingDate, time:couple.weddingTime, venue:couple.venue }];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400&family=Noto+Sans+JP:wght@300;400&display=swap" rel="stylesheet"/>

      <div style={{ minHeight:"100vh", background:"#FAFAF8", fontFamily:"'Noto Sans JP',sans-serif", overflowX:"hidden" }}
        onContextMenu={e=>e.preventDefault()}>

        {/* Sakura petals */}
        <Sakura x="-10" y={120} size={70} rotate={-20} opacity={0.18}/>
        <Sakura x="82%" y={80} size={55} rotate={30} opacity={0.15}/>
        <Sakura x="5%" y="55%" size={50} rotate={-40} opacity={0.12}/>
        <Sakura x="88%" y="60%" size={65} rotate={15} opacity={0.14}/>

        <div style={{ maxWidth:560, margin:"0 auto", padding:"0 28px" }}>

          {/* ── SECTION 1 — Hero ─── */}
          <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", padding:"80px 0 60px", position:"relative" }}>

            <Reveal>
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:32 }}>
                <div style={{ flex:1, height:"0.5px", background:"#1A1A1A", opacity:0.15 }}/>
                <span style={{ fontFamily:"'Noto Serif JP',serif", fontSize:11, letterSpacing:"0.3em", color:"#999", textTransform:"uppercase" as const }}>Joyfully invite you</span>
                <div style={{ flex:1, height:"0.5px", background:"#1A1A1A", opacity:0.15 }}/>
              </div>
            </Reveal>

            {/* Brush stroke behind names */}
            <div style={{ position:"relative", marginBottom:8 }}>
              <div style={{ position:"absolute", top:"50%", left:-20, transform:"translateY(-50%)" }}>
                <BrushStroke width={600} color="#1A1A1A" opacity={0.04}/>
              </div>
              <Reveal delay={0.1}>
                <h1 style={{ fontFamily:"'Noto Serif JP',serif", fontWeight:300, fontSize:"clamp(3rem,10vw,5.5rem)", color:"#1A1A1A", lineHeight:1.1, letterSpacing:"0.05em" }}>
                  {couple.groomName}
                </h1>
              </Reveal>
            </div>

            <Reveal delay={0.15}>
              <div style={{ display:"flex", alignItems:"center", gap:12, margin:"12px 0" }}>
                <div style={{ height:"0.5px", width:32, background:"#CC2936", opacity:0.6 }}/>
                <RedSeal text="縁"/>
                <div style={{ height:"0.5px", width:32, background:"#CC2936", opacity:0.6 }}/>
                <span style={{ fontFamily:"'Noto Serif JP',serif", fontWeight:300, fontSize:13, color:"#999", letterSpacing:"0.3em" }}>and</span>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <h1 style={{ fontFamily:"'Noto Serif JP',serif", fontWeight:300, fontSize:"clamp(3rem,10vw,5.5rem)", color:"#CC2936", lineHeight:1.1, letterSpacing:"0.05em", marginBottom:36 }}>
                {couple.brideName}
              </h1>
            </Reveal>

            <Reveal delay={0.3}>
              <div style={{ borderLeft:"2px solid #CC2936", paddingLeft:16 }}>
                <p style={{ fontFamily:"'Noto Sans JP',sans-serif", fontWeight:300, fontSize:15, color:"#333", marginBottom:4 }}>{formatWeddingDate(couple.weddingDate)}</p>
                <p style={{ fontFamily:"'Noto Sans JP',sans-serif", fontWeight:300, fontSize:13, color:"#777" }}>{couple.weddingTime} · {couple.venue}</p>
              </div>
            </Reveal>

            <motion.div animate={{ y:[0,6,0] }} transition={{ duration:2.5, repeat:Infinity }} style={{ position:"absolute", bottom:28, color:"#CC2936", opacity:0.4, fontSize:18 }}>↓</motion.div>
          </section>

          {/* ── SECTION 2 — Message ─── */}
          {couple.personalMessage && (
            <section style={{ padding:"20px 0 48px" }}>
              <Reveal>
                <BrushStroke width="100%" color="#1A1A1A" opacity={0.06} y={-2}/>
                <p style={{ fontFamily:"'Noto Serif JP',serif", fontWeight:300, fontSize:18, color:"#333", lineHeight:2, padding:"24px 0", fontStyle:"italic" }}>
                  &ldquo;{couple.personalMessage}&rdquo;
                </p>
                <BrushStroke width="100%" color="#1A1A1A" opacity={0.06} y={2}/>
              </Reveal>
            </section>
          )}

          {/* ── SECTION 3 — Events ─── */}
          <section style={{ padding:"20px 0 48px" }}>
            <Reveal>
              <p style={{ fontFamily:"'Noto Sans JP',sans-serif", fontWeight:300, fontSize:10, letterSpacing:"0.4em", color:"#999", textTransform:"uppercase" as const, marginBottom:24 }}>式次第 — Programme</p>
            </Reveal>
            <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {allEvents.map((event,i) => (
                <Reveal key={i} delay={i*0.1}>
                  <div style={{ display:"flex", gap:20, padding:"20px 0", borderBottom:"1px solid #E0D8D0", alignItems:"flex-start" }}>
                    <div style={{ width:3, height:3, borderRadius:"50%", background:"#CC2936", marginTop:8, flexShrink:0 }}/>
                    <div style={{ flex:1 }}>
                      <h3 style={{ fontFamily:"'Noto Serif JP',serif", fontWeight:400, fontSize:18, color:"#1A1A1A", marginBottom:8 }}>{event.name}</h3>
                      <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
                        <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:"#666" }}><Calendar size={12} color="#CC2936"/>{formatWeddingDate(event.date)}</span>
                        <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:"#666" }}><Clock size={12} color="#CC2936"/>{event.time}</span>
                        {event.venue && <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#999" }}><MapPin size={12} color="#CC2936"/>{event.venue}</span>}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ── SECTION 4 — Venue ─── */}
          <section style={{ padding:"20px 0 48px" }}>
            <Reveal>
              <p style={{ fontFamily:"'Noto Sans JP',sans-serif", fontWeight:300, fontSize:10, letterSpacing:"0.4em", color:"#999", textTransform:"uppercase" as const, marginBottom:20 }}>会場 — Location</p>
              <div style={{ background:"#F5F3F0", borderRadius:4, padding:"28px 24px", borderLeft:"3px solid #CC2936" }}>
                <h3 style={{ fontFamily:"'Noto Serif JP',serif", fontWeight:400, fontSize:20, color:"#1A1A1A", marginBottom:6 }}>{couple.venue}</h3>
                {couple.venueAddress && <p style={{ fontFamily:"'Noto Sans JP',sans-serif", fontWeight:300, fontSize:13, color:"#666", lineHeight:1.9, marginBottom:16 }}>{couple.venueAddress}</p>}
                {couple.mapLink && (
                  <a href={couple.mapLink} target="_blank" rel="noopener noreferrer"
                    style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"9px 20px", border:"1px solid #CC2936", borderRadius:2, color:"#CC2936", fontSize:11, fontFamily:"'Noto Sans JP',sans-serif", letterSpacing:"0.12em", textDecoration:"none", textTransform:"uppercase" as const }}>
                    <MapPin size={11}/> View Map
                  </a>
                )}
              </div>
            </Reveal>
          </section>

          {/* ── SECTION 5 — Countdown ─── */}
          <section style={{ padding:"20px 0 48px" }}>
            <Reveal>
              <p style={{ fontFamily:"'Noto Serif JP',serif", fontStyle:"normal", fontWeight:300, fontSize:16, color:"#666", textAlign:"center", marginBottom:20 }}>佳き日まで — Until the day</p>
              <Countdown targetDate={couple.weddingDate}/>
            </Reveal>
          </section>

          {/* ── SECTION 6 — RSVP ─── */}
          <section style={{ padding:"20px 0 80px" }}>
            <Reveal>
              <BrushStroke width="100%" color="#1A1A1A" opacity={0.06}/>
              <div style={{ padding:"28px 0" }}>
                <p style={{ fontFamily:"'Noto Sans JP',sans-serif", fontWeight:300, fontSize:10, letterSpacing:"0.4em", color:"#999", textTransform:"uppercase" as const, textAlign:"center", marginBottom:8 }}>出欠 — RSVP</p>
                <p style={{ fontFamily:"'Noto Serif JP',serif", fontWeight:300, fontSize:18, color:"#333", textAlign:"center", marginBottom:28 }}>ご出席をお知らせください</p>
                <RSVPForm inviteSlug={`${couple.groomName.toLowerCase().replace(/\s+/g,"-")}-weds-${couple.brideName.toLowerCase().replace(/\s+/g,"-")}`} coupleName={`${couple.groomName} & ${couple.brideName}`} accentColor="#CC2936" theme="light"/>
                {couple.phone && (
                  <div style={{ textAlign:"center", marginTop:16 }}>
                    <button onClick={()=>{const p=couple.phone?.replace(/\D/g,"");window.open(`https://wa.me/${p}?text=${encodeURIComponent(`Hi! We would love to attend the wedding of ${couple.groomName} & ${couple.brideName}.`)}`,"_blank");}}
                      style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 18px", background:"transparent", border:"1px solid #DDD", borderRadius:2, color:"#666", fontFamily:"'Noto Sans JP',sans-serif", fontSize:11, cursor:"pointer", letterSpacing:"0.08em" }}>
                      <Phone size={11}/> Also WhatsApp us
                    </button>
                  </div>
                )}
              </div>
              <BrushStroke width="100%" color="#1A1A1A" opacity={0.06}/>
              <div style={{ textAlign:"center", marginTop:24 }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:12 }}>
                  <RedSeal text="愛"/>
                  <div>
                    <p style={{ fontFamily:"'Noto Serif JP',serif", fontWeight:300, fontSize:18, color:"#333" }}>{couple.groomName} & {couple.brideName}</p>
                    <p style={{ fontFamily:"'Noto Sans JP',sans-serif", fontWeight:300, fontSize:9, color:"#CCC", letterSpacing:"0.3em", textTransform:"uppercase" as const, marginTop:4 }}>Made with WedCraft</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>
        </div>
      </div>
    </>
  );
}