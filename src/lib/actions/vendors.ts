"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function listVendors(category?: string) {
  return prisma.vendor.findMany({
    where: category ? { category } : undefined,
    orderBy: { updatedAt: "desc" },
  });
}

export async function getVendor(id: string) {
  return prisma.vendor.findUnique({ where: { id } });
}

export async function createVendor(data: {
  name: string;
  category: string;
  contactPhone?: string;
  contactName?: string;
  contactInstagram?: string;
  priceJod?: number | null;
  priceType?: string;
  notes?: string;
  status?: string;
  rating?: number | null;
}) {
  const v = await prisma.vendor.create({
    data: { ...data, priceJod: data.priceJod ?? null, rating: data.rating ?? null },
  });
  revalidatePath("/vendors");
  revalidatePath("/");
  revalidatePath("/budget");
  return v;
}

export async function updateVendor(id: string, data: Parameters<typeof createVendor>[0]) {
  const v = await prisma.vendor.update({
    where: { id },
    data: { ...data, priceJod: data.priceJod ?? null, rating: data.rating ?? null },
  });
  revalidatePath("/vendors");
  revalidatePath(`/vendors/${id}`);
  revalidatePath("/budget");
  return v;
}

export async function deleteVendor(id: string) {
  await prisma.vendor.delete({ where: { id } });
  revalidatePath("/vendors");
  revalidatePath("/budget");
}
