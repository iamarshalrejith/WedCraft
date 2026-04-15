"use client";

import { useEffect, useState, useRef } from "react";
import { CoupleDetails } from "@/types/invite";
import { formatWeddingDate } from "@/lib/invite-utils";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Calendar, Clock } from "lucide-react";
import RSVPForm from "@/components/rsvp/RSVPForm";

interface GardenPartyProps { couple: CoupleDetails; }

function Countdown({ targetDate }: { targetDate: string }) {
  const [t, setT] = useState({ d:0,h:0,m:0,s:0 });
  useEffect(()=>{
    const tick=()=>{const diff=new Date(targetDate).getTime()-Date.now();if(diff<=0)return;setT({d:Math.floor(diff/86400000),h:Math.floor((diff%86400000)/3600000),m:Math.floor((diff%3600000)/60000),s:Math.floor((diff%60000)/1000)});};
    tick();const id=setInterval(tick,1000);return()=>clearInterval(id);
  },[targetDate]);
  return (
    <div style={{display:"flex",gap:16,justifyContent:"center"}}>
      {[{v:t.d,l:"Days"},{v:t.h,l:"Hours"},{v:t.m,l:"Mins"},{v:t.s,l:"Secs"}].map(({v,l})=>(
        <div key={l} style={{textAlign:"center"}}>
          <div style={{width:60,height:60,background:"rgba(255,255,255,0.8)",border:"1.5px solid rgba(180,140,160,0.3)",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:"#7A5C6E",marginBottom:6,boxShadow:"0 4px 16px rgba(180,140,160,0.12)"}}>
            {String(v).padStart(2,"0")}
          </div>
          <span style={{fontSize:10,color:"#A88A96",letterSpacing:"0.15em",textTransform:"uppercase" as const,fontFamily:"'Montserrat',sans-serif",fontWeight:400}}>{l}</span>
        </div>
      ))}
    </div>
  );
}

function Reveal({children,delay=0}:{children:React.ReactNode;delay?:number}) {
  const ref=useRef(null);const inView=useInView(ref,{once:true,margin:"-50px"});
  return <motion.div ref={ref} initial={{opacity:0,y:18}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.9,delay,ease:[0.22,1,0.36,1]}}>{children}</motion.div>;
}

// Watercolor flower clusters SVG
const WatercolorCluster = ({x,y,size=80,hue=340,opacity=0.2,rotate=0}:{x:number|string;y:number|string;size?:number;hue?:number;opacity?:number;rotate?:number}) => (
  <svg width={size} height={size} viewBox="0 0 80 80" style={{position:"absolute",left:x,top:y,opacity,transform:`rotate(${rotate}deg)`,pointerEvents:"none"}}>
    {[0,60,120,180,240,300].map((a,i)=>{
      const rad=a*Math.PI/180;const cx=40+16*Math.cos(rad);const cy=40+16*Math.sin(rad);
      return <ellipse key={i} cx={cx} cy={cy} rx="8" ry="12" transform={`rotate(${a} ${cx} ${cy})`} fill={`hsl(${hue+i*5},65%,78%)`} opacity="0.75"/>;
    })}
    <circle cx="40" cy="40" r="7" fill={`hsl(${hue},50%,88%)`}/>
    <circle cx="40" cy="40" r="3.5" fill={`hsl(${hue+20},70%,70%)`}/>
    {Array.from({length:4}).map((_,i)=>{
      const a=(i*90)*Math.PI/180;
      return <path key={i} d={`M40 40 Q${40+12*Math.cos(a-0.4)} ${40+12*Math.sin(a-0.4)} ${40+20*Math.cos(a)} ${40+20*Math.sin(a)}`} stroke={`hsl(${120+hue%60},40%,55%)`} strokeWidth="1" fill="none" opacity="0.5"/>;
    })}
  </svg>
);

// Butterfly SVG
const Butterfly = ({x,y,size=24,opacity=0.35}:{x:number|string;y:number|string;size?:number;opacity?:number}) => (
  <motion.svg width={size} height={size} viewBox="0 0 24 24" style={{position:"absolute",left:x,top:y,opacity,pointerEvents:"none"}}
    animate={{y:[0,-4,0],rotate:[-3,3,-3]}} transition={{duration:3,repeat:Infinity,ease:"easeInOut"}}>
    <ellipse cx="8" cy="10" rx="6" ry="8" fill="#F9A8D4" opacity="0.8" transform="rotate(-20 8 10)"/>
    <ellipse cx="16" cy="10" rx="6" ry="8" fill="#FDA4AF" opacity="0.8" transform="rotate(20 16 10)"/>
    <ellipse cx="8" cy="16" rx="4" ry="6" fill="#F0ABFC" opacity="0.7" transform="rotate(15 8 16)"/>
    <ellipse cx="16" cy="16" rx="4" ry="6" fill="#E879F9" opacity="0.7" transform="rotate(-15 16 16)"/>
    <line x1="12" y1="6" x2="12" y2="20" stroke="#7C3AED" strokeWidth="0.8" opacity="0.4"/>
  </motion.svg>
);

