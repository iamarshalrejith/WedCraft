"use client";

import { useEffect, useState, useRef } from "react";
import { CoupleDetails } from "@/types/invite";
import { formatWeddingDate } from "@/lib/invite-utils";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Calendar, Clock } from "lucide-react";
import RSVPForm from "@/components/rsvp/RSVPForm";
import MusicPlayer from "@/components/MusicPlayer";
import Image from "next/image";

interface SilverScreenProps { couple: CoupleDetails; }

function Countdown({ targetDate }: { targetDate: string }) {
  const [t, setT] = useState({ d:0,h:0,m:0,s:0 });
  useEffect(()=>{
    const tick=()=>{const diff=new Date(targetDate).getTime()-Date.now();if(diff<=0)return;setT({d:Math.floor(diff/86400000),h:Math.floor((diff%86400000)/3600000),m:Math.floor((diff%3600000)/60000),s:Math.floor((diff%60000)/1000)});};
    tick();const id=setInterval(tick,1000);return()=>clearInterval(id);
  },[targetDate]);
  return (
    <div style={{display:"flex",gap:0,border:"1px solid rgba(212,175,55,0.4)"}}>
      {[{v:t.d,l:"DAYS"},{v:t.h,l:"HRS"},{v:t.m,l:"MIN"},{v:t.s,l:"SEC"}].map(({v,l},i)=>(
        <div key={l} style={{flex:1,textAlign:"center",padding:"16px 0",borderRight:i<3?"1px solid rgba(212,175,55,0.25)":"none"}}>
          <div style={{fontFamily:"'Abril Fatface',serif",fontSize:32,color:"#D4AF37",lineHeight:1}}>{String(v).padStart(2,"0")}</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:9,color:"rgba(212,175,55,0.5)",letterSpacing:"0.25em",marginTop:4}}>{l}</div>
        </div>
      ))}
    </div>
  );
}

function Reveal({children,delay=0}:{children:React.ReactNode;delay?:number}) {
  const ref=useRef(null);const inView=useInView(ref,{once:true,margin:"-50px"});
  return <motion.div ref={ref} initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.9,delay,ease:[0.22,1,0.36,1]}}>{children}</motion.div>;
}

// Film strip decoration
const FilmStrip = ({vertical=false}:{vertical?:boolean}) => (
  <div style={{
    display:"flex", flexDirection:vertical?"column":"row",
    gap:0, background:"rgba(0,0,0,0.8)",
    padding:vertical?"6px 4px":"4px 6px",
  }}>
    {Array.from({length:vertical?12:8}).map((_,i)=>(
      <div key={i} style={{
        width:vertical?12:16, height:vertical?16:12,
        background:"rgba(212,175,55,0.15)",
        border:"0.5px solid rgba(212,175,55,0.2)",
        margin:vertical?"2px 0":"0 2px",
        flexShrink:0,
      }}/>
    ))}
  </div>
);

// Vintage star divider
const StarDivider = () => (
  <div style={{display:"flex",alignItems:"center",gap:10,margin:"28px 0"}}>
    <div style={{flex:1,height:"0.5px",background:"linear-gradient(to right,transparent,rgba(212,175,55,0.5))"}}/>
    <div style={{display:"flex",gap:6}}>
      {["★","✦","★"].map((s,i)=><span key={i} style={{color:"#D4AF37",fontSize:i===1?10:7,opacity:0.7}}>{s}</span>)}
    </div>
    <div style={{flex:1,height:"0.5px",background:"linear-gradient(to left,transparent,rgba(212,175,55,0.5))"}}/>
  </div>
);

