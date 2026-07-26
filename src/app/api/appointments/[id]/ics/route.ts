import { getAppointment } from "@/lib/actions/appointments";
import { buildIcsEvent } from "@/lib/ics";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const appt = await getAppointment(id);
  if (!appt) {
    return new Response("Not found", { status: 404 });
  }

  const host = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://wedding-planner.local";

  const body = buildIcsEvent({
    uid: `${appt.id}@${host}`,
    title: appt.title,
    startsAt: appt.startsAt,
    endsAt: appt.endsAt,
    location: appt.location,
    description: appt.notes,
    remindMins: appt.remindMins,
  });

  const filename = appt.title.replace(/[^\w\s-]/g, "").trim().slice(0, 40) || "appointment";

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}.ics"`,
      "Cache-Control": "no-store",
    },
  });
}
