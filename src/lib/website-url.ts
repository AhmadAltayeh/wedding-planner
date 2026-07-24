export function websiteUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function websiteDisplayLabel(value: string): string {
  const trimmed = value.trim();
  try {
    const url = new URL(websiteUrl(trimmed));
    return url.hostname.replace(/^www\./, "");
  } catch {
    return trimmed;
  }
}
