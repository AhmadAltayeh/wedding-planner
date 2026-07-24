/** Build a Google Maps URL for an address, place name, or existing maps link. */
export function googleMapsUrl(location: string): string {
  const trimmed = location.trim();
  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed)) {
    if (/google\.com\/maps|maps\.google|goo\.gl\/maps|maps\.app\.goo\.gl/i.test(trimmed)) {
      return trimmed;
    }
    return trimmed;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
}

export function locationDisplayLabel(location: string): string {
  const trimmed = location.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const host = new URL(trimmed).hostname.replace(/^www\./, "");
      return host.includes("google") ? "Google Maps link" : host;
    } catch {
      return "Map link";
    }
  }
  return trimmed;
}
