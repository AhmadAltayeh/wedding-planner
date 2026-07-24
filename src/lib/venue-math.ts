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

export type VenueEstimateBreakdown = {
  guests: number;
  cateringJod: number;
  hallJod: number;
  djJod: number;
  lightsJod: number;
  addonsJod: number;
  totalJod: number | null;
};

function addonTotal(
  addons: VenueEstimateInput["addons"],
  guests: number
): number {
  let sum = 0;
  for (const a of addons) {
    if (a.included || a.priceJod == null) continue;
    if (a.priceType === "per_person") sum += a.priceJod * guests;
    else sum += a.priceJod;
  }
  return sum;
}

export function venueEstimateBreakdown(
  venue: VenueEstimateInput,
  guestCount: number
): VenueEstimateBreakdown {
  const guests = Math.max(guestCount, venue.minGuests ?? 0);
  const cateringJod = (venue.pricePerPerson ?? 0) * guests;
  const hallJod = venue.hallRentalJod ?? 0;

  const djJod =
    venue.djPriceJod != null && !venue.includesDj ? venue.djPriceJod : 0;
  const lightsJod =
    venue.lightsPriceJod != null && !venue.includesLights ? venue.lightsPriceJod : 0;

  const addonsJod = addonTotal(venue.addons, guests);

  const hasPerPerson = venue.pricePerPerson != null;
  const hasHall = venue.hallRentalJod != null;
  const hasDj = djJod > 0;
  const hasLights = lightsJod > 0;
  const hasAddons = addonsJod > 0;

  if (!hasPerPerson && !hasHall && !hasDj && !hasLights && !hasAddons) {
    return {
      guests,
      cateringJod,
      hallJod,
      djJod,
      lightsJod,
      addonsJod,
      totalJod: null,
    };
  }

  const totalJod = cateringJod + hallJod + djJod + lightsJod + addonsJod;

  return {
    guests,
    cateringJod,
    hallJod,
    djJod,
    lightsJod,
    addonsJod,
    totalJod,
  };
}

export function estimateVenueTotal(venue: VenueEstimateInput, guestCount: number): number | null {
  return venueEstimateBreakdown(venue, guestCount).totalJod;
}
