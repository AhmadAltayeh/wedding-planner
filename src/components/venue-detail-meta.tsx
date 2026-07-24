import { Star, MapPinCheck } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { formatDateWithDay, cn } from "@/lib/utils";
import { SERVICE_STYLES, VENUE_TYPES, statusColor, statusLabel } from "@/lib/constants";

export function VenueDetailMeta({
  status,
  serviceStyle,
  venueType,
  rating,
  visitedAt,
}: {
  status: string;
  serviceStyle: string;
  venueType: string;
  rating: number | null;
  visitedAt: Date | null;
}) {
  const menuType = SERVICE_STYLES.find((s) => s.value === serviceStyle)?.label ?? serviceStyle;
  const placeType = VENUE_TYPES.find((t) => t.value === venueType)?.label ?? venueType;
  const isVisitedStatus = status === "visited";

  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          className={cn(
            statusColor(status),
            "px-3 py-1.5 text-sm",
            isVisitedStatus &&
              "gap-1.5 border border-amber-300/80 px-4 py-2 text-base font-bold shadow-md shadow-amber-200/50 ring-2 ring-amber-200/60"
          )}
        >
          {isVisitedStatus && <MapPinCheck className="h-4 w-4 shrink-0" aria-hidden />}
          {statusLabel(status)}
        </Badge>

        {visitedAt && (
          <span className="inline-flex items-center rounded-full border border-gold/50 bg-blush/50 px-4 py-2 text-sm font-semibold text-sage-dark">
            Visited {formatDateWithDay(visitedAt)}
          </span>
        )}

        {rating != null && rating >= 1 && (
          <span
            className="inline-flex items-center gap-1 rounded-full border border-gold-soft/70 bg-surface px-3 py-1.5 text-sm font-semibold text-ink"
            aria-label={`Rating ${rating} out of 5`}
          >
            <Star className="h-4 w-4 fill-gold text-gold" aria-hidden />
            {rating}
            <span className="font-normal text-ink-muted">/ 5</span>
          </span>
        )}
      </div>

      <Card className="py-3">
        <dl className="space-y-2.5 text-sm">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="shrink-0 font-medium text-ink-muted">Menu type</dt>
            <dd className="text-right font-semibold text-ink">{menuType}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-t border-gold-soft/40 pt-2.5">
            <dt className="shrink-0 font-medium text-ink-muted">Venue type</dt>
            <dd className="text-right font-semibold text-ink">{placeType}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
