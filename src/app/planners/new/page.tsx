import { PageHeader } from "@/components/ui";
import { PlannerForm } from "@/components/planner-form";

export default function NewPlannerPage() {
  return (
    <div>
      <PageHeader title="Add planner" />
      <PlannerForm />
    </div>
  );
}
