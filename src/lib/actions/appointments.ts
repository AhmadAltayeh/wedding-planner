"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function listAppointments() {
  return prisma.appointment.findMany({
    orderBy: { startsAt: "asc" },
  });
}

export async function listUpcomingAppointments(limit = 5) {
  const now = new Date();
  return prisma.appointment.findMany({
    where: { startsAt: { gte: now } },
    orderBy: { startsAt: "asc" },
    take: limit,
  });
}

export async function createAppointment(data: {
  title: string;
  startsAt: string;
  endsAt?: string | null;
  location?: string;
  notes?: string;
  venueId?: string | null;
  plannerId?: string | null;
  vendorId?: string | null;
  remindMins?: number;
}) {
  await prisma.appointment.create({
    data: {
      title: data.title.trim(),
      startsAt: new Date(data.startsAt),
      endsAt: data.endsAt ? new Date(data.endsAt) : null,
      location: data.location?.trim() || null,
      notes: data.notes?.trim() || null,
      venueId: data.venueId || null,
      plannerId: data.plannerId || null,
      vendorId: data.vendorId || null,
      remindMins: data.remindMins ?? 60,
    },
  });
  revalidatePath("/appointments");
  revalidatePath("/");
}

export async function deleteAppointment(id: string) {
  await prisma.appointment.delete({ where: { id } });
  revalidatePath("/appointments");
  revalidatePath("/");
}

export async function getAppointment(id: string) {
  return prisma.appointment.findUnique({ where: { id } });
}
