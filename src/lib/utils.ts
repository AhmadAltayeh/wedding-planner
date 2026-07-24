import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatJod(amount: number | null | undefined): string {
  if (amount == null || Number.isNaN(amount)) return "—";
  return `${amount.toLocaleString("en-JO", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} JOD`;
}

function toCalendarDate(d: Date | string): Date {
  if (typeof d === "string") {
    const iso = d.slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
      const [y, m, day] = iso.split("-").map(Number);
      return new Date(y, m - 1, day);
    }
    return new Date(d);
  }
  return d;
}

export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = toCalendarDate(d);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** e.g. "Friday, 12 Jul 2026" */
export function formatDateWithDay(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = toCalendarDate(d);
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Compact list: "Fri, 12 Jul 2026" */
export function formatDateWithShortDay(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = toCalendarDate(d);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
