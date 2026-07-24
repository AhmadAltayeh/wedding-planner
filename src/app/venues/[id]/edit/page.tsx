import { notFound } from "next/navigation";
import { getVenue } from "@/lib/actions/venues";
import { getSettings } from "@/lib/actions/settings";
import { PageHeader } from "@/components/ui";
import { VenueForm } from "@/components/venue-form";
import { VenueMediaSection } from "@/components/venue-media";

export default async function EditVenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const venue = await getVenue(id);
  if (!venue) notFound();
  const settings = await getSettings();

  return (
    <div>
      <PageHeader title="Edit venue" subtitle={venue.name} />
      <VenueMediaSection venueId={venue.id} media={venue.media} />
      <VenueForm venue={venue} guestEstimate={settings.guestEstimate} />
    </div>
  );
}
