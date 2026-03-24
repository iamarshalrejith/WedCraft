"use client";

import { useEffect, useState, useRef } from "react";
import { CoupleDetails } from "@/types/invite";
import { formatWeddingDate } from "@/lib/invite-utils";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Calendar, Clock } from "lucide-react";
import RSVPForm from "@/components/rsvp/RSVPForm";

interface IndianClassicProps { couple: CoupleDetails; }

function Countdown({ targetDate }: { targetDate: string }) {
  const [t, setT] = useState({ d:0, h:0, m:0, s:0 });
  useEffect(() => {
    const tick = () => { const diff=new Date(targetDate).getTime()-Date.now(); if(diff<=0)return; setT({d:Math.floor(diff/86400000),h:Math.floor((diff%86400000)/3600000),m:Math.floor((diff%3600000)/60000),s:Math.floor((diff%60000)/1000)}); };
    tick(); const id=setInterval(tick,1000); return ()=>clearInterval(id);
  },[targetDate]);
  return (
    <div style={{display:"flex",gap:16,justifyContent:"center"}}>
      {[{v:t.d,l:"நாள்"},{v:t.h,l:"மணி"},{v:t.m,l:"நிமிடம்"},{v:t.s,l:"வினாடி"}].map(({v,l})=>(
        <div key={l} style={{textAlign:"center"}}>
          <div style={{width:64,height:64,background:"rgba(255,255,255,0.1)",border:"1px solid rgba(212,175,55,0.5)",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Rozha One',serif",fontSize:26,color:"#D4AF37",marginBottom:6}}>
            {String(v).padStart(2,"0")}
          </div>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontFamily:"sans-serif"}}>{l}</span>
        </div>
      ))}
    </div>
  );
}

function Reveal({children,delay=0}:{children:React.ReactNode;delay?:number}) {
  const ref=useRef(null); const inView=useInView(ref,{once:true,margin:"-50px"});
  return <motion.div ref={ref} initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.9,delay,ease:[0.22,1,0.36,1]}}>{children}</motion.div>;
}

// Kolam-inspired border pattern
const KolamBorder = () => (
  <svg width="100%" height="40" viewBox="0 0 400 40" preserveAspectRatio="xMidYMid meet" style={{opacity:0.35}}>
    {Array.from({length:20}).map((_,i)=>(
      <g key={i} transform={`translate(${i*20},0)`}>
        <circle cx="10" cy="10" r="3" fill="none" stroke="#D4AF37" strokeWidth="0.8"/>
        <circle cx="10" cy="10" r="6" fill="none" stroke="#D4AF37" strokeWidth="0.5"/>
        <line x1="4" y1="10" x2="16" y2="10" stroke="#D4AF37" strokeWidth="0.5"/>
        <line x1="10" y1="4" x2="10" y2="16" stroke="#D4AF37" strokeWidth="0.5"/>
        <circle cx="10" cy="30" r="4" fill="none" stroke="#CC0000" strokeWidth="0.5"/>
        <path d="M6 30 L10 26 L14 30 L10 34 Z" fill="none" stroke="#CC0000" strokeWidth="0.5"/>
      </g>
    ))}
  </svg>
);

// Temple gopuram silhouette
const GopuramSilhouette = ({opacity=0.1}:{opacity?:number}) => (
  <svg width="200" height="160" viewBox="0 0 200 160" fill="none" style={{opacity}}>
    <rect x="80" y="140" width="40" height="20" fill="#D4AF37"/>
    <rect x="70" y="120" width="60" height="25" fill="#D4AF37"/>
    <rect x="60" y="105" width="80" height="20" fill="#D4AF37"/>
    <rect x="50" y="90" width="100" height="18" fill="#D4AF37"/>
    <rect x="40" y="77" width="120" height="16" fill="#D4AF37"/>
    <rect x="30" y="65" width="140" height="15" fill="#D4AF37"/>
    <rect x="20" y="54" width="160" height="14" fill="#D4AF37"/>
    <rect x="10" y="44" width="180" height="13" fill="#D4AF37"/>
    <path d="M90 44 L100 10 L110 44 Z" fill="#D4AF37"/>
    {[30,50,70,90,110,130,150].map((x,i)=>(
      <rect key={i} x={x} y={45+i%2*5} width="8" height="10" fill="rgba(0,0,0,0.2)" rx="1"/>
    ))}
  </svg>
);

