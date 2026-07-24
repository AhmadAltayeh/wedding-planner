"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function listPlanners() {
  return prisma.planner.findMany({
    include: { media: { where: { kind: "photo" }, take: 1 } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPlanner(id: string) {
  return prisma.planner.findUnique({
    where: { id },
    include: { media: { orderBy: { createdAt: "desc" } } },
  });
}

export async function createPlanner(data: {
  name: string;
  company?: string;
  contactPhone?: string;
  contactName?: string;
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
  revalidatePath("/planners/new");
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
  const media = await prisma.plannerMedia.findMany({ where: { plannerId: id } });
  await prisma.planner.delete({ where: { id } });
  const { removeMediaFile } = await import("@/lib/media-storage");
  for (const m of media) {
    await removeMediaFile(m);
  }
  revalidatePath("/planners");
  revalidatePath("/");
}
