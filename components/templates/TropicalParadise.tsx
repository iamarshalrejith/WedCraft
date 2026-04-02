"use client";

import { useEffect, useState, useRef } from "react";
import { CoupleDetails } from "@/types/invite";
import { formatWeddingDate } from "@/lib/invite-utils";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Calendar, Clock } from "lucide-react";
import RSVPForm from "@/components/rsvp/RSVPForm";
import MusicPlayer from "@/components/MusicPlayer";
import Image from "next/image";

interface TropicalParadiseProps { couple: CoupleDetails; }

function Countdown({ targetDate }: { targetDate: string }) {
  const [t, setT] = useState({ d:0, h:0, m:0, s:0 });
  useEffect(() => {
    const tick = () => { const diff=new Date(targetDate).getTime()-Date.now(); if(diff<=0)return; setT({d:Math.floor(diff/86400000),h:Math.floor((diff%86400000)/3600000),m:Math.floor((diff%3600000)/60000),s:Math.floor((diff%60000)/1000)}); };
    tick(); const id=setInterval(tick,1000); return ()=>clearInterval(id);
  },[targetDate]);
  return (
    <div style={{display:"flex",gap:16,justifyContent:"center"}}>
      {[{v:t.d,l:"Days"},{v:t.h,l:"Hours"},{v:t.m,l:"Mins"},{v:t.s,l:"Secs"}].map(({v,l})=>(
        <div key={l} style={{textAlign:"center"}}>
          <div style={{width:64,height:64,background:"rgba(255,255,255,0.25)",border:"2px solid rgba(255,255,255,0.5)",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Pacifico',cursive",fontSize:22,color:"#fff",marginBottom:6,backdropFilter:"blur(4px)"}}>
            {String(v).padStart(2,"0")}
          </div>
          <span style={{fontSize:10,letterSpacing:"0.2em",color:"rgba(255,255,255,0.7)",textTransform:"uppercase" as const,fontFamily:"sans-serif"}}>{l}</span>
        </div>
      ))}
    </div>
  );
}

function Reveal({children,delay=0}:{children:React.ReactNode;delay?:number}) {
  const ref=useRef(null); const inView=useInView(ref,{once:true,margin:"-50px"});
  return <motion.div ref={ref} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.8,delay,ease:[0.22,1,0.36,1]}}>{children}</motion.div>;
}

// Palm leaf SVG
const PalmLeaf = ({x,y,size=120,rotate=0,flip=false,opacity=0.35}:{x:number|string;y:number|string;size?:number;rotate?:number;flip?:boolean;opacity?:number}) => (
  <svg width={size} height={size*1.2} viewBox="0 0 100 120" fill="none" style={{position:"absolute",left:x,top:y,transform:`rotate(${rotate}deg) scaleX(${flip?-1:1})`,opacity,pointerEvents:"none"}}>
    <path d="M50 110 C50 110 20 80 10 40 C5 15 30 5 50 20 C70 5 95 15 90 40 C80 80 50 110 50 110Z" fill="#2D7A2D"/>
    <path d="M50 110 L50 20" stroke="#1A5C1A" strokeWidth="1.5"/>
    <path d="M50 60 C35 50 20 45 10 40" stroke="#1A5C1A" strokeWidth="0.8" fill="none"/>
    <path d="M50 60 C65 50 80 45 90 40" stroke="#1A5C1A" strokeWidth="0.8" fill="none"/>
    <path d="M50 80 C38 72 28 65 22 58" stroke="#1A5C1A" strokeWidth="0.8" fill="none"/>
    <path d="M50 80 C62 72 72 65 78 58" stroke="#1A5C1A" strokeWidth="0.8" fill="none"/>
  </svg>
);

