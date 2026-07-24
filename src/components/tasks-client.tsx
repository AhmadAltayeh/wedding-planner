"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createTask, toggleTask, deleteTask } from "@/lib/actions/tasks";
import type { Task } from "@prisma/client";
import { Button, Card, Field, Input, Select } from "@/components/ui";
import { TASK_CATEGORIES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Trash2 } from "lucide-react";

export function TasksClient({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("general");

  const open = tasks.filter((t) => !t.completed);
  const done = tasks.filter((t) => t.completed);

  return (
    <div>
      <Card className="mb-6">
        <Field label="New task">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Book court appointment"
          />
        </Field>
        <Field label="Category">
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            {TASK_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>
        </Field>
        <Button
          className="w-full"
          disabled={!title.trim() || pending}
          onClick={() =>
            startTransition(async () => {
              await createTask({ title, category });
              setTitle("");
              router.refresh();
            })
          }
        >
          Add task
        </Button>
      </Card>

      <section className="mb-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          To do ({open.length})
        </h2>
        <ul className="space-y-2">
          {open.map((t) => (
            <TaskRow key={t.id} task={t} />
          ))}
        </ul>
      </section>

      {done.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Done</h2>
          <ul className="space-y-2 opacity-70">
            {done.map((t) => (
              <TaskRow key={t.id} task={t} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function TaskRow({ task }: { task: Task }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  return (
    <li>
      <Card className="flex items-start gap-3 py-3">
        <input
          type="checkbox"
          className="mt-1 h-5 w-5 rounded border-slate-300"
          checked={task.completed}
          onChange={(e) =>
            startTransition(async () => {
              await toggleTask(task.id, e.target.checked);
              router.refresh();
            })
          }
        />
        <div className="min-w-0 flex-1">
          <p className={task.completed ? "line-through text-slate-500" : "font-medium"}>{task.title}</p>
          {task.dueDate && (
            <p className="text-xs text-slate-500">Due {formatDate(task.dueDate)}</p>
          )}
        </div>
        <button
          type="button"
          className="text-sage"
          onClick={() =>
            startTransition(async () => {
              await deleteTask(task.id);
              router.refresh();
            })
          }
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </Card>
    </li>
  );
}
