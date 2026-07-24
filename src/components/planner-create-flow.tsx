"use client";

import Link from "next/link";
import { useState } from "react";
import type { Planner } from "@prisma/client";
import { PlannerForm } from "@/components/planner-form";
import { PlannerMediaSection } from "@/components/planner-media";
import { Button } from "@/components/ui";

export function PlannerCreateFlow() {
  const [planner, setPlanner] = useState<Planner | null>(null);

  return (
    <>
      <PlannerMediaSection plannerId={planner?.id} media={[]} locked={!planner} />
      <PlannerForm
        planner={planner ?? undefined}
        onCreated={(p) => setPlanner(p)}
        submitLabel={planner ? "Save changes" : "Save planner & unlock uploads"}
      />
      {planner && (
        <Link href="/planners" className="mt-4 block">
          <Button variant="secondary" className="w-full">
            Done — back to planners
          </Button>
        </Link>
      )}
    </>
  );
}
