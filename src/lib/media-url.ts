export function mediaSrc(media: { id: string; blobUrl: string | null }): string {
  return media.blobUrl ?? `/api/media/${media.id}`;
}

export function isImageMime(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}
