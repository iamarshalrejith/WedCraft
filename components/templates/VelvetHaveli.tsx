"use client";

import { useEffect, useState } from "react";
import { CoupleDetails } from "@/types/invite";
import RSVPForm from "@/components/rsvp/RSVPForm";
import MusicPlayer from "@/components/MusicPlayer";
import Image from "next/image";

interface Props { couple?: CoupleDetails; }

const defaultCouple: CoupleDetails = {
  groomName: "Rajveer", brideName: "Padmini",
  weddingDate: "2026-12-05", weddingTime: "6:30 PM",
  venue: "Samode Haveli, Jaipur", venueAddress: "Gangapole, Jaipur, Rajasthan",
  mapLink: "", phone: "+919876543210",
  personalMessage: "Like the blue city, our love is ancient and everlasting.",
  events: [
    { name: "Haldi & Chooda", date: "2026-12-03", time: "9:00 AM", venue: "Bride's Haveli" },
    { name: "Sangeet & Dandiya", date: "2026-12-04", time: "7:00 PM", venue: "Haveli Courtyard" },
    { name: "Shahi Vivah", date: "2026-12-05", time: "6:30 PM", venue: "Samode Haveli" },
  ],
};

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function VelvetHaveli({ couple = defaultCouple }: Props) {
  const c = couple;
  const [visible, setVisible] = useState(false);
  const [peacockAnim, setPeacockAnim] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 200);
    const t2 = setTimeout(() => setPeacockAnim(true), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="min-h-screen" style={{ background:"#0C0A1E", fontFamily:"Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
        .haveli-title { font-family:'Cinzel Decorative',serif; }
        .haveli-body  { font-family:'Cormorant Garamond',serif; font-size:1.15rem; }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer  { 0%,100%{opacity:0.7} 50%{opacity:1} }
        @keyframes peacockFan { from{transform:scaleY(0) rotate(-10deg); opacity:0} to{transform:scaleY(1) rotate(0deg); opacity:1} }
        @keyframes ghungroo { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-3px)} 75%{transform:translateX(3px)} }
        .fade-up   { animation: fadeUp 1s ease forwards; }
        .shimmer   { animation: shimmer 3s ease-in-out infinite; }
        .peacock   { animation: peacockFan 1.2s cubic-bezier(.22,.61,.36,1) forwards; transform-origin: bottom center; }
        .ghungroo  { animation: ghungroo 1.5s ease-in-out infinite; }
        .jaali     { background-image: repeating-linear-gradient(0deg, rgba(212,175,55,0.15) 0, rgba(212,175,55,0.15) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, rgba(212,175,55,0.15) 0, rgba(212,175,55,0.15) 1px, transparent 1px, transparent 20px); }
      `}</style>

      {/* Jaali pattern overlay */}
      <div className="fixed inset-0 jaali pointer-events-none"/>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
        {/* Background arch */}
        <div className="absolute inset-0 flex justify-center items-start pt-0">
          <svg viewBox="0 0 800 600" className="w-full max-w-2xl opacity-20" preserveAspectRatio="xMidYMid meet">
            <path d="M400 10 Q580 10 620 200 L620 580 L180 580 L180 200 Q220 10 400 10Z" fill="none" stroke="#D4AF37" strokeWidth="2"/>
            <path d="M400 30 Q560 30 598 200 L598 560 L202 560 L202 200 Q240 30 400 30Z" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.5"/>
            {/* Arch floral top */}
            <circle cx="400" cy="30" r="12" fill="#D4AF37" opacity="0.6"/>
            {[0,60,120,180,240,300].map((a,i) => (
              <circle key={i} cx={400+16*Math.cos(a*Math.PI/180)} cy={30+16*Math.sin(a*Math.PI/180)} r="4" fill="#FF8C00" opacity="0.5"/>
            ))}
          </svg>
        </div>

        {/* Peacock */}
        <div className={`mb-6 ${peacockAnim ? "peacock" : "opacity-0"}`}>
          <svg viewBox="0 0 120 140" width="80" height="93">
            {/* Tail feathers */}
            {[-30,-15,0,15,30].map((angle, i) => (
              <ellipse key={i} cx="60" cy="70" rx="8" ry="40"
                transform={`rotate(${angle} 60 110)`}
                fill={i===2?"#1A6B3C":"#0D4A6B"} opacity="0.7"/>
            ))}
            {[-30,-15,0,15,30].map((angle, i) => (
              <circle key={i} cx={60+35*Math.sin(angle*Math.PI/180)} cy={110-35*Math.cos(angle*Math.PI/180)+5}
                r="6" fill={i===2?"#D4AF37":"#00C9A7"} opacity="0.8"/>
            ))}
            {/* Body */}
            <ellipse cx="60" cy="95" rx="12" ry="18" fill="#1B6B8A"/>
            {/* Head */}
            <circle cx="60" cy="70" r="9" fill="#1B6B8A"/>
            {/* Crown */}
            {[-1,0,1].map((x,i)=>(
              <line key={i} x1={60+x*4} y1="61" x2={60+x*3} y2="53" stroke="#D4AF37" strokeWidth="1.5"/>
            ))}
            {[-1,0,1].map((x,i)=>(
              <circle key={i} cx={60+x*3} cy="52" r="2.5" fill="#D4AF37"/>
            ))}
          </svg>
        </div>

        {/* Title */}
        <div className={`text-center ${visible ? "fade-up" : "opacity-0"}`} style={{ animationDelay:"0.3s" }}>
          <p className="haveli-body italic text-sm tracking-[0.4em] uppercase mb-4" style={{ color:"#D4AF3799" }}>
            — ॐ सर्वमंगल मांगल्ये —
          </p>
          <h1 className="haveli-title text-4xl md:text-6xl font-bold text-center leading-tight mb-2" style={{
            color:"#F5DEB3",
            textShadow:"0 0 30px rgba(212,175,55,0.4)"
          }}>
            {c.groomName}
          </h1>
          <div className="text-3xl my-2 shimmer" style={{ color:"#FF8C00" }}>❋</div>
          <h1 className="haveli-title text-4xl md:text-6xl font-bold text-center leading-tight" style={{
            color:"#F5DEB3",
            textShadow:"0 0 30px rgba(212,175,55,0.4)"
          }}>
            {c.brideName}
          </h1>
        </div>

        {c.couplePhotoUrl && (
  <div className={`mt-8 ${visible ? "fade-up" : "opacity-0"}`} style={{ animationDelay:"0.5s" }}>
    <div
      style={{
        display: "inline-block",
        padding: "8px",
        background: "linear-gradient(135deg,#D4AF37,#FF8C00,#D4AF37)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
      }}
    >
      <div
        style={{
          padding: "6px",
          background: "#0C0A1E",
          border: "1px solid rgba(212,175,55,0.4)",
        }}
      >
        <Image
          src={c.couplePhotoUrl}
          alt="Couple"
          width={200}
          height={260}
          style={{
            objectFit: "cover",
            filter: "contrast(1.05) saturate(1.05)",
          }}
        />
      </div>
    </div>
  </div>
)}

        {/* Divider */}
        <div className={`my-8 flex items-center gap-4 ${visible ? "fade-up" : "opacity-0"}`} style={{ animationDelay:"0.6s" }}>
          <div style={{ width:80, height:1, background:"linear-gradient(90deg, transparent, #D4AF37)" }}/>
          <span className="ghungroo text-2xl">𑀠</span>
          <div style={{ width:80, height:1, background:"linear-gradient(90deg, #D4AF37, transparent)" }}/>
        </div>

        <div className={`text-center ${visible ? "fade-up" : "opacity-0"}`} style={{ animationDelay:"0.8s" }}>
          <p className="haveli-body text-lg" style={{ color:"#F5DEB3" }}>{formatDate(c.weddingDate)}</p>
          <p className="haveli-body italic" style={{ color:"#D4AF3799" }}>{c.weddingTime} · {c.venue}</p>
        </div>
      </section>

      {/* ── Floral divider ── */}
      <div className="flex items-center justify-center py-4">
        <div style={{ flex:1, height:1, background:"linear-gradient(90deg, transparent, #D4AF3744, #D4AF37)" }}/>
        <span className="mx-6 text-2xl" style={{ color:"#FF8C00" }}>🌼</span>
        <div style={{ flex:1, height:1, background:"linear-gradient(90deg, #D4AF37, #D4AF3744, transparent)" }}/>
      </div>

      {/* ── Personal Message ── */}
      <section className="max-w-2xl mx-auto px-8 py-16 text-center">
        <div className="relative p-8 rounded-3xl" style={{ background:"rgba(212,175,55,0.06)", border:"1px solid rgba(212,175,55,0.2)" }}>
          {/* Corner flowers */}
          {["top-3 left-3","top-3 right-3","bottom-3 left-3","bottom-3 right-3"].map((pos,i)=>(
            <span key={i} className={`absolute ${pos} text-lg`} style={{ color:"#FF8C0066" }}>✿</span>
          ))}
          <p className="haveli-body text-xl leading-relaxed italic" style={{ color:"#F5DEB3BF", fontSize:"1.3rem" }}>
            &ldquo;{c.personalMessage}&rdquo;
          </p>
          <p className="haveli-title text-base mt-4" style={{ color:"#D4AF37" }}>
            — {c.groomName} & {c.brideName}
          </p>
        </div>
      </section>

      {/* ── Events ── */}
      <section className="max-w-3xl mx-auto px-8 py-16">
        <h2 className="haveli-title text-2xl text-center mb-3" style={{ color:"#D4AF37" }}>
          शुभ कार्यक्रम
        </h2>
        <p className="haveli-body text-center italic mb-10" style={{ color:"#D4AF3799" }}>Auspicious Events</p>
        <div className="space-y-5">
          {c.events?.map((ev, i) => {
            const icons = ["🌿","🎶","🌸"];
            return (
              <div key={i} className="flex gap-5 items-start p-5 rounded-2xl" style={{ background:"rgba(255,140,0,0.06)", border:"1px solid rgba(212,175,55,0.2)" }}>
                <div className="text-3xl shrink-0">{icons[i % icons.length]}</div>
                <div>
                  <p className="haveli-title font-bold text-base" style={{ color:"#F5DEB3" }}>{ev.name}</p>
                  <p className="haveli-body text-sm mt-0.5" style={{ color:"#D4AF3799" }}>{formatDate(ev.date)} · {ev.time}</p>
                  {ev.venue && <p className="haveli-body text-sm" style={{ color:"#F5DEB399" }}>{ev.venue}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Venue ── */}
      <section className="max-w-2xl mx-auto px-8 py-16 text-center">
        <div className="relative p-8 rounded-3xl overflow-hidden" style={{ background:"linear-gradient(135deg, rgba(75,0,130,0.4), rgba(20,10,40,0.8))", border:"1px solid rgba(212,175,55,0.3)" }}>
          <div className="text-4xl mb-4">🏯</div>
          <h3 className="haveli-title text-xl mb-2" style={{ color:"#D4AF37" }}>The Royal Venue</h3>
          <p className="haveli-body text-lg" style={{ color:"#F5DEB3" }}>{c.venue}</p>
          {c.venueAddress && <p className="haveli-body text-sm italic mt-1" style={{ color:"#F5DEB399" }}>{c.venueAddress}</p>}
          {c.mapLink && (
            <a href={c.mapLink} target="_blank" rel="noreferrer" className="inline-block mt-4 px-6 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
              style={{ background:"linear-gradient(135deg, #D4AF37, #FF8C00)", color:"#0C0A1E" }}>
              मार्ग देखें · View Map
            </a>
          )}
        </div>
      </section>

    {/* ── RSVP ── */}
<section className="max-w-lg mx-auto px-8 pb-24 text-center">

  <h3 className="haveli-title text-2xl mb-2" style={{ color:"#D4AF37" }}>
    Will You Be Joining Us?
  </h3>

  <p className="haveli-body italic mb-6" style={{ color:"#D4AF3799" }}>
    Your gracious presence will complete our celebration
  </p>

  {/* FORM */}
  <div
    className="mb-6 p-6 rounded-3xl"
    style={{
      background:"rgba(212,175,55,0.06)",
      border:"1px solid rgba(212,175,55,0.3)",
      boxShadow:"0 6px 30px rgba(212,175,55,0.15)"
    }}
  >
    <RSVPForm
      inviteSlug="velvet-haveli"
      coupleName={`${c.groomName} & ${c.brideName}`}
      accentColor="#D4AF37"
      theme="dark"
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
        background:"linear-gradient(135deg, #D4AF37, #FF8C00)",
        color:"#0C0A1E"
      }}
    >
      💌 RSVP via WhatsApp
    </a>
  )}

</section>
{c.bgMusicUrl && (
  <MusicPlayer
    src={c.bgMusicUrl}
    dark
    accentColor="#D4AF37"
  />
)}
    </div>
  );
}