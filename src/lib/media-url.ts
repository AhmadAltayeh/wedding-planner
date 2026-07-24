/**
 * Always serve via the app media route so old + new uploads work the same:
 * - Vercel Blob (blobUrl in DB)
 * - Legacy local files (storagePath, dev Mac)
 */
export function mediaSrc(media: { id: string; blobUrl?: string | null }): string {
  return `/api/media/${media.id}`;
}

export function isImageMime(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}
