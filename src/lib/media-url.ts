/** Public blobs: direct CDN URL. Local uploads: proxied via API + login. */
export function mediaSrc(media: { id: string; blobUrl: string | null }): string {
  return media.blobUrl ?? `/api/media/${media.id}`;
}

export function isImageMime(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}
