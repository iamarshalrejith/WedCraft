"use client";

import { useEffect, useState, useRef } from "react";
import { CoupleDetails } from "@/types/invite";
import { formatWeddingDate } from "@/lib/invite-utils";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Calendar, Clock } from "lucide-react";
import RSVPForm from "@/components/rsvp/RSVPForm";

interface BengaliClassicProps { couple: CoupleDetails; }

function Countdown({ targetDate }: { targetDate: string }) {
  const [t, setT] = useState({ d:0,h:0,m:0,s:0 });
  useEffect(()=>{
    const tick=()=>{const diff=new Date(targetDate).getTime()-Date.now();if(diff<=0)return;setT({d:Math.floor(diff/86400000),h:Math.floor((diff%86400000)/3600000),m:Math.floor((diff%3600000)/60000),s:Math.floor((diff%60000)/1000)});};
    tick();const id=setInterval(tick,1000);return()=>clearInterval(id);
  },[targetDate]);
  return (
    <div style={{display:"flex",gap:12,justifyContent:"center"}}>
      {[{v:t.d,l:"দিন"},{v:t.h,l:"ঘণ্টা"},{v:t.m,l:"মিনিট"},{v:t.s,l:"সেকেন্ড"}].map(({v,l})=>(
        <div key={l} style={{textAlign:"center"}}>
          <div style={{width:60,height:60,background:"rgba(255,255,255,0.12)",border:"1.5px solid rgba(255,255,255,0.5)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Hind Siliguri',sans-serif",fontSize:24,color:"#fff",fontWeight:600,marginBottom:6}}>
            {String(v).padStart(2,"0")}
          </div>
          <span style={{fontSize:10,color:"rgba(255,255,255,0.55)",fontFamily:"'Hind Siliguri',sans-serif"}}>{l}</span>
        </div>
      ))}
    </div>
  );
}

function Reveal({children,delay=0}:{children:React.ReactNode;delay?:number}) {
  const ref=useRef(null);const inView=useInView(ref,{once:true,margin:"-50px"});
  return <motion.div ref={ref} initial={{opacity:0,y:22}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.9,delay,ease:[0.22,1,0.36,1]}}>{children}</motion.div>;
}

// Alpona (Bengali floor art) SVG pattern
const AlponaPattern = ({opacity=0.12}:{opacity?:number}) => (
  <svg width="200" height="60" viewBox="0 0 200 60" fill="none" style={{opacity}}>
    <circle cx="100" cy="30" r="25" stroke="#fff" strokeWidth="0.8"/>
    <circle cx="100" cy="30" r="18" stroke="#fff" strokeWidth="0.5"/>
    <circle cx="100" cy="30" r="10" stroke="#fff" strokeWidth="0.5"/>
    {[0,45,90,135,180,225,270,315].map((a,i)=>{
      const rad=a*Math.PI/180;const x=100+22*Math.cos(rad);const y=30+22*Math.sin(rad);
      return <ellipse key={i} cx={x} cy={y} rx="4" ry="7" transform={`rotate(${a} ${x} ${y})`} fill="#fff" opacity="0.5"/>;
    })}
    <line x1="10" y1="30" x2="75" y2="30" stroke="#fff" strokeWidth="0.5"/>
    <line x1="125" y1="30" x2="190" y2="30" stroke="#fff" strokeWidth="0.5"/>
    {[15,185].map(x=>[20,40].map(y=><circle key={`${x}${y}`} cx={x} cy={y} r="2" fill="#fff" opacity="0.4"/>))}
  </svg>
);

// Conch shell (shankha) motif
const Shankha = ({size=40,opacity=0.6}:{size?:number;opacity?:number}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{opacity}}>
    <path d="M20 5 C10 5 5 12 5 20 C5 28 10 35 20 35 C28 35 34 30 35 22 C36 16 32 10 26 8 C24 7 22 6 20 5Z" fill="white" opacity="0.7"/>
    <path d="M20 8 C12 8 8 14 8 20 C8 26 12 32 20 32 C26 32 31 28 32 22" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" fill="none"/>
    <circle cx="20" cy="20" r="4" fill="rgba(255,255,255,0.3)"/>
  </svg>
);