// Hibiscus flower
const Hibiscus = ({x,y,size=60,rotate=0,opacity=0.5}:{x:number|string;y:number|string;size?:number;rotate?:number;opacity?:number}) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{position:"absolute",left:x,top:y,transform:`rotate(${rotate}deg)`,opacity,pointerEvents:"none"}}>
    {[0,72,144,216,288].map((a,i)=>(
      <ellipse key={i} cx="30" cy="30" rx="7" ry="16" transform={`rotate(${a} 30 30)`} fill={i%2===0?"#FF4D6D":"#FF2D50"} opacity={0.85}/>
    ))}
    <circle cx="30" cy="30" r="7" fill="#FFD700"/>
    <circle cx="30" cy="30" r="4" fill="#FF8C00"/>
    <line x1="30" y1="14" x2="30" y2="8" stroke="#FF8C00" strokeWidth="1.5"/>
  </svg>
);

export default function TropicalParadise({couple}:TropicalParadiseProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(()=>setMounted(true),[]);
  const allEvents = couple.events?.length>0 ? couple.events : [{name:"Wedding Ceremony",date:couple.weddingDate,time:couple.weddingTime,venue:couple.venue}];
  const slug = couple.slug ?? `${couple.groomName.toLowerCase().replace(/\s+/g,"-")}-weds-${couple.brideName.toLowerCase().replace(/\s+/g,"-")}`;
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Nunito:ital,wght@0,300;0,400;0,600;1,300&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes sway{0%,100%{transform:rotate(-5deg) scaleX(1)}50%{transform:rotate(5deg) scaleX(1)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
      `}</style>
      <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#006994 0%,#0099B8 35%,#00B4A6 65%,#006994 100%)",fontFamily:"'Nunito',sans-serif",overflowX:"hidden"}} onContextMenu={e=>e.preventDefault()}>

        {/* Palm leaves */}
        <PalmLeaf x={-30} y={40} size={160} rotate={20} opacity={0.45}/>
        <PalmLeaf x="75%" y={20} size={140} rotate={-30} flip opacity={0.4}/>
        <PalmLeaf x="-20" y="55%" size={120} rotate={35} opacity={0.3}/>
        <PalmLeaf x="80%" y="52%" size={130} rotate={-40} flip opacity={0.35}/>

        {/* Hibiscus */}
        <Hibiscus x="5%" y="30%" size={50} rotate={-15} opacity={0.5}/>
        <Hibiscus x="85%" y="25%" size={45} rotate={20} opacity={0.45}/>
        <Hibiscus x="8%" y="65%" size={40} rotate={30} opacity={0.4}/>
        <Hibiscus x="88%" y="68%" size={48} rotate={-25} opacity={0.45}/>

        {/* Wave bottom decoration */}
        <div style={{position:"fixed",bottom:0,left:0,right:0,height:60,background:"rgba(255,255,255,0.05)",clipPath:"ellipse(60% 100% at 50% 100%)",pointerEvents:"none"}}/>

        {/* ── SECTION 1 — Hero ── */}
        <section style={{position:"relative",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 24px 100px",textAlign:"center",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,rgba(0,180,166,0.15) 0%,transparent 70%)",pointerEvents:"none"}}/>

          <Reveal>
            <p style={{fontFamily:"'Nunito',sans-serif",fontWeight:300,fontSize:11,letterSpacing:"0.4em",color:"rgba(255,255,255,0.65)",textTransform:"uppercase" as const,marginBottom:20}}>Paradise found</p>
          </Reveal>

          {mounted&&<motion.div animate={{y:[0,-10,0]}} transition={{duration:3,repeat:Infinity}} style={{fontSize:48,marginBottom:16}}>🌺</motion.div>}

          <Reveal delay={0.1}>
            <h1 style={{fontFamily:"'Pacifico',cursive",fontSize:"clamp(3rem,10vw,5.5rem)",color:"#fff",lineHeight:1.1,marginBottom:4,textShadow:"0 4px 24px rgba(0,80,100,0.4)"}}>
              {couple.groomName}
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{display:"flex",alignItems:"center",gap:16,margin:"8px 0"}}>
              <div style={{height:"1px",width:48,background:"rgba(255,255,255,0.5)"}}/>
              <span style={{fontSize:24}}>🌊</span>
              <div style={{height:"1px",width:48,background:"rgba(255,255,255,0.5)"}}/>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <h1 style={{fontFamily:"'Pacifico',cursive",fontSize:"clamp(3rem,10vw,5.5rem)",color:"#FFFDE7",lineHeight:1.1,marginBottom:32,textShadow:"0 4px 24px rgba(0,80,100,0.4)"}}>
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
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.4)",
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
            <div style={{display:"inline-flex",alignItems:"center",gap:10,padding:"12px 28px",background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.4)",borderRadius:40,backdropFilter:"blur(8px)"}}>
              <Calendar size={13} color="#fff"/>
              <span style={{fontFamily:"'Nunito',sans-serif",fontWeight:600,fontSize:15,color:"#fff"}}>{formatWeddingDate(couple.weddingDate)}</span>
              <span style={{color:"rgba(255,255,255,0.5)"}}>·</span>
              <span style={{fontSize:13,color:"rgba(255,255,255,0.8)"}}>{couple.weddingTime}</span>
            </div>
          </Reveal>

          <Reveal delay={0.5}>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.55)",marginTop:10}}>{couple.venue}</p>
          </Reveal>

          <motion.div animate={{y:[0,8,0]}} transition={{duration:2.2,repeat:Infinity}} style={{position:"absolute",bottom:32,color:"rgba(255,255,255,0.5)",fontSize:20}}>↓</motion.div>
        </section>

        {/* ── SECTION 2 — Message ── */}
        <section style={{padding:"40px 24px 60px",maxWidth:520,margin:"0 auto",textAlign:"center"}}>
          <Reveal>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:24}}>
              <div style={{height:"1px",flex:1,background:"rgba(255,255,255,0.3)"}}/>
              <span style={{fontSize:20}}>🌺</span>
              <div style={{height:"1px",flex:1,background:"rgba(255,255,255,0.3)"}}/>
            </div>
            <p style={{fontFamily:"'Nunito',sans-serif",fontStyle:"italic",fontWeight:300,fontSize:19,color:"rgba(255,255,255,0.8)",lineHeight:1.9}}>
              {couple.personalMessage?`"${couple.personalMessage}"`:`"Love found us where the ocean meets the sky. Come celebrate with us in paradise."`}
            </p>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginTop:24}}>
              <div style={{height:"1px",flex:1,background:"rgba(255,255,255,0.3)"}}/>
              <span style={{fontSize:20}}>🌊</span>
              <div style={{height:"1px",flex:1,background:"rgba(255,255,255,0.3)"}}/>
            </div>
          </Reveal>
        </section>

        {/* ── SECTION 3 — Events ── */}
        <section style={{padding:"20px 24px 60px",maxWidth:560,margin:"0 auto"}}>
          <Reveal>
            <p style={{fontFamily:"'Nunito',sans-serif",fontWeight:300,fontSize:10,letterSpacing:"0.4em",color:"rgba(255,255,255,0.55)",textTransform:"uppercase" as const,textAlign:"center",marginBottom:28}}>The Celebration</p>
          </Reveal>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {allEvents.map((event,i)=>(
              <Reveal key={i} delay={i*0.1}>
                <div style={{background:"rgba(255,255,255,0.15)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:20,padding:"22px 24px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <span style={{fontSize:20}}>🌴</span>
                    <div style={{flex:1}}>
                      <h3 style={{fontFamily:"'Pacifico',cursive",fontSize:17,color:"#fff",marginBottom:8}}>{event.name}</h3>
                      <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
                        <span style={{display:"flex",alignItems:"center",gap:5,fontSize:13,color:"rgba(255,255,255,0.8)"}}><Calendar size={12} color="rgba(255,255,255,0.7)"/>{formatWeddingDate(event.date)}</span>
                        <span style={{display:"flex",alignItems:"center",gap:5,fontSize:13,color:"rgba(255,255,255,0.8)"}}><Clock size={12} color="rgba(255,255,255,0.7)"/>{event.time}</span>
                        {event.venue&&<span style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:"rgba(255,255,255,0.55)"}}><MapPin size={12} color="rgba(255,255,255,0.6)"/>{event.venue}</span>}
                      </div>
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
            <div style={{background:"rgba(255,255,255,0.15)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:24,padding:"32px 24px"}}>
              <span style={{fontSize:28,display:"block",marginBottom:12}}>📍</span>
              <h3 style={{fontFamily:"'Pacifico',cursive",fontSize:20,color:"#fff",marginBottom:6}}>{couple.venue}</h3>
              {couple.venueAddress&&<p style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.8,marginBottom:18}}>{couple.venueAddress}</p>}
              {couple.mapLink&&<a href={couple.mapLink} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"11px 26px",background:"rgba(255,255,255,0.25)",borderRadius:40,color:"#fff",fontSize:12,fontFamily:"'Nunito',sans-serif",fontWeight:600,letterSpacing:"0.1em",textDecoration:"none",textTransform:"uppercase" as const,border:"1px solid rgba(255,255,255,0.4)"}}><MapPin size={12}/> View on Maps</a>}
            </div>
          </Reveal>
        </section>

        {/* ── SECTION 5 — Countdown ── */}
        <section style={{padding:"20px 24px 60px",textAlign:"center"}}>
          <Reveal>
            <p style={{fontFamily:"'Pacifico',cursive",fontSize:18,color:"rgba(255,255,255,0.55)",marginBottom:28}}>Until our paradise moment</p>
            <Countdown targetDate={couple.weddingDate}/>
          </Reveal>
        </section>

        {/* ── SECTION 6 — RSVP ── */}
        <section style={{padding:"20px 24px 80px",maxWidth:520,margin:"0 auto",textAlign:"center"}}>
          <Reveal>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:24}}>
              <div style={{height:"1px",flex:1,background:"rgba(255,255,255,0.3)"}}/>
              <span style={{fontSize:20}}>🌺</span>
              <div style={{height:"1px",flex:1,background:"rgba(255,255,255,0.3)"}}/>
            </div>
            <h2 style={{fontFamily:"'Pacifico',cursive",fontSize:26,color:"#fff",marginBottom:8}}>Join us in paradise</h2>
            <p style={{fontFamily:"'Nunito',sans-serif",fontWeight:300,fontSize:14,color:"rgba(255,255,255,0.65)",lineHeight:1.8,marginBottom:28}}>Let us know you&apos;re coming — the more the merrier!</p>
            <div style={{textAlign:"left",marginBottom:16}}>
              <RSVPForm inviteSlug={slug} coupleName={`${couple.groomName} & ${couple.brideName}`} accentColor="#00B4A6" theme="dark"/>
            </div>
            {couple.phone&&<button onClick={()=>{const p=couple.phone?.replace(/\D/g,"");window.open(`https://wa.me/${p}?text=${encodeURIComponent(`Hey! So excited to celebrate with ${couple.groomName} & ${couple.brideName} in paradise! 🌺`)}`,"_blank");}} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 22px",background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.35)",borderRadius:40,color:"rgba(255,255,255,0.8)",fontFamily:"'Nunito',sans-serif",fontSize:12,cursor:"pointer",fontWeight:600}}><Phone size={12}/> Also WhatsApp us</button>}
            <div style={{marginTop:40}}>
              <span style={{fontSize:24}}>🌊</span>
              <p style={{fontFamily:"'Pacifico',cursive",fontSize:18,color:"rgba(255,255,255,0.4)",marginTop:8}}>{couple.groomName} & {couple.brideName}</p>
              <p style={{fontSize:10,color:"rgba(255,255,255,0.2)",letterSpacing:"0.25em",textTransform:"uppercase" as const,marginTop:6}}>Made with WedCraft</p>
            </div>
          </Reveal>
        </section>
      </div>
      {couple.bgMusicUrl && (
  <MusicPlayer
    src={couple.bgMusicUrl}
    dark
    accentColor="#00B4A6"
  />
)}
    </>
  );
}