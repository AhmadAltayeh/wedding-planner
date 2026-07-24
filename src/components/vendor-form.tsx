"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Vendor } from "@prisma/client";
import { createVendor, updateVendor } from "@/lib/actions/vendors";
import { Button, Field, Input, Select, Textarea } from "@/components/ui";
import { VENDOR_CATEGORIES, STATUS_OPTIONS } from "@/lib/constants";

type Form = Parameters<typeof createVendor>[0];

const empty: Form = {
  name: "",
  category: "photography",
  status: "considering",
  priceType: "fixed",
};

function toForm(v: Vendor): Form {
  return {
    name: v.name,
    category: v.category,
    contactPhone: v.contactPhone ?? undefined,
    contactName: v.contactName ?? undefined,
    contactInstagram: v.contactInstagram ?? undefined,
    priceJod: v.priceJod,
    priceType: v.priceType,
    notes: v.notes ?? undefined,
    status: v.status,
    rating: v.rating,
  };
}

export function VendorForm({ vendor }: { vendor?: Vendor }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<Form>(vendor ? toForm(vendor) : empty);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        startTransition(async () => {
          if (vendor) {
            await updateVendor(vendor.id, form);
            router.push("/vendors");
          } else {
            await createVendor(form);
            router.push("/vendors");
          }
          router.refresh();
        });
      }}
    >
      <Field label="Name *">
        <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </Field>
      <Field label="Category">
        <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {VENDOR_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </Select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Price (JOD)">
          <Input
            type="number"
            value={form.priceJod ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                priceJod: e.target.value === "" ? null : Number(e.target.value),
              })
            }
          />
        </Field>
        <Field label="Price type">
          <Select
            value={form.priceType}
            onChange={(e) => setForm({ ...form, priceType: e.target.value })}
          >
            <option value="fixed">Fixed</option>
            <option value="per_person">Per person</option>
            <option value="range">Range / quote</option>
          </Select>
        </Field>
      </div>
      <Field label="Contact name">
        <Input
          value={form.contactName ?? ""}
          onChange={(e) => setForm({ ...form, contactName: e.target.value })}
          placeholder="Person at this vendor"
        />
      </Field>
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
        <Textarea value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </Field>
      <Button type="submit" className="w-full" disabled={pending}>
        {vendor ? "Save" : "Add vendor"}
      </Button>
    </form>
  );
}
