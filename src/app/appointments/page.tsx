import { listAppointments } from "@/lib/actions/appointments";
import { listVenues } from "@/lib/actions/venues";
import { listPlanners } from "@/lib/actions/planners";
import { listVendors } from "@/lib/actions/vendors";
import { PageHeader } from "@/components/ui";
import { AppointmentsClient } from "@/components/appointments-client";
import { InstallAppHint } from "@/components/install-app-hint";

export default async function AppointmentsPage() {
  const [appointments, venues, planners, vendors] = await Promise.all([
    listAppointments(),
    listVenues(),
    listPlanners(),
    listVendors(),
  ]);

  return (
    <div>
      <PageHeader
        title="Appointments"
        subtitle="Venue visits, planner calls & meetings — sync alerts via Calendar"
      />
      <InstallAppHint className="mb-4" />
      <AppointmentsClient
        appointments={appointments}
        venues={venues.map((v) => ({ id: v.id, name: v.name }))}
        planners={planners.map((p) => ({ id: p.id, name: p.name }))}
        vendors={vendors.map((v) => ({ id: v.id, name: v.name }))}
      />
    </div>
  );
}
