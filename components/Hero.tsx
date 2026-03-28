"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const Hero = () => {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  // Spotlight effect
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!spotlightRef.current) return;
      spotlightRef.current.style.background = `
        radial-gradient(
          600px at ${e.clientX}px ${e.clientY}px,
          rgba(0,0,0,0.08),
          transparent 80%
        )
      `;
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // Trigger animation
  useEffect(() => {
    setVisible(true);
  }, []);

  return (
<section className="relative w-full min-h-[75vh] sm:min-h-[85vh] flex items-center justify-center pt-20 sm:pt-24 pb-6  text-black overflow-hidden">      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 transition duration-200"
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl px-6 text-center">
        {/* Heading */}
        <h1
          className={`text-[36px]  sm:text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1] transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Your Wedding Invite.
          <br />
          <span className="text-neutral-600 block">Made Interactive.</span>
        </h1>

        {/* Subtext */}
       <p
  className={`mt-6 sm:mt-8 px-15 sm:px-4 text-xs sm:text-lg text-neutral-700 max-w-md mx-auto transition-all duration-700 delay-150 ${
    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
  }`}
>
  Not a card. Not a PDF. An interactive experience your guests will
  remember.
</p>

        {/* CTA */}
        <div
          className={`mt-10 flex flex-col items-center gap-3 transition-all duration-700 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <MagneticButton
            text="Open a Sample Invite"
            primary
            onClick={() => router.push("/preview/celestial-dream")}
          />

          <p className="text-sm text-neutral-500">
            Experience it like your guests will
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;

/* ---------------- BUTTON ---------------- */

const MagneticButton = ({
  text,
  primary = false,
  onClick,
}: {
  text: string;
  primary?: boolean;
  onClick?: () => void;
}) => {
  const ref = useRef<HTMLButtonElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    ref.current.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };

  const handleLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      className={`px-5 py-2.5 sm:px-8 sm:py-4 text-sm sm:text-base rounded-full transition-transform duration-200 ${
        primary
          ? "bg-black text-white hover:scale-[1.03] active:scale-[0.97]"
          : "border border-black hover:bg-black hover:text-white"
      }`}
    >
      {text}
    </button>
  );
};
