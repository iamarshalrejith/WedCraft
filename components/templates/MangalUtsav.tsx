"use client";

import { useEffect, useState, useRef } from "react";
import { CoupleDetails } from "@/types/invite";
import { formatWeddingDate } from "@/lib/invite-utils";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Heart } from "lucide-react";
import RSVPForm from "@/components/rsvp/RSVPForm";
import MusicPlayer from "@/components/MusicPlayer";
import Image from "next/image";

interface MangalUtsavProps {
  couple: CoupleDetails;
}

// ─── Countdown ────────────────────────────────────────────────────────────────
function Countdown({ targetDate }: { targetDate: string }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return;
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const Box = ({ v, l }: { v: number; l: string }) => (
    <div className="flex flex-col items-center gap-1">
      <div
        style={{
          fontFamily: "'Cinzel', serif",
          border: "1px solid rgba(212,175,55,0.4)",
        }}
        className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold"
        css-color="color: #D4AF37"
      >
        <span style={{ color: "#D4AF37" }}>{String(v).padStart(2, "0")}</span>
      </div>
      <span
        style={{
          color: "#D4AF37",
          fontFamily: "'Cormorant Garamond', serif",
          opacity: 0.8,
        }}
        className="text-xs tracking-widest uppercase"
      >
        {l}
      </span>
    </div>
  );

  return (
    <div className="flex gap-4 justify-center">
      <Box v={t.d} l="Days" />
      <Box v={t.h} l="Hours" />
      <Box v={t.m} l="Mins" />
      <Box v={t.s} l="Secs" />
    </div>
  );
}

