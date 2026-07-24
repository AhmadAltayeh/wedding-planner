import type { VenueMedia } from "@prisma/client";
import { isImageMime } from "@/lib/media-url";

/** Venue photos for the gallery, including older rows with odd `kind` values. */
export function venueGalleryPhotos(media: VenueMedia[]): VenueMedia[] {
  const asPhoto = media.filter((m) => {
    if (m.kind === "menu") return false;
    if (m.kind === "photo") return true;
    return isImageMime(m.mimeType);
  });
  if (asPhoto.length > 0) return asPhoto;

  // Older visits sometimes saved visit pictures as menu image uploads.
  return media.filter((m) => m.kind === "menu" && isImageMime(m.mimeType));
}
