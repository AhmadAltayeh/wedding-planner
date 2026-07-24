export type VenueEstimateInput = {
  pricePerPerson: number | null;
  minGuests: number | null;
  hallRentalJod: number | null;
  djPriceJod?: number | null;
  lightsPriceJod?: number | null;
  includesDj?: boolean;
  includesLights?: boolean;
  addons: { priceJod: number | null; included: boolean; priceType: string }[];
};

export function estimateVenueTotal(venue: VenueEstimateInput, guestCount: number): number | null {
  const { pricePerPerson, minGuests, hallRentalJod, addons } = venue;
  const hasPerPerson = pricePerPerson != null;
  const hasHall = hallRentalJod != null;
  const hasDj = !venue.includesDj && venue.djPriceJod != null;
  const hasLights = !venue.includesLights && venue.lightsPriceJod != null;

  if (!hasPerPerson && !hasHall && !hasDj && !hasLights && addons.every((a) => a.included || a.priceJod == null)) {
    return null;
  }

  const guests = Math.max(guestCount, minGuests ?? 0);
  let total = (pricePerPerson ?? 0) * guests + (hallRentalJod ?? 0);

  if (!venue.includesDj && venue.djPriceJod != null) total += venue.djPriceJod;
  if (!venue.includesLights && venue.lightsPriceJod != null) total += venue.lightsPriceJod;

  for (const a of addons) {
    if (a.included || a.priceJod == null) continue;
    if (a.priceType === "per_person") total += a.priceJod * guests;
    else total += a.priceJod;
  }
  return total;
}
