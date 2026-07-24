import { listVenues } from "@/lib/actions/venues";
import { getSettings } from "@/lib/actions/settings";
import { PageHeader, Card, EmptyState } from "@/components/ui";
import { formatJod } from "@/lib/utils";
import { estimateVenueTotal } from "@/lib/venue-math";
import { SERVICE_STYLES } from "@/lib/constants";
import Link from "next/link";

export default async function ComparePage() {
  const [venues, settings] = await Promise.all([listVenues(), getSettings()]);
  const guests = settings.guestEstimate;

  const rows = venues
    .map((v) => ({
      ...v,
      est: estimateVenueTotal(v, guests),
    }))
    .sort((a, b) => (a.est ?? Infinity) - (b.est ?? Infinity));

  return (
    <div>
      <PageHeader
        title="Compare venues"
        subtitle={`Estimates for ${guests} guests (change in Settings)`}
      />

      {rows.length === 0 ? (
        <EmptyState title="Nothing to compare" description="Add at least two venues with pricing." />
      ) : (
        <div className="space-y-3">
          {rows.map((v, i) => {
            const style = SERVICE_STYLES.find((s) => s.value === v.serviceStyle)?.label;
            return (
              <Link key={v.id} href={`/venues/${v.id}`}>
                <Card className="relative overflow-hidden active:border-gold/50 active:bg-blush/25">
                  {i === 0 && v.est != null && (
                    <span className="absolute right-3 top-3 rounded-full bg-gold-soft/80 px-2.5 py-0.5 text-xs font-bold text-sage-dark">
                      Best value
                    </span>
                  )}
                  <h2 className="pr-24 font-serif text-lg font-semibold text-ink">{v.name}</h2>
                  <p className="text-sm text-ink-muted">{v.location} · {style}</p>
                  <dl className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                    <dt className="text-ink-muted">Per person</dt>
                    <dd className="font-medium text-ink">{formatJod(v.pricePerPerson)}</dd>
                    <dt className="text-ink-muted">Min guests</dt>
                    <dd>{v.minGuests ?? "—"}</dd>
                    <dt className="text-ink-muted">Buffet / seated</dt>
                    <dd>{style}</dd>
                    <dt className="text-ink-muted">Food in package</dt>
                    <dd>{v.includesFood ? "Yes" : "No"}</dd>
                    <dt className="text-ink-muted">DJ / lights</dt>
                    <dd>
                      {v.includesDj ? "DJ incl." : v.djPriceJod != null ? `${v.djPriceJod} JOD DJ` : "DJ —"}
                      {" · "}
                      {v.includesLights ? "lights incl." : v.lightsPriceJod != null ? `${v.lightsPriceJod} JOD` : "lights —"}
                    </dd>
                    <dt className="col-span-2 pt-2 font-serif text-base font-semibold text-sage-dark">
                      Est. total
                    </dt>
                    <dd className="col-span-2 font-serif text-xl font-bold text-ink">
                      {formatJod(v.est)}
                    </dd>
                  </dl>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
