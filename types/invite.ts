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
  // Optional events
  events: WeddingEvent[];
  // Optional message
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
  createdAt: string;
  purchasedAt?: string;
}