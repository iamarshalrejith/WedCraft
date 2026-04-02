"use client";

import { useEffect, useState, useRef } from "react";
import { CoupleDetails } from "@/types/invite";
import { formatWeddingDate } from "@/lib/invite-utils";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Calendar } from "lucide-react";
import RSVPForm from "@/components/rsvp/RSVPForm";
import MusicPlayer from "@/components/MusicPlayer";
import Image from "next/image";


interface UrbanChicProps { couple: CoupleDetails; }

function Countdown({ targetDate }: { targetDate: string }) {
  const [t, setT] = useState({ d:0, h:0, m:0, s:0 });
  useEffect(() => {
    const tick = () => { const diff=new Date(targetDate).getTime()-Date.now(); if(diff<=0)return; setT({d:Math.floor(diff/86400000),h:Math.floor((diff%86400000)/3600000),m:Math.floor((diff%3600000)/60000),s:Math.floor((diff%60000)/1000)}); };
    tick(); const id=setInterval(tick,1000); return ()=>clearInterval(id);
  },[targetDate]);
  return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",border:"1px solid #1A1A1A"}}>
      {[{v:t.d,l:"Days"},{v:t.h,l:"Hours"},{v:t.m,l:"Min"},{v:t.s,l:"Sec"}].map(({v,l},i)=>(
        <div key={l} style={{padding:"24px 0",textAlign:"center",borderRight:i<3?"1px solid #1A1A1A":"none"}}>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:42,fontWeight:700,color:"#1A1A1A",lineHeight:1}}>{String(v).padStart(2,"0")}</div>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:9,fontWeight:500,letterSpacing:"0.3em",color:"#999",textTransform:"uppercase" as const,marginTop:6}}>{l}</div>
        </div>
      ))}
    </div>
  );
}

function Reveal({children,delay=0,direction="up"}:{children:React.ReactNode;delay?:number;direction?:"up"|"left"}) {
  const ref=useRef(null); const inView=useInView(ref,{once:true,margin:"-40px"});
  const initial = direction==="left" ? {opacity:0,x:-30} : {opacity:0,y:20};
  return <motion.div ref={ref} initial={initial} animate={inView?{opacity:1,x:0,y:0}:{}} transition={{duration:0.7,delay,ease:[0.16,1,0.3,1]}}>{children}</motion.div>;
}

