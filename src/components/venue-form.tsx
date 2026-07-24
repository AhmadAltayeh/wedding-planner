"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Venue } from "@prisma/client";
import type { VenueAddon, VenueDate } from "@prisma/client";
import {
  createVenue,
  updateVenue,
  type VenueInput,
} from "@/lib/actions/venues";
import { Button, Field, Input, Select, Textarea } from "@/components/ui";
import {
  VENUE_TYPES,
  SERVICE_STYLES,
  STATUS_OPTIONS,
} from "@/lib/constants";

type VenueWithRelations = Venue & { availableDates: VenueDate[]; addons: VenueAddon[] };

function boolField(
  key: keyof VenueInput,
  label: string,
  form: VenueInput,
  setForm: (f: VenueInput) => void
) {
  return (
    <label className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3">
      <input
        type="checkbox"
        checked={!!form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
        className="h-5 w-5 rounded border-gold-soft text-sage"
      />
      <span className="text-sm font-medium text-slate-800">{label}</span>
    </label>
  );
}

const empty: VenueInput = {
  name: "",
  location: "",
  venueType: "hotel",
  serviceStyle: "both",
  status: "considering",
  includesFood: false,
  includesDj: false,
  includesLights: false,
  includesTables: false,
  includesChairs: false,
  includesParking: false,
  includesZaffe: false,
  includesDecor: false,
};

function venueToInput(v: Venue): VenueInput {
  return {
    name: v.name,
    location: v.location ?? undefined,
    venueType: v.venueType,
    contactPhone: v.contactPhone ?? undefined,
    contactInstagram: v.contactInstagram ?? undefined,
    website: v.website ?? undefined,
    pricePerPerson: v.pricePerPerson,
    minGuests: v.minGuests,
    maxGuests: v.maxGuests,
    serviceStyle: v.serviceStyle,
    includesFood: v.includesFood,
    includesDj: v.includesDj,
    includesLights: v.includesLights,
    includesTables: v.includesTables,
    includesChairs: v.includesChairs,
    includesParking: v.includesParking,
    includesZaffe: v.includesZaffe,
    includesDecor: v.includesDecor,
    djPriceJod: v.djPriceJod,
    lightsPriceJod: v.lightsPriceJod,
    hallRentalJod: v.hallRentalJod,
    notes: v.notes ?? undefined,
    status: v.status,
    rating: v.rating,
    visitedAt: v.visitedAt ? v.visitedAt.toISOString().slice(0, 10) : null,
  };
}

export function VenueForm({
  venue,
  onCreated,
  submitLabel,
  submitAnchorId,
}: {
  venue?: VenueWithRelations | Venue;
  onCreated?: (venue: Venue) => void;
  submitLabel?: string;
  submitAnchorId?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<VenueInput>(venue ? venueToInput(venue) : empty);

  const num = (v: string) => (v === "" ? null : Number(v));

  function submit() {
    if (!form.name.trim()) return;
    startTransition(async () => {
      if (venue) {
        const updated = await updateVenue(venue.id, form);
        if (onCreated) {
          onCreated(updated);
        } else {
          router.push(`/venues/${venue.id}`);
        }
      } else {
        const created = await createVenue(form);
        if (onCreated) {
          onCreated(created);
        } else {
          router.push(`/venues/${created.id}`);
        }
      }
      router.refresh();
    });
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <Field label="Venue / hotel name *">
        <Input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Landmark Amman"
        />
      </Field>

      <Field label="Location">
        <Input
          value={form.location ?? ""}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder="Neighborhood, address, or Google Maps link"
        />
      </Field>

      <Field label="Type">
        <Select
          value={form.venueType}
          onChange={(e) => setForm({ ...form, venueType: e.target.value })}
        >
          {VENUE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Service style">
        <Select
          value={form.serviceStyle}
          onChange={(e) => setForm({ ...form, serviceStyle: e.target.value })}
        >
          {SERVICE_STYLES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Price per person (JOD)">
          <Input
            type="number"
            inputMode="decimal"
            value={form.pricePerPerson ?? ""}
            onChange={(e) => setForm({ ...form, pricePerPerson: num(e.target.value) })}
          />
        </Field>
        <Field label="Hall rental (JOD)">
          <Input
            type="number"
            inputMode="decimal"
            value={form.hallRentalJod ?? ""}
            onChange={(e) => setForm({ ...form, hallRentalJod: num(e.target.value) })}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="DJ price (JOD)">
          <Input
            type="number"
            inputMode="decimal"
            value={form.djPriceJod ?? ""}
            onChange={(e) => setForm({ ...form, djPriceJod: num(e.target.value) })}
            disabled={form.includesDj}
            placeholder={form.includesDj ? "Included" : ""}
          />
        </Field>
        <Field label="Lights price (JOD)">
          <Input
            type="number"
            inputMode="decimal"
            value={form.lightsPriceJod ?? ""}
            onChange={(e) => setForm({ ...form, lightsPriceJod: num(e.target.value) })}
            disabled={form.includesLights}
            placeholder={form.includesLights ? "Included" : ""}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Min guests">
          <Input
            type="number"
            value={form.minGuests ?? ""}
            onChange={(e) => setForm({ ...form, minGuests: num(e.target.value) })}
          />
        </Field>
        <Field label="Max guests">
          <Input
            type="number"
            value={form.maxGuests ?? ""}
            onChange={(e) => setForm({ ...form, maxGuests: num(e.target.value) })}
          />
        </Field>
      </div>

      <Field label="Included in base package">
        <div className="grid gap-2">
          {boolField("includesFood", "Food / menu", form, setForm)}
          {boolField("includesDj", "DJ (included — no extra price)", form, setForm)}
          {boolField("includesLights", "Lights (included)", form, setForm)}
          {boolField("includesTables", "Tables", form, setForm)}
          {boolField("includesChairs", "Chairs", form, setForm)}
          {boolField("includesParking", "Parking", form, setForm)}
          {boolField("includesZaffe", "Zaffe", form, setForm)}
          {boolField("includesDecor", "Decor", form, setForm)}
        </div>
      </Field>

      <Field label="Phone / WhatsApp">
        <Input
          type="tel"
          value={form.contactPhone ?? ""}
          onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
          placeholder="+962 7x xxx xxxx"
        />
      </Field>
      <Field label="Instagram">
        <Input
          value={form.contactInstagram ?? ""}
          onChange={(e) => setForm({ ...form, contactInstagram: e.target.value })}
          placeholder="@venue"
        />
      </Field>
      <Field label="Website">
        <Input
          type="url"
          value={form.website ?? ""}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Status">
          <Select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Rating (1–5)">
          <Input
            type="number"
            min={1}
            max={5}
            value={form.rating ?? ""}
            onChange={(e) => setForm({ ...form, rating: num(e.target.value) })}
          />
        </Field>
      </div>

      <Field label="Visit date">
        <Input
          type="date"
          value={form.visitedAt ?? ""}
          onChange={(e) => setForm({ ...form, visitedAt: e.target.value || null })}
        />
      </Field>

      <Field label="Notes">
        <Textarea
          value={form.notes ?? ""}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Tasting notes, coordinator name, payment terms…"
        />
      </Field>

      <Button type="submit" id={submitAnchorId} className="w-full" disabled={pending}>
        {pending ? "Saving…" : submitLabel ?? (venue ? "Save changes" : "Add venue")}
      </Button>
    </form>
  );
}
