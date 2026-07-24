import { displayNames } from "@/lib/brand";
import { formatDate } from "@/lib/utils";

export function CoupleHero({
  groom,
  bride,
  weddingDate,
  compact,
}: {
  groom: string;
  bride: string;
  weddingDate?: Date | null;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Ahmad & Nour</p>
        <div className="gold-rule mt-2 w-16" />
      </div>
    );
  }

  return (
    <header className="relative mb-8 overflow-hidden rounded-3xl border border-gold-soft/60 bg-surface/80 px-5 py-8 text-center shadow-sm shadow-sage/5 backdrop-blur-sm">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a68b5b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <p className="relative text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
        Amman · Jordan
      </p>
      <div className="relative mt-4 flex flex-col items-center gap-1">
        <span className="font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          {groom}
        </span>
        <span className="font-script text-4xl leading-none text-gold sm:text-5xl" aria-hidden>
          &
        </span>
        <span className="font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          {bride}
        </span>
      </div>
      <div className="gold-rule relative mx-auto mt-5 w-32" />
      <p className="relative mt-4 text-sm text-ink-muted">Our wedding planner</p>
      {weddingDate && (
        <p className="relative mt-1 text-sm font-medium text-sage-dark">
          {formatDate(weddingDate)}
        </p>
      )}
    </header>
  );
}

export function CoupleTitle({ partnerOne, partnerTwo }: { partnerOne?: string | null; partnerTwo?: string | null }) {
  const { groom, bride } = displayNames(partnerOne, partnerTwo);
  return (
    <span>
      {groom} <span className="font-script text-gold">&</span> {bride}
    </span>
  );
}
