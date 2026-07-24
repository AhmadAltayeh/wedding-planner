"use client";

import { formatJod } from "@/lib/utils";
import { venueEstimateBreakdown } from "@/lib/venue-math";
import type { VenueEstimateInput } from "@/lib/venue-math";

export function VenueEstimatePreview({
  venue,
  guestEstimate,
}: {
  venue: VenueEstimateInput;
  guestEstimate: number;
}) {
  const b = venueEstimateBreakdown(venue, guestEstimate);
  if (b.totalJod == null) return null;

  return (
    <div className="rounded-xl border border-gold-soft/60 bg-blush/30 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wider text-gold">Estimated total</p>
      <p className="mt-1 font-serif text-2xl font-bold text-sage-dark">{formatJod(b.totalJod)}</p>
      <p className="text-xs text-ink-muted">For {b.guests} guests (from Settings)</p>
      <ul className="mt-3 space-y-1 border-t border-gold-soft/40 pt-3 text-sm text-ink-muted">
        {venue.pricePerPerson != null && (
          <li className="flex justify-between gap-2">
            <span>
              Catering ({formatJod(venue.pricePerPerson)} × {b.guests})
            </span>
            <span className="font-medium text-ink">{formatJod(b.cateringJod)}</span>
          </li>
        )}
        {b.hallJod > 0 && (
          <li className="flex justify-between gap-2">
            <span>Hall rental</span>
            <span className="font-medium text-ink">{formatJod(b.hallJod)}</span>
          </li>
        )}
        {b.djJod > 0 && (
          <li className="flex justify-between gap-2">
            <span>
              DJ
              {venue.includesDj ? " (in package)" : ""}
            </span>
            <span className="font-medium text-ink">{formatJod(b.djJod)}</span>
          </li>
        )}
        {b.lightsJod > 0 && (
          <li className="flex justify-between gap-2">
            <span>
              Lights
              {venue.includesLights ? " (in package)" : ""}
            </span>
            <span className="font-medium text-ink">{formatJod(b.lightsJod)}</span>
          </li>
        )}
        {b.addonsJod > 0 && (
          <li className="flex justify-between gap-2">
            <span>Add-ons</span>
            <span className="font-medium text-ink">{formatJod(b.addonsJod)}</span>
          </li>
        )}
      </ul>
    </div>
  );
}
