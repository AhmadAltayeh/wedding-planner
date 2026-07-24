import Link from "next/link";
import { notFound } from "next/navigation";
import { getVenue } from "@/lib/actions/venues";
import { getSettings } from "@/lib/actions/settings";
import { PageHeader, Card, Badge, Button } from "@/components/ui";
import { VenueDatesSection } from "@/components/venue-dates-section";
import { VenueExtras } from "@/components/venue-extras";
import { VenueMediaSection } from "@/components/venue-media";
import { LocationBlock, DjLightsPricing } from "@/components/venue-location";
import { formatDate, formatJod } from "@/lib/utils";
import { venueEstimateBreakdown } from "@/lib/venue-math";
import { SERVICE_STYLES, statusLabel } from "@/lib/constants";
import { Pencil } from "lucide-react";

export default async function VenueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [venue, settings] = await Promise.all([getVenue(id), getSettings()]);
  if (!venue) notFound();

  const guests = settings.guestEstimate;
  const estimate = venueEstimateBreakdown(venue, guests);
  const style = SERVICE_STYLES.find((s) => s.value === venue.serviceStyle)?.label;

  return (
    <div>
      <PageHeader
        title={venue.name}
        subtitle={[venue.location, style].filter(Boolean).join(" · ")}
        action={
          <Link href={`/venues/${id}/edit`}>
            <Button variant="secondary" className="gap-1 px-3">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </Link>
        }
      />

      <VenueMediaSection venueId={venue.id} media={venue.media} />

      <Badge className="mt-4">{statusLabel(venue.status)}</Badge>
      <div className="mt-2">
        <LocationBlock location={venue.location} />
      </div>

      <Card className="mt-4">
        <p className="text-sm text-ink-muted">Pricing</p>
        <p className="mt-1 text-lg font-semibold">
          {venue.pricePerPerson != null ? `${formatJod(venue.pricePerPerson)} / person` : "Per-person TBD"}
        </p>
        {venue.minGuests != null && (
          <p className="text-sm text-ink-muted">Minimum {venue.minGuests} guests</p>
        )}
        {venue.hallRentalJod != null && (
          <p className="text-sm text-ink-muted">Hall rental {formatJod(venue.hallRentalJod)}</p>
        )}
        <DjLightsPricing
          includesDj={venue.includesDj}
          includesLights={venue.includesLights}
          djPriceJod={venue.djPriceJod}
          lightsPriceJod={venue.lightsPriceJod}
        />
        {estimate.totalJod != null && (
          <div className="mt-3 border-t border-gold-soft/40 pt-3">
            <p className="font-semibold text-sage-dark">
              Estimated {formatJod(estimate.totalJod)} for {estimate.guests} guests
            </p>
            <ul className="mt-2 space-y-0.5 text-sm text-ink-muted">
              {venue.pricePerPerson != null && (
                <li>
                  Catering {formatJod(venue.pricePerPerson)} × {estimate.guests} ={" "}
                  {formatJod(estimate.cateringJod)}
                </li>
              )}
              {estimate.hallJod > 0 && <li>Hall {formatJod(estimate.hallJod)}</li>}
              {estimate.djJod > 0 && (
                <li>
                  DJ{venue.includesDj ? " (in package)" : ""} {formatJod(estimate.djJod)}
                </li>
              )}
              {estimate.lightsJod > 0 && (
                <li>
                  Lights{venue.includesLights ? " (in package)" : ""} {formatJod(estimate.lightsJod)}
                </li>
              )}
              {estimate.addonsJod > 0 && <li>Add-ons {formatJod(estimate.addonsJod)}</li>}
            </ul>
          </div>
        )}
      </Card>

      <VenueDatesSection
        venueId={venue.id}
        dates={venue.availableDates}
        weddingDate={settings.weddingDate}
      />

      {(venue.contactPhone || venue.contactName || venue.contactInstagram || venue.website) && (
        <Card className="mt-3 text-sm">
          {venue.contactPhone && (
            <p>
              {venue.contactName && (
                <span className="font-medium text-ink">{venue.contactName} · </span>
              )}
              <a href={`tel:${venue.contactPhone}`} className="font-medium text-sage">
                {venue.contactPhone}
              </a>
            </p>
          )}
          {!venue.contactPhone && venue.contactName && (
            <p className="font-medium text-ink">{venue.contactName}</p>
          )}
          {venue.contactInstagram && <p>{venue.contactInstagram}</p>}
          {venue.website && (
            <a href={venue.website} className="break-all text-sage" target="_blank" rel="noreferrer">
              {venue.website}
            </a>
          )}
        </Card>
      )}

      {venue.notes && (
        <Card className="mt-3">
          <p className="text-sm text-ink-muted">Notes</p>
          <p className="mt-1 whitespace-pre-wrap text-sm">{venue.notes}</p>
        </Card>
      )}

      {venue.visitedAt && (
        <p className="mt-3 text-sm text-ink-muted">Visited {formatDate(venue.visitedAt)}</p>
      )}

      <VenueExtras venueId={venue.id} addons={venue.addons} />
    </div>
  );
}