export default function SilverScreen({couple}:SilverScreenProps) {
  const slug =
  couple.slug ??
  `${couple.groomName.toLowerCase().replace(/\s+/g,"-")}-weds-${couple.brideName.toLowerCase().replace(/\s+/g,"-")}`;
  const allEvents=couple.events?.length>0?couple.events:[{name:"The Grand Ceremony",date:couple.weddingDate,time:couple.weddingTime,venue:couple.venue}];
  const year=new Date(couple.weddingDate).getFullYear();

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Bebas+Neue&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400&display=swap" rel="stylesheet"/>
      <style>{`@keyframes flicker{0%,100%{opacity:1}92%{opacity:1}93%{opacity:0.85}94%{opacity:1}97%{opacity:0.9}98%{opacity:1}}`}</style>
      <div style={{minHeight:"100vh",background:"#0D0A04",fontFamily:"'Lato',sans-serif",overflowX:"hidden"}} onContextMenu={e=>e.preventDefault()}>

        {/* Top film strip */}
        <FilmStrip/>

        {/* ── Hero — Bollywood poster style ── */}
        <section style={{position:"relative",background:"linear-gradient(170deg,#1A1205 0%,#2A1E08 40%,#1A1205 100%)",padding:"60px 24px 80px",textAlign:"center",overflow:"hidden",minHeight:"90vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>

          {/* Vertical film strips sides */}
          <div style={{position:"absolute",top:0,left:0,bottom:0}}><FilmStrip vertical/></div>
          <div style={{position:"absolute",top:0,right:0,bottom:0}}><FilmStrip vertical/></div>

          {/* Sepia vignette */}
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,0.6) 100%)",pointerEvents:"none"}}/>

          <Reveal>
            <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,letterSpacing:"0.8em",color:"rgba(212,175,55,0.5)",marginBottom:20}}>A LIFETIME PRODUCTION PRESENTS</p>
          </Reveal>

          {/* Big decorative circle */}
          <Reveal delay={0.05}>
            <div style={{position:"relative",marginBottom:24}}>
              <svg width="120" height="120" viewBox="0 0 120 120" style={{opacity:0.25}}>
                <circle cx="60" cy="60" r="55" stroke="#D4AF37" strokeWidth="1" fill="none"/>
                <circle cx="60" cy="60" r="48" stroke="#D4AF37" strokeWidth="0.5" fill="none" strokeDasharray="4 4"/>
                <circle cx="60" cy="60" r="40" stroke="#D4AF37" strokeWidth="1" fill="none"/>
                {[0,60,120,180,240,300].map((a,i)=>{const r=a*Math.PI/180;return <circle key={i} cx={Number((60 + 50 * Math.cos(r)).toFixed(4))} 
  cy={Number((60 + 50 * Math.sin(r)).toFixed(4))} r={3} fill="#D4AF37"/>;})}
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:36,animation:"flicker 4s infinite"}}>🎬</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 style={{fontFamily:"'Abril Fatface',serif",fontSize:"clamp(3rem,11vw,6.5rem)",color:"#D4AF37",lineHeight:0.95,letterSpacing:"0.02em",textShadow:"0 0 40px rgba(212,175,55,0.3), 2px 2px 0 rgba(0,0,0,0.5)"}}>
              {couple.groomName.toUpperCase()}
            </h1>
          </Reveal>

          <Reveal delay={0.15}>
            <div style={{display:"flex",alignItems:"center",gap:16,margin:"10px 0"}}>
              <div style={{height:"0.5px",width:48,background:"rgba(212,175,55,0.5)"}}/>
              <span style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:16,color:"rgba(212,175,55,0.6)"}}>and</span>
              <div style={{height:"0.5px",width:48,background:"rgba(212,175,55,0.5)"}}/>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <h1 style={{fontFamily:"'Abril Fatface',serif",fontSize:"clamp(3rem,11vw,6.5rem)",color:"#F5E6C8",lineHeight:0.95,letterSpacing:"0.02em",textShadow:"2px 2px 0 rgba(0,0,0,0.5)",marginBottom:28}}>
              {couple.brideName.toUpperCase()}
            </h1>
          </Reveal>

          {couple.couplePhotoUrl && (
  <Reveal delay={0.25}>
    <div style={{
      marginTop: 24,
      padding: "6px",
      background: "linear-gradient(135deg,#D4AF37,#8B7340,#D4AF37)",
      display: "inline-block"
    }}>
      <div style={{
        background: "#0D0A04",
        padding: "6px"
      }}>
        <Image
  src={couple.couplePhotoUrl}
  alt="Couple"
  width={180}
  height={220}
  style={{
    objectFit: "cover",
    filter: "sepia(40%) contrast(1.1)",
  }}
/>
      </div>
    </div>
  </Reveal>
)}

          <Reveal delay={0.3}>
            <div style={{display:"inline-block",padding:"3px",background:"linear-gradient(135deg,#D4AF37,#8B7340,#D4AF37)",marginBottom:6}}>
              <div style={{background:"#0D0A04",padding:"11px 28px",display:"flex",alignItems:"center",gap:10}}>
                <Calendar size={13} color="#D4AF37"/>
                <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,color:"#D4AF37",letterSpacing:"0.1em"}}>{formatWeddingDate(couple.weddingDate).toUpperCase()}</span>
                <span style={{color:"rgba(212,175,55,0.3)"}}>|</span>
                <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:14,color:"rgba(212,175,55,0.65)",letterSpacing:"0.08em"}}>{couple.weddingTime}</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,color:"rgba(212,175,55,0.35)",letterSpacing:"0.3em",marginTop:8}}>{couple.venue.toUpperCase()}</p>
          </Reveal>

          <Reveal delay={0.5}>
            <p style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:13,color:"rgba(212,175,55,0.25)",marginTop:24,letterSpacing:"0.1em"}}>A {year} Production</p>
          </Reveal>

          <motion.div animate={{y:[0,8,0]}} transition={{duration:2.5,repeat:Infinity}} style={{position:"absolute",bottom:20,color:"rgba(212,175,55,0.35)",fontSize:18}}>↓</motion.div>
        </section>

        <FilmStrip/>

        {/* ── Message ── */}
        <section style={{padding:"40px 24px",maxWidth:520,margin:"0 auto",textAlign:"center",background:"#110D03"}}>
          <Reveal>
            <StarDivider/>
            <p style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:19,color:"rgba(245,230,200,0.7)",lineHeight:1.9}}>
              {couple.personalMessage?`"${couple.personalMessage}"`:`"In the greatest love story ever told — yours — the best scene is yet to come. We invite you to be part of it."`}
            </p>
            <StarDivider/>
          </Reveal>
        </section>

        {/* ── Events ── */}
        <section style={{padding:"20px 24px 60px",maxWidth:560,margin:"0 auto",background:"#110D03"}}>
          <Reveal><p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,letterSpacing:"0.5em",color:"rgba(212,175,55,0.45)",textAlign:"center",marginBottom:28}}>THE PROGRAMME</p></Reveal>
          <div style={{display:"flex",flexDirection:"column",gap:2}}>
            {allEvents.map((event,i)=>(
              <Reveal key={i} delay={i*0.1}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 0.5px 1fr",padding:"20px 0",borderBottom:"0.5px solid rgba(212,175,55,0.12)"}}>
                  <div style={{textAlign:"right",paddingRight:20}}>
                    <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,letterSpacing:"0.15em",color:"rgba(212,175,55,0.5)",marginBottom:2}}>{formatWeddingDate(event.date).toUpperCase()}</p>
                    <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,color:"rgba(212,175,55,0.35)",letterSpacing:"0.1em"}}>{event.time}</p>
                  </div>
                  <div style={{width:"0.5px",background:"rgba(212,175,55,0.2)",margin:"0 auto"}}/>
                  <div style={{paddingLeft:20}}>
                    <p style={{fontFamily:"'Abril Fatface',serif",fontSize:16,color:"#F5E6C8",marginBottom:2}}>{event.name}</p>
                    {event.venue&&<p style={{fontFamily:"'Lato',sans-serif",fontWeight:300,fontSize:11,color:"rgba(212,175,55,0.35)",letterSpacing:"0.05em"}}>{event.venue}</p>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Venue ── */}
        <section style={{padding:"20px 24px 60px",maxWidth:520,margin:"0 auto",textAlign:"center",background:"#110D03"}}>
          <Reveal>
            <div style={{border:"0.5px solid rgba(212,175,55,0.25)",padding:"28px 24px",position:"relative"}}>
              <div style={{position:"absolute",top:-1,left:20,right:20,height:2,background:"linear-gradient(to right,transparent,#D4AF37,transparent)"}}/>
              <MapPin size={18} color="#D4AF37" style={{margin:"0 auto 12px",display:"block",opacity:0.7}}/>
              <h3 style={{fontFamily:"'Abril Fatface',serif",fontSize:20,color:"#F5E6C8",marginBottom:6}}>{couple.venue}</h3>
              {couple.venueAddress&&<p style={{fontFamily:"'Lato',sans-serif",fontWeight:300,fontSize:13,color:"rgba(212,175,55,0.4)",lineHeight:1.8,marginBottom:18}}>{couple.venueAddress}</p>}
              {couple.mapLink&&<a href={couple.mapLink} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 24px",border:"0.5px solid rgba(212,175,55,0.4)",color:"#D4AF37",fontSize:11,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:"0.2em",textDecoration:"none"}}><MapPin size={11}/> DIRECTIONS</a>}
            </div>
          </Reveal>
        </section>

        {/* ── Countdown ── */}
        <section style={{padding:"20px 24px 60px",maxWidth:480,margin:"0 auto",background:"#110D03"}}>
          <Reveal>
            <p style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:18,color:"rgba(212,175,55,0.35)",textAlign:"center",marginBottom:24}}>Until the main feature begins</p>
            <Countdown targetDate={couple.weddingDate}/>
          </Reveal>
        </section>

        <FilmStrip/>

        {/* ── RSVP ── */}
        <section style={{padding:"40px 24px 80px",maxWidth:520,margin:"0 auto",background:"#0D0A04",textAlign:"center"}}>
          <Reveal>
            <StarDivider/>
            <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,letterSpacing:"0.5em",color:"rgba(212,175,55,0.45)",marginBottom:8}}>RESERVE YOUR SEAT</p>
            <h2 style={{fontFamily:"'Abril Fatface',serif",fontSize:26,color:"#F5E6C8",marginBottom:28}}>Are You Coming?</h2>
            <div style={{textAlign:"left",marginBottom:16}}>
              <RSVPForm inviteSlug={slug} coupleName={`${couple.groomName} & ${couple.brideName}`} accentColor="#D4AF37" theme="dark"/>
            </div>
            {couple.phone&&<button onClick={()=>{const p=couple.phone?.replace(/\D/g,"");window.open(`https://wa.me/${p}?text=${encodeURIComponent(`Hello! Looking forward to celebrating with ${couple.groomName} & ${couple.brideName}! 🎬`)}`,"_blank");}} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 22px",background:"transparent",border:"0.5px solid rgba(212,175,55,0.3)",color:"rgba(212,175,55,0.6)",fontFamily:"'Bebas Neue',sans-serif",fontSize:12,cursor:"pointer",letterSpacing:"0.2em"}}><Phone size={11}/> WHATSAPP</button>}
            <StarDivider/>
            <p style={{fontFamily:"'Abril Fatface',serif",fontSize:16,color:"rgba(212,175,55,0.3)"}}>{couple.groomName} & {couple.brideName}</p>
            <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:9,color:"rgba(212,175,55,0.15)",letterSpacing:"0.35em",marginTop:8}}>MADE WITH WEDCRAFT</p>
          </Reveal>
        </section>

        <FilmStrip/>
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