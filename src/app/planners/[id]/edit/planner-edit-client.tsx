"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Planner, PlannerMedia } from "@prisma/client";
import { deletePlanner } from "@/lib/actions/planners";
import { PageHeader, Button } from "@/components/ui";
import { PlannerForm } from "@/components/planner-form";
import { PlannerMediaSection } from "@/components/planner-media";

type PlannerWithMedia = Planner & { media: PlannerMedia[] };

export function PlannerEditClient({ planner }: { planner: PlannerWithMedia }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <PageHeader title="Edit planner" subtitle={planner.name} />
      <PlannerMediaSection plannerId={planner.id} media={planner.media} />
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