// ─── Fade-in section wrapper ──────────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Decorative divider ───────────────────────────────────────────────────────
const GoldDivider = () => (
  <div className="flex items-center justify-center gap-3 my-6">
    <div
      style={{ background: "linear-gradient(to right, transparent, #D4AF37)" }}
      className="h-px w-16 opacity-50"
    />
    <div style={{ color: "#D4AF37", fontSize: 18 }}>✦</div>
    <div
      style={{ background: "linear-gradient(to left, transparent, #D4AF37)" }}
      className="h-px w-16 opacity-50"
    />
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
export default function MangalUtsav({ couple }: MangalUtsavProps) {
  const [petalsVisible, setPetalsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPetalsVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  const handleWhatsAppRSVP = () => {
    const phone = couple.phone?.replace(/\D/g, "");
    const msg = encodeURIComponent(
      `Namaste! 🙏 I'd like to RSVP for the wedding of ${couple.groomName} & ${couple.brideName} on ${formatWeddingDate(couple.weddingDate)}.`,
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  const bgStyle: React.CSSProperties = {
    background:
      "radial-gradient(ellipse at top, #1a0a00 0%, #0d0500 40%, #000000 100%)",
    minHeight: "100vh",
    fontFamily: "'Cormorant Garamond', serif",
  };

  // ─── Section 1: Hero ─────────────────────────────────────────────────────
  const HeroSection = () => (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-16 pb-24">
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Falling petals - CSS only */}
      {petalsVisible &&
        Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "-20px",
              left: `${8 + i * 7.5}%`,
              width: 8,
              height: 8,
              borderRadius: "50% 0 50% 0",
              background: i % 2 === 0 ? "#D4AF37" : "#C0392B",
              opacity: 0.6,
              animation: `petalFall ${3 + (i % 4)}s linear ${i * 0.4}s infinite`,
            }}
          />
        ))}

      {/* OM text */}
      <FadeIn>
        <p
          style={{
            color: "#D4AF37",
            fontFamily: "'Cinzel', serif",
            fontSize: 13,
            letterSpacing: "0.3em",
            opacity: 0.7,
          }}
          className="text-center mb-4 uppercase tracking-widest"
        >
          ॐ श्री गणेशाय नमः
        </p>
      </FadeIn>

      {/* Ganesha SVG motif */}
      <FadeIn delay={0.1}>
        <div className="mb-6 flex justify-center">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle
              cx="32"
              cy="32"
              r="30"
              stroke="#D4AF37"
              strokeWidth="0.8"
              strokeDasharray="4 3"
              opacity="0.5"
            />
            <circle
              cx="32"
              cy="32"
              r="22"
              stroke="#D4AF37"
              strokeWidth="0.5"
              opacity="0.3"
            />
            <text
              x="32"
              y="40"
              textAnchor="middle"
              style={{
                fontSize: 28,
                fill: "#D4AF37",
                fontFamily: "'Noto Serif Devanagari', serif",
              }}
            >
              ॐ
            </text>
          </svg>
        </div>
      </FadeIn>

      {/* Couple Names */}
      <FadeIn delay={0.2}>
        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            color: "#F5E6C8",
            fontSize: "clamp(2.4rem, 8vw, 5rem)",
            letterSpacing: "0.12em",
            lineHeight: 1.1,
            textAlign: "center",
          }}
        >
          {couple.groomName.toUpperCase()}
        </h1>
      </FadeIn>

      <FadeIn delay={0.3}>
        <div className="flex items-center gap-4 my-3">
          <div
            style={{
              height: 1,
              width: 48,
              background: "#D4AF37",
              opacity: 0.5,
            }}
          />
          <span
            style={{
              color: "#D4AF37",
              fontFamily: "'Satisfy', cursive",
              fontSize: 22,
            }}
          >
            weds
          </span>
          <div
            style={{
              height: 1,
              width: 48,
              background: "#D4AF37",
              opacity: 0.5,
            }}
          />
        </div>
      </FadeIn>

      <FadeIn delay={0.4}>
        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            color: "#D4AF37",
            fontSize: "clamp(2.4rem, 8vw, 5rem)",
            letterSpacing: "0.12em",
            lineHeight: 1.1,
            textAlign: "center",
          }}
        >
          {couple.brideName.toUpperCase()}
        </h1>
      </FadeIn>

      {/* IMAGE HERE (separate block) */}
      {couple.couplePhotoUrl && (
        <FadeIn delay={0.45}>
          <Image
  src={couple.couplePhotoUrl}
  alt="Couple"
  width={160}
  height={160}
  className="mt-6 object-cover rounded-full border-4 border-[#D4AF37] shadow-xl"
  priority
/>
        </FadeIn>
      )}

      <FadeIn delay={0.5}>
        <div className="mt-8 text-center">
          <p
            style={{
              color: "#D4AF37",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20,
              letterSpacing: "0.1em",
            }}
          >
            {formatWeddingDate(couple.weddingDate)}
          </p>
          <p
            style={{
              color: "rgba(245,230,200,0.6)",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 16,
            }}
            className="mt-1"
          >
            {couple.weddingTime} · {couple.venue}
          </p>
        </div>
      </FadeIn>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8"
      >
        <div style={{ color: "#D4AF37", opacity: 0.4, fontSize: 22 }}>↓</div>
      </motion.div>
    </section>
  );

  // ─── Section 2: Blessing ─────────────────────────────────────────────────
  const BlessingSection = () => (
    <section className="py-20 px-6 text-center max-w-lg mx-auto">
      <FadeIn>
        <div
          style={{
            border: "1px solid rgba(212,175,55,0.25)",
            borderRadius: 24,
            padding: "48px 32px",
            background: "rgba(212,175,55,0.04)",
            backdropFilter: "blur(4px)",
          }}
        >
          <p
            style={{
              color: "rgba(245,230,200,0.5)",
              fontFamily: "'Cinzel', serif",
              fontSize: 11,
              letterSpacing: "0.3em",
            }}
            className="uppercase mb-4"
          >
            With the blessings of
          </p>

          {couple.personalMessage ? (
            <p
              style={{
                color: "#F5E6C8",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 19,
                lineHeight: 1.8,
                fontStyle: "italic",
              }}
            >
              &ldquo;{couple.personalMessage}&rdquo;
            </p>
          ) : (
            <p
              style={{
                color: "#F5E6C8",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 19,
                lineHeight: 1.8,
              }}
            >
              Our families joyfully invite you
              <br />
              to witness and bless the union of
              <br />
              our children
            </p>
          )}

          <GoldDivider />

          <p
            style={{
              color: "rgba(212,175,55,0.8)",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 16,
              lineHeight: 1.7,
            }}
          >
            Together with their families, they
            <br />
            request the honour of your presence
          </p>
        </div>
      </FadeIn>
    </section>
  );

  // ─── Section 2.5: Family ─────────────────────────────────────────────────
  const hasParents = couple.groomFatherName || couple.groomMotherName || couple.brideFatherName || couple.brideMotherName;
  const hasRelatives = couple.relatives && couple.relatives.length > 0;
  const groomRelatives = couple.relatives?.filter((r) => r.side === "groom") ?? [];
  const brideRelatives = couple.relatives?.filter((r) => r.side === "bride") ?? [];

  const FamilySection = () => {
    if (!hasParents && !hasRelatives) return null;

    const ParentsCard = ({ sideLabel, fatherName, motherName, delay }: { sideLabel: string; fatherName?: string; motherName?: string; delay: number }) => (
      <FadeIn delay={delay}>
        <div style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, padding: "20px 16px", textAlign: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", width: 36, height: 2, background: "linear-gradient(90deg, transparent, #D4AF37, transparent)", opacity: 0.7 }} />
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: "0.35em", color: "rgba(212,175,55,0.5)", textTransform: "uppercase" as const, marginBottom: 14 }}>
            {sideLabel}
          </p>
          {fatherName && (
            <div style={{ marginBottom: motherName ? 10 : 0 }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#F5E6C8", fontWeight: 500, lineHeight: 1.3 }}>{fatherName}</p>
              <p style={{ fontSize: 9, color: "rgba(212,175,55,0.4)", letterSpacing: "0.15em", textTransform: "uppercase" as const, marginTop: 2 }}>Father</p>
            </div>
          )}
          {fatherName && motherName && <div style={{ height: "0.5px", background: "rgba(212,175,55,0.15)", margin: "8px auto", width: 32 }} />}
          {motherName && (
            <div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#F5E6C8", fontWeight: 500, lineHeight: 1.3 }}>{motherName}</p>
              <p style={{ fontSize: 9, color: "rgba(212,175,55,0.4)", letterSpacing: "0.15em", textTransform: "uppercase" as const, marginTop: 2 }}>Mother</p>
            </div>
          )}
        </div>
      </FadeIn>
    );

    const RelativeCard = ({ rel, delay }: { rel: { name: string; relation: string; spouseName?: string }; delay: number }) => (
      <FadeIn delay={delay}>
        <div style={{ background: "rgba(212,175,55,0.03)", border: "1px solid rgba(212,175,55,0.12)", borderRadius: 8, padding: "12px 12px", textAlign: "center" }}>
          <p style={{ fontSize: 8, letterSpacing: "0.22em", color: "rgba(212,175,55,0.35)", textTransform: "uppercase" as const, marginBottom: 7 }}>{rel.relation}</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: "#F5E6C8", fontWeight: 500, lineHeight: 1.3 }}>{rel.name}</p>
          {rel.spouseName && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "center", margin: "5px 0" }}>
                <div style={{ height: "0.5px", flex: 1, background: "rgba(212,175,55,0.15)" }} />
                <span style={{ fontSize: 9, color: "rgba(212,175,55,0.5)" }}>&amp;</span>
                <div style={{ height: "0.5px", flex: 1, background: "rgba(212,175,55,0.15)" }} />
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: "rgba(245,230,200,0.65)", lineHeight: 1.3 }}>{rel.spouseName}</p>
            </>
          )}
        </div>
      </FadeIn>
    );

    return (
      <section className="py-12 px-4 max-w-2xl mx-auto">
        <FadeIn>
          <div className="text-center mb-7">
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: "0.45em", color: "rgba(212,175,55,0.5)", textTransform: "uppercase" as const, marginBottom: 6 }}>
              With the blessings of
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#F5E6C8", fontWeight: 400, letterSpacing: "0.04em" }}>
              Our Beloved Families
            </p>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "start" }}>
          {/* LEFT — Groom relatives */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {groomRelatives.length > 0 && (
              <>
                <FadeIn delay={0.05}>
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: 7, letterSpacing: "0.25em", color: "rgba(212,175,55,0.35)", textTransform: "uppercase" as const, textAlign: "center", marginBottom: 4 }}>
                    {couple.groomName}&apos;s Relatives
                  </p>
                </FadeIn>
                {groomRelatives.map((rel, i) => <RelativeCard key={i} rel={rel} delay={0.1 + i * 0.08} />)}
              </>
            )}
          </div>

          {/* CENTER — Parents */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 136, maxWidth: 172 }}>
            {(couple.groomFatherName || couple.groomMotherName) && (
              <ParentsCard sideLabel={`${couple.groomName}'s Parents`} fatherName={couple.groomFatherName} motherName={couple.groomMotherName} delay={0.1} />
            )}
            {(couple.groomFatherName || couple.groomMotherName) && (couple.brideFatherName || couple.brideMotherName) && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "#D4AF37", opacity: 0.25 }} />)}
                </div>
              </div>
            )}
            {(couple.brideFatherName || couple.brideMotherName) && (
              <ParentsCard sideLabel={`${couple.brideName}'s Parents`} fatherName={couple.brideFatherName} motherName={couple.brideMotherName} delay={0.2} />
            )}
          </div>

          {/* RIGHT — Bride relatives */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {brideRelatives.length > 0 && (
              <>
                <FadeIn delay={0.05}>
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: 7, letterSpacing: "0.25em", color: "rgba(212,175,55,0.35)", textTransform: "uppercase" as const, textAlign: "center", marginBottom: 4 }}>
                    {couple.brideName}&apos;s Relatives
                  </p>
                </FadeIn>
                {brideRelatives.map((rel, i) => <RelativeCard key={i} rel={rel} delay={0.1 + i * 0.08} />)}
              </>
            )}
          </div>
        </div>
      </section>
    );
  };

  // ─── Section 3: Events ───────────────────────────────────────────────────
  const EventsSection = () => {
    const allEvents =
      couple.events?.length > 0
        ? couple.events
        : [
            {
              name: "Wedding Ceremony",
              date: couple.weddingDate,
              time: couple.weddingTime,
              venue: couple.venue,
            },
          ];

    return (
      <section className="py-20 px-6 max-w-lg mx-auto">
        <FadeIn>
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              color: "#D4AF37",
              fontSize: 13,
              letterSpacing: "0.35em",
              textAlign: "center",
              marginBottom: 32,
            }}
            className="uppercase"
          >
            Events & Celebrations
          </h2>
        </FadeIn>

        <div className="space-y-4">
          {allEvents.map((event, i) => (
            <FadeIn key={i} delay={i * 0.12}>
              <div
                style={{
                  border: "1px solid rgba(212,175,55,0.2)",
                  borderRadius: 20,
                  padding: "28px 28px",
                  background: "rgba(212,175,55,0.03)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Corner accent */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 40,
                    height: 40,
                    borderTop: "2px solid rgba(212,175,55,0.4)",
                    borderLeft: "2px solid rgba(212,175,55,0.4)",
                    borderRadius: "20px 0 0 0",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 40,
                    height: 40,
                    borderBottom: "2px solid rgba(212,175,55,0.4)",
                    borderRight: "2px solid rgba(212,175,55,0.4)",
                    borderRadius: "0 0 20px 0",
                  }}
                />

                <h3
                  style={{
                    color: "#F5E6C8",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 20,
                    marginBottom: 12,
                  }}
                >
                  {event.name}
                </h3>
                <div className="space-y-1">
                  <p style={{ color: "rgba(212,175,55,0.8)", fontSize: 15 }}>
                    📅 {formatWeddingDate(event.date)}
                  </p>
                  <p style={{ color: "rgba(212,175,55,0.8)", fontSize: 15 }}>
                    🕐 {event.time}
                  </p>
                  {event.venue && (
                    <p style={{ color: "rgba(245,230,200,0.6)", fontSize: 14 }}>
                      📍 {event.venue}
                    </p>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    );
  };

  // ─── Section 4: Venue ────────────────────────────────────────────────────
  const VenueSection = () => (
    <section className="py-20 px-6 max-w-lg mx-auto text-center">
      <FadeIn>
        <h2
          style={{
            fontFamily: "'Cinzel', serif",
            color: "#D4AF37",
            fontSize: 13,
            letterSpacing: "0.35em",
          }}
          className="uppercase mb-8"
        >
          Venue
        </h2>

        <div
          style={{
            border: "1px solid rgba(212,175,55,0.25)",
            borderRadius: 24,
            padding: "40px 28px",
            background: "rgba(212,175,55,0.04)",
          }}
        >
          <div className="flex justify-center mb-4">
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(212,175,55,0.1)",
                border: "1px solid rgba(212,175,55,0.3)",
              }}
              className="flex items-center justify-center"
            >
              <MapPin size={20} color="#D4AF37" />
            </div>
          </div>

          <h3
            style={{
              color: "#F5E6C8",
              fontFamily: "'Playfair Display', serif",
              fontSize: 22,
              marginBottom: 8,
            }}
          >
            {couple.venue}
          </h3>

          {couple.venueAddress && (
            <p
              style={{
                color: "rgba(245,230,200,0.55)",
                fontSize: 15,
                lineHeight: 1.7,
              }}
            >
              {couple.venueAddress}
            </p>
          )}

          {couple.mapLink && (
            <a
              href={couple.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginTop: 24,
                padding: "12px 28px",
                border: "1px solid #D4AF37",
                borderRadius: 40,
                color: "#D4AF37",
                fontFamily: "'Cinzel', serif",
                fontSize: 12,
                letterSpacing: "0.15em",
                textDecoration: "none",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background =
                  "rgba(212,175,55,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = "transparent";
              }}
            >
              <MapPin size={14} />
              VIEW ON MAPS
            </a>
          )}
        </div>
      </FadeIn>
    </section>
  );

  // ─── Section 5: Countdown ────────────────────────────────────────────────
  const CountdownSection = () => (
    <section className="py-20 px-6 text-center">
      <FadeIn>
        <div className="max-w-lg mx-auto">
          <p
            style={{
              color: "rgba(212,175,55,0.6)",
              fontFamily: "'Cinzel', serif",
              fontSize: 11,
              letterSpacing: "0.3em",
            }}
            className="uppercase mb-2"
          >
            Counting down to
          </p>
          <h2
            style={{
              color: "#F5E6C8",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28,
              marginBottom: 32,
              fontStyle: "italic",
            }}
          >
            The Most Beautiful Day
          </h2>
          <Countdown targetDate={couple.weddingDate} />
        </div>
      </FadeIn>
    </section>
  );

  // ─── Section 6: RSVP ─────────────────────────────────────────────────────
  const RsvpSection = () => (
    <section className="py-20 px-6 text-center max-w-lg mx-auto">
      <FadeIn>
        <GoldDivider />
        <h2
          style={{
            color: "#D4AF37",
            fontFamily: "'Cinzel', serif",
            fontSize: 13,
            letterSpacing: "0.35em",
          }}
          className="uppercase mb-4"
        >
          Join Our Celebration
        </h2>

        <p
          style={{
            color: "rgba(245,230,200,0.65)",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 18,
            lineHeight: 1.8,
            marginBottom: 32,
          }}
        >
          Your presence would make our day
          <br />
          truly complete and memorable
        </p>

        <div className="w-full max-w-md mx-auto mb-6">
          <RSVPForm
            inviteSlug={
  couple.slug ??
  `${couple.groomName.toLowerCase().replace(/\s+/g, "-")}-weds-${couple.brideName.toLowerCase().replace(/\s+/g, "-")}`
}
            coupleName={`${couple.groomName} & ${couple.brideName}`}
            accentColor="#D4AF37"
            theme="dark"
          />
        </div>

        {couple.phone && (
          <button
            onClick={handleWhatsAppRSVP}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 22px",
              background: "transparent",
              borderRadius: 40,
              border: "1px solid rgba(212,175,55,0.4)",
              color: "rgba(212,175,55,0.8)",
              fontFamily: "'Cinzel', serif",
              fontSize: 11,
              letterSpacing: "0.15em",
              cursor: "pointer",
            }}
          >
            <Phone size={13} />
            Also WhatsApp us
          </button>
        )}

        <GoldDivider />

        {/* Footer */}
        <div className="mt-8">
          <div className="flex justify-center mb-4">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle
                cx="24"
                cy="24"
                r="22"
                stroke="#D4AF37"
                strokeWidth="0.5"
                opacity="0.3"
              />
              <text
                x="24"
                y="31"
                textAnchor="middle"
                style={{
                  fontSize: 20,
                  fill: "#D4AF37",
                  opacity: 0.6,
                  fontFamily: "'Noto Serif Devanagari', serif",
                }}
              >
                ॐ
              </text>
            </svg>
          </div>
          <p
            style={{
              color: "rgba(212,175,55,0.4)",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 13,
              letterSpacing: "0.1em",
            }}
          >
            {couple.groomName} & {couple.brideName} ·{" "}
            {new Date(couple.weddingDate).getFullYear()}
          </p>
          <p
            style={{
              color: "rgba(212,175,55,0.2)",
              fontSize: 11,
              marginTop: 8,
              letterSpacing: "0.2em",
            }}
            className="uppercase"
          >
            Made with WedCraft
          </p>
        </div>
      </FadeIn>
    </section>
  );

  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Playfair+Display:wght@400;500&family=Satisfy&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Playfair+Display:wght@400;500&family=Satisfy&family=Noto+Serif+Devanagari:wght@400;600&display=swap"
        rel="stylesheet"
      />

      {/* Petal animation keyframes */}
      <style>{`
        @keyframes petalFall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 0.7; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>

      <div style={bgStyle} onContextMenu={(e) => e.preventDefault()}>
        <HeroSection />
        <BlessingSection />
        <FamilySection />
        <EventsSection />
        <VenueSection />
        <CountdownSection />
        <RsvpSection />
      </div>

      {/* Background music — Premium/Luxury feature */}
      {couple.bgMusicUrl && (
        <MusicPlayer src={couple.bgMusicUrl} dark accentColor="#D4AF37" />
      )}
    </>
  );
}