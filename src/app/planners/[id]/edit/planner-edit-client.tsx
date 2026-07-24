"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deletePlanner } from "@/lib/actions/planners";
import type { Planner } from "@prisma/client";
import { PageHeader, Button } from "@/components/ui";
import { PlannerForm } from "@/components/planner-form";

export function PlannerEditClient({ planner }: { planner: Planner }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <PageHeader title="Edit planner" subtitle={planner.name} />
      <PlannerForm planner={planner} />
      <Button
        variant="danger"
        className="mt-8 w-full"
        disabled={pending}
        onClick={() => {
          if (!confirm("Delete planner?")) return;
          startTransition(async () => {
            await deletePlanner(planner.id);
            router.push("/planners");
            router.refresh();
          });
        }}
      >
        Delete planner
      </Button>
    </div>
  );
}
