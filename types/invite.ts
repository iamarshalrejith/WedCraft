// Tier durations in months
export const TIER_EXPIRY_MONTHS: Record<string, number> = {
  Basic:    6,
  Standard: 9,
  Premium:  12,
  Luxury:   24,
};

// Max edits per tier (admin bypasses this)
export const TIER_MAX_EDITS: Record<string, number> = {
  Basic:    2,
  Standard: 2,
  Premium:  2,
  Luxury:   2,  // same for now — Luxury gets "30 days" which is handled by expiry
};

export interface CoupleDetails {
  groomName: string;
  brideName: string;
  weddingDate: string;       // ISO date string
  weddingTime: string;       // e.g. "7:00 PM"
  venue: string;
  venueAddress: string;
  mapLink: string;
  phone: string;             // for RSVP
  couplePhotoUrl?: string;
  events: WeddingEvent[];
  personalMessage?: string;
}

export interface WeddingEvent {
  name: string;    // e.g. "Mehendi"
  date: string;
  time: string;
  venue?: string;
}

export interface InviteRecord {
  id: string;
  slug: string;              // rahul-weds-priya
  templateId: string;
  templateSlug: string;
  coupleDetails: CoupleDetails;
  isPurchased: boolean;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  userId?: string | null;
  createdAt: string;
  purchasedAt?: string;
  // ── New tier fields ──────────────────────────────────────────
  purchasedTier?: string;    // "Basic" | "Standard" | "Premium" | "Luxury"
  expiresAt?: string;        // ISO date — invite URL stops working after this
  editCount?: number;        // how many times edited so far (starts at 0)
  viewCount?: number;
  lastViewedAt?: string;
}