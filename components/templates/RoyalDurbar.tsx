"use client";

import { useEffect, useState, useRef } from "react";
import { CoupleDetails } from "@/types/invite";
import { formatWeddingDate } from "@/lib/invite-utils";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Calendar, Clock } from "lucide-react";
import RSVPForm from "@/components/rsvp/RSVPForm";
import Image from "next/image";
import MusicPlayer from "@/components/MusicPlayer";

interface RoyalDurbarProps { couple: CoupleDetails; }

function Countdown({ targetDate }: { targetDate: string }) {
  const [t, setT] = useState({ d:0, h:0, m:0, s:0 });
  useEffect(() => {
    const tick = () => { const diff = new Date(targetDate).getTime()-Date.now(); if(diff<=0)return; setT({d:Math.floor(diff/86400000),h:Math.floor((diff%86400000)/3600000),m:Math.floor((diff%3600000)/60000),s:Math.floor((diff%60000)/1000)}); };
    tick(); const id=setInterval(tick,1000); return ()=>clearInterval(id);
  },[targetDate]);
  return (
    <div style={{display:"flex",gap:16,justifyContent:"center"}}>
      {[{v:t.d,l:"Days"},{v:t.h,l:"Hours"},{v:t.m,l:"Mins"},{v:t.s,l:"Secs"}].map(({v,l})=>(
        <div key={l} style={{textAlign:"center"}}>
          <div style={{width:64,height:64,background:"rgba(212,175,55,0.12)",border:"1px solid rgba(212,175,55,0.6)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'IM Fell English',serif",fontSize:26,color:"#D4AF37",marginBottom:6}}>
            {String(v).padStart(2,"0")}
          </div>
          <span style={{fontSize:10,letterSpacing:"0.2em",color:"rgba(212,175,55,0.55)",textTransform:"uppercase" as const,fontFamily:"sans-serif"}}>{l}</span>
        </div>
      ))}
    </div>
  );
}

function Reveal({children,delay=0}:{children:React.ReactNode;delay?:number}) {
  const ref=useRef(null); const inView=useInView(ref,{once:true,margin:"-50px"});
  return <motion.div ref={ref} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.9,delay,ease:[0.22,1,0.36,1]}}>{children}</motion.div>;
}

// Mughal arch SVG
const MughalArch = ({width=220,color="#D4AF37",opacity=0.25}:{width?:number;color?:string;opacity?:number}) => (
  <svg width={width} height={width*0.8} viewBox="0 0 220 176" fill="none" style={{opacity}}>
    <path d="M10 176 L10 80 Q10 10 110 10 Q210 10 210 80 L210 176 Z" stroke={color} strokeWidth="1.5" fill="none"/>
    <path d="M30 176 L30 85 Q30 35 110 35 Q190 35 190 85 L190 176" stroke={color} strokeWidth="0.5" fill="none" opacity="0.5"/>
    <path d="M10 80 Q60 50 110 50 Q160 50 210 80" stroke={color} strokeWidth="0.5" fill="none" opacity="0.4"/>
    {[0,1,2,3,4].map(i=><circle key={i} cx={10+i*50} cy={10+i*8} r={2} fill={color} opacity={0.6}/>)}
    {[0,1,2].map(i=><path key={i} d={`M${70+i*30} 10 L${80+i*30} 25 L${60+i*30} 25 Z`} fill={color} opacity={0.4}/>)}
  </svg>
);

// Gold floral border
const FloralBorder = () => (
  <div style={{position:"relative",height:20,overflow:"hidden",margin:"20px 0"}}>
    <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(90deg,transparent 0px,transparent 12px,rgba(212,175,55,0.4) 12px,rgba(212,175,55,0.4) 13px)",opacity:0.5}}/>
    <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",display:"flex",gap:8,alignItems:"center"}}>
      {["❋","✦","❋"].map((s,i)=><span key={i} style={{fontSize:12,color:"#D4AF37",opacity:0.7}}>{s}</span>)}
    </div>
  </div>
);

