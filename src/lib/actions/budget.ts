"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function listBudgetItems() {
  return prisma.budgetItem.findMany({ orderBy: { category: "asc" } });
}

export async function createBudgetItem(data: {
  category: string;
  label: string;
  estimatedJod?: number | null;
  actualJod?: number | null;
  paid?: boolean;
  notes?: string;
}) {
  await prisma.budgetItem.create({
    data: {
      ...data,
      estimatedJod: data.estimatedJod ?? null,
      actualJod: data.actualJod ?? null,
    },
  });
  revalidatePath("/budget");
  revalidatePath("/");
}

export async function updateBudgetItem(
  id: string,
  data: Parameters<typeof createBudgetItem>[0]
) {
  await prisma.budgetItem.update({
    where: { id },
    data: {
      ...data,
      estimatedJod: data.estimatedJod ?? null,
      actualJod: data.actualJod ?? null,
    },
  });
  revalidatePath("/budget");
  revalidatePath("/");
}

export async function deleteBudgetItem(id: string) {
  await prisma.budgetItem.delete({ where: { id } });
  revalidatePath("/budget");
  revalidatePath("/");
}
