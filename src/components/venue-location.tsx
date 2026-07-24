import { MapPin } from "lucide-react";
import { formatJod } from "@/lib/utils";
import { googleMapsUrl, locationDisplayLabel } from "@/lib/maps-url";

export function LocationLine({ location }: { location: string | null | undefined }) {
  if (!location?.trim()) return null;
  const href = googleMapsUrl(location);
  const label = locationDisplayLabel(location);
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-sage underline-offset-2 hover:underline"
    >
      <MapPin className="h-4 w-4 shrink-0" />
      {label}
    </a>
  );
}

export function LocationBlock({ location }: { location: string | null | undefined }) {
  if (!location?.trim()) return null;
  const href = googleMapsUrl(location);
  const label = locationDisplayLabel(location);

  return (
    <div className="text-sm text-slate-700">
      <p>
        <span className="text-slate-500">Location · </span>
        <span className="text-ink">{label}</span>
      </p>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-gold-soft/70 bg-blush/30 px-4 font-semibold text-sage-dark active:bg-blush/50"
      >
        <MapPin className="h-5 w-5 text-gold" />
        Open in Google Maps
      </a>
    </div>
  );
}

export function DjLightsPricing({
  includesDj,
  includesLights,
  djPriceJod,
  lightsPriceJod,
}: {
  includesDj: boolean;
  includesLights: boolean;
  djPriceJod: number | null;
  lightsPriceJod: number | null;
}) {
  if (!includesDj && djPriceJod == null && !includesLights && lightsPriceJod == null) return null;
  return (
    <div className="mt-2 space-y-1 text-sm text-slate-700">
      <p>
        DJ: {includesDj ? "Included" : djPriceJod != null ? formatJod(djPriceJod) : "Not included / TBD"}
      </p>
      <p>
        Lights:{" "}
        {includesLights ? "Included" : lightsPriceJod != null ? formatJod(lightsPriceJod) : "Not included / TBD"}
      </p>
    </div>
  );
}
