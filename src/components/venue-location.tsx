import { MapPin, Instagram, Globe, Phone } from "lucide-react";
import { formatJod } from "@/lib/utils";
import { googleMapsUrl, locationDisplayLabel } from "@/lib/maps-url";
import { instagramUrl, instagramDisplayLabel } from "@/lib/instagram-url";
import { websiteUrl, websiteDisplayLabel } from "@/lib/website-url";

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
        className={linkButtonClass}
      >
        <MapPin className="h-5 w-5 text-gold" />
        Open in Google Maps
      </a>
    </div>
  );
}

const linkButtonClass =
  "mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-gold-soft/70 bg-blush/30 px-4 font-semibold text-sage-dark active:bg-blush/50";

export function ContactBlock({
  contactName,
  contactPhone,
}: {
  contactName: string | null | undefined;
  contactPhone: string | null | undefined;
}) {
  if (!contactName?.trim() && !contactPhone?.trim()) return null;

  return (
    <div className="mt-4 rounded-xl border border-gold-soft/50 bg-surface px-4 py-3 text-sm text-slate-700 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-gold">Contact</p>
      {contactName?.trim() && <p className="mt-2 font-medium text-ink">{contactName.trim()}</p>}
      {contactPhone?.trim() && (
        <>
          <p className={contactName?.trim() ? "mt-1 text-ink-muted" : "mt-2"}>{contactPhone.trim()}</p>
          <a href={`tel:${contactPhone.trim()}`} className={linkButtonClass}>
            <Phone className="h-5 w-5 text-gold" />
            Call / WhatsApp
          </a>
        </>
      )}
    </div>
  );
}

export function InstagramBlock({ instagram }: { instagram: string | null | undefined }) {
  if (!instagram?.trim()) return null;
  const href = instagramUrl(instagram);
  const label = instagramDisplayLabel(instagram);

  return (
    <div className="mt-3 text-sm text-slate-700">
      <p>
        <span className="text-slate-500">Instagram · </span>
        <span className="text-ink">{label}</span>
      </p>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={linkButtonClass}
      >
        <Instagram className="h-5 w-5 text-gold" />
        Open in Instagram
      </a>
    </div>
  );
}

export function WebsiteBlock({ website }: { website: string | null | undefined }) {
  if (!website?.trim()) return null;
  const href = websiteUrl(website);
  const label = websiteDisplayLabel(website);

  return (
    <div className="mt-3 text-sm text-slate-700">
      <p>
        <span className="text-slate-500">Website · </span>
        <span className="text-ink">{label}</span>
      </p>
      <a href={href} target="_blank" rel="noreferrer" className={linkButtonClass}>
        <Globe className="h-5 w-5 text-gold" />
        Open website
      </a>
    </div>
  );
}

function djLightsLine(included: boolean, priceJod: number | null): string {
  if (priceJod != null && priceJod > 0) {
    const amount = formatJod(priceJod);
    return included ? `${amount} (included in package)` : amount;
  }
  if (included) return "Included — add JOD amount in edit to count in total";
  return "Not included / TBD";
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
  const showDj = includesDj || djPriceJod != null;
  const showLights = includesLights || lightsPriceJod != null;
  if (!showDj && !showLights) return null;
  return (
    <div className="mt-2 space-y-1 text-sm text-slate-700">
      {showDj && <p>DJ: {djLightsLine(includesDj, djPriceJod)}</p>}
      {showLights && <p>Lights: {djLightsLine(includesLights, lightsPriceJod)}</p>}
    </div>
  );
}
