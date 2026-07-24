"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function listPlanners() {
  return prisma.planner.findMany({ orderBy: { updatedAt: "desc" } });
}

export async function getPlanner(id: string) {
  return prisma.planner.findUnique({ where: { id } });
}

export async function createPlanner(data: {
  name: string;
  company?: string;
  contactPhone?: string;
  contactInstagram?: string;
  serviceLevel?: string;
  packagePriceJod?: number | null;
  priceNotes?: string;
  includesVenue?: boolean;
  includesVendors?: boolean;
  notes?: string;
  status?: string;
  rating?: number | null;
}) {
  const p = await prisma.planner.create({
    data: { ...data, packagePriceJod: data.packagePriceJod ?? null, rating: data.rating ?? null },
  });
  revalidatePath("/planners");
  revalidatePath("/");
  return p;
}

export async function updatePlanner(
  id: string,
  data: Parameters<typeof createPlanner>[0]
) {
  const p = await prisma.planner.update({
    where: { id },
    data: { ...data, packagePriceJod: data.packagePriceJod ?? null, rating: data.rating ?? null },
  });
  revalidatePath("/planners");
  revalidatePath(`/planners/${id}`);
  revalidatePath("/");
  return p;
}

export async function deletePlanner(id: string) {
  await prisma.planner.delete({ where: { id } });
  revalidatePath("/planners");
  revalidatePath("/");
}
