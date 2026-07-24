import Link from "next/link";
import { getSettings } from "@/lib/actions/settings";
import { listVenues } from "@/lib/actions/venues";
import { listPlanners } from "@/lib/actions/planners";
import { listTasks } from "@/lib/actions/tasks";
import { CoupleHero } from "@/components/couple-hero";
import { DatabaseSetupHelp } from "@/components/database-setup-help";
import { displayNames } from "@/lib/brand";
import { Card, Badge, Button, SectionTitle } from "@/components/ui";
import { formatJod } from "@/lib/utils";
import { estimateVenueTotal } from "@/lib/venue-math";
import { statusColor, statusLabel } from "@/lib/constants";
import { Building2, MapPin } from "lucide-react";
import { isProductionDatabaseConfigured } from "@/lib/prisma";

export default async function HomePage() {
  if (!isProductionDatabaseConfigured()) {
    const { groom, bride } = displayNames("Ahmad", "Nour");
    return (
      <div>
        <CoupleHero groom={groom} bride={bride} />
        <DatabaseSetupHelp detail="TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is not set on Vercel." />
      </div>
    );
  }

  let settings;
  let venues;
  let planners;
  let tasks;

  try {
    [settings, venues, planners, tasks] = await Promise.all([
      getSettings(),
      listVenues(),
      listPlanners(),
      listTasks(),
    ]);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    const { groom, bride } = displayNames("Ahmad", "Nour");
    return (
      <div>
        <CoupleHero groom={groom} bride={bride} />
        <DatabaseSetupHelp detail={detail} />
      </div>
    );
  }

  const { groom, bride } = displayNames(settings.partnerOne, settings.partnerTwo);
  const guests = settings.guestEstimate;
  const openTasks = tasks.filter((t) => !t.completed).length;
  const shortlisted = venues.filter((v) => v.status === "shortlisted" || v.status === "visited");

  return (
    <div>
      <CoupleHero groom={groom} bride={bride} weddingDate={settings.weddingDate} />

      <div className="grid grid-cols-2 gap-3">
        <Card className="border-sage/10 bg-gradient-to-br from-surface to-blush/30">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Guests</p>
          <p className="stat-value mt-1 text-3xl text-ink">{guests}</p>
        </Card>
        <Card className="border-sage/10 bg-gradient-to-br from-surface to-blush/30">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Budget</p>
          <p className="stat-value mt-1 text-2xl text-sage-dark">{formatJod(settings.totalBudgetJod)}</p>
        </Card>
        <Card>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Venues</p>
          <p className="stat-value mt-1 text-3xl text-ink">{venues.length}</p>
        </Card>
        <Card>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Tasks</p>
          <p className="stat-value mt-1 text-3xl text-ink">{openTasks}</p>
        </Card>
      </div>

      {shortlisted.length > 0 && (
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-2">
            <SectionTitle>Top picks</SectionTitle>
            <Link href="/venues" className="text-link text-sm">
              All venues
            </Link>
          </div>
          <div className="space-y-3">
            {shortlisted.slice(0, 3).map((v) => {
              const est = estimateVenueTotal(v, guests);
              return (
                <Link key={v.id} href={`/venues/${v.id}`}>
                  <Card className="transition active:border-gold/60 active:bg-blush/20">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-ink">{v.name}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-sm text-ink-muted">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-gold" />
                          {v.location ?? "Location TBD"}
                        </p>
                        <p className="text-sm text-ink-muted">
                          {v.pricePerPerson != null ? `${v.pricePerPerson} JOD / person` : "Price TBD"}
                        </p>
                      </div>
                      <Badge className={statusColor(v.status)}>{statusLabel(v.status)}</Badge>
                    </div>
                    {est != null && (
                      <p className="mt-2 text-sm font-semibold text-sage-dark">
                        Est. {formatJod(est)} · {guests} guests
                      </p>
                    )}
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {venues.length === 0 && (
        <Card className="mt-10 flex flex-col items-center gap-4 py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blush">
            <Building2 className="h-7 w-7 text-sage" />
          </div>
          <div>
            <p className="font-serif text-lg font-medium text-ink">Your venue shortlist starts here</p>
            <p className="mt-1 text-sm text-ink-muted">Hotels, halls, and outdoor spaces in Amman</p>
          </div>
          <Link href="/venues/new">
            <Button>Add first venue</Button>
          </Link>
        </Card>
      )}

      {planners.length > 0 && (
        <p className="mt-8 text-center text-sm text-ink-muted">
          {planners.length} planner{planners.length !== 1 ? "s" : ""} saved ·{" "}
          <Link href="/planners" className="text-link">
            View
          </Link>
        </p>
      )}
    </div>
  );
}
