import Link from "next/link";
import { listVenues } from "@/lib/actions/venues";
import { getSettings } from "@/lib/actions/settings";
import { PageHeader, Card, Badge, EmptyState } from "@/components/ui";
import { FabLink } from "@/components/fab-link";
import { formatDateWithShortDay, formatJod } from "@/lib/utils";
import { estimateVenueTotal } from "@/lib/venue-math";
import { SERVICE_STYLES, statusColor, statusLabel } from "@/lib/constants";

export default async function VenuesPage() {
  const [venues, settings] = await Promise.all([listVenues(), getSettings()]);
  const guests = settings.guestEstimate;

  return (
    <div>
      <PageHeader
        title="Venues & hotels"
        subtitle="Per-person pricing, minimums, dates & inclusions"
        action={<FabLink href="/venues/new" label="Add venue" />}
      />

      {venues.length === 0 ? (
        <EmptyState
          title="No venues yet"
          description="Add hotels and halls you find in Amman — buffet vs seated, DJ, lights, and more."
        />
      ) : (
        <ul className="space-y-3">
          {venues.map((v) => {
            const style = SERVICE_STYLES.find((s) => s.value === v.serviceStyle)?.label ?? v.serviceStyle;
            const est = estimateVenueTotal(v, guests);
            const includes = [
              v.includesFood && "Food",
              v.includesDj && "DJ",
              v.includesLights && "Lights",
              v.includesTables && "Tables",
              v.includesChairs && "Chairs",
            ].filter(Boolean);

            return (
              <li key={v.id}>
                <Link href={`/venues/${v.id}`}>
                  <Card className="active:border-gold/50 active:bg-blush/25">
                    <div className="flex justify-between gap-2">
                      <div>
                        <h2 className="font-semibold text-ink">{v.name}</h2>
                        <p className="text-sm text-ink-muted">
                          {v.location || "Location TBD"} · {style}
                          {v.minGuests != null && ` · min ${v.minGuests} guests`}
                        </p>
                      </div>
                      <Badge className={statusColor(v.status)}>{statusLabel(v.status)}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-ink">
                      {v.pricePerPerson != null
                        ? `${formatJod(v.pricePerPerson)} / person`
                        : "Per-person price not set"}
                      {est != null && (
                        <span className="font-medium text-sage-dark"> · Est. {formatJod(est)}</span>
                      )}
                    </p>
                    {includes.length > 0 && (
                      <p className="mt-1 text-xs text-ink-muted">Includes: {includes.join(", ")}</p>
                    )}
                    {v.availableDates.length > 0 && (
                      <p className="mt-2 text-xs font-medium text-sage">
                        <span className="text-ink-muted">Dates: </span>
                        {v.availableDates
                          .slice(0, 3)
                          .map((d) => formatDateWithShortDay(d.date))
                          .join(" · ")}
                        {v.availableDates.length > 3 && ` +${v.availableDates.length - 3} more`}
                      </p>
                    )}
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