const PetalDivider = () => (
  <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,margin:"28px 0"}}>
    <div style={{flex:1,height:"0.5px",background:"linear-gradient(to right,transparent,rgba(180,140,160,0.4))"}}/>
    <span style={{fontSize:18,filter:"saturate(0.8)"}}>🌸</span>
    <div style={{flex:1,height:"0.5px",background:"linear-gradient(to left,transparent,rgba(180,140,160,0.4))"}}/>
  </div>
);


// ─── Family Section ───────────────────────────────────────────────────────────
function FamilySection({ couple }: { couple: CoupleDetails }) {
  const hasParents = couple.groomFatherName || couple.groomMotherName || couple.brideFatherName || couple.brideMotherName;
  const hasRelatives = couple.relatives && couple.relatives.length > 0;
  if (!hasParents && !hasRelatives) return null;
  const groomRelatives = couple.relatives?.filter((r) => r.side === "groom") ?? [];
  const brideRelatives = couple.relatives?.filter((r) => r.side === "bride") ?? [];

  const ParentsCard = ({ sideLabel, fatherName, motherName, delay }: { sideLabel: string; fatherName?: string; motherName?: string; delay: number }) => (
    <Reveal delay={delay}>
      <div style={{ background:"rgba(255,255,255,0.75)", border:"1px solid rgba(180,140,160,0.25)", borderRadius:8, padding:"22px 16px", textAlign:"center", height:"100%" }}>
        <p style={{ fontSize:8, letterSpacing:"0.32em", color:"rgba(168,138,150,0.65)", textTransform:"uppercase" as const, marginBottom:14 }}>{sideLabel}</p>
        {fatherName && (<div style={{ marginBottom: motherName ? 12 : 0 }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, color:"#5C3D52", lineHeight:1.3 }}>{fatherName}</p>
          <p style={{ fontSize:9, color:"rgba(168,138,150,0.65)", letterSpacing:"0.15em", textTransform:"uppercase" as const, marginTop:2 }}>Father</p>
        </div>)}
        {fatherName && motherName && <div style={{ height:"0.5px", background:"rgba(180,140,160,0.25)", margin:"10px auto", width:36 }} />}
        {motherName && (<div>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, color:"#5C3D52", lineHeight:1.3 }}>{motherName}</p>
          <p style={{ fontSize:9, color:"rgba(168,138,150,0.65)", letterSpacing:"0.15em", textTransform:"uppercase" as const, marginTop:2 }}>Mother</p>
        </div>)}
      </div>
    </Reveal>
  );

  const RelativeCard = ({ rel, delay }: { rel: { name: string; relation: string; spouseName?: string }; delay: number }) => (
    <Reveal delay={delay}>
      <div style={{ background:"rgba(255,255,255,0.75)", border:"1px solid rgba(180,140,160,0.25)", borderRadius:6, padding:"11px", textAlign:"center", borderLeft:"2px solid rgba(180,140,160,0.25)" }}>
        <p style={{ fontSize:8, letterSpacing:"0.2em", color:"rgba(168,138,150,0.65)", textTransform:"uppercase" as const, marginBottom:6 }}>{rel.relation}</p>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, color:"#5C3D52", lineHeight:1.3 }}>{rel.name}</p>
        {rel.spouseName && (<>
          <div style={{ display:"flex", alignItems:"center", gap:5, justifyContent:"center", margin:"4px 0" }}>
            <div style={{ height:"0.5px", flex:1, background:"rgba(180,140,160,0.25)" }} />
            <span style={{ fontSize:9, color:"rgba(168,138,150,0.65)" }}>&amp;</span>
            <div style={{ height:"0.5px", flex:1, background:"rgba(180,140,160,0.25)" }} />
          </div>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:13, color:"#5C3D52", lineHeight:1.3, opacity:0.7 }}>{rel.spouseName}</p>
        </>)}
      </div>
    </Reveal>
  );

  return (
    <section style={{ padding:"20px 20px 52px", maxWidth:580, margin:"0 auto" }}>
      <Reveal>
        <div style={{ textAlign:"center", marginBottom:26 }}>
          <p style={{ fontSize:9, letterSpacing:"0.4em", color:"rgba(168,138,150,0.65)", textTransform:"uppercase" as const, marginBottom:6 }}>With Family Blessings</p>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:"#5C3D52" }}>Our Families</p>
        </div>
      </Reveal>
      {hasParents && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom: hasRelatives ? 26 : 0 }}>
          {(couple.groomFatherName || couple.groomMotherName) && (
            <ParentsCard sideLabel={`${couple.groomName}'s Parents`} fatherName={couple.groomFatherName} motherName={couple.groomMotherName} delay={0.1} />
          )}
          {(couple.brideFatherName || couple.brideMotherName) && (
            <ParentsCard sideLabel={`${couple.brideName}'s Parents`} fatherName={couple.brideFatherName} motherName={couple.brideMotherName} delay={0.2} />
          )}
        </div>
      )}
      {hasRelatives && (
        <>
          <Reveal delay={0.25}>
            <div style={{ display:"flex", alignItems:"center", gap:10, margin:"4px 0 18px" }}>
              <div style={{ flex:1, height:"0.5px", background:"rgba(180,140,160,0.25)" }} />
              <p style={{ fontSize:8, letterSpacing:"0.28em", color:"rgba(168,138,150,0.65)", textTransform:"uppercase" as const, whiteSpace:"nowrap" as const }}>Extended Family</p>
              <div style={{ flex:1, height:"0.5px", background:"rgba(180,140,160,0.25)" }} />
            </div>
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {groomRelatives.length > 0 && (<>
                <Reveal delay={0.28}><p style={{ fontSize:7, letterSpacing:"0.22em", color:"rgba(168,138,150,0.65)", textTransform:"uppercase" as const, textAlign:"center", marginBottom:4 }}>{couple.groomName}&apos;s Side</p></Reveal>
                {groomRelatives.map((rel, i) => <RelativeCard key={i} rel={rel} delay={0.3 + i * 0.07} />)}
              </>)}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {brideRelatives.length > 0 && (<>
                <Reveal delay={0.28}><p style={{ fontSize:7, letterSpacing:"0.22em", color:"rgba(168,138,150,0.65)", textTransform:"uppercase" as const, textAlign:"center", marginBottom:4 }}>{couple.brideName}&apos;s Side</p></Reveal>
                {brideRelatives.map((rel, i) => <RelativeCard key={i} rel={rel} delay={0.3 + i * 0.07} />)}
              </>)}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default function GardenParty({couple}:GardenPartyProps) {
  const [mounted,setMounted]=useState(false);
  useEffect(()=>setMounted(true),[]);
  const slug =
  couple.slug ??
  `${couple.groomName.toLowerCase().replace(/\s+/g,"-")}-weds-${couple.brideName.toLowerCase().replace(/\s+/g,"-")}`;
  const allEvents=couple.events?.length>0?couple.events:[{name:"Wedding Ceremony",date:couple.weddingDate,time:couple.weddingTime,venue:couple.venue}];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Montserrat:wght@300;400;500&family=Alex+Brush&display=swap" rel="stylesheet"/>
      <style>{`@keyframes petalFall{0%{transform:translateY(-15px) rotate(0deg);opacity:.7}100%{transform:translateY(110vh) rotate(360deg);opacity:0}}`}</style>

      <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#FDF5F8 0%,#FAF0F4 35%,#F4EEF8 70%,#FDF5F8 100%)",fontFamily:"'Montserrat',sans-serif",overflowX:"hidden"}} onContextMenu={e=>e.preventDefault()}>

        {/* Watercolor flower clusters */}
        <WatercolorCluster x={-25} y={60} size={120} hue={340} opacity={0.25}/>
        <WatercolorCluster x="75%" y={30} size={100} hue={280} opacity={0.22} rotate={45}/>
        <WatercolorCluster x="5%" y="55%" size={90} hue={0} opacity={0.18} rotate={-20}/>
        <WatercolorCluster x="82%" y="52%" size={110} hue={320} opacity={0.2} rotate={30}/>

        {/* Butterflies */}
        {mounted&&<>
          <Butterfly x="18%" y="22%" size={28} opacity={0.3}/>
          <Butterfly x="75%" y="35%" size={22} opacity={0.25}/>
          <Butterfly x="60%" y="18%" size={20} opacity={0.28}/>
        </>}

        {/* Falling petals */}
        {mounted&&Array.from({length:10}).map((_,i)=>(
          <div key={i} style={{position:"fixed",top:-12,left:`${6+i*9}%`,width:8,height:10,borderRadius:"50% 0 50% 0",background:i%3===0?"#F9A8D4":i%3===1?"#DDD6FE":"#BBF7D0",opacity:0.55,animation:`petalFall ${5+(i%4)}s linear ${i*0.5}s infinite`,pointerEvents:"none",zIndex:1}}/>
        ))}

        {/* ── Hero ── */}
        <section style={{position:"relative",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 24px 100px",textAlign:"center"}}>

          <Reveal><p style={{fontFamily:"'Montserrat',sans-serif",fontWeight:300,fontSize:10,letterSpacing:"0.5em",color:"#A88A96",textTransform:"uppercase" as const,marginBottom:20}}>An Outdoor Garden Wedding</p></Reveal>

          <Reveal delay={0.05}>
            <div style={{fontSize:36,marginBottom:16}}>🌷</div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 style={{fontFamily:"'Alex Brush',cursive",fontSize:"clamp(4rem,13vw,7rem)",color:"#6B4E71",lineHeight:1,marginBottom:4}}>
              {couple.groomName}
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{display:"flex",alignItems:"center",gap:16,margin:"8px 0"}}>
              <div style={{height:"0.5px",width:48,background:"rgba(168,138,150,0.4)"}}/>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:18,color:"#B4809A"}}>&</span>
              <div style={{height:"0.5px",width:48,background:"rgba(168,138,150,0.4)"}}/>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <h1 style={{fontFamily:"'Alex Brush',cursive",fontSize:"clamp(4rem,13vw,7rem)",color:"#9B59B6",lineHeight:1,marginBottom:32}}>
              {couple.brideName}
            </h1>
          </Reveal>

          <Reveal delay={0.4}>
            <div style={{display:"inline-flex",alignItems:"center",gap:10,padding:"11px 26px",background:"rgba(255,255,255,0.75)",border:"1px solid rgba(180,140,160,0.25)",borderRadius:40,backdropFilter:"blur(8px)",boxShadow:"0 4px 20px rgba(180,140,160,0.1)"}}>
              <Calendar size={13} color="#A88A96"/>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:"#6B4E71"}}>{formatWeddingDate(couple.weddingDate)}</span>
              <span style={{color:"rgba(168,138,150,0.4)"}}>·</span>
              <span style={{fontSize:13,color:"#A88A96"}}>{couple.weddingTime}</span>
            </div>
          </Reveal>

          <Reveal delay={0.5}>
            <p style={{fontSize:13,color:"#B4809A",marginTop:10}}>{couple.venue}</p>
          </Reveal>

          <motion.div animate={{y:[0,8,0]}} transition={{duration:2.2,repeat:Infinity}} style={{position:"absolute",bottom:32,color:"#C4A0B0",opacity:0.6,fontSize:20}}>↓</motion.div>
        </section>

        {/* ── Message ── */}
        <section style={{padding:"40px 24px",maxWidth:520,margin:"0 auto",textAlign:"center"}}>
          <Reveal>
            <PetalDivider/>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:20,color:"#7A5C6E",lineHeight:1.9}}>
              {couple.personalMessage?`"${couple.personalMessage}"`:`"In every garden, there is a season for everything. Our season of love has arrived — and we want you to bloom alongside us."`}
            </p>
            <PetalDivider/>
          </Reveal>
        </section>

        {/* ── SECTION 2.5 — Family ── */}
        <FamilySection couple={couple} />
        {(couple.groomFatherName || couple.groomMotherName || couple.brideFatherName || couple.brideMotherName || (couple.relatives && couple.relatives.length > 0)) && (
          <div style={{ display:"flex", alignItems:"center", gap:12, padding:"0 20px", margin:"0 0 8px" }}>
            <div style={{ flex:1, height:"0.5px", background:"rgba(180,180,180,0.3)" }} />
            <span style={{ fontSize:14, opacity:0.35 }}>✦</span>
            <div style={{ flex:1, height:"0.5px", background:"rgba(180,180,180,0.3)" }} />
          </div>
        )}

        {/* ── Events ── */}
        <section style={{padding:"20px 24px 60px",maxWidth:560,margin:"0 auto"}}>
          <Reveal><p style={{fontFamily:"'Montserrat',sans-serif",fontWeight:300,fontSize:10,letterSpacing:"0.4em",color:"#A88A96",textTransform:"uppercase" as const,textAlign:"center",marginBottom:28}}>The Garden Party</p></Reveal>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {allEvents.map((event,i)=>(
              <Reveal key={i} delay={i*0.1}>
                <div style={{background:"rgba(255,255,255,0.7)",border:"1px solid rgba(180,140,160,0.2)",borderRadius:16,padding:"22px 24px",backdropFilter:"blur(8px)",boxShadow:"0 4px 20px rgba(180,140,160,0.07)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <span style={{fontSize:18}}>🌺</span>
                    <div style={{flex:1}}>
                      <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:"#6B4E71",marginBottom:8}}>{event.name}</h3>
                      <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
                        <span style={{display:"flex",alignItems:"center",gap:5,fontSize:13,color:"#A88A96"}}><Calendar size={12} color="#C4A0B0"/>{formatWeddingDate(event.date)}</span>
                        <span style={{display:"flex",alignItems:"center",gap:5,fontSize:13,color:"#A88A96"}}><Clock size={12} color="#C4A0B0"/>{event.time}</span>
                        {event.venue&&<span style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:"#C4A0B0"}}><MapPin size={12} color="#C4A0B0"/>{event.venue}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Venue ── */}
        <section style={{padding:"20px 24px 60px",maxWidth:520,margin:"0 auto",textAlign:"center"}}>
          <Reveal>
            <div style={{background:"rgba(255,255,255,0.75)",border:"1px solid rgba(180,140,160,0.2)",borderRadius:20,padding:"32px 24px",backdropFilter:"blur(8px)",boxShadow:"0 8px 32px rgba(180,140,160,0.08)"}}>
              <span style={{fontSize:24,display:"block",marginBottom:12}}>🏡</span>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:21,color:"#6B4E71",marginBottom:6}}>{couple.venue}</h3>
              {couple.venueAddress&&<p style={{fontSize:13,color:"#A88A96",lineHeight:1.8,marginBottom:18}}>{couple.venueAddress}</p>}
              {couple.mapLink&&<a href={couple.mapLink} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 24px",background:"rgba(107,78,113,0.08)",border:"1px solid rgba(107,78,113,0.25)",borderRadius:40,color:"#6B4E71",fontSize:12,fontFamily:"'Montserrat',sans-serif",fontWeight:400,letterSpacing:"0.08em",textDecoration:"none"}}><MapPin size={12}/> View Garden</a>}
            </div>
          </Reveal>
        </section>

        {/* ── Countdown ── */}
        <section style={{padding:"20px 24px 60px",textAlign:"center"}}>
          <Reveal>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:20,color:"#B4809A",marginBottom:28}}>Until we meet in the garden</p>
            <Countdown targetDate={couple.weddingDate}/>
          </Reveal>
        </section>

        {/* ── RSVP ── */}
        <section style={{padding:"20px 24px 80px",maxWidth:480,margin:"0 auto",textAlign:"center"}}>
          <Reveal>
            <PetalDivider/>
            <span style={{fontSize:28}}>🌸</span>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:"#6B4E71",marginTop:12,marginBottom:8}}>Will you join us?</h2>
            <p style={{fontFamily:"'Montserrat',sans-serif",fontWeight:300,fontSize:14,color:"#A88A96",lineHeight:1.8,marginBottom:28}}>Your presence will make our garden bloom</p>
            <div style={{textAlign:"left",marginBottom:16}}>
              <RSVPForm inviteSlug={slug} coupleName={`${couple.groomName} & ${couple.brideName}`} accentColor="#9B59B6" theme="light"/>
            </div>
            {couple.phone&&<button onClick={()=>{const p=couple.phone?.replace(/\D/g,"");window.open(`https://wa.me/${p}?text=${encodeURIComponent(`Hi! So excited to be at ${couple.groomName} & ${couple.brideName}'s garden wedding! 🌷`)}`,"_blank");}} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 20px",background:"transparent",border:"1px solid rgba(180,140,160,0.4)",borderRadius:40,color:"#A88A96",fontFamily:"'Montserrat',sans-serif",fontSize:12,cursor:"pointer"}}><Phone size={12}/> Also WhatsApp</button>}
            <PetalDivider/>
            <p style={{fontFamily:"'Alex Brush',cursive",fontSize:24,color:"#B4809A"}}>{couple.groomName} & {couple.brideName}</p>
            <p style={{fontFamily:"'Montserrat',sans-serif",fontWeight:300,fontSize:9,color:"#D4B8C4",letterSpacing:"0.3em",textTransform:"uppercase" as const,marginTop:8}}>Made with WedCraft</p>
          </Reveal>
        </section>
      </div>
    </>
  );
}