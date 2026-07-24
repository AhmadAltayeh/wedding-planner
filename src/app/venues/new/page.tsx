import { PageHeader } from "@/components/ui";
import { VenueCreateFlow } from "@/components/venue-create-flow";

export default function NewVenuePage() {
  return (
    <div>
      <PageHeader title="Add venue" subtitle="Hotel, hall, or outdoor space in Amman" />
      <VenueCreateFlow />
    </div>
  );
}
