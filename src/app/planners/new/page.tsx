import { PageHeader } from "@/components/ui";
import { PlannerCreateFlow } from "@/components/planner-create-flow";

export default function NewPlannerPage() {
  return (
    <div>
      <PageHeader title="Add planner" />
      <PlannerCreateFlow />
    </div>
  );
}
