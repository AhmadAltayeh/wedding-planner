import { notFound } from "next/navigation";
import { getPlanner } from "@/lib/actions/planners";
import { PlannerEditClient } from "./planner-edit-client";

export default async function EditPlannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const planner = await getPlanner(id);
  if (!planner) notFound();
  return <PlannerEditClient planner={planner} />;
}