export default function UrbanChic({couple}:UrbanChicProps) {
  const allEvents = couple.events?.length>0 ? couple.events : [{name:"Wedding Ceremony",date:couple.weddingDate,time:couple.weddingTime,venue:couple.venue}];
  const slug =
  couple.slug ??
  `${couple.groomName.toLowerCase().replace(/\s+/g,"-")}-weds-${couple.brideName.toLowerCase().replace(/\s+/g,"-")}`;
  const year = new Date(couple.weddingDate).getFullYear();

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=Space+Mono:ital@0;1&display=swap" rel="stylesheet"/>
      <div style={{minHeight:"100vh",background:"#FAFAFA",fontFamily:"'Space Grotesk',sans-serif",overflowX:"hidden"}} onContextMenu={e=>e.preventDefault()}>

        {/* Top ticker bar */}
        <div style={{background:"#1A1A1A",color:"#FAFAFA",fontSize:10,letterSpacing:"0.25em",padding:"8px 0",overflow:"hidden",whiteSpace:"nowrap"}}>
          <motion.div animate={{x:[0,-800]}} transition={{duration:20,repeat:Infinity,ease:"linear"}} style={{display:"inline-flex",gap:48}}>
            {Array.from({length:8}).map((_,i)=>(
              <span key={i}>{couple.groomName.toUpperCase()} × {couple.brideName.toUpperCase()} &nbsp;·&nbsp; {formatWeddingDate(couple.weddingDate).toUpperCase()} &nbsp;·&nbsp; {couple.venue.toUpperCase()} &nbsp;★&nbsp;</span>
            ))}
          </motion.div>
        </div>

        {/* ── SECTION 1 — Editorial Hero ── */}
        <section style={{position:"relative",minHeight:"95vh",display:"grid",gridTemplateColumns:"1fr 1fr",overflow:"hidden"}}>
          {/* Left — black panel */}
          <div style={{background:"#1A1A1A",display:"flex",flexDirection:"column",justifyContent:"center",padding:"60px 48px",position:"relative"}}>
            <Reveal direction="left">
              <p style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:"0.4em",color:"rgba(255,255,255,0.35)",textTransform:"uppercase" as const,marginBottom:32}}>Vol.01 · {year}</p>
            </Reveal>
            <Reveal delay={0.1} direction="left">
              <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:"clamp(2.5rem,5vw,4.5rem)",color:"#FAFAFA",lineHeight:0.95,letterSpacing:"-0.02em",marginBottom:0}}>
                {couple.groomName.toUpperCase()}
              </h1>
            </Reveal>
            <Reveal delay={0.15} direction="left">
              <div style={{height:3,background:"#FAFAFA",margin:"16px 0",width:48}}/>
            </Reveal>
            <Reveal delay={0.2} direction="left">
              <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,fontSize:"clamp(2.5rem,5vw,4.5rem)",color:"#FAFAFA",lineHeight:0.95,letterSpacing:"-0.02em",fontStyle:"italic"}}>
                {couple.brideName.toUpperCase()}
              </h1>
            </Reveal>
            <Reveal delay={0.3} direction="left">
              <p style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:"0.2em",color:"rgba(255,255,255,0.4)",marginTop:32}}>
                {formatWeddingDate(couple.weddingDate)} · {couple.weddingTime}
              </p>
            </Reveal>
          </div>

          {/* Right — white panel with big number */}
          <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"60px 32px",borderLeft:"1px solid #1A1A1A",position:"relative"}}>
            {/* Big decorative year */}
            <div style={{position:"absolute",fontSize:160,fontWeight:700,color:"rgba(0,0,0,0.04)",lineHeight:1,bottom:-20,right:0,fontFamily:"'Space Grotesk',sans-serif",userSelect:"none"}}>
              {year}
            </div>
            <Reveal delay={0.2}>
              <div style={{zIndex:1,textAlign:"center"}}>
                <p style={{fontFamily:"'Space Mono',monospace",fontStyle:"italic",fontSize:13,color:"#555",lineHeight:1.8,maxWidth:260}}>
                  {couple.personalMessage
                    ?`"${couple.personalMessage}"`
                    :`"Not a fairy tale. Not a movie. The real thing — and it's better than all of it."`}
                </p>
              </div>
            </Reveal>
            {couple.couplePhotoUrl && (
  <Reveal delay={0.25}>
    <div style={{ marginTop: 28 }}>
      <Image
        src={couple.couplePhotoUrl}
        alt="Couple"
        width={220}
        height={260}
        style={{
          objectFit: "cover",
          border: "1px solid #1A1A1A",
        }}
      />
    </div>
  </Reveal>
)}
            <Reveal delay={0.3}>
              <div style={{marginTop:32,display:"flex",alignItems:"center",gap:12,zIndex:1}}>
                <div style={{height:1,width:32,background:"#1A1A1A"}}/>
                <p style={{fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:"0.3em",color:"#999",textTransform:"uppercase" as const}}>{couple.venue}</p>
              </div>
            </Reveal>
          </div>

          <motion.div animate={{y:[0,6,0]}} transition={{duration:2.5,repeat:Infinity}} style={{position:"absolute",bottom:20,left:"50%",transform:"translateX(-50%)",color:"#1A1A1A",opacity:0.3,fontSize:16}}>↓</motion.div>
        </section>

        {/* ── SECTION 2 — Events ── */}
        <section style={{padding:"60px 40px",maxWidth:800,margin:"0 auto"}}>
          <Reveal>
            <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:40}}>
              <p style={{fontFamily:"'Space Mono',monospace",fontSize:9,fontWeight:500,letterSpacing:"0.4em",color:"#999",textTransform:"uppercase" as const,whiteSpace:"nowrap"}}>Programme</p>
              <div style={{flex:1,height:1,background:"#1A1A1A"}}/>
            </div>
          </Reveal>
          <div style={{display:"flex",flexDirection:"column",gap:0}}>
            {allEvents.map((event,i)=>(
              <Reveal key={i} delay={i*0.1}>
                <div style={{display:"grid",gridTemplateColumns:"80px 1fr auto",gap:24,padding:"24px 0",borderBottom:"1px solid #E5E5E5",alignItems:"center"}}>
                  <span style={{fontFamily:"'Space Mono',monospace",fontStyle:"italic",fontSize:28,fontWeight:700,color:"rgba(0,0,0,0.08)",lineHeight:1}}>{String(i+1).padStart(2,"0")}</span>
                  <div>
                    <h3 style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:500,fontSize:18,color:"#1A1A1A",marginBottom:4}}>{event.name}</h3>
                    {event.venue&&<p style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"#999",letterSpacing:"0.1em"}}>{event.venue}</p>}
                  </div>
                  <div style={{textAlign:"right"}}>
                    <p style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"#555"}}>{formatWeddingDate(event.date)}</p>
                    <p style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"#999"}}>{event.time}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── SECTION 3 — Venue ── */}
        <section style={{background:"#1A1A1A",padding:"60px 40px",textAlign:"center"}}>
          <Reveal>
            <p style={{fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:"0.4em",color:"rgba(255,255,255,0.35)",textTransform:"uppercase" as const,marginBottom:24}}>Location</p>
            <h3 style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:32,color:"#FAFAFA",marginBottom:8,letterSpacing:"-0.02em"}}>{couple.venue}</h3>
            {couple.venueAddress&&<p style={{fontFamily:"'Space Mono',monospace",fontSize:12,color:"rgba(255,255,255,0.4)",lineHeight:1.8,marginBottom:24}}>{couple.venueAddress}</p>}
            {couple.mapLink&&<a href={couple.mapLink} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"12px 28px",border:"1px solid rgba(255,255,255,0.3)",color:"#FAFAFA",fontSize:11,fontFamily:"'Space Mono',monospace",letterSpacing:"0.15em",textDecoration:"none",textTransform:"uppercase" as const}}><MapPin size={11}/> Get Directions</a>}
          </Reveal>
        </section>

        {/* ── SECTION 4 — Countdown ── */}
        <section style={{padding:"60px 40px",maxWidth:700,margin:"0 auto"}}>
          <Reveal>
            <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:32}}>
              <p style={{fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:"0.4em",color:"#999",textTransform:"uppercase" as const,whiteSpace:"nowrap"}}>Count down</p>
              <div style={{flex:1,height:1,background:"#1A1A1A"}}/>
            </div>
            <Countdown targetDate={couple.weddingDate}/>
          </Reveal>
        </section>

        {/* ── SECTION 5 — RSVP ── */}
        <section style={{background:"#F0F0F0",padding:"60px 40px",maxWidth:"100%"}}>
          <div style={{maxWidth:600,margin:"0 auto"}}>
            <Reveal>
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:32}}>
                <p style={{fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:"0.4em",color:"#999",textTransform:"uppercase" as const,whiteSpace:"nowrap"}}>RSVP</p>
                <div style={{flex:1,height:1,background:"#1A1A1A"}}/>
              </div>
              <p style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,fontSize:18,color:"#555",marginBottom:28}}>Are you coming? Let us know.</p>
              <RSVPForm inviteSlug={slug} coupleName={`${couple.groomName} & ${couple.brideName}`} accentColor="#1A1A1A" theme="light"/>
              {couple.phone&&(
                <div style={{marginTop:16}}>
                  <button onClick={()=>{const p=couple.phone?.replace(/\D/g,"");window.open(`https://wa.me/${p}?text=${encodeURIComponent(`Hi! I'd love to join ${couple.groomName} & ${couple.brideName}'s wedding.`)}`,"_blank");}} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 20px",background:"transparent",border:"1px solid #CCC",color:"#555",fontFamily:"'Space Mono',monospace",fontSize:10,cursor:"pointer",letterSpacing:"0.1em",textTransform:"uppercase" as const}}>
                    <Phone size={11}/> Also WhatsApp us
                  </button>
                </div>
              )}
            </Reveal>
          </div>
        </section>

        {/* Footer */}
        <div style={{background:"#1A1A1A",padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"rgba(255,255,255,0.25)",letterSpacing:"0.2em"}}>{couple.groomName.toUpperCase()} × {couple.brideName.toUpperCase()}</span>
          <span style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"rgba(255,255,255,0.2)",letterSpacing:"0.2em"}}>MADE WITH WEDCRAFT</span>
        </div>
      </div>
      {couple.bgMusicUrl && (
  <MusicPlayer
    src={couple.bgMusicUrl}
    accentColor="#1A1A1A"
  />
)}
    </>
  );
}