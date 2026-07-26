"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Appointment, Planner, Vendor, Venue } from "@prisma/client";
import { createAppointment, deleteAppointment } from "@/lib/actions/appointments";
import { APPOINTMENT_REMIND_OPTIONS } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import { Button, Card, Field, Input, Select, Textarea } from "@/components/ui";
import { CalendarPlus, Trash2, Bell } from "lucide-react";

type Props = {
  appointments: Appointment[];
  venues: Pick<Venue, "id" | "name">[];
  planners: Pick<Planner, "id" | "name">[];
  vendors: Pick<Vendor, "id" | "name">[];
};

export function AppointmentsClient({ appointments, venues, planners, vendors }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [remindMins, setRemindMins] = useState("60");
  const [linkType, setLinkType] = useState<"none" | "venue" | "planner" | "vendor">("none");
  const [linkId, setLinkId] = useState("");

  const now = new Date();
  const upcoming = appointments.filter((a) => new Date(a.startsAt) >= now);
  const past = appointments.filter((a) => new Date(a.startsAt) < now).reverse();

  function resetForm() {
    setTitle("");
    setStartsAt("");
    setEndsAt("");
    setLocation("");
    setNotes("");
    setRemindMins("60");
    setLinkType("none");
    setLinkId("");
  }

  return (
    <div>
      <Card className="mb-4 border-gold-soft/60 bg-blush/20">
        <p className="text-sm text-ink-muted">
          <Bell className="mr-1.5 inline h-4 w-4 text-gold" />
          iPhone doesn&apos;t let websites create <strong>Reminders</strong> directly. Tap{" "}
          <strong>Add to Calendar</strong> on each meeting — Apple Calendar will notify you like a reminder.
        </p>
      </Card>

      <Card className="mb-6">
        <h2 className="mb-3 font-serif text-lg font-semibold text-ink">New appointment</h2>
        <Field label="Title">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Venue walk-through with family"
          />
        </Field>
        <Field label="Starts">
          <Input
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
          />
        </Field>
        <Field label="Ends (optional)">
          <Input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
        </Field>
        <Field label="Location">
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Hotel lobby, Amman"
          />
        </Field>
        <Field label="Link to">
          <Select
            value={linkType}
            onChange={(e) => {
              setLinkType(e.target.value as typeof linkType);
              setLinkId("");
            }}
          >
            <option value="none">None</option>
            <option value="venue">Venue</option>
            <option value="planner">Planner</option>
            <option value="vendor">Vendor</option>
          </Select>
        </Field>
        {linkType === "venue" && (
          <Field label="Venue">
            <Select value={linkId} onChange={(e) => setLinkId(e.target.value)}>
              <option value="">Select…</option>
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </Select>
          </Field>
        )}
        {linkType === "planner" && (
          <Field label="Planner">
            <Select value={linkId} onChange={(e) => setLinkId(e.target.value)}>
              <option value="">Select…</option>
              {planners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>
        )}
        {linkType === "vendor" && (
          <Field label="Vendor">
            <Select value={linkId} onChange={(e) => setLinkId(e.target.value)}>
              <option value="">Select…</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </Select>
          </Field>
        )}
        <Field label="Calendar alert">
          <Select value={remindMins} onChange={(e) => setRemindMins(e.target.value)}>
            {APPOINTMENT_REMIND_OPTIONS.map((o) => (
              <option key={o.value} value={String(o.value)}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Notes">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
        </Field>
        <Button
          className="mt-2 w-full"
          disabled={!title.trim() || !startsAt || pending}
          onClick={() =>
            startTransition(async () => {
              await createAppointment({
                title,
                startsAt,
                endsAt: endsAt || null,
                location,
                notes,
                remindMins: Number(remindMins),
                venueId: linkType === "venue" ? linkId || null : null,
                plannerId: linkType === "planner" ? linkId || null : null,
                vendorId: linkType === "vendor" ? linkId || null : null,
              });
              resetForm();
              router.refresh();
            })
          }
        >
          Save appointment
        </Button>
      </Card>

      <AppointmentList title="Upcoming" items={upcoming} empty="No upcoming meetings." />
      {past.length > 0 && (
        <AppointmentList title="Past" items={past} empty="" className="mt-6 opacity-80" />
      )}
    </div>
  );
}

function AppointmentList({
  title,
  items,
  empty,
  className,
}: {
  title: string;
  items: Appointment[];
  empty: string;
  className?: string;
}) {
  if (items.length === 0 && !empty) return null;

  return (
    <section className={className}>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-muted">
        {title} ({items.length})
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-ink-muted">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((a) => (
            <AppointmentRow key={a.id} appointment={a} />
          ))}
        </ul>
      )}
    </section>
  );
}

function AppointmentRow({ appointment: a }: { appointment: Appointment }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  return (
    <li>
      <Card className="py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-ink">{a.title}</p>
            <p className="mt-0.5 text-sm text-ink-muted">{formatDateTime(a.startsAt)}</p>
            {a.location && <p className="text-sm text-ink-muted">{a.location}</p>}
            {a.notes && <p className="mt-1 text-xs text-ink-muted">{a.notes}</p>}
          </div>
          <button
            type="button"
            className="shrink-0 text-sage"
            aria-label="Delete"
            onClick={() =>
              startTransition(async () => {
                await deleteAppointment(a.id);
                router.refresh();
              })
            }
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <a
          href={`/api/appointments/${a.id}/ics`}
          className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-gold/50 bg-blush/30 text-sm font-semibold text-sage-dark active:bg-blush/50"
        >
          <CalendarPlus className="h-4 w-4" />
          Add to iPhone Calendar
        </a>
      </Card>
    </li>
  );
}
