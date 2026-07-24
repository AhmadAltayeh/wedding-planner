import type { VenueMedia } from "@prisma/client";
import { isImageMime } from "@/lib/media-url";

/** Only venue visit photos — never catering menu uploads. */
export function venueGalleryPhotos(media: VenueMedia[]): VenueMedia[] {
  return media.filter((m) => {
    if (m.kind === "menu") return false;
    if (m.kind === "photo") return true;
    return isImageMime(m.mimeType);
  });
}
