import { PageHeader } from "@/components/ui";
import { VenueForm } from "@/components/venue-form";

export default function NewVenuePage() {
  return (
    <div>
      <PageHeader title="Add venue" subtitle="Hotel, hall, or outdoor space in Amman" />
      <VenueForm />
    </div>
  );
}
