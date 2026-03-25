"use client";

import { useEffect, useState, useRef } from "react";
import { CoupleDetails } from "@/types/invite";
import RSVPForm from "@/components/rsvp/RSVPForm";

interface Props { couple?: CoupleDetails; }

const defaultCouple: CoupleDetails = {
  groomName: "Zane", brideName: "Nova",
  weddingDate: "2027-03-08", weddingTime: "9:00 PM",
  venue: "Skyline Club, Mumbai", venueAddress: "BKC, Mumbai",
  mapLink: "", phone: "+919876543210",
  personalMessage: "Love is the only frequency that matters.",
  events: [
    { name: "Pre-Party", date: "2027-03-07", time: "10:00 PM", venue: "Rooftop Lounge" },
    { name: "Wedding Ceremony", date: "2027-03-08", time: "9:00 PM", venue: "Skyline Club" },
  ],
};

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function Countdown({ targetDate }: { targetDate: string }) {
  const [time, setTime] = useState({ d:0, h:0, m:0, s:0 });
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return;
      setTime({ d:Math.floor(diff/86400000), h:Math.floor((diff%86400000)/3600000), m:Math.floor((diff%3600000)/60000), s:Math.floor((diff%60000)/1000) });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return (
    <div className="flex gap-4 justify-center">
      {[["d","DAYS"],["h","HRS"],["m","MIN"],["s","SEC"]].map(([k,label]) => (
        <div key={k} className="text-center">
          <div className="font-mono text-3xl md:text-5xl font-bold tabular-nums" style={{ color:"#FF2D78", textShadow:"0 0 20px #FF2D78, 0 0 40px #FF2D7855" }}>
            {String(time[k as keyof typeof time]).padStart(2,"0")}
          </div>
          <div className="text-xs tracking-widest mt-1" style={{ color:"#00F5FF88" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

export default function NeonVows({ couple = defaultCouple }: Props) {
  const c = couple;
  const [glitchActive, setGlitchActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Periodic glitch
  useEffect(() => {
    const trigger = () => { setGlitchActive(true); setTimeout(() => setGlitchActive(false), 200); };
    const id = setInterval(trigger, 3000 + Math.random() * 2000);
    return () => clearInterval(id);
  }, []);

  // Scanline canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    for (let y = 0; y < canvas.height; y += 4) {
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, y, canvas.width, 2);
    }
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background:"#050510", fontFamily:"'Courier New', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
        .neon-title { font-family:'Orbitron',monospace; }
        .neon-mono { font-family:'Share Tech Mono',monospace; }
        @keyframes glitch1 { 0%{clip-path:inset(0 0 95% 0)} 25%{clip-path:inset(30% 0 50% 0)} 50%{clip-path:inset(60% 0 20% 0)} 100%{clip-path:inset(0 0 95% 0)} }
        @keyframes glitch2 { 0%{clip-path:inset(60% 0 0 0)} 25%{clip-path:inset(0 0 80% 0)} 50%{clip-path:inset(40% 0 40% 0)} 100%{clip-path:inset(60% 0 0 0)} }
        @keyframes flicker { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.6} 94%{opacity:1} 95%{opacity:0.8} 96%{opacity:1} }
        @keyframes ticker { 0%{transform:translateX(100%)} 100%{transform:translateX(-100%)} }
        .glitch-main { position:relative; }
        .glitch-main.active::before { content:attr(data-text); position:absolute; top:0; left:3px; color:#00F5FF; animation:glitch1 0.2s infinite; opacity:0.8; }
        .glitch-main.active::after  { content:attr(data-text); position:absolute; top:0; left:-3px; color:#FF2D78; animation:glitch2 0.2s infinite; opacity:0.8; }
        .neon-pink-glow { text-shadow: 0 0 10px #FF2D78, 0 0 20px #FF2D78, 0 0 40px #FF2D7855; }
        .neon-cyan-glow { text-shadow: 0 0 10px #00F5FF, 0 0 20px #00F5FF, 0 0 40px #00F5FF55; }
        .flicker { animation: flicker 4s infinite; }
        .ticker-track { animation: ticker 20s linear infinite; white-space:nowrap;  display: inline-block;
  min-width: 100%; }
      `}</style>

      {/* Scanlines */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10 opacity-30"/>

      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)`,
        backgroundSize: "40px 40px"
      }}/>

      {/* ── Ticker ── */}
      <div className="fixed top-0 left-0 right-0 z-30 overflow-hidden" style={{ background:"#FF2D7820", borderBottom:"1px solid #FF2D7844", height:32, display:"flex", alignItems:"center" }}>
        <div className="ticker-track neon-mono text-xs" style={{ color:"#FF2D78" }}>
          {Array(6).fill(`⬥ WEDCRAFT PRESENTS ⬥ ${c.groomName.toUpperCase()} × ${c.brideName.toUpperCase()} ⬥ ${formatDate(c.weddingDate)} ⬥ ${c.venue.toUpperCase()} `).join("")}
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20">
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background:"radial-gradient(circle, #FF2D7820 0%, transparent 70%)", filter:"blur(40px)" }}/>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background:"radial-gradient(circle, #00F5FF15 0%, transparent 70%)", filter:"blur(40px)" }}/>

        <p className="neon-mono text-xs tracking-[0.5em] mb-6 flicker" style={{ color:"#00F5FF99" }}>[ LOADING LOVE.EXE ]</p>

        {/* Glitch title */}
        <div
          className={`glitch-main ${glitchActive ? "active" : ""} neon-title text-5xl md:text-8xl font-black text-center leading-none mb-2`}
          data-text={c.groomName}
          style={{ color:"#FAFAFA" }}
        >
          <span className="neon-pink-glow">{c.groomName}</span>
        </div>
        <div className="neon-title text-2xl md:text-4xl font-bold my-2 neon-cyan-glow" style={{ color:"#00F5FF" }}>×</div>
        <div
          className={`glitch-main ${glitchActive ? "active" : ""} neon-title text-5xl md:text-8xl font-black text-center leading-none mb-8`}
          data-text={c.brideName}
          style={{ color:"#FAFAFA" }}
        >
          <span className="neon-pink-glow">{c.brideName}</span>
        </div>

        {/* Date */}
        <div className="neon-mono text-lg mb-2" style={{ color:"#00F5FF" }}>
          <span className="neon-cyan-glow">{formatDate(c.weddingDate)}</span>
        </div>
        <div className="neon-mono text-sm mb-10" style={{ color:"#FFFFFF88" }}>{c.weddingTime} // {c.venue}</div>

        {/* Countdown */}
        <div className="w-full max-w-md p-6 rounded-2xl mb-6" style={{ background:"rgba(0,0,0,0.6)", border:"1px solid #FF2D7844", backdropFilter:"blur(10px)" }}>
          <p className="neon-mono text-xs text-center mb-4" style={{ color:"#00F5FF55" }}>— COUNTDOWN TO ZERO —</p>
          <Countdown targetDate={c.weddingDate}/>
        </div>

        {/* CTA */}
        <a href="#events" className="neon-mono text-sm px-8 py-3 rounded-xl font-bold tracking-widest transition-all hover:scale-105 flicker"
          style={{ background:"#FF2D78", color:"#050510", boxShadow:"0 0 20px #FF2D7888" }}>
          ACCESS ALL EVENTS →
        </a>
      </section>

      {/* ── Message ── */}
      <section className="max-w-2xl mx-auto px-8 py-16 text-center">
        <div className="p-8 rounded-2xl" style={{ background:"rgba(0,0,0,0.5)", border:"1px solid #00F5FF33", backdropFilter:"blur(10px)" }}>
          <p className="text-4xl mb-4" style={{ color:"#00F5FF44" }}>&ldquo;</p>
          <p className="text-base leading-relaxed" style={{ color:"#FFFFFF99", fontFamily:"'Share Tech Mono',monospace" }}>{c.personalMessage}</p>
          <p className="text-4xl mt-4" style={{ color:"#00F5FF44" }}>&rdquo;</p>
        </div>
      </section>

      {/* ── Events ── */}
      <section id="events" className="max-w-3xl mx-auto px-8 py-16">
        <h2 className="neon-title text-2xl font-bold text-center mb-10" style={{ color:"#FF2D78" }}>
          <span className="neon-pink-glow">// EVENTS</span>
        </h2>
        <div className="space-y-4">
          {c.events?.map((ev, i) => (
            <div key={i} className="flex gap-4 items-center p-5 rounded-xl" style={{ background:"rgba(255,45,120,0.05)", border:"1px solid #FF2D7833" }}>
              <div className="neon-title text-3xl font-black w-10 shrink-0" style={{ color:"#FF2D7866" }}>{String(i+1).padStart(2,"0")}</div>
              <div>
                <p className="neon-title font-bold" style={{ color:"#FAFAFA" }}>{ev.name}</p>
                <p className="neon-mono text-xs mt-1" style={{ color:"#00F5FF88" }}>{formatDate(ev.date)} @ {ev.time}</p>
                {ev.venue && <p className="neon-mono text-xs" style={{ color:"#FFFFFF55" }}>{ev.venue}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Venue ── */}
      <section className="max-w-2xl mx-auto px-8 py-16 text-center">
        <div className="p-8 rounded-2xl" style={{ background:"rgba(0,245,255,0.03)", border:"1px solid #00F5FF33" }}>
          <p className="neon-mono text-xs tracking-widest mb-3" style={{ color:"#00F5FF55" }}>[ VENUE DATA ]</p>
          <p className="neon-title text-xl font-bold mb-1" style={{ color:"#FAFAFA" }}>{c.venue}</p>
          {c.venueAddress && <p className="neon-mono text-sm" style={{ color:"#FFFFFF55" }}>{c.venueAddress}</p>}
          {c.mapLink && (
            <a href={c.mapLink} target="_blank" rel="noreferrer" className="inline-block mt-4 neon-mono text-xs px-6 py-2 rounded-xl" style={{ border:"1px solid #00F5FF55", color:"#00F5FF" }}>
              [ MAP ACCESS ]
            </a>
          )}
        </div>
      </section>

      
     {/* ── RSVP ── */}
<section className="max-w-lg mx-auto px-4 sm:px-6 md:px-8 pb-24 text-center">

  <p className="neon-mono text-xs tracking-widest mb-4" style={{ color:"#A78BFA88" }}>
    [ WILL YOU JOIN US? ]
  </p>

  <h2 className="neon-title text-xl mb-6 neon-purple-glow">
    Confirm Your Presence
  </h2>

  {/* FORM */}
 <div className="mb-6 p-4 sm:p-6 rounded-2xl"
    style={{
      background:"rgba(0,0,0,0.6)",
      border:"1px solid #6D28D944",
      backdropFilter:"blur(10px)"
    }}
  >
    <div className="w-full overflow-hidden">
       <RSVPForm
      inviteSlug="neon-vows"
      coupleName={`${c.groomName} & ${c.brideName}`}
      accentColor="#6D28D9"
      theme="dark"
    />
    </div>
   
  </div>

  {/* WHATSAPP BUTTON */}
  {c.phone && (
    <a
      href={`https://wa.me/${c.phone.replace(/\D/g,"")}`}
      target="_blank"
      rel="noreferrer"
     className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm px-4 py-3 rounded-xl font-bold transition-all hover:scale-105"
      style={{
        background:"rgba(109,40,217,0.1)",
        border:"1px solid #6D28D9",
        color:"#A78BFA",
        boxShadow:"0 0 20px #6D28D922"
      }}
    >
      📡 RSVP via WhatsApp
    </a>
  )}

</section>
    </div>
  );
}