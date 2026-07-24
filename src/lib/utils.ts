import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatJod(amount: number | null | undefined): string {
  if (amount == null || Number.isNaN(amount)) return "—";
  return `${amount.toLocaleString("en-JO", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} JOD`;
}

export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
