import { listBudgetItems } from "@/lib/actions/budget";
import { getSettings } from "@/lib/actions/settings";
import { PageHeader } from "@/components/ui";
import { BudgetClient } from "@/components/budget-client";

export default async function BudgetPage() {
  const [items, settings] = await Promise.all([listBudgetItems(), getSettings()]);

  return (
    <div>
      <PageHeader
        title="Budget"
        subtitle="All amounts in Jordanian dinar (JOD)"
      />
      <BudgetClient items={items} totalBudget={settings.totalBudgetJod} />
    </div>
  );
}
