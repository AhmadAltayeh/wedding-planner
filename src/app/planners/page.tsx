import Link from "next/link";
import { listPlanners } from "@/lib/actions/planners";
import { PageHeader, Card, Badge, EmptyState } from "@/components/ui";
import { FabLink } from "@/components/fab-link";
import { formatJod } from "@/lib/utils";
import { PLANNER_LEVELS, statusColor, statusLabel } from "@/lib/constants";

export default async function PlannersPage() {
  const planners = await listPlanners();

  return (
    <div>
      <PageHeader
        title="Wedding planners"
        subtitle="Full planning, partial, or day-of in Amman"
        action={<FabLink href="/planners/new" label="Add planner" />}
      />
      {planners.length === 0 ? (
        <EmptyState title="No planners" description="Track quotes and what each package includes." />
      ) : (
        <ul className="space-y-3">
          {planners.map((p) => (
            <li key={p.id}>
              <Link href={`/planners/${p.id}/edit`}>
                <Card className="active:border-gold/50 active:bg-blush/25">
                  <div className="flex justify-between gap-2">
                    <div>
                      <h2 className="font-semibold text-ink">{p.name}</h2>
                      {p.company && <p className="text-sm text-ink-muted">{p.company}</p>}
                      <p className="mt-1 text-sm text-ink">
                        {PLANNER_LEVELS.find((l) => l.value === p.serviceLevel)?.label}
                        {p.packagePriceJod != null && ` · ${formatJod(p.packagePriceJod)}`}
                      </p>
                    </div>
                    <Badge className={statusColor(p.status)}>{statusLabel(p.status)}</Badge>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
