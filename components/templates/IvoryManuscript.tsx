"use client";

import { useEffect, useState } from "react";
import { CoupleDetails } from "@/types/invite";
import RSVPForm from "@/components/rsvp/RSVPForm";
import MusicPlayer from "@/components/MusicPlayer";
import Image from "next/image";

interface Props { couple?: CoupleDetails; }

const defaultCouple: CoupleDetails = {
  groomName: "Edmund", brideName: "Celeste",
  weddingDate: "2027-04-10", weddingTime: "4:00 PM",
  venue: "The Old Library, Ooty", venueAddress: "Club Road, Ooty, Tamil Nadu",
  mapLink: "", phone: "+919876543210",
  personalMessage: "Every love story is beautiful, but ours is my favourite.",
  events: [
    { name: "Garden Party", date: "2027-04-09", time: "5:00 PM", venue: "The Manor Garden" },
    { name: "Wedding Ceremony", date: "2027-04-10", time: "4:00 PM", venue: "The Old Library" },
  ],
};

function useTypewriter(text: string, speed = 50) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, i + 1)); i++; }
      else clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return displayed;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}


// ─── Family Section ───────────────────────────────────────────────────────────
function FamilySection({ c }: { c: CoupleDetails }) {
  const hasParents = c.groomFatherName || c.groomMotherName || c.brideFatherName || c.brideMotherName;
  const hasRelatives = c.relatives && c.relatives.length > 0;
  if (!hasParents && !hasRelatives) return null;
  const groomRelatives = c.relatives?.filter((r) => r.side === "groom") ?? [];
  const brideRelatives = c.relatives?.filter((r) => r.side === "bride") ?? [];

  return (
    <section className="max-w-3xl mx-auto px-6 py-10">
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <p style={{ fontSize:9, letterSpacing:"0.4em", color:"rgba(100,75,50,0.6)", textTransform:"uppercase" as const, marginBottom:6 }}>With Family Blessings</p>
        <p style={{ fontFamily:"Georgia,serif", fontSize:22, color:"#4A3018" }}>Our Families</p>
      </div>
      {hasParents && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom: hasRelatives ? 24 : 0 }}>
          {(c.groomFatherName || c.groomMotherName) && (
            <div style={{ background:"#EFE4CF", border:"1px solid rgba(139,111,66,0.3)", borderRadius:10, padding:"20px 16px", textAlign:"center" }}>
              <p style={{ fontSize:8, letterSpacing:"0.3em", color:"rgba(100,75,50,0.6)", textTransform:"uppercase" as const, marginBottom:12 }}>{c.groomName}&apos;s Parents</p>
              {c.groomFatherName && (<div style={{ marginBottom: c.groomMotherName ? 10 : 0 }}>
                <p style={{ fontFamily:"Georgia,serif", fontSize:15, color:"#4A3018", lineHeight:1.3 }}>{c.groomFatherName}</p>
                <p style={{ fontSize:9, color:"rgba(100,75,50,0.6)", textTransform:"uppercase" as const, marginTop:2 }}>Father</p>
              </div>)}
              {c.groomFatherName && c.groomMotherName && <div style={{ height:"0.5px", background:"rgba(139,111,66,0.3)", margin:"8px auto", width:32 }} />}
              {c.groomMotherName && (<div>
                <p style={{ fontFamily:"Georgia,serif", fontSize:15, color:"#4A3018", lineHeight:1.3 }}>{c.groomMotherName}</p>
                <p style={{ fontSize:9, color:"rgba(100,75,50,0.6)", textTransform:"uppercase" as const, marginTop:2 }}>Mother</p>
              </div>)}
            </div>
          )}
          {(c.brideFatherName || c.brideMotherName) && (
            <div style={{ background:"#EFE4CF", border:"1px solid rgba(139,111,66,0.3)", borderRadius:10, padding:"20px 16px", textAlign:"center" }}>
              <p style={{ fontSize:8, letterSpacing:"0.3em", color:"rgba(100,75,50,0.6)", textTransform:"uppercase" as const, marginBottom:12 }}>{c.brideName}&apos;s Parents</p>
              {c.brideFatherName && (<div style={{ marginBottom: c.brideMotherName ? 10 : 0 }}>
                <p style={{ fontFamily:"Georgia,serif", fontSize:15, color:"#4A3018", lineHeight:1.3 }}>{c.brideFatherName}</p>
                <p style={{ fontSize:9, color:"rgba(100,75,50,0.6)", textTransform:"uppercase" as const, marginTop:2 }}>Father</p>
              </div>)}
              {c.brideFatherName && c.brideMotherName && <div style={{ height:"0.5px", background:"rgba(139,111,66,0.3)", margin:"8px auto", width:32 }} />}
              {c.brideMotherName && (<div>
                <p style={{ fontFamily:"Georgia,serif", fontSize:15, color:"#4A3018", lineHeight:1.3 }}>{c.brideMotherName}</p>
                <p style={{ fontSize:9, color:"rgba(100,75,50,0.6)", textTransform:"uppercase" as const, marginTop:2 }}>Mother</p>
              </div>)}
            </div>
          )}
        </div>
      )}
      {hasRelatives && (
        <>
          <div style={{ display:"flex", alignItems:"center", gap:10, margin:"4px 0 16px" }}>
            <div style={{ flex:1, height:"0.5px", background:"rgba(139,111,66,0.3)" }} />
            <p style={{ fontSize:8, letterSpacing:"0.28em", color:"rgba(100,75,50,0.6)", textTransform:"uppercase" as const, whiteSpace:"nowrap" as const }}>Extended Family</p>
            <div style={{ flex:1, height:"0.5px", background:"rgba(139,111,66,0.3)" }} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {groomRelatives.length > 0 && (<>
                <p style={{ fontSize:7, letterSpacing:"0.22em", color:"rgba(100,75,50,0.6)", textTransform:"uppercase" as const, textAlign:"center", marginBottom:4 }}>{c.groomName}&apos;s Side</p>
                {groomRelatives.map((rel, i) => (
                  <div key={i} style={{ background:"#EFE4CF", border:"1px solid rgba(139,111,66,0.3)", borderRadius:6, padding:"10px", textAlign:"center", borderLeft:"2px solid rgba(139,111,66,0.3)" }}>
                    <p style={{ fontSize:8, color:"rgba(100,75,50,0.6)", letterSpacing:"0.18em", textTransform:"uppercase" as const, marginBottom:5 }}>{rel.relation}</p>
                    <p style={{ fontFamily:"Georgia,serif", fontSize:13, color:"#4A3018", lineHeight:1.3 }}>{rel.name}</p>
                    {rel.spouseName && (<><p style={{ fontSize:9, color:"rgba(100,75,50,0.6)", margin:"3px 0" }}>&amp;</p><p style={{ fontFamily:"Georgia,serif", fontSize:12, color:"#4A3018", opacity:0.75 }}>{rel.spouseName}</p></>)}
                  </div>
                ))}
              </>)}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {brideRelatives.length > 0 && (<>
                <p style={{ fontSize:7, letterSpacing:"0.22em", color:"rgba(100,75,50,0.6)", textTransform:"uppercase" as const, textAlign:"center", marginBottom:4 }}>{c.brideName}&apos;s Side</p>
                {brideRelatives.map((rel, i) => (
                  <div key={i} style={{ background:"#EFE4CF", border:"1px solid rgba(139,111,66,0.3)", borderRadius:6, padding:"10px", textAlign:"center", borderLeft:"2px solid rgba(139,111,66,0.3)" }}>
                    <p style={{ fontSize:8, color:"rgba(100,75,50,0.6)", letterSpacing:"0.18em", textTransform:"uppercase" as const, marginBottom:5 }}>{rel.relation}</p>
                    <p style={{ fontFamily:"Georgia,serif", fontSize:13, color:"#4A3018", lineHeight:1.3 }}>{rel.name}</p>
                    {rel.spouseName && (<><p style={{ fontSize:9, color:"rgba(100,75,50,0.6)", margin:"3px 0" }}>&amp;</p><p style={{ fontFamily:"Georgia,serif", fontSize:12, color:"#4A3018", opacity:0.75 }}>{rel.spouseName}</p></>)}
                  </div>
                ))}
              </>)}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default function IvoryManuscript({ couple = defaultCouple }: Props) {
  const c = couple;
  const [sealVisible, setSealVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const heading = useTypewriter(`${c.groomName} & ${c.brideName}`, 80);

  useEffect(() => {
    const t1 = setTimeout(() => setSealVisible(true), 300);
    const t2 = setTimeout(() => setContentVisible(true), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Georgia', serif", background: "#F5F0E8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=IM+Fell+English:ital@0;1&display=swap');
        .manuscript-title { font-family: 'Special Elite', cursive; }
        .manuscript-body { font-family: 'IM Fell English', serif; }
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes stampIn { 0%{ opacity:0; transform:scale(2.5) rotate(-15deg); } 60%{ transform:scale(0.95) rotate(3deg); } 100%{ opacity:1; transform:scale(1) rotate(0deg); } }
        @keyframes inkFade { from{ opacity:0; } to{ opacity:1; } }
        .stamp-anim { animation: stampIn 0.7s cubic-bezier(.22,.61,.36,1) forwards; }
        .ink-reveal { animation: inkFade 1.2s ease forwards; }
        .content-reveal { animation: fadeSlideUp 0.8s ease forwards; }
        .paper-line { border-bottom: 1px solid #C4A97A44; }
        .decorative-drop::first-letter { float:left; font-size:4.5rem; line-height:0.8; padding-right:0.12em; color:#8B6F42; font-family:'Special Elite',cursive; }
      `}</style>

      {/* Parchment texture overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(180,140,80,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(160,120,60,0.06) 0%, transparent 50%)`,
        mixBlendMode: "multiply"
      }}/>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20" style={{ background: "linear-gradient(160deg, #F8F2E4 0%, #EDE4CE 50%, #E6D9BE 100%)" }}>
        {/* Corner ornaments */}
        {[["top-6 left-6","rotate-0"],["top-6 right-6","rotate-90"],["bottom-6 left-6","-rotate-90"],["bottom-6 right-6","rotate-180"]].map(([pos, rot], i) => (
          <div key={i} className={`absolute ${pos} ${rot} opacity-30`} style={{ width:60, height:60 }}>
            <svg viewBox="0 0 60 60" fill="none">
              <path d="M2 2 L2 20 M2 2 L20 2" stroke="#8B6F42" strokeWidth="2"/>
              <path d="M2 2 L12 12" stroke="#8B6F42" strokeWidth="1" opacity="0.5"/>
              <circle cx="20" cy="20" r="3" fill="none" stroke="#8B6F42" strokeWidth="1"/>
            </svg>
          </div>
        ))}

        {/* Wax Seal */}
        <div className={`mb-8 transition-all ${sealVisible ? "stamp-anim" : "opacity-0"}`} style={{ width:90, height:90 }}>
          <svg viewBox="0 0 90 90">
            <circle cx="45" cy="45" r="40" fill="#8B2020" opacity="0.9"/>
            <circle cx="45" cy="45" r="36" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="4 3"/>
            <circle cx="45" cy="45" r="28" fill="#A02020" opacity="0.6"/>
            <text x="45" y="42" textAnchor="middle" fontSize="10" fill="#F5E6C8" fontFamily="Georgia,serif" fontStyle="italic">W</text>
            <text x="45" y="56" textAnchor="middle" fontSize="7" fill="#D4AF37" fontFamily="Georgia,serif">✦ ✦ ✦</text>
          </svg>
        </div>

        {/* Invitation text */}
        <p className={`manuscript-body text-sm tracking-[0.35em] uppercase mb-4 ${contentVisible ? "ink-reveal" : "opacity-0"}`} style={{ color:"#8B6F42" }}>
          You are cordially invited to the wedding of
        </p>

        {/* Typewriter heading */}
        <h1 className={`manuscript-title text-5xl md:text-7xl text-center leading-tight mb-4`} style={{ color:"#3D2B1A", minHeight:"1.2em" }}>
          {heading}
          <span className="animate-pulse" style={{ color:"#8B6F42" }}>|</span>
        </h1>

        {/* Ink underline */}
        <div className={`relative h-px w-64 mb-6 ${contentVisible ? "ink-reveal" : "opacity-0"}`}>
          <div style={{ height:2, background:"linear-gradient(90deg, transparent, #8B6F42, transparent)" }}/>
          <div className="absolute left-1/2 -translate-x-1/2 -top-2 text-xl" style={{ color:"#C4A97A" }}>✦</div>
        </div>

        <div className={`text-center space-y-2 ${contentVisible ? "content-reveal" : "opacity-0"}`}>
          <p className="manuscript-body text-xl" style={{ color:"#5C4030" }}>{formatDate(c.weddingDate)}</p>
          <p className="manuscript-body" style={{ color:"#7A5C40", fontStyle:"italic" }}>{c.weddingTime} · {c.venue}</p>
        </div>

        {c.couplePhotoUrl && (
  <div className={`${contentVisible ? "content-reveal" : "opacity-0"} mt-8`}>
    <div
      style={{
        display: "inline-block",
        padding: "8px",
        background: "#F8F2E4",
        border: "1px solid #C4A97A88",
        boxShadow: "0 6px 20px rgba(139,111,66,0.18)",
      }}
    >
      <div
        style={{
          padding: "6px",
          border: "1px solid #8B6F4244",
          background: "#EFE4CF",
        }}
      >
        <Image
          src={c.couplePhotoUrl}
          alt="Couple"
          width={220}
          height={280}
          style={{
            objectFit: "cover",
            filter: "sepia(18%) contrast(1.03)",
          }}
        />
      </div>
    </div>
  </div>
)}

        {/* Scroll down hint */}
        <div className={`absolute bottom-10 flex flex-col items-center gap-2 ${contentVisible ? "ink-reveal" : "opacity-0"}`}>
          <p className="manuscript-body text-xs tracking-widest uppercase" style={{ color:"#A0856A" }}>Scroll to read</p>
          <div style={{ width:1, height:40, background:"linear-gradient(to bottom, #A0856A, transparent)" }}/>
        </div>
      </section>

      {/* ── Personal Message ── */}
      <section className="max-w-2xl mx-auto px-8 py-20">
        <div className="relative">
          {/* Ruled lines */}
          {Array.from({length:8}).map((_,i) => (
            <div key={i} className="paper-line" style={{ marginBottom:36, paddingBottom:0 }}/>
          ))}
          <div className="absolute inset-0 flex flex-col justify-center">
            <p className="manuscript-body text-lg leading-relaxed text-center italic decorative-drop" style={{ color:"#3D2B1A", fontSize:"1.15rem" }}>
              {c.personalMessage}
            </p>
          </div>
        </div>
        <p className="manuscript-title text-right mt-8 text-2xl" style={{ color:"#8B6F42" }}>— {c.groomName} & {c.brideName}</p>
      </section>

      {/* ── Family ── */}
      <FamilySection c={couple} />
      {(couple.groomFatherName || couple.groomMotherName || couple.brideFatherName || couple.brideMotherName || (couple.relatives && couple.relatives.length > 0)) && (
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"0 20px", margin:"0 0 8px" }}>
          <div style={{ flex:1, height:"0.5px", background:"rgba(180,180,180,0.3)" }} />
          <span style={{ fontSize:14, opacity:0.35 }}>✦</span>
          <div style={{ flex:1, height:"0.5px", background:"rgba(180,180,180,0.3)" }} />
        </div>
      )}

      {/* ── Events ── */}
      <section className="max-w-3xl mx-auto px-8 py-16">
        <h2 className="manuscript-title text-3xl text-center mb-12" style={{ color:"#3D2B1A" }}>
          ✦ Schedule of Events ✦
        </h2>
        <div className="space-y-6">
          {c.events?.map((ev, i) => (
            <div key={i} className="flex gap-6 items-start p-6 rounded-2xl" style={{ background:"rgba(255,255,255,0.5)", border:"1px solid #C4A97A55", boxShadow:"2px 4px 16px rgba(139,111,66,0.1)" }}>
              <div className="text-center shrink-0">
                <div className="manuscript-title text-4xl" style={{ color:"#8B6F42" }}>{String(i+1).padStart(2,"0")}</div>
              </div>
              <div>
                <p className="manuscript-title text-xl" style={{ color:"#3D2B1A" }}>{ev.name}</p>
                <p className="manuscript-body text-sm mt-1" style={{ color:"#7A5C40", fontStyle:"italic" }}>{formatDate(ev.date)} · {ev.time}</p>
                {ev.venue && <p className="manuscript-body text-sm mt-0.5" style={{ color:"#9A7A60" }}>{ev.venue}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Venue ── */}
      <section className="max-w-2xl mx-auto px-8 py-16 text-center">
        <div className="relative p-8 rounded-2xl" style={{ background:"linear-gradient(135deg, #F0E6D0, #E8D9BC)", border:"2px solid #C4A97A55" }}>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl" style={{ color:"#8B6F42" }}>📍</div>
          <h3 className="manuscript-title text-2xl mb-3" style={{ color:"#3D2B1A" }}>The Venue</h3>
          <p className="manuscript-body text-lg" style={{ color:"#5C4030" }}>{c.venue}</p>
          {c.venueAddress && <p className="manuscript-body text-sm mt-1" style={{ color:"#8B7355", fontStyle:"italic" }}>{c.venueAddress}</p>}
          {c.mapLink && (
            <a href={c.mapLink} target="_blank" rel="noreferrer" className="inline-block mt-4 px-6 py-2 rounded-xl text-sm font-medium transition-colors" style={{ background:"#8B6F42", color:"#F5EDD8" }}>
              View on Map →
            </a>
          )}
        </div>
      </section>

      

     {/* ── RSVP ── */}
<section className="max-w-lg mx-auto px-8 pb-24 text-center">

  <h3 className="manuscript-title text-2xl mb-3" style={{ color:"#3D2B1A" }}>
    Will You Be Joining Us?
  </h3>

  <p className="manuscript-body text-sm mb-6 italic" style={{ color:"#7A5C40" }}>
    Kindly respond to this invitation
  </p>

  {/* FORM */}
  <div
    className="mb-6 p-6 rounded-2xl"
    style={{
      background:"rgba(255,255,255,0.6)",
      border:"1px solid #C4A97A55",
      boxShadow:"2px 4px 16px rgba(139,111,66,0.1)"
    }}
  >
    <RSVPForm
      inviteSlug={c.slug ?? "ivory-manuscript"}
      coupleName={`${c.groomName} & ${c.brideName}`}
      accentColor="#8B6F42"
      theme="light"
    />
  </div>

  {/* WHATSAPP BACKUP */}
  {c.phone && (
    <a
      href={`https://wa.me/${c.phone.replace(/\D/g,"")}`}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
      style={{
        background:"#3D2B1A",
        color:"#F5EDD8"
      }}
    >
      💌 RSVP via WhatsApp
    </a>
  )}

</section>
{c.bgMusicUrl && (
  <MusicPlayer
    src={c.bgMusicUrl}
    accentColor="#8B6F42"
  />
)}
    </div>
  );
}