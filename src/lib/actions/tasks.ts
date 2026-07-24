"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { seedDefaultTasks } from "./settings";

export async function listTasks() {
  await seedDefaultTasks();
  return prisma.task.findMany({
    orderBy: [{ completed: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

export async function createTask(data: {
  title: string;
  category?: string;
  dueDate?: string | null;
  notes?: string;
}) {
  const max = await prisma.task.aggregate({ _max: { sortOrder: true } });
  await prisma.task.create({
    data: {
      title: data.title,
      category: data.category ?? "general",
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      notes: data.notes,
      sortOrder: (max._max.sortOrder ?? 0) + 1,
    },
  });
  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function toggleTask(id: string, completed: boolean) {
  await prisma.task.update({ where: { id }, data: { completed } });
  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function deleteTask(id: string) {
  await prisma.task.delete({ where: { id } });
  revalidatePath("/tasks");
  revalidatePath("/");
}
