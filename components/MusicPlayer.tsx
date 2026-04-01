"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface MusicPlayerProps {
  src: string;           // URL to the audio file
  autoPlay?: boolean;    // default true
  accentColor?: string;  // button color to match template
  dark?: boolean;        // light or dark button style
}

/**
 * Floating music toggle button.
 * Renders in the bottom-left corner of the invite page.
 * Uses HTML5 <audio> — completely free, no third-party service.
 *
 * USAGE inside a template:
 *   {couple.bgMusicUrl && (
 *     <MusicPlayer src={couple.bgMusicUrl} dark accentColor="#D4AF37" />
 *   )}
 */
export default function MusicPlayer({
  src,
  autoPlay = true,
  accentColor = "#000000",
  dark = false,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    audio.addEventListener("canplaythrough", () => setReady(true));
    audio.addEventListener("error", () => setReady(false));

    // Browsers block autoplay until a user gesture — we attempt it and
    // catch the rejection silently. User can toggle manually.
    if (autoPlay) {
      audio.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [src, autoPlay]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  if (!ready && !playing) return null;

  const bg = dark
    ? "rgba(0,0,0,0.55)"
    : "rgba(255,255,255,0.85)";
  const border = dark
    ? "1px solid rgba(255,255,255,0.15)"
    : "1px solid rgba(0,0,0,0.08)";
  const iconColor = dark ? accentColor : accentColor;

  return (
    <button
      onClick={toggle}
      aria-label={playing ? "Mute background music" : "Play background music"}
      style={{
        position: "fixed",
        bottom: 24,
        left: 20,
        zIndex: 200,
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: bg,
        border,
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        transition: "transform 0.15s",
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
    >
      {playing
        ? <Volume2 size={16} color={iconColor} />
        : <VolumeX size={16} color={iconColor} />
      }

      {/* Animated ring when playing */}
      {playing && (
        <span style={{
          position: "absolute",
          inset: -3,
          borderRadius: "50%",
          border: `1.5px solid ${accentColor}`,
          opacity: 0.4,
          animation: "musicPulse 2s ease-in-out infinite",
        }} />
      )}

      <style>{`
        @keyframes musicPulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.18); opacity: 0.1; }
        }
      `}</style>
    </button>
  );
}