// ── Family Section ─────────────────────────────────────────────────────────────
function FamilySection({ couple }: { couple: CoupleDetails }) {
  const hasParents =
    couple.groomFatherName || couple.groomMotherName ||
    couple.brideFatherName || couple.brideMotherName;
  const hasRelatives = couple.relatives && couple.relatives.length > 0;
  if (!hasParents && !hasRelatives) return null;

  const groomRelatives = couple.relatives?.filter((r) => r.side === "groom") ?? [];
  const brideRelatives = couple.relatives?.filter((r) => r.side === "bride") ?? [];
  const dimGold = "rgba(212,175,55,0.45)";
  const dimBorder = "rgba(212,175,55,0.18)";
  const cream = "#F5E6C8";
  const dimCream = "rgba(245,230,200,0.7)";

  const ParentsCard = ({ sideLabel, fatherName, motherName, delay }: { sideLabel: string; fatherName?: string; motherName?: string; delay: number }) => (
    <Reveal delay={delay}>
      <div style={{ background:"rgba(212,175,55,0.04)", border:`1px solid ${dimBorder}`, borderRadius:4, padding:"22px 18px", textAlign:"center", height:"100%" }}>
        <p style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:"0.3em", color:dimGold, textTransform:"uppercase" as const, marginBottom:16 }}>{sideLabel}</p>
        {fatherName && (<div style={{ marginBottom: motherName ? 12 : 0 }}>
          <p style={{ fontFamily:"'IM Fell English',serif", fontSize:15, color:cream, lineHeight:1.3 }}>{fatherName}</p>
          <p style={{ fontSize:10, color:dimGold, letterSpacing:"0.15em", textTransform:"uppercase" as const, marginTop:2 }}>Father</p>
        </div>)}
        {fatherName && motherName && <div style={{ height:"0.5px", background:dimBorder, margin:"10px auto", width:36 }} />}
        {motherName && (<div>
          <p style={{ fontFamily:"'IM Fell English',serif", fontSize:15, color:cream, lineHeight:1.3 }}>{motherName}</p>
          <p style={{ fontSize:10, color:dimGold, letterSpacing:"0.15em", textTransform:"uppercase" as const, marginTop:2 }}>Mother</p>
        </div>)}
      </div>
    </Reveal>
  );

  const RelativeCard = ({ rel, delay }: { rel: { name: string; relation: string; spouseName?: string }; delay: number }) => (
    <Reveal delay={delay}>
      <div style={{ background:"rgba(212,175,55,0.03)", border:`1px solid rgba(212,175,55,0.12)`, borderRadius:3, padding:"12px", textAlign:"center" }}>
        <p style={{ fontSize:8, letterSpacing:"0.22em", color:"rgba(212,175,55,0.35)", textTransform:"uppercase" as const, marginBottom:7 }}>{rel.relation}</p>
        <p style={{ fontFamily:"'IM Fell English',serif", fontSize:14, color:cream, lineHeight:1.3 }}>{rel.name}</p>
        {rel.spouseName && (<>
          <div style={{ display:"flex", alignItems:"center", gap:5, justifyContent:"center", margin:"5px 0" }}>
            <div style={{ height:"0.5px", flex:1, background:dimBorder }} />
            <span style={{ fontSize:9, color:"rgba(212,175,55,0.5)" }}>&amp;</span>
            <div style={{ height:"0.5px", flex:1, background:dimBorder }} />
          </div>
          <p style={{ fontFamily:"'IM Fell English',serif", fontSize:13, color:dimCream, lineHeight:1.3 }}>{rel.spouseName}</p>
        </>)}
      </div>
    </Reveal>
  );

  return (
    <section style={{ padding:"20px 16px 60px", maxWidth:620, margin:"0 auto" }}>
      <Reveal>
        <p style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:"0.4em", color:"rgba(212,175,55,0.55)", textTransform:"uppercase" as const, textAlign:"center", marginBottom:28 }}>
          Two Families, One Celebration
        </p>
      </Reveal>

      {/* ── PARENTS — side by side, full width, responsive ── */}
      {hasParents && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:hasRelatives ? 28 : 0 }}>
          {(couple.groomFatherName || couple.groomMotherName) && (
            <ParentsCard sideLabel={`${couple.groomName}'s Parents`} fatherName={couple.groomFatherName} motherName={couple.groomMotherName} delay={0.1} />
          )}
          {(couple.brideFatherName || couple.brideMotherName) && (
            <ParentsCard sideLabel={`${couple.brideName}'s Parents`} fatherName={couple.brideFatherName} motherName={couple.brideMotherName} delay={0.2} />
          )}
        </div>
      )}

      {/* ── RELATIVES — own section below, 2 columns groom|bride ── */}
      {hasRelatives && (
        <>
          <Reveal delay={0.25}>
            <div style={{ display:"flex", alignItems:"center", gap:10, margin:"4px 0 20px" }}>
              <div style={{ flex:1, height:"0.5px", background:"rgba(212,175,55,0.15)" }} />
              <p style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:"0.3em", color:"rgba(212,175,55,0.4)", textTransform:"uppercase" as const, whiteSpace:"nowrap" as const }}>
                Extended Family
              </p>
              <div style={{ flex:1, height:"0.5px", background:"rgba(212,175,55,0.15)" }} />
            </div>
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {/* Groom side */}
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {groomRelatives.length > 0 && (
                <>
                  <Reveal delay={0.28}>
                    <p style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.25em", color:"rgba(212,175,55,0.38)", textTransform:"uppercase" as const, textAlign:"center", marginBottom:4 }}>
                      {couple.groomName}&apos;s Side
                    </p>
                  </Reveal>
                  {groomRelatives.map((rel, i) => <RelativeCard key={i} rel={rel} delay={0.3 + i * 0.07} />)}
                </>
              )}
            </div>
            {/* Bride side */}
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {brideRelatives.length > 0 && (
                <>
                  <Reveal delay={0.28}>
                    <p style={{ fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:"0.25em", color:"rgba(212,175,55,0.38)", textTransform:"uppercase" as const, textAlign:"center", marginBottom:4 }}>
                      {couple.brideName}&apos;s Side
                    </p>
                  </Reveal>
                  {brideRelatives.map((rel, i) => <RelativeCard key={i} rel={rel} delay={0.3 + i * 0.07} />)}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
export default function RoyalDurbar({couple}:RoyalDurbarProps) {
  const allEvents = couple.events?.length>0 ? couple.events : [{name:"Wedding Ceremony",date:couple.weddingDate,time:couple.weddingTime,venue:couple.venue}];
  const slug =
  couple.slug ??
  `${couple.groomName.toLowerCase().replace(/\s+/g,"-")}-weds-${couple.brideName.toLowerCase().replace(/\s+/g,"-")}`;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Cinzel:wght@400;500&family=Lato:wght@300;400&display=swap" rel="stylesheet"/>
      <style>{`@keyframes lampGlow{0%,100%{opacity:.7;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}`}</style>
      <div style={{minHeight:"100vh",background:"linear-gradient(170deg,#1A0005 0%,#2D000A 35%,#1A0005 70%,#0D0003 100%)",fontFamily:"'Lato',sans-serif",overflowX:"hidden"}} onContextMenu={e=>e.preventDefault()}>

        {/* Mughal arch top decoration */}
        <div style={{display:"flex",justifyContent:"center",paddingTop:60,opacity:0.3}}>
          <MughalArch width={300} color="#D4AF37" opacity={1} />
        </div>

        {/* Hanging diyas */}
        {[15,35,55,75,85].map((pct,i)=>(
          <div key={i} style={{position:"fixed",top:0,left:`${pct}%`,animation:`lampGlow ${1.5+i*0.3}s ease-in-out ${i*0.2}s infinite`,pointerEvents:"none",zIndex:1}}>
            <div style={{width:1,height:60,background:"rgba(212,175,55,0.3)",margin:"0 auto"}}/>
            <div style={{width:12,height:16,background:"radial-gradient(circle at 50% 30%,#FFD700,#FF8C00)",borderRadius:"50% 50% 60% 60%",margin:"0 auto",boxShadow:"0 0 12px #FF8C00, 0 0 24px rgba(255,140,0,0.5)"}}/>
          </div>
        ))}

        {/* ── SECTION 1 — Hero ── */}
        <section style={{position:"relative",minHeight:"80vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 24px 80px",textAlign:"center",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,rgba(139,0,30,0.2) 0%,transparent 70%)",pointerEvents:"none"}}/>

          <Reveal>
            <p style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:"0.5em",color:"rgba(212,175,55,0.55)",textTransform:"uppercase" as const,marginBottom:20}}>With the blessings of the almighty</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{display:"flex",gap:16,justifyContent:"center",marginBottom:16}}>
              {["🪔","🌹","🪔"].map((e,i)=><span key={i} style={{fontSize:24}}>{e}</span>)}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <h1 style={{fontFamily:"'IM Fell English',serif",fontSize:"clamp(2.8rem,9vw,5rem)",color:"#F5E6C8",letterSpacing:"0.06em",lineHeight:1.1,marginBottom:4,textShadow:"0 0 40px rgba(212,175,55,0.2)"}}>
              {couple.groomName}
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{display:"flex",alignItems:"center",gap:16,margin:"10px 0"}}>
              <div style={{height:"0.5px",width:60,background:"rgba(212,175,55,0.5)"}}/>
              <span style={{fontFamily:"'IM Fell English',serif",fontStyle:"italic",fontSize:18,color:"#D4AF37"}}>weds</span>
              <div style={{height:"0.5px",width:60,background:"rgba(212,175,55,0.5)"}}/>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <h1 style={{fontFamily:"'IM Fell English',serif",fontSize:"clamp(2.8rem,9vw,5rem)",color:"#D4AF37",letterSpacing:"0.06em",lineHeight:1.1,marginBottom:32,textShadow:"0 0 40px rgba(212,175,55,0.3)"}}>
              {couple.brideName}
            </h1>
          </Reveal>

          {couple.couplePhotoUrl && (
            <Reveal delay={0.3}>
              <div style={{ marginBottom: 28 }}>
                <div style={{
                  display: "inline-block", padding: "8px",
                  background: "linear-gradient(135deg,#D4AF37,#8B7340,#D4AF37)",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
                }}>
                  <div style={{ padding: "6px", background: "#1A0005", border: "1px solid rgba(212,175,55,0.4)" }}>
                    <Image
                      src={couple.couplePhotoUrl} alt="Couple"
                      width={200} height={260}
                      style={{ objectFit: "cover", filter: "contrast(1.05) saturate(1.05)" }}
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          <Reveal delay={0.35}>
            <div style={{display:"inline-flex",alignItems:"center",gap:10,padding:"12px 28px",background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.35)",borderRadius:4}}>
              <Calendar size={13} color="#D4AF37"/>
              <span style={{fontFamily:"'IM Fell English',serif",fontSize:15,color:"#F5E6C8"}}>{formatWeddingDate(couple.weddingDate)}</span>
              <span style={{color:"rgba(212,175,55,0.35)"}}>·</span>
              <span style={{fontSize:13,color:"rgba(212,175,55,0.7)"}}>{couple.weddingTime}</span>
            </div>
          </Reveal>

          <Reveal delay={0.45}>
            <p style={{fontSize:12,color:"rgba(212,175,55,0.4)",marginTop:10,letterSpacing:"0.1em"}}>{couple.venue}</p>
          </Reveal>

          <motion.div animate={{y:[0,8,0]}} transition={{duration:2.2,repeat:Infinity}} style={{position:"absolute",bottom:24,color:"rgba(212,175,55,0.4)",fontSize:20}}>↓</motion.div>
        </section>

        <FloralBorder/>

        {/* ── SECTION 2 — Message ── */}
        <section style={{padding:"40px 24px",maxWidth:520,margin:"0 auto",textAlign:"center"}}>
          <Reveal>
            <p style={{fontFamily:"'IM Fell English',serif",fontStyle:"italic",fontSize:20,color:"rgba(245,230,200,0.7)",lineHeight:1.9}}>
              {couple.personalMessage?`"${couple.personalMessage}"`:`"Two families, one celebration. With hearts full of joy and gratitude, we invite you to witness and bless this sacred union."`}
            </p>
          </Reveal>
        </section>

        <FloralBorder/>

        {/* ── SECTION 3 — Family ── */}
        <FamilySection couple={couple} />

        {(couple.groomFatherName || couple.groomMotherName || couple.brideFatherName || couple.brideMotherName || (couple.relatives && couple.relatives.length > 0)) && (
          <FloralBorder/>
        )}

        {/* ── SECTION 4 — Events ── */}
        <section style={{padding:"20px 24px 60px",maxWidth:560,margin:"0 auto"}}>
          <Reveal><p style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:"0.4em",color:"rgba(212,175,55,0.55)",textTransform:"uppercase" as const,textAlign:"center",marginBottom:28}}>Ceremonies</p></Reveal>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {allEvents.map((event,i)=>(
              <Reveal key={i} delay={i*0.1}>
                <div style={{background:"rgba(212,175,55,0.04)",border:"1px solid rgba(212,175,55,0.2)",borderRadius:4,padding:"22px 24px",display:"flex",gap:16}}>
                  <div style={{width:"2px",minHeight:50,background:"linear-gradient(to bottom,#D4AF37,rgba(212,175,55,0.2))",flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <h3 style={{fontFamily:"'IM Fell English',serif",fontSize:20,color:"#F5E6C8",marginBottom:10}}>{event.name}</h3>
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

        {/* ── SECTION 5 — Venue ── */}
        <section style={{padding:"20px 24px 60px",maxWidth:520,margin:"0 auto",textAlign:"center"}}>
          <Reveal>
            <div style={{position:"relative",display:"flex",justifyContent:"center",marginBottom:16,opacity:0.2}}>
              <MughalArch width={180} color="#D4AF37" opacity={1}/>
            </div>
            <div style={{background:"rgba(212,175,55,0.04)",border:"1px solid rgba(212,175,55,0.2)",borderRadius:4,padding:"28px 24px",marginTop:-60,position:"relative",zIndex:1}}>
              <MapPin size={18} color="#D4AF37" style={{margin:"0 auto 12px",display:"block"}}/>
              <h3 style={{fontFamily:"'IM Fell English',serif",fontSize:22,color:"#F5E6C8",marginBottom:6}}>{couple.venue}</h3>
              {couple.venueAddress&&<p style={{fontSize:13,color:"rgba(212,175,55,0.45)",lineHeight:1.8,marginBottom:16}}>{couple.venueAddress}</p>}
              {couple.mapLink&&<a href={couple.mapLink} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 24px",border:"1px solid rgba(212,175,55,0.4)",borderRadius:2,color:"#D4AF37",fontSize:11,fontFamily:"'Cinzel',serif",letterSpacing:"0.15em",textDecoration:"none",textTransform:"uppercase" as const}}><MapPin size={11}/> View on Maps</a>}
            </div>
          </Reveal>
        </section>

        {/* ── SECTION 6 — Countdown ── */}
        <section style={{padding:"20px 24px 60px",textAlign:"center"}}>
          <Reveal>
            <p style={{fontFamily:"'IM Fell English',serif",fontStyle:"italic",fontSize:18,color:"rgba(245,230,200,0.4)",marginBottom:28}}>Counting down to the grand celebration</p>
            <Countdown targetDate={couple.weddingDate}/>
          </Reveal>
        </section>

        <FloralBorder/>

        {/* ── SECTION 7 — RSVP ── */}
        <section style={{padding:"20px 24px 80px",maxWidth:520,margin:"0 auto",textAlign:"center"}}>
          <Reveal>
            <div style={{display:"flex",gap:12,justifyContent:"center",marginBottom:16}}>
              {["🪔","🌹","🪔"].map((e,i)=><span key={i} style={{fontSize:20}}>{e}</span>)}
            </div>
            <h2 style={{fontFamily:"'IM Fell English',serif",fontSize:26,color:"#F5E6C8",marginBottom:8}}>You are cordially invited</h2>
            <p style={{fontFamily:"'Lato',sans-serif",fontWeight:300,fontSize:14,color:"rgba(212,175,55,0.5)",lineHeight:1.8,marginBottom:28}}>Your presence will be our greatest honour</p>
            <div style={{textAlign:"left",marginBottom:16}}>
              <RSVPForm inviteSlug={slug} coupleName={`${couple.groomName} & ${couple.brideName}`} accentColor="#D4AF37" theme="dark"/>
            </div>
            {couple.phone&&<button onClick={()=>{const p=couple.phone?.replace(/\D/g,"");window.open(`https://wa.me/${p}?text=${encodeURIComponent(`Adaab! We are honoured to attend the wedding of ${couple.groomName} & ${couple.brideName}.`)}`,`_blank`);}} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 22px",background:"transparent",border:"1px solid rgba(212,175,55,0.3)",borderRadius:2,color:"rgba(212,175,55,0.6)",fontFamily:"'Cinzel',serif",fontSize:11,cursor:"pointer",letterSpacing:"0.15em",textTransform:"uppercase" as const}}><Phone size={11}/> Also WhatsApp us</button>}
            <FloralBorder/>
            <p style={{fontFamily:"'IM Fell English',serif",fontStyle:"italic",fontSize:18,color:"rgba(212,175,55,0.35)"}}>{couple.groomName} & {couple.brideName}</p>
            <p style={{fontSize:10,color:"rgba(212,175,55,0.15)",letterSpacing:"0.25em",textTransform:"uppercase" as const,marginTop:8}}>Made with WedCraft</p>
          </Reveal>
        </section>

        <div style={{display:"flex",justifyContent:"center",paddingBottom:20,opacity:0.15,transform:"scaleY(-1)"}}>
          <MughalArch width={200} color="#D4AF37" opacity={1}/>
        </div>
      </div>

      {couple.bgMusicUrl && (
        <MusicPlayer src={couple.bgMusicUrl} dark accentColor="#D4AF37" />
      )}
    </>
  );
}