/**
 * Generates a URL-safe slug from couple names.
 * e.g. "Rahul" + "Priya" → "rahul-weds-priya"
 */
export function generateInviteSlug(groomName: string, brideName: string): string {
  const clean = (name: string) =>
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");

  const groom = clean(groomName) || "groom";
  const bride = clean(brideName) || "bride";
  return `${groom}-weds-${bride}`;
}

/**
 * Formats a price in INR
 */
export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

/**
 * Formats a date string nicely
 * "2026-12-12" → "12th December 2026"
 */
export function formatWeddingDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  const month = date.toLocaleString("en-IN", { month: "long" });
  const year = date.getFullYear();
  return `${day}${suffix} ${month} ${year}`;
}

/**
 * Days until a date
 */
export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}