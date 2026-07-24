export function instagramUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const handle = trimmed.replace(/^@/, "").replace(/\s/g, "");
  return `https://www.instagram.com/${encodeURIComponent(handle)}/`;
}

export function instagramDisplayLabel(value: string): string {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const path = new URL(trimmed).pathname.replace(/\/$/, "");
      const parts = path.split("/").filter(Boolean);
      if (parts[0] && parts[0] !== "p" && parts[0] !== "reel") {
        return `@${parts[0]}`;
      }
      return "Instagram";
    } catch {
      return "Instagram";
    }
  }
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}
