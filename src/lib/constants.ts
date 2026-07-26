export const VENUE_TYPES = [
  { value: "hotel", label: "Hotel" },
  { value: "hall", label: "Wedding hall" },
  { value: "outdoor", label: "Outdoor / garden" },
  { value: "restaurant", label: "Restaurant" },
  { value: "villa", label: "Villa / private" },
] as const;

export const SERVICE_STYLES = [
  { value: "buffet", label: "Buffet" },
  { value: "seated", label: "Seated / plated" },
  { value: "both", label: "Both options" },
] as const;

export const STATUS_OPTIONS = [
  { value: "considering", label: "Considering", color: "bg-slate-100 text-slate-700" },
  { value: "contacted", label: "Contacted", color: "bg-blue-100 text-blue-800" },
  { value: "visited", label: "Visited", color: "bg-amber-100 text-amber-900" },
  { value: "shortlisted", label: "Shortlisted", color: "bg-violet-100 text-violet-800" },
  { value: "booked", label: "Booked", color: "bg-emerald-100 text-emerald-800" },
  { value: "rejected", label: "Rejected", color: "bg-blush text-sage-dark" },
] as const;

export const ADDON_CATEGORIES = [
  { value: "food", label: "Food / menu" },
  { value: "dj", label: "DJ / music" },
  { value: "lights", label: "Lighting" },
  { value: "tables", label: "Tables" },
  { value: "chairs", label: "Chairs" },
  { value: "decor", label: "Decor" },
  { value: "zaffe", label: "Zaffe / dabke" },
  { value: "other", label: "Other" },
] as const;

export const VENDOR_CATEGORIES = [
  { value: "photography", label: "Photography" },
  { value: "videography", label: "Videography" },
  { value: "florist", label: "Florist" },
  { value: "cake", label: "Cake / sweets" },
  { value: "makeup", label: "Makeup / hair" },
  { value: "dress", label: "Bridal dress" },
  { value: "suit", label: "Groom suit" },
  { value: "invitations", label: "Invitations" },
  { value: "catering", label: "External catering" },
  { value: "transport", label: "Cars / transport" },
  { value: "henna", label: "Henna night" },
  { value: "other", label: "Other" },
] as const;

export const PLANNER_LEVELS = [
  { value: "full", label: "Full planning" },
  { value: "partial", label: "Partial / month-of" },
  { value: "day_of", label: "Day-of coordination" },
  { value: "consultation", label: "Consultation only" },
] as const;

export const TASK_CATEGORIES = [
  { value: "venue", label: "Venue" },
  { value: "legal", label: "Legal / court" },
  { value: "guests", label: "Guests" },
  { value: "vendors", label: "Vendors" },
  { value: "attire", label: "Attire" },
  { value: "general", label: "General" },
] as const;

export const APPOINTMENT_REMIND_OPTIONS = [
  { value: 0, label: "At meeting time" },
  { value: 15, label: "15 min before" },
  { value: 60, label: "1 hour before" },
  { value: 1440, label: "1 day before" },
] as const;

export function statusLabel(value: string): string {
  return STATUS_OPTIONS.find((s) => s.value === value)?.label ?? value;
}

export function statusColor(value: string): string {
  return STATUS_OPTIONS.find((s) => s.value === value)?.color ?? "bg-slate-100 text-slate-700";
}
