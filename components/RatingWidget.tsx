"use client";

import { useEffect, useState } from "react";
import { Star, Loader2, Check, MessageSquare } from "lucide-react";

// ── Display-only star row ─────────────────────────────────────────────────────
export function StarDisplay({
  rating,
  count,
  size = 13,
}: {
  rating: number;
  count?: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={
            s <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
      {count !== undefined && (
        <span className="text-xs text-gray-500 ml-0.5">
          {rating > 0 ? rating.toFixed(1) : "—"}{" "}
          <span className="text-gray-400">({count})</span>
        </span>
      )}
    </div>
  );
}

// ── Interactive rating widget — shown in dashboard after purchase ─────────────
interface RatingWidgetProps {
  templateSlug: string;
  templateName: string;
}

export function RatingWidget({ templateSlug, templateName }: RatingWidgetProps) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [existingRating, setExistingRating] = useState<number | null>(null);
  const [checkingExisting, setCheckingExisting] = useState(true);

  // Check if user already reviewed this template
  useEffect(() => {
    fetch(`/api/review?slug=${templateSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.userReview) {
          setExistingRating(data.userReview.rating);
          setSelected(data.userReview.rating);
          setComment(data.userReview.comment ?? "");
          setSubmitted(true);
        }
      })
      .catch(() => {})
      .finally(() => setCheckingExisting(false));
  }, [templateSlug]);

  const handleSubmit = async () => {
    if (!selected) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateSlug, rating: selected, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSubmitted(true);
      setExistingRating(selected);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  const labels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];
  const displayStar = hovered || selected;

  if (checkingExisting) return null;

  return (
    <div className="border-t border-gray-100 pt-4 mt-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Rate this template
      </p>

      {submitted ? (
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Check size={13} className="text-emerald-600" />
          </div>
          <div>
            <StarDisplay rating={selected} size={14} />
            <p className="text-xs text-gray-400 mt-0.5">
              {existingRating !== null
                ? "Your review is live. You can update it anytime."
                : "Thanks for rating!"}
            </p>
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="ml-auto text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Star selector */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => {
                  setSelected(s);
                  setShowComment(true);
                }}
                className="p-0.5 transition-transform hover:scale-110"
              >
                <Star
                  size={22}
                  className={
                    s <= displayStar
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200"
                  }
                />
              </button>
            ))}
            {displayStar > 0 && (
              <span className="text-xs font-medium text-gray-500 ml-2">
                {labels[displayStar]}
              </span>
            )}
          </div>

          {/* Optional comment */}
          {showComment && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowComment(!showComment)}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700"
              >
                <MessageSquare size={12} />
                {comment ? "Edit your comment" : "Add a comment (optional)"}
              </button>
              <textarea
                rows={2}
                placeholder="What did you love about this template?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-black/10 placeholder:text-gray-400"
              />
            </div>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}

          {selected > 0 && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-black text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Check size={12} />
              )}
              {loading ? "Submitting..." : existingRating ? "Update review" : "Submit review"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Public review list — shown on template preview page ───────────────────────
export function ReviewList({ templateSlug }: { templateSlug: string }) {
  const [data, setData] = useState<{
    reviews: Array<{ id: string; userName: string; rating: number; comment: string; createdAt: string }>;
    count: number;
    average: number;
  } | null>(null);

  useEffect(() => {
    fetch(`/api/review?slug=${templateSlug}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, [templateSlug]);

  if (!data || data.count === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center gap-3 mb-4">
        <StarDisplay rating={data.average} count={data.count} size={16} />
      </div>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {data.reviews.slice(0, 5).map((r) => (
          <div key={r.id} className="bg-gray-50 rounded-xl px-3 py-2.5">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                  {r.userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-gray-700">{r.userName}</span>
              </div>
              <StarDisplay rating={r.rating} size={11} />
            </div>
            {r.comment && (
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{r.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}