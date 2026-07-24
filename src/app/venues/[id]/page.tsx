import Link from "next/link";
import { notFound } from "next/navigation";
import { getVenue } from "@/lib/actions/venues";
import { getSettings } from "@/lib/actions/settings";
import { PageHeader, Card, Button } from "@/components/ui";
import { VenueDatesSection } from "@/components/venue-dates-section";
import { VenueExtras } from "@/components/venue-extras";
import { VenueMediaSection } from "@/components/venue-media";
import { VenueDetailMeta } from "@/components/venue-detail-meta";
import { LocationBlock, ContactBlock, InstagramBlock, WebsiteBlock, DjLightsPricing } from "@/components/venue-location";
import { formatJod } from "@/lib/utils";
import { venueEstimateBreakdown } from "@/lib/venue-math";
import { Pencil } from "lucide-react";

export default async function VenueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [venue, settings] = await Promise.all([getVenue(id), getSettings()]);
  if (!venue) notFound();

  const guests = settings.guestEstimate;
  const estimate = venueEstimateBreakdown(venue, guests);

  return (
    <div>
      <PageHeader
        title={venue.name}
        action={
          <Link href={`/venues/${id}/edit`}>
            <Button variant="secondary" className="gap-1 px-3">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </Link>
        }
      />

      <VenueDetailMeta
        status={venue.status}
        serviceStyle={venue.serviceStyle}
        venueType={venue.venueType}
        rating={venue.rating}
        visitedAt={venue.visitedAt}
      />

      <LocationBlock location={venue.location} />

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

      <ContactBlock contactName={venue.contactName} contactPhone={venue.contactPhone} />
      <InstagramBlock instagram={venue.contactInstagram} />
      <WebsiteBlock website={venue.website} />

      {venue.notes && (
        <Card className="mt-3">
          <p className="text-sm text-ink-muted">Notes</p>
          <p className="mt-1 whitespace-pre-wrap text-sm">{venue.notes}</p>
        </Card>
      )}

      <VenueExtras venueId={venue.id} addons={venue.addons} collapsible />

      <VenueMediaSection venueId={venue.id} media={venue.media} variant="detail" />
    </div>
  );
}
