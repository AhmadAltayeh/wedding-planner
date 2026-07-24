import Link from "next/link";
import { listVendors } from "@/lib/actions/vendors";
import { PageHeader, Card, Badge, EmptyState, SectionTitle } from "@/components/ui";
import { FabLink } from "@/components/fab-link";
import { formatJod } from "@/lib/utils";
import { VENDOR_CATEGORIES, statusColor, statusLabel } from "@/lib/constants";

export default async function VendorsPage() {
  const vendors = await listVendors();

  const byCategory = VENDOR_CATEGORIES.map((cat) => ({
    ...cat,
    items: vendors.filter((v) => v.category === cat.value),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      <PageHeader
        title="Vendors"
        subtitle="Photo, zaffe, cake, makeup, henna & more"
        action={<FabLink href="/vendors/new" label="Add vendor" />}
      />

      {vendors.length === 0 ? (
        <EmptyState title="No vendors" description="Save quotes as you collect them." />
      ) : (
        <div className="space-y-6">
          {byCategory.map((group) => (
            <section key={group.value}>
              <SectionTitle>{group.label}</SectionTitle>
              <ul className="mt-2 space-y-2">
                {group.items.map((v) => (
                  <li key={v.id}>
                    <Link href={`/vendors/${v.id}/edit`}>
                      <Card className="active:border-gold/50 active:bg-blush/25">
                        <div className="flex justify-between gap-2">
                          <div>
                            <p className="font-semibold text-ink">{v.name}</p>
                            <p className="text-sm text-ink-muted">
                              {v.priceJod != null ? formatJod(v.priceJod) : "Price TBD"}
                            </p>
                          </div>
                          <Badge className={statusColor(v.status)}>{statusLabel(v.status)}</Badge>
                        </div>
                      </Card>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
