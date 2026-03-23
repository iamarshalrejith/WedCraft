"use client";

import { useState } from "react";
import {
  Check,
  Loader2,
  Users,
  MessageSquare,
  Phone,
  User,
  PartyPopper,
  HelpCircle,
  XCircle,
} from "lucide-react";

interface RSVPFormProps {
  inviteSlug: string;
  coupleName: string;
  accentColor?: string; // hex, e.g. "#D4AF37"
  theme?: "dark" | "light"; // for template theming
}

type Attending = "yes" | "no" | "maybe";

export default function RSVPForm({
  inviteSlug,
  coupleName,
  accentColor = "#D4AF37",
  theme = "dark",
}: RSVPFormProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [attending, setAttending] = useState<Attending | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState("");

  const isDark = theme === "dark";
  const bg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const border = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)";
  const textPrimary = isDark ? "#fff" : "#1a1a1a";
  const textSecondary = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)";
  const inputBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.9)";
  const inputBorder = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)";

  const handleSubmit = async () => {
    if (!guestName.trim() || !attending) {
      setError("Please enter your name and attendance status.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inviteSlug,
          guestName: guestName.trim(),
          guestPhone: guestPhone.trim() || undefined,
          attending,
          guestCount,
          message: message.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setStep("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const AttendBtn = ({
    val,
    label,
    Icon,
  }: {
    val: Attending;
    label: string;
    Icon: React.ElementType;
  }) => {
    const active = attending === val;

    return (
      <button
        type="button"
        onClick={() => setAttending(val)}
        style={{
          flex: 1,
          padding: "10px 8px",
          borderRadius: 12,
          border: active ? `2px solid ${accentColor}` : `1px solid ${border}`,
          background: active ? `${accentColor}22` : bg,
          color: active ? accentColor : textSecondary,
          fontFamily: "sans-serif",
          fontSize: 13,
          fontWeight: active ? 600 : 400,
          cursor: "pointer",
          transition: "all 0.2s",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Icon size={18} />
        <span>{label}</span>
      </button>
    );
  };
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: `1px solid ${inputBorder}`,
    background: inputBg,
    color: textPrimary,
    fontSize: 14,
    fontFamily: "sans-serif",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: textSecondary,
    marginBottom: 6,
    fontFamily: "sans-serif",
  };

  if (step === "success") {
    return (
      <div
        style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: 20,
          padding: "40px 28px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: `${accentColor}22`,
            border: `2px solid ${accentColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <Check size={28} color={accentColor} />
        </div>
        <h3
          style={{
            color: textPrimary,
            fontFamily: "sans-serif",
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          RSVP Received! 🎉
        </h3>
        <p
          style={{
            color: textSecondary,
            fontFamily: "sans-serif",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          Thank you, <strong style={{ color: textPrimary }}>{guestName}</strong>
          .
          {attending === "yes"
            ? ` ${coupleName} can't wait to celebrate with you!`
            : attending === "maybe"
              ? " They hope to see you there!"
              : " They appreciate you letting them know."}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 20,
        padding: "28px 24px",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <h3
          style={{
            color: textPrimary,
            fontFamily: "sans-serif",
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          Will you be joining us?
        </h3>
        <p
          style={{
            color: textSecondary,
            fontFamily: "sans-serif",
            fontSize: 13,
          }}
        >
          Let {coupleName} know you&apos;re coming
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Attendance */}
        <div>
          <label style={labelStyle}>Attendance *</label>
          <div style={{ display: "flex", gap: 8 }}>
            <AttendBtn val="yes" label="Attending" Icon={PartyPopper} />
            <AttendBtn val="maybe" label="Maybe" Icon={HelpCircle} />
            <AttendBtn val="no" label="Can't make it" Icon={XCircle} />
          </div>
        </div>

        {/* Name */}
        <div>
          <label style={labelStyle}>
            <User size={11} style={{ display: "inline", marginRight: 4 }} />
            Your Name *
          </label>
          <input
            type="text"
            placeholder="e.g. Ramesh Kumar"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Show extra fields only if attending or maybe */}
        {attending && attending !== "no" && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <label style={labelStyle}>
                  <Phone
                    size={11}
                    style={{ display: "inline", marginRight: 4 }}
                  />
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  <Users
                    size={11}
                    style={{ display: "inline", marginRight: 4 }}
                  />
                  No. of Guests
                </label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "person" : "people"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>
                <MessageSquare
                  size={11}
                  style={{ display: "inline", marginRight: 4 }}
                />
                Message to couple (optional)
              </label>
              <textarea
                placeholder="Share your wishes or let them know anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                style={{
                  ...inputStyle,
                  resize: "none" as const,
                  lineHeight: 1.6,
                }}
              />
            </div>
          </>
        )}

        {error && (
          <p
            style={{
              color: "#ef4444",
              fontSize: 13,
              fontFamily: "sans-serif",
              margin: 0,
            }}
          >
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !guestName.trim() || !attending}
          style={{
            padding: "14px 24px",
            borderRadius: 40,
            border: "none",
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
            color: isDark ? "#1a0a00" : "#fff",
            fontFamily: "sans-serif",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.08em",
            cursor: "pointer",
            opacity: !guestName.trim() || !attending ? 0.5 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Check size={16} />
          )}
          {loading ? "Submitting..." : "Confirm RSVP"}
        </button>
      </div>
    </div>
  );
}
