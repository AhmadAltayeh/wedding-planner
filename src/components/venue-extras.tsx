"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import {
  addVenueAddon,
  deleteVenueAddon,
  deleteVenue,
} from "@/lib/actions/venues";
import { Button, Field, Input, Select } from "@/components/ui";
import { ADDON_CATEGORIES } from "@/lib/constants";
import { formatJod } from "@/lib/utils";
import type { VenueAddon } from "@prisma/client";
import { Trash2 } from "lucide-react";

export function VenueExtras({
  venueId,
  addons,
}: {
  venueId: string;
  addons: VenueAddon[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [addonName, setAddonName] = useState("");
  const [addonCat, setAddonCat] = useState("food");
  const [addonPrice, setAddonPrice] = useState("");
  const [addonType, setAddonType] = useState("fixed");
  const [addonIncluded, setAddonIncluded] = useState(false);

  return (
    <div className="mt-8 space-y-8">
      <section>
        <h2 className="mb-3 font-serif text-lg font-semibold">Menu & add-ons pricing</h2>
        <p className="mb-3 text-sm text-ink-muted">
          Track DJ, lights, extra menu tiers, chairs — included or priced separately.
        </p>
        <ul className="mb-3 space-y-2">
          {addons.map((a) => (
            <li key={a.id} className="rounded-xl border border-gold-soft/40 px-3 py-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">{a.name}</span>
                <button
                  type="button"
                  className="text-sage"
                  onClick={() =>
                    startTransition(async () => {
                      await deleteVenueAddon(a.id, venueId);
                      router.refresh();
                    })
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="text-ink-muted">
                {ADDON_CATEGORIES.find((c) => c.value === a.category)?.label ?? a.category}
                {a.included
                  ? " · Included"
                  : a.priceJod != null
                    ? ` · ${formatJod(a.priceJod)}${a.priceType === "per_person" ? " / person" : ""}`
                    : ""}
              </p>
            </li>
          ))}
        </ul>
        <Field label="Add-on name">
          <Input value={addonName} onChange={(e) => setAddonName(e.target.value)} placeholder="Premium buffet menu" />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Category">
            <Select value={addonCat} onChange={(e) => setAddonCat(e.target.value)}>
              {ADDON_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Price (JOD)">
            <Input
              type="number"
              value={addonPrice}
              onChange={(e) => setAddonPrice(e.target.value)}
              disabled={addonIncluded}
            />
          </Field>
        </div>
        <Field label="Price type">
          <Select value={addonType} onChange={(e) => setAddonType(e.target.value)} disabled={addonIncluded}>
            <option value="fixed">Fixed total</option>
            <option value="per_person">Per person</option>
          </Select>
        </Field>
        <label className="mb-3 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={addonIncluded}
            onChange={(e) => setAddonIncluded(e.target.checked)}
          />
          Included in package (no extra charge)
        </label>
        <Button
          variant="secondary"
          className="w-full"
          disabled={!addonName.trim() || pending}
          onClick={() =>
            startTransition(async () => {
              await addVenueAddon(venueId, {
                name: addonName,
                category: addonCat,
                priceJod: addonPrice === "" ? null : Number(addonPrice),
                priceType: addonType,
                included: addonIncluded,
              });
              setAddonName("");
              setAddonPrice("");
              router.refresh();
            })
          }
        >
          Add line item
        </Button>
      </section>

      <Button
        variant="danger"
        className="w-full"
        disabled={pending}
        onClick={() => {
          if (!confirm("Delete this venue?")) return;
          startTransition(async () => {
            await deleteVenue(venueId);
            router.push("/venues");
            router.refresh();
          });
        }}
      >
        Delete venue
      </Button>
    </div>
  );
}