const RedDivider = () => (
  <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,margin:"24px 0"}}>
    <div style={{flex:1,height:1,background:"linear-gradient(to right,transparent,rgba(255,255,255,0.3))"}}/>
    <Shankha size={24} opacity={0.5}/>
    <div style={{flex:1,height:1,background:"linear-gradient(to left,transparent,rgba(255,255,255,0.3))"}}/>
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
      <div style={{background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.18)", borderRadius:6, padding:"22px 16px", textAlign:"center", height:"100%"}}>
        <p style={{fontFamily:"'Hind Siliguri',sans-serif", fontSize:8, letterSpacing:"0.3em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase" as const, marginBottom:14}}>{sideLabel}</p>
        {fatherName && (<div style={{marginBottom: motherName ? 12 : 0}}>
          <p style={{fontFamily:"'Hind Siliguri',sans-serif", fontSize:16, color:"rgba(255,255,255,0.9)", lineHeight:1.3, fontWeight:600}}>{fatherName}</p>
          <p style={{fontSize:9, color:"rgba(255,255,255,0.35)", letterSpacing:"0.15em", textTransform:"uppercase" as const, marginTop:2}}>Father</p>
        </div>)}
        {fatherName && motherName && <div style={{height:"0.5px", background:"rgba(255,255,255,0.15)", margin:"10px auto", width:36}} />}
        {motherName && (<div>
          <p style={{fontFamily:"'Hind Siliguri',sans-serif", fontSize:16, color:"rgba(255,255,255,0.9)", lineHeight:1.3, fontWeight:600}}>{motherName}</p>
          <p style={{fontSize:9, color:"rgba(255,255,255,0.35)", letterSpacing:"0.15em", textTransform:"uppercase" as const, marginTop:2}}>Mother</p>
        </div>)}
      </div>
    </Reveal>
  );

  const RelativeCard = ({ rel, delay }: { rel: { name: string; relation: string; spouseName?: string }; delay: number }) => (
    <Reveal delay={delay}>
      <div style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:5, padding:"11px", textAlign:"center", borderLeft:"2px solid rgba(255,255,255,0.25)"}}>
        <p style={{fontSize:8, letterSpacing:"0.2em", color:"rgba(255,255,255,0.35)", textTransform:"uppercase" as const, marginBottom:6, fontFamily:"'Hind Siliguri',sans-serif"}}>{rel.relation}</p>
        <p style={{fontFamily:"'Hind Siliguri',sans-serif", fontSize:14, color:"rgba(255,255,255,0.88)", lineHeight:1.3, fontWeight:600}}>{rel.name}</p>
        {rel.spouseName && (<>
          <div style={{display:"flex", alignItems:"center", gap:5, justifyContent:"center", margin:"4px 0"}}>
            <div style={{height:"0.5px", flex:1, background:"rgba(255,255,255,0.15)"}} />
            <span style={{fontSize:9, color:"rgba(255,255,255,0.4)"}}>&amp;</span>
            <div style={{height:"0.5px", flex:1, background:"rgba(255,255,255,0.15)"}} />
          </div>
          <p style={{fontFamily:"'Hind Siliguri',sans-serif", fontSize:13, color:"rgba(255,255,255,0.65)", lineHeight:1.3}}>{rel.spouseName}</p>
        </>)}
      </div>
    </Reveal>
  );

  return (
    <section style={{padding:"20px 16px 48px", maxWidth:580, margin:"0 auto"}}>
      <Reveal>
        <div style={{textAlign:"center", marginBottom:26}}>
          <p style={{fontFamily:"'Hind Siliguri',sans-serif", fontSize:9, letterSpacing:"0.4em", color:"rgba(255,255,255,0.4)", textTransform:"uppercase" as const, marginBottom:6}}>পরিবারের আশীর্বাদে</p>
          <p style={{fontFamily:"'Hind Siliguri',sans-serif", fontSize:22, color:"rgba(255,255,255,0.92)", fontWeight:600}}>আমাদের দুই পরিবার</p>
        </div>
      </Reveal>

      {hasParents && (
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom: hasRelatives ? 26 : 0}}>
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
            <div style={{display:"flex", alignItems:"center", gap:10, margin:"4px 0 18px"}}>
              <div style={{flex:1, height:"0.5px", background:"rgba(255,255,255,0.15)"}} />
              <p style={{fontFamily:"'Hind Siliguri',sans-serif", fontSize:8, letterSpacing:"0.28em", color:"rgba(255,255,255,0.35)", textTransform:"uppercase" as const, whiteSpace:"nowrap" as const}}>Extended Family</p>
              <div style={{flex:1, height:"0.5px", background:"rgba(255,255,255,0.15)"}} />
            </div>
          </Reveal>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:14}}>
            <div style={{display:"flex", flexDirection:"column", gap:8}}>
              {groomRelatives.length > 0 && (<>
                <Reveal delay={0.28}><p style={{fontFamily:"'Hind Siliguri',sans-serif", fontSize:7, letterSpacing:"0.22em", color:"rgba(255,255,255,0.3)", textTransform:"uppercase" as const, textAlign:"center", marginBottom:4}}>{couple.groomName}&apos;s Side</p></Reveal>
                {groomRelatives.map((rel, i) => <RelativeCard key={i} rel={rel} delay={0.3 + i * 0.07} />)}
              </>)}
            </div>
            <div style={{display:"flex", flexDirection:"column", gap:8}}>
              {brideRelatives.length > 0 && (<>
                <Reveal delay={0.28}><p style={{fontFamily:"'Hind Siliguri',sans-serif", fontSize:7, letterSpacing:"0.22em", color:"rgba(255,255,255,0.3)", textTransform:"uppercase" as const, textAlign:"center", marginBottom:4}}>{couple.brideName}&apos;s Side</p></Reveal>
                {brideRelatives.map((rel, i) => <RelativeCard key={i} rel={rel} delay={0.3 + i * 0.07} />)}
              </>)}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default function BengaliClassic({couple}:BengaliClassicProps) {
  const slug =
  couple.slug ??
  `${couple.groomName.toLowerCase().replace(/\s+/g,"-")}-weds-${couple.brideName.toLowerCase().replace(/\s+/g,"-")}`;
  const allEvents=couple.events?.length>0?couple.events:[{name:"Biye Bari",date:couple.weddingDate,time:couple.weddingTime,venue:couple.venue}];
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600&family=Tiro+Bangla:ital@0;1&display=swap" rel="stylesheet"/>
      <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#7B0D1E 0%,#9B1C2E 30%,#7B0D1E 65%,#5A0A16 100%)",fontFamily:"'Hind Siliguri',sans-serif",overflowX:"hidden"}} onContextMenu={e=>e.preventDefault()}>

        {/* Top alpona border */}
        <div style={{display:"flex",justifyContent:"center",padding:"12px 0",borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
          <AlponaPattern opacity={0.18}/>
        </div>

        {/* ── Hero ── */}
        <section style={{position:"relative",minHeight:"90vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 24px 80px",textAlign:"center",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,rgba(180,30,50,0.2) 0%,transparent 70%)",pointerEvents:"none"}}/>

          <Reveal><p style={{fontFamily:"'Tiro Bangla',serif",fontSize:18,color:"rgba(255,255,255,0.55)",marginBottom:20,letterSpacing:"0.05em"}}>শুভ বিবাহ</p></Reveal>
          <Reveal delay={0.05}><Shankha size={52} opacity={0.9}/></Reveal>
          <Reveal delay={0.1}><p style={{fontFamily:"'Hind Siliguri',sans-serif",fontWeight:300,fontSize:11,letterSpacing:"0.4em",color:"rgba(255,255,255,0.45)",textTransform:"uppercase" as const,marginTop:12,marginBottom:24}}>Together forever</p></Reveal>

          <Reveal delay={0.15}>
            <h1 style={{fontFamily:"'Tiro Bangla',serif",fontSize:"clamp(2.6rem,8vw,4.5rem)",color:"#fff",letterSpacing:"0.04em",lineHeight:1.2,marginBottom:4,textShadow:"0 0 40px rgba(255,255,255,0.1)"}}>
              {couple.groomName}
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{display:"flex",alignItems:"center",gap:16,margin:"8px 0"}}>
              <div style={{height:1,width:48,background:"rgba(255,255,255,0.4)"}}/>
              <span style={{fontFamily:"'Tiro Bangla',serif",fontStyle:"italic",fontSize:18,color:"rgba(255,255,255,0.65)"}}>এবং</span>
              <div style={{height:1,width:48,background:"rgba(255,255,255,0.4)"}}/>
            </div>
          </Reveal>
          <Reveal delay={0.25}>
            <h1 style={{fontFamily:"'Tiro Bangla',serif",fontSize:"clamp(2.6rem,8vw,4.5rem)",color:"#FFD4DA",letterSpacing:"0.04em",lineHeight:1.2,marginBottom:32,textShadow:"0 0 40px rgba(255,180,180,0.2)"}}>
              {couple.brideName}
            </h1>
          </Reveal>
          <Reveal delay={0.35}>
            <div style={{display:"inline-flex",alignItems:"center",gap:10,padding:"11px 26px",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:4}}>
              <Calendar size={13} color="rgba(255,255,255,0.7)"/>
              <span style={{fontFamily:"'Tiro Bangla',serif",fontSize:15,color:"#fff"}}>{formatWeddingDate(couple.weddingDate)}</span>
              <span style={{color:"rgba(255,255,255,0.3)"}}>·</span>
              <span style={{fontSize:13,color:"rgba(255,255,255,0.65)"}}>{couple.weddingTime}</span>
            </div>
          </Reveal>
          <Reveal delay={0.45}><p style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:10}}>{couple.venue}</p></Reveal>
          <motion.div animate={{y:[0,8,0]}} transition={{duration:2.2,repeat:Infinity}} style={{position:"absolute",bottom:24,color:"rgba(255,255,255,0.35)",fontSize:20}}>↓</motion.div>
        </section>

        <div style={{display:"flex",justifyContent:"center",padding:"8px 0"}}><AlponaPattern opacity={0.12}/></div>

        {/* ── Message ── */}
        <section style={{padding:"40px 24px",maxWidth:520,margin:"0 auto",textAlign:"center"}}>
          <Reveal>
            <p style={{fontFamily:"'Tiro Bangla',serif",fontStyle:"italic",fontSize:20,color:"rgba(255,255,255,0.72)",lineHeight:1.9}}>
              {couple.personalMessage?`"${couple.personalMessage}"`:`"দুটি মন, একটি স্বপ্ন — আপনার উপস্থিতি আমাদের বিশেষ দিনটিকে আরও সুন্দর করবে।"`}
            </p>
          </Reveal>
        </section>

        <div style={{display:"flex",justifyContent:"center",padding:"8px 0"}}><AlponaPattern opacity={0.12}/></div>

        {/* ── Family ── */}
        <FamilySection couple={couple} />
        {(couple.groomFatherName || couple.groomMotherName || couple.brideFatherName || couple.brideMotherName || (couple.relatives && couple.relatives.length > 0)) && <RedDivider />}

        {/* ── Events ── */}
        <section style={{padding:"20px 24px 60px",maxWidth:560,margin:"0 auto"}}>
          <Reveal><p style={{fontFamily:"'Hind Siliguri',sans-serif",fontWeight:500,fontSize:10,letterSpacing:"0.4em",color:"rgba(255,255,255,0.45)",textTransform:"uppercase" as const,textAlign:"center",marginBottom:28}}>অনুষ্ঠান সমূহ</p></Reveal>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {allEvents.map((event,i)=>(
              <Reveal key={i} delay={i*0.1}>
                <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:4,padding:"22px 24px",borderLeft:"3px solid rgba(255,255,255,0.4)"}}>
                  <h3 style={{fontFamily:"'Tiro Bangla',serif",fontSize:19,color:"#fff",marginBottom:10}}>{event.name}</h3>
                  <div style={{display:"flex",flexDirection:"column",gap:5}}>
                    <span style={{display:"flex",alignItems:"center",gap:7,fontSize:13,color:"rgba(255,255,255,0.7)"}}><Calendar size={12} color="rgba(255,255,255,0.5)"/>{formatWeddingDate(event.date)}</span>
                    <span style={{display:"flex",alignItems:"center",gap:7,fontSize:13,color:"rgba(255,255,255,0.7)"}}><Clock size={12} color="rgba(255,255,255,0.5)"/>{event.time}</span>
                    {event.venue&&<span style={{display:"flex",alignItems:"center",gap:7,fontSize:12,color:"rgba(255,255,255,0.4)"}}><MapPin size={12} color="rgba(255,255,255,0.4)"/>{event.venue}</span>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Venue ── */}
        <section style={{padding:"20px 24px 60px",maxWidth:520,margin:"0 auto",textAlign:"center"}}>
          <Reveal>
            <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:4,padding:"28px 24px"}}>
              <MapPin size={18} color="rgba(255,255,255,0.6)" style={{margin:"0 auto 12px",display:"block"}}/>
              <h3 style={{fontFamily:"'Tiro Bangla',serif",fontSize:20,color:"#fff",marginBottom:6}}>{couple.venue}</h3>
              {couple.venueAddress&&<p style={{fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.8,marginBottom:16}}>{couple.venueAddress}</p>}
              {couple.mapLink&&<a href={couple.mapLink} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 22px",border:"1px solid rgba(255,255,255,0.35)",borderRadius:2,color:"rgba(255,255,255,0.8)",fontSize:11,fontFamily:"'Hind Siliguri',sans-serif",letterSpacing:"0.12em",textDecoration:"none",textTransform:"uppercase" as const}}><MapPin size={11}/> দেখুন</a>}
            </div>
          </Reveal>
        </section>

        {/* ── Countdown ── */}
        <section style={{padding:"20px 24px 60px",textAlign:"center"}}>
          <Reveal>
            <p style={{fontFamily:"'Tiro Bangla',serif",fontStyle:"italic",fontSize:18,color:"rgba(255,255,255,0.4)",marginBottom:28}}>শুভ দিনের অপেক্ষায়</p>
            <Countdown targetDate={couple.weddingDate}/>
          </Reveal>
        </section>

        <div style={{display:"flex",justifyContent:"center",padding:"8px 0"}}><AlponaPattern opacity={0.12}/></div>

        {/* ── RSVP ── */}
        <section style={{padding:"20px 24px 80px",maxWidth:520,margin:"0 auto",textAlign:"center"}}>
          <Reveal>
            <Shankha size={36} opacity={0.5}/>
            <h2 style={{fontFamily:"'Tiro Bangla',serif",fontSize:24,color:"#fff",marginTop:12,marginBottom:8}}>আমন্ত্রণ রইল</h2>
            <p style={{fontFamily:"'Hind Siliguri',sans-serif",fontWeight:300,fontSize:14,color:"rgba(255,255,255,0.5)",lineHeight:1.8,marginBottom:28}}>আপনার উপস্থিতি আমাদের আনন্দ দ্বিগুণ করবে</p>
            <div style={{textAlign:"left",marginBottom:16}}>
              <RSVPForm inviteSlug={slug} coupleName={`${couple.groomName} & ${couple.brideName}`} accentColor="#FF6B8A" theme="dark"/>
            </div>
            {couple.phone&&<button onClick={()=>{const p=couple.phone?.replace(/\D/g,"");window.open(`https://wa.me/${p}?text=${encodeURIComponent(`নমস্কার! ${couple.groomName} ও ${couple.brideName}-এর বিবাহে যোগ দিতে পারবো। 🌺`)}`,"_blank");}} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 20px",background:"transparent",border:"1px solid rgba(255,255,255,0.25)",borderRadius:2,color:"rgba(255,255,255,0.6)",fontFamily:"'Hind Siliguri',sans-serif",fontSize:12,cursor:"pointer"}}><Phone size={11}/> WhatsApp করুন</button>}
            <RedDivider/>
            <p style={{fontFamily:"'Tiro Bangla',serif",fontSize:18,color:"rgba(255,255,255,0.35)"}}>{couple.groomName} ও {couple.brideName}</p>
            <p style={{fontSize:10,color:"rgba(255,255,255,0.15)",letterSpacing:"0.2em",textTransform:"uppercase" as const,marginTop:8}}>Made with WedCraft</p>
          </Reveal>
        </section>
        <div style={{display:"flex",justifyContent:"center",padding:"12px 0",borderTop:"1px solid rgba(255,255,255,0.08)"}}><AlponaPattern opacity={0.1}/></div>
      </div>
    </>
  );
}