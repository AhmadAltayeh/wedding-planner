"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { storeMediaFile, removeMediaFile } from "@/lib/media-storage";

function validateImageFile(file: File) {
  const type = file.type || "";
  const ok = !type || type.startsWith("image/") || ["image/jpeg", "image/png", "image/webp"].includes(type);
  if (!ok) throw new Error("File type not allowed");
}

export async function uploadPlannerMedia(plannerId: string, formData: FormData) {
  if (!(await isAuthenticated())) throw new Error("Unauthorized");

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("No file");
  validateImageFile(file);

  const { blobUrl, storagePath, sizeBytes } = await storeMediaFile("planners", plannerId, file);

  await prisma.plannerMedia.create({
    data: {
      plannerId,
      kind: "photo",
      storagePath,
      blobUrl,
      originalName: file.name,
      mimeType: file.type || "application/octet-stream",
      sizeBytes,
    },
  });

  revalidatePath(`/planners/${plannerId}/edit`);
  revalidatePath("/planners/new");
  revalidatePath("/planners");
}

export async function listPlannerMedia(plannerId: string) {
  return prisma.plannerMedia.findMany({
    where: { plannerId },
    orderBy: { createdAt: "desc" },
  });
}

export async function deletePlannerMedia(mediaId: string, plannerId: string) {
  if (!(await isAuthenticated())) throw new Error("Unauthorized");
  const media = await prisma.plannerMedia.findUnique({ where: { id: mediaId } });
  if (!media || media.plannerId !== plannerId) return;
  await prisma.plannerMedia.delete({ where: { id: mediaId } });
  await removeMediaFile(media);
  revalidatePath(`/planners/${plannerId}/edit`);
  revalidatePath("/planners/new");
}
