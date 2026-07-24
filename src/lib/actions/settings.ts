"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  return prisma.weddingSettings.upsert({
    where: { id: "default" },
    create: { id: "default", partnerOne: "Ahmad", partnerTwo: "Nour" },
    update: {},
  });
}

export async function updateSettings(data: {
  partnerOne?: string;
  partnerTwo?: string;
  weddingDate?: string | null;
  guestEstimate?: number;
  totalBudgetJod?: number | null;
  notes?: string;
}) {
  await prisma.weddingSettings.upsert({
    where: { id: "default" },
    create: { id: "default", ...parseSettings(data) },
    update: parseSettings(data),
  });
  revalidatePath("/");
  revalidatePath("/compare");
  revalidatePath("/budget");
}

function parseSettings(data: {
  partnerOne?: string;
  partnerTwo?: string;
  weddingDate?: string | null;
  guestEstimate?: number;
  totalBudgetJod?: number | null;
  notes?: string;
}) {
  return {
    partnerOne: data.partnerOne,
    partnerTwo: data.partnerTwo,
    weddingDate: data.weddingDate ? new Date(data.weddingDate) : data.weddingDate === null ? null : undefined,
    guestEstimate: data.guestEstimate,
    totalBudgetJod: data.totalBudgetJod,
    notes: data.notes,
  };
}

export async function seedDefaultTasks() {
  const count = await prisma.task.count();
  if (count > 0) return;
  const defaults = [
    "Set wedding date & guest estimate",
    "Book venue or hotel hall",
    "Court / legal marriage paperwork (Jordan)",
    "Choose photographer & videographer",
    "Book zaffe & DJ",
    "Send save-the-dates / invitations",
    "Tasting with caterer",
    "Bridal dress fittings",
    "Final guest count to venue",
    "Payment schedule review",
  ];
  await prisma.task.createMany({
    data: defaults.map((title, i) => ({ title, sortOrder: i, category: "general" })),
  });
  revalidatePath("/tasks");
}
