import { notFound } from "next/navigation";
import { getVenue } from "@/lib/actions/venues";
import { PageHeader } from "@/components/ui";
import { VenueForm } from "@/components/venue-form";

export default async function EditVenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const venue = await getVenue(id);
  if (!venue) notFound();

  return (
    <div>
      <PageHeader title="Edit venue" subtitle={venue.name} />
      <VenueForm venue={venue} />
    </div>
  );
}
