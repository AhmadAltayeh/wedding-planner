import Link from "next/link";
import { formatJod } from "@/lib/utils";

export function LocationLine({ location }: { location: string | null | undefined }) {
  if (!location) return null;
  const isUrl = /^https?:\/\//i.test(location.trim());
  if (isUrl) {
    return (
      <a href={location.trim()} target="_blank" rel="noreferrer" className="text-sage underline-offset-2 hover:underline">
        Open in Maps
      </a>
    );
  }
  return <span>{location}</span>;
}

export function LocationBlock({ location }: { location: string | null | undefined }) {
  if (!location) return null;
  const isUrl = /^https?:\/\//i.test(location.trim());
  return (
    <p className="text-sm text-slate-700">
      <span className="text-slate-500">Location · </span>
      {isUrl ? (
        <Link href={location.trim()} target="_blank" rel="noreferrer" className="font-medium text-sage">
          {location.trim()}
        </Link>
      ) : (
        location
      )}
    </p>
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
