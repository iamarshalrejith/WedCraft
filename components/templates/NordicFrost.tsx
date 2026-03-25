"use client";

import { useEffect, useState, useRef } from "react";
import { CoupleDetails } from "@/types/invite";
import RSVPForm from "@/components/rsvp/RSVPForm";

interface Props { couple?: CoupleDetails; }

const defaultCouple: CoupleDetails = {
  groomName: "Erik", brideName: "Freya",
  weddingDate: "2027-01-06", weddingTime: "2:00 PM",
  venue: "The Snow Chapel, Shimla", venueAddress: "The Ridge, Shimla, Himachal Pradesh",
  mapLink: "", phone: "+919876543210",
  personalMessage: "In the quiet of winter, we found forever.",
  events: [
    { name: "Ice Dinner", date: "2027-01-05", time: "7:00 PM", venue: "Mountain Lodge" },
    { name: "Wedding Ceremony", date: "2027-01-06", time: "2:00 PM", venue: "The Snow Chapel" },
  ],
};

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

// Snowflake SVG symbols
const SNOWFLAKES = ["❄","❅","❆","✦","✧"];

interface Flake { id: number; x: number; size: number; delay: number; duration: number; symbol: string; }

export default function NordicFrost({ couple = defaultCouple }: Props) {
  const c = couple;
  const [visible, setVisible] = useState(false);
  const [flakes, setFlakes] = useState<Flake[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    setFlakes(Array.from({length:30}, (_,i) => ({
      id: i,
      x: Math.random() * 100,
      size: 10 + Math.random() * 16,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
      symbol: SNOWFLAKES[Math.floor(Math.random() * SNOWFLAKES.length)],
    })));
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background:"#F4F8FF", fontFamily:"Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Jost:wght@300;400;500&display=swap');
        .nordic-serif  { font-family:'Playfair Display',serif; }
        .nordic-sans   { font-family:'Jost',sans-serif; }
        @keyframes snowfall { 0%{transform:translateY(-60px) rotate(0deg); opacity:0} 10%{opacity:0.7} 90%{opacity:0.4} 100%{transform:translateY(100vh) rotate(360deg); opacity:0} }
        @keyframes fadeSlide { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes crystalPulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.05)} }
        .snow-fall { animation: snowfall linear infinite; }
        .reveal { animation: fadeSlide 0.9s ease forwards; }
        .crystal-pulse { animation: crystalPulse 4s ease-in-out infinite; }
      `}</style>

      {/* Snowflakes */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {flakes.map(f => (
          <div key={f.id} className="snow-fall absolute" style={{
            left: `${f.x}%`,
            fontSize: f.size,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
            color: "#4682B4",
            opacity: 0.3,
          }}>
            {f.symbol}
          </div>
        ))}
      </div>

      {/* Subtle frost vignette */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(70,130,180,0.08) 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(176,196,222,0.1) 0%, transparent 50%)"
      }}/>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">

        {/* Giant background snowflake */}
        <div className="absolute inset-0 flex items-center justify-center crystal-pulse pointer-events-none">
          <svg viewBox="0 0 400 400" width="400" height="400" style={{ opacity:0.06 }}>
            {[0,30,60,90,120,150].map((angle,i) => (
              <g key={i} transform={`rotate(${angle} 200 200)`}>
                <line x1="200" y1="40" x2="200" y2="360" stroke="#4682B4" strokeWidth="2"/>
                <line x1="200" y1="100" x2="160" y2="70" stroke="#4682B4" strokeWidth="1.5"/>
                <line x1="200" y1="100" x2="240" y2="70" stroke="#4682B4" strokeWidth="1.5"/>
                <line x1="200" y1="160" x2="170" y2="140" stroke="#4682B4" strokeWidth="1"/>
                <line x1="200" y1="160" x2="230" y2="140" stroke="#4682B4" strokeWidth="1"/>
              </g>
            ))}
            <circle cx="200" cy="200" r="12" fill="#4682B4"/>
          </svg>
        </div>

        <div className={`text-center relative z-10 ${visible ? "reveal" : "opacity-0"}`}>
          <p className="nordic-sans text-xs tracking-[0.6em] uppercase mb-6" style={{ color:"#4682B488", letterSpacing:"0.5em" }}>
            Together in frost and forever
          </p>

          {/* Names */}
          <h1 className="nordic-serif text-6xl md:text-8xl font-bold leading-none mb-2" style={{ color:"#1A2744" }}>
            {c.groomName}
          </h1>
          <div className="my-3 flex items-center justify-center gap-4">
            <div style={{ width:60, height:1, background:"linear-gradient(90deg, transparent, #4682B4)" }}/>
            <span className="text-2xl" style={{ color:"#4682B4" }}>❄</span>
            <div style={{ width:60, height:1, background:"linear-gradient(90deg, #4682B4, transparent)" }}/>
          </div>
          <h1 className="nordic-serif text-6xl md:text-8xl font-bold leading-none mb-10" style={{ color:"#1A2744" }}>
            {c.brideName}
          </h1>

          {/* Date badge */}
          <div className="inline-block px-8 py-4 rounded-2xl mb-4" style={{ background:"rgba(70,130,180,0.08)", border:"1.5px solid rgba(70,130,180,0.25)" }}>
            <p className="nordic-serif text-lg" style={{ color:"#1A2744" }}>{formatDate(c.weddingDate)}</p>
            <p className="nordic-sans text-sm font-light mt-1" style={{ color:"#4682B4" }}>{c.weddingTime}</p>
          </div>

          <p className="nordic-sans text-sm font-light" style={{ color:"#4682B488" }}>{c.venue}</p>
        </div>
      </section>

      {/* ── Geometric divider ── */}
      <div className="flex items-center justify-center py-6 px-8">
        <svg viewBox="0 0 600 30" className="w-full max-w-2xl" style={{ overflow:"visible" }}>
          <line x1="0" y1="15" x2="250" y2="15" stroke="#B0C4DE" strokeWidth="1"/>
          <polygon points="290,5 310,15 290,25 300,15" fill="none" stroke="#4682B4" strokeWidth="1.5"/>
          <line x1="350" y1="15" x2="600" y2="15" stroke="#B0C4DE" strokeWidth="1"/>
          <circle cx="300" cy="15" r="4" fill="#4682B4" opacity="0.5"/>
        </svg>
      </div>

      {/* ── Personal Message ── */}
      <section className="max-w-2xl mx-auto px-8 py-16 text-center">
        <p className="nordic-serif text-2xl leading-relaxed italic" style={{ color:"#1A2744", fontSize:"1.4rem" }}>
          &ldquo;{c.personalMessage}&rdquo;
        </p>
        <p className="nordic-sans text-sm mt-4 font-light tracking-wider" style={{ color:"#4682B4" }}>
          — {c.groomName} & {c.brideName}
        </p>
      </section>

      {/* ── Events ── */}
      <section className="max-w-3xl mx-auto px-8 py-16">
        <h2 className="nordic-serif text-3xl text-center mb-3" style={{ color:"#1A2744" }}>Events</h2>
        <p className="nordic-sans text-sm text-center mb-10 font-light tracking-widest uppercase" style={{ color:"#4682B488" }}>Join us for</p>
        <div className="grid md:grid-cols-2 gap-5">
          {c.events?.map((ev, i) => (
            <div key={i} className="p-6 rounded-2xl relative overflow-hidden" style={{ background:"white", border:"1px solid rgba(70,130,180,0.15)", boxShadow:"0 4px 24px rgba(70,130,180,0.08)" }}>
              {/* Corner ice crystal */}
              <div className="absolute top-3 right-3 text-xl" style={{ color:"#4682B422" }}>❄</div>
              <div className="text-3xl mb-3">
                {i === 0 ? "🍷" : "⛪"}
              </div>
              <p className="nordic-serif text-xl font-bold" style={{ color:"#1A2744" }}>{ev.name}</p>
              <p className="nordic-sans text-sm font-light mt-1" style={{ color:"#4682B4" }}>{formatDate(ev.date)}</p>
              <p className="nordic-sans text-sm font-light" style={{ color:"#4682B499" }}>{ev.time}</p>
              {ev.venue && <p className="nordic-sans text-xs mt-2 font-light" style={{ color:"#1A274488" }}>{ev.venue}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Venue ── */}
      <section className="max-w-2xl mx-auto px-8 py-16 text-center">
        <div className="p-8 rounded-3xl" style={{ background:"linear-gradient(135deg, #EEF4FF, #E0EAF8)", border:"1px solid rgba(70,130,180,0.2)" }}>
          <div className="text-4xl mb-4">🏔️</div>
          <h3 className="nordic-serif text-2xl mb-2" style={{ color:"#1A2744" }}>{c.venue}</h3>
          {c.venueAddress && <p className="nordic-sans text-sm font-light" style={{ color:"#4682B4" }}>{c.venueAddress}</p>}
          {c.mapLink && (
            <a href={c.mapLink} target="_blank" rel="noreferrer"
              className="inline-block mt-4 px-6 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
              style={{ background:"#4682B4", color:"white" }}>
              View on Map
            </a>
          )}
        </div>
      </section>

     {/* ── RSVP ── */}
<section className="max-w-lg mx-auto px-8 pb-24 text-center">

  <h3 className="nordic-serif text-2xl mb-2" style={{ color:"#1A2744" }}>
    Will You Be Joining Us?
  </h3>

  <p className="nordic-sans text-sm font-light mb-6" style={{ color:"#4682B4" }}>
    We would be delighted to have you
  </p>

  {/* FORM */}
  <div
    className="mb-6 p-6 rounded-3xl"
    style={{
      background:"white",
      border:"1px solid rgba(70,130,180,0.2)",
      boxShadow:"0 4px 20px rgba(70,130,180,0.08)"
    }}
  >
    <RSVPForm
      inviteSlug="nordic-frost"
      coupleName={`${c.groomName} & ${c.brideName}`}
      accentColor="#4682B4"
      theme="light"
    />
  </div>

  {/* WHATSAPP BACKUP */}
  {c.phone && (
    <a
      href={`https://wa.me/${c.phone.replace(/\D/g,"")}`}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-medium text-sm transition-all hover:scale-105"
      style={{
        background:"#1A2744",
        color:"#F4F8FF"
      }}
    >
      ❄ RSVP via WhatsApp
    </a>
  )}

</section>
    </div>
  );
}