export default function IndianClassic({couple}:IndianClassicProps) {
  const allEvents = couple.events?.length>0 ? couple.events : [{name:"Thirumanam",date:couple.weddingDate,time:couple.weddingTime,venue:couple.venue}];
  const slug = `${couple.groomName.toLowerCase().replace(/\s+/g,"-")}-weds-${couple.brideName.toLowerCase().replace(/\s+/g,"-")}`;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Rozha+One&family=Hind:wght@300;400;500&display=swap" rel="stylesheet"/>
      <div style={{minHeight:"100vh",background:"linear-gradient(170deg,#8B0000 0%,#A50000 30%,#8B0000 60%,#6B0000 100%)",fontFamily:"'Hind',sans-serif",overflowX:"hidden"}} onContextMenu={e=>e.preventDefault()}>

        {/* Kolam top border */}
        <KolamBorder/>

        {/* ── SECTION 1 — Hero ── */}
        <section style={{position:"relative",minHeight:"90vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 24px 80px",textAlign:"center",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,rgba(212,175,55,0.08) 0%,transparent 70%)",pointerEvents:"none"}}/>

          {/* Gopuram top */}
          <div style={{position:"absolute",top:-20,left:"50%",transform:"translateX(-50%)"}}>
            <GopuramSilhouette opacity={0.15}/>
          </div>

          <Reveal>
            <p style={{fontFamily:"'Rozha One',serif",fontSize:14,letterSpacing:"0.15em",color:"rgba(212,175,55,0.6)",marginBottom:16}}>ஸ்ரீ கணேசாய நமஃ</p>
          </Reveal>

          <Reveal delay={0.05}>
            <div style={{fontSize:28,marginBottom:16}}>🪷</div>
          </Reveal>

          <Reveal delay={0.1}>
            <p style={{fontFamily:"'Hind',sans-serif",fontWeight:300,fontSize:10,letterSpacing:"0.5em",color:"rgba(212,175,55,0.5)",textTransform:"uppercase" as const,marginBottom:20}}>
              இறைவனின் அருளால்
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <h1 style={{fontFamily:"'Rozha One',serif",fontSize:"clamp(2.5rem,8vw,4.5rem)",color:"#F5E6C8",letterSpacing:"0.06em",lineHeight:1.15,marginBottom:4}}>
              {couple.groomName}
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{display:"flex",alignItems:"center",gap:16,margin:"10px 0"}}>
              <div style={{height:"1px",width:48,background:"rgba(212,175,55,0.5)"}}/>
              <span style={{fontSize:20}}>🌸</span>
              <div style={{height:"1px",width:48,background:"rgba(212,175,55,0.5)"}}/>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <h1 style={{fontFamily:"'Rozha One',serif",fontSize:"clamp(2.5rem,8vw,4.5rem)",color:"#D4AF37",letterSpacing:"0.06em",lineHeight:1.15,marginBottom:28}}>
              {couple.brideName}
            </h1>
          </Reveal>

          <Reveal delay={0.35}>
            <div style={{display:"inline-flex",alignItems:"center",gap:10,padding:"12px 28px",background:"rgba(212,175,55,0.1)",border:"1px solid rgba(212,175,55,0.4)",borderRadius:4}}>
              <Calendar size={13} color="#D4AF37"/>
              <span style={{fontFamily:"'Rozha One',serif",fontSize:15,color:"#F5E6C8"}}>{formatWeddingDate(couple.weddingDate)}</span>
              <span style={{color:"rgba(212,175,55,0.35)"}}>·</span>
              <span style={{fontSize:13,color:"rgba(212,175,55,0.7)"}}>{couple.weddingTime}</span>
            </div>
          </Reveal>

          <Reveal delay={0.45}>
            <p style={{fontSize:12,color:"rgba(212,175,55,0.4)",marginTop:10}}>{couple.venue}</p>
          </Reveal>

          <motion.div animate={{y:[0,8,0]}} transition={{duration:2.2,repeat:Infinity}} style={{position:"absolute",bottom:24,color:"rgba(212,175,55,0.4)",fontSize:20}}>↓</motion.div>
        </section>

        <KolamBorder/>

        {/* ── SECTION 2 — Message ── */}
        <section style={{padding:"40px 24px",maxWidth:520,margin:"0 auto",textAlign:"center"}}>
          <Reveal>
            <p style={{fontFamily:"'Hind',sans-serif",fontWeight:300,fontSize:13,color:"rgba(212,175,55,0.55)",fontStyle:"italic",marginBottom:12}}>Telugu / Tamil / Kannada · Wedding Blessings</p>
            <p style={{fontFamily:"'Rozha One',serif",fontSize:19,color:"rgba(245,230,200,0.75)",lineHeight:1.9}}>
              {couple.personalMessage?`"${couple.personalMessage}"`:`"திருமணம் ஒருமுறை தான் நடக்கும் — அதன் இனிய நினைவுகள் என்றும் நிலைக்கும்."`}
            </p>
          </Reveal>
        </section>

        <KolamBorder/>

        {/* ── SECTION 3 — Events ── */}
        <section style={{padding:"20px 24px 60px",maxWidth:560,margin:"0 auto"}}>
          <Reveal><p style={{fontFamily:"'Rozha One',serif",fontSize:11,letterSpacing:"0.3em",color:"rgba(212,175,55,0.55)",textTransform:"uppercase" as const,textAlign:"center",marginBottom:28}}>Ceremonies</p></Reveal>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {allEvents.map((event,i)=>(
              <Reveal key={i} delay={i*0.1}>
                <div style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(212,175,55,0.2)",borderRadius:4,padding:"22px 24px",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:0,left:0,width:4,height:"100%",background:"linear-gradient(to bottom,#D4AF37,rgba(212,175,55,0.2))"}}/>
                  <div style={{paddingLeft:12}}>
                    <h3 style={{fontFamily:"'Rozha One',serif",fontSize:20,color:"#F5E6C8",marginBottom:10}}>{event.name}</h3>
                    <div style={{display:"flex",flexDirection:"column",gap:5}}>
                      <span style={{display:"flex",alignItems:"center",gap:7,fontSize:13,color:"rgba(245,230,200,0.7)"}}><Calendar size={12} color="#D4AF37"/>{formatWeddingDate(event.date)}</span>
                      <span style={{display:"flex",alignItems:"center",gap:7,fontSize:13,color:"rgba(245,230,200,0.7)"}}><Clock size={12} color="#D4AF37"/>{event.time}</span>
                      {event.venue&&<span style={{display:"flex",alignItems:"center",gap:7,fontSize:12,color:"rgba(212,175,55,0.45)"}}><MapPin size={12} color="#D4AF37"/>{event.venue}</span>}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── SECTION 4 — Venue ── */}
        <section style={{padding:"20px 24px 60px",maxWidth:520,margin:"0 auto",textAlign:"center"}}>
          <Reveal>
            <GopuramSilhouette opacity={0.12}/>
            <div style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(212,175,55,0.2)",borderRadius:4,padding:"28px 24px",marginTop:-40,position:"relative",zIndex:1}}>
              <MapPin size={18} color="#D4AF37" style={{margin:"0 auto 12px",display:"block"}}/>
              <h3 style={{fontFamily:"'Rozha One',serif",fontSize:20,color:"#F5E6C8",marginBottom:6}}>{couple.venue}</h3>
              {couple.venueAddress&&<p style={{fontSize:13,color:"rgba(212,175,55,0.45)",lineHeight:1.8,marginBottom:16}}>{couple.venueAddress}</p>}
              {couple.mapLink&&<a href={couple.mapLink} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 24px",border:"1px solid rgba(212,175,55,0.4)",borderRadius:2,color:"#D4AF37",fontSize:11,fontFamily:"'Hind',sans-serif",fontWeight:500,letterSpacing:"0.15em",textDecoration:"none",textTransform:"uppercase" as const}}><MapPin size={11}/> View on Maps</a>}
            </div>
          </Reveal>
        </section>

        {/* ── SECTION 5 — Countdown ── */}
        <section style={{padding:"20px 24px 60px",textAlign:"center"}}>
          <Reveal>
            <p style={{fontFamily:"'Rozha One',serif",fontSize:16,color:"rgba(245,230,200,0.45)",marginBottom:28}}>திருமண நாளை நோக்கி</p>
            <Countdown targetDate={couple.weddingDate}/>
          </Reveal>
        </section>

        <KolamBorder/>

        {/* ── SECTION 6 — RSVP ── */}
        <section style={{padding:"20px 24px 80px",maxWidth:520,margin:"0 auto",textAlign:"center"}}>
          <Reveal>
            <div style={{fontSize:24,marginBottom:16}}>🪷</div>
            <h2 style={{fontFamily:"'Rozha One',serif",fontSize:24,color:"#F5E6C8",marginBottom:8}}>உங்கள் வருகையை எதிர்நோக்குகிறோம்</h2>
            <p style={{fontFamily:"'Hind',sans-serif",fontWeight:300,fontSize:14,color:"rgba(212,175,55,0.5)",lineHeight:1.8,marginBottom:28}}>Your blessings are our greatest gift</p>
            <div style={{textAlign:"left",marginBottom:16}}>
              <RSVPForm inviteSlug={slug} coupleName={`${couple.groomName} & ${couple.brideName}`} accentColor="#D4AF37" theme="dark"/>
            </div>
            {couple.phone&&<button onClick={()=>{const p=couple.phone?.replace(/\D/g,"");window.open(`https://wa.me/${p}?text=${encodeURIComponent(`வணக்கம்! நான் ${couple.groomName} & ${couple.brideName} உங்கள் திருமணத்தில் கலந்து கொள்கிறேன்! 🪷`)}`,"_blank");}} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 22px",background:"transparent",border:"1px solid rgba(212,175,55,0.3)",borderRadius:2,color:"rgba(212,175,55,0.65)",fontFamily:"'Hind',sans-serif",fontSize:11,cursor:"pointer",letterSpacing:"0.1em"}}><Phone size={11}/> WhatsApp us</button>}
            <KolamBorder/>
            <p style={{fontFamily:"'Rozha One',serif",fontSize:16,color:"rgba(212,175,55,0.35)",marginTop:8}}>{couple.groomName} & {couple.brideName}</p>
            <p style={{fontSize:10,color:"rgba(212,175,55,0.15)",letterSpacing:"0.2em",textTransform:"uppercase" as const,marginTop:6}}>Made with WedCraft</p>
          </Reveal>
        </section>
      </div>
    </>
  );
}