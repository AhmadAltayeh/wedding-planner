"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Planner } from "@prisma/client";
import { createPlanner, updatePlanner } from "@/lib/actions/planners";
import { Button, Field, Input, Select, Textarea } from "@/components/ui";
import { PLANNER_LEVELS, STATUS_OPTIONS } from "@/lib/constants";

type Form = Parameters<typeof createPlanner>[0];

const empty: Form = {
  name: "",
  serviceLevel: "full",
  status: "considering",
  includesVenue: false,
  includesVendors: false,
};

function toForm(p: Planner): Form {
  return {
    name: p.name,
    company: p.company ?? undefined,
    contactPhone: p.contactPhone ?? undefined,
    contactInstagram: p.contactInstagram ?? undefined,
    serviceLevel: p.serviceLevel,
    packagePriceJod: p.packagePriceJod,
    priceNotes: p.priceNotes ?? undefined,
    includesVenue: p.includesVenue,
    includesVendors: p.includesVendors,
    notes: p.notes ?? undefined,
    status: p.status,
    rating: p.rating,
  };
}

export function PlannerForm({
  planner,
  onCreated,
  submitLabel,
  submitAnchorId,
}: {
  planner?: Planner;
  onCreated?: (planner: Planner) => void;
  submitLabel?: string;
  submitAnchorId?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<Form>(planner ? toForm(planner) : empty);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        startTransition(async () => {
          if (planner) {
            const updated = await updatePlanner(planner.id, form);
            if (onCreated) {
              onCreated(updated);
            } else {
              router.push("/planners");
            }
          } else {
            const created = await createPlanner(form);
            if (onCreated) {
              onCreated(created);
            } else {
              router.push("/planners");
            }
          }
          router.refresh();
        });
      }}
    >
      <Field label="Planner name *">
        <Input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </Field>
      <Field label="Company">
        <Input
          value={form.company ?? ""}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
      </Field>
      <Field label="Service level">
        <Select
          value={form.serviceLevel}
          onChange={(e) => setForm({ ...form, serviceLevel: e.target.value })}
        >
          {PLANNER_LEVELS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Package price (JOD)">
        <Input
          type="number"
          value={form.packagePriceJod ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              packagePriceJod: e.target.value === "" ? null : Number(e.target.value),
            })
          }
        />
      </Field>
      <Field label="Price notes">
        <Input
          value={form.priceNotes ?? ""}
          onChange={(e) => setForm({ ...form, priceNotes: e.target.value })}
          placeholder="% of budget, deposit, etc."
        />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.includesVenue}
          onChange={(e) => setForm({ ...form, includesVenue: e.target.checked })}
        />
        Helps book venue
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.includesVendors}
          onChange={(e) => setForm({ ...form, includesVendors: e.target.checked })}
        />
        Manages vendors
      </label>
      <Field label="Phone">
        <Input
          type="tel"
          value={form.contactPhone ?? ""}
          onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
        />
      </Field>
      <Field label="Instagram">
        <Input
          value={form.contactInstagram ?? ""}
          onChange={(e) => setForm({ ...form, contactInstagram: e.target.value })}
        />
      </Field>
      <Field label="Status">
        <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Notes">
        <Textarea
          value={form.notes ?? ""}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </Field>
      <Button type="submit" id={submitAnchorId} className="w-full" disabled={pending}>
        {pending ? "Saving…" : submitLabel ?? (planner ? "Save" : "Add planner")}
      </Button>
    </form>
  );
}
