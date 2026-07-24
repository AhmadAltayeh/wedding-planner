"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { addVenueDate, removeVenueDate } from "@/lib/actions/venues";
import { Button, Card, Input } from "@/components/ui";
import { formatDateWithDay } from "@/lib/utils";
import type { VenueDate } from "@prisma/client";
import { CalendarDays, Trash2 } from "lucide-react";

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function VenueDatesSection({
  venueId,
  dates,
  weddingDate,
}: {
  venueId: string;
  dates: VenueDate[];
  weddingDate?: Date | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [dateVal, setDateVal] = useState("");
  const [dateNote, setDateNote] = useState("");

  return (
    <Card className="mt-4">
      <div className="mb-3 flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-gold" />
        <h2 className="font-serif text-lg font-semibold text-ink">Available dates</h2>
      </div>

      {dates.length === 0 ? (
        <p className="mb-3 text-sm text-ink-muted">
          Add dates the venue told you are open (Fridays, specific weekends, etc.).
        </p>
      ) : (
        <ul className="mb-4 space-y-2">
          {dates.map((d) => {
            const matchesWedding =
              weddingDate != null && sameDay(new Date(d.date), new Date(weddingDate));
            return (
              <li
                key={d.id}
                className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm ${
                  matchesWedding ? "border border-gold/50 bg-gold-soft/30" : "bg-blush/40"
                }`}
              >
                <div>
                  <span className="font-semibold text-ink">{formatDateWithDay(d.date)}</span>
                  {d.note && <p className="text-ink-muted">{d.note}</p>}
                  {matchesWedding && (
                    <p className="mt-0.5 text-xs font-semibold text-sage-dark">Matches your wedding date</p>
                  )}
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-lg p-2 text-sage active:bg-blush"
                  aria-label="Remove date"
                  onClick={() =>
                    startTransition(async () => {
                      await removeVenueDate(d.id, venueId);
                      router.refresh();
                    })
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="space-y-2 border-t border-gold-soft/50 pt-4">
        <Input type="date" value={dateVal} onChange={(e) => setDateVal(e.target.value)} />
        <Input
          placeholder="Note (e.g. evening only, summer rate)"
          value={dateNote}
          onChange={(e) => setDateNote(e.target.value)}
        />
        <Button
          variant="secondary"
          className="w-full"
          disabled={!dateVal || pending}
          onClick={() =>
            startTransition(async () => {
              await addVenueDate(venueId, dateVal, dateNote || undefined);
              setDateVal("");
              setDateNote("");
              router.refresh();
            })
          }
        >
          {pending ? "Saving…" : "Add available date"}
        </Button>
      </div>
    </Card>
  );
}
