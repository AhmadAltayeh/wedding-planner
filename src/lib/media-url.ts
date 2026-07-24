/** Always serve through the app so private Vercel Blob + login cookie work. */
export function mediaSrc(media: { id: string; blobUrl?: string | null }): string {
  return `/api/media/${media.id}`;
}

export function isImageMime(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}
