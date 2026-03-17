export interface RSVPResponse {
  id: string;
  inviteSlug: string;         // which invite they responded to
  guestName: string;
  guestPhone?: string;
  attending: "yes" | "no" | "maybe";
  guestCount: number;         // how many people coming
  message?: string;           // optional note to couple
  respondedAt: string;        // ISO timestamp
}