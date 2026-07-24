import { getSettings } from "@/lib/actions/settings";
import { PageHeader } from "@/components/ui";
import { VenueCreateFlow } from "@/components/venue-create-flow";

export default async function NewVenuePage() {
  const settings = await getSettings();
  return (
    <div>
      <PageHeader title="Add venue" subtitle="Hotel, hall, or outdoor space in Amman" />
      <VenueCreateFlow guestEstimate={settings.guestEstimate} />
    </div>
  );
}
