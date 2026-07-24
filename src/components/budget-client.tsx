"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createBudgetItem,
  updateBudgetItem,
  deleteBudgetItem,
} from "@/lib/actions/budget";
import type { BudgetItem } from "@prisma/client";
import { Button, Card, Field, Input, Select } from "@/components/ui";
import { formatJod } from "@/lib/utils";
import { Trash2 } from "lucide-react";

const CATEGORIES = [
  "venue",
  "catering",
  "planner",
  "photography",
  "video",
  "attire",
  "decor",
  "music",
  "invitations",
  "other",
];

export function BudgetClient({
  items,
  totalBudget,
}: {
  items: BudgetItem[];
  totalBudget: number | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState("venue");
  const [estimated, setEstimated] = useState("");

  const estSum = items.reduce((s, i) => s + (i.estimatedJod ?? 0), 0);
  const actualSum = items.reduce((s, i) => s + (i.actualJod ?? 0), 0);

  return (
    <div>
      <Card className="mb-6">
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-slate-500">Target budget</dt>
          <dd className="font-semibold">{formatJod(totalBudget)}</dd>
          <dt className="text-slate-500">Estimated (lines)</dt>
          <dd className="font-semibold">{formatJod(estSum)}</dd>
          <dt className="text-slate-500">Actual paid</dt>
          <dd className="font-semibold text-sage-dark">{formatJod(actualSum)}</dd>
          {totalBudget != null && (
            <>
              <dt className="text-slate-500">Remaining (est.)</dt>
              <dd className="font-semibold">{formatJod(totalBudget - estSum)}</dd>
            </>
          )}
        </dl>
      </Card>

      <ul className="mb-6 space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <Card className="text-sm">
              <div className="flex justify-between gap-2">
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-slate-600 capitalize">{item.category}</p>
                </div>
                <button
                  type="button"
                  className="text-sage"
                  onClick={() =>
                    startTransition(async () => {
                      await deleteBudgetItem(item.id);
                      router.refresh();
                    })
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <label className="text-xs text-slate-500">
                  Estimated
                  <Input
                    type="number"
                    className="mt-1"
                    defaultValue={item.estimatedJod ?? ""}
                    onBlur={(e) =>
                      startTransition(async () => {
                        await updateBudgetItem(item.id, {
                          category: item.category,
                          label: item.label,
                          estimatedJod: e.target.value === "" ? null : Number(e.target.value),
                          actualJod: item.actualJod,
                          paid: item.paid,
                          notes: item.notes ?? undefined,
                        });
                        router.refresh();
                      })
                    }
                  />
                </label>
                <label className="text-xs text-slate-500">
                  Actual
                  <Input
                    type="number"
                    className="mt-1"
                    defaultValue={item.actualJod ?? ""}
                    onBlur={(e) =>
                      startTransition(async () => {
                        await updateBudgetItem(item.id, {
                          category: item.category,
                          label: item.label,
                          estimatedJod: item.estimatedJod,
                          actualJod: e.target.value === "" ? null : Number(e.target.value),
                          paid: item.paid,
                          notes: item.notes ?? undefined,
                        });
                        router.refresh();
                      })
                    }
                  />
                </label>
              </div>
              <label className="mt-2 flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  defaultChecked={item.paid}
                  onChange={(e) =>
                    startTransition(async () => {
                      await updateBudgetItem(item.id, {
                        category: item.category,
                        label: item.label,
                        estimatedJod: item.estimatedJod,
                        actualJod: item.actualJod,
                        paid: e.target.checked,
                        notes: item.notes ?? undefined,
                      });
                      router.refresh();
                    })
                  }
                />
                Paid
              </label>
            </Card>
          </li>
        ))}
      </ul>

      <Card>
        <h2 className="mb-3 font-medium">Add budget line</h2>
        <Field label="Label">
          <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Venue deposit" />
        </Field>
        <Field label="Category">
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Estimated (JOD)">
          <Input type="number" value={estimated} onChange={(e) => setEstimated(e.target.value)} />
        </Field>
        <Button
          className="w-full"
          disabled={!label.trim() || pending}
          onClick={() =>
            startTransition(async () => {
              await createBudgetItem({
                label,
                category,
                estimatedJod: estimated === "" ? null : Number(estimated),
              });
              setLabel("");
              setEstimated("");
              router.refresh();
            })
          }
        >
          Add
        </Button>
      </Card>
    </div>
  );
}
