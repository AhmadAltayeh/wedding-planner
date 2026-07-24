"use client";

import Link from "next/link";
import { useState } from "react";
import type { Venue } from "@prisma/client";
import { VenueForm } from "@/components/venue-form";
import { VenueMediaSection } from "@/components/venue-media";
import { Button } from "@/components/ui";

export function VenueCreateFlow() {
  const [venue, setVenue] = useState<Venue | null>(null);

  return (
    <>
      <VenueMediaSection venueId={venue?.id} media={[]} locked={!venue} />
      <VenueForm
        venue={venue ?? undefined}
        onCreated={(v) => setVenue(v)}
        submitLabel={venue ? "Save changes" : "Save venue & unlock uploads"}
      />
      {venue && (
        <Link href={`/venues/${venue.id}`} className="mt-4 block">
          <Button variant="secondary" className="w-full">
            Done — view venue
          </Button>
        </Link>
      )}
    </>
  );
}
