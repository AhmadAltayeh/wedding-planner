"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { storeMediaFile, removeMediaFile } from "@/lib/media-storage";
import { isAuthenticated } from "@/lib/auth";

export type VenueInput = {
  name: string;
  location?: string;
  venueType?: string;
  contactPhone?: string;
  contactName?: string;
  contactInstagram?: string;
  website?: string;
  pricePerPerson?: number | null;
  minGuests?: number | null;
  maxGuests?: number | null;
  serviceStyle?: string;
  includesFood?: boolean;
  includesDj?: boolean;
  includesLights?: boolean;
  includesTables?: boolean;
  includesChairs?: boolean;
  includesParking?: boolean;
  includesZaffe?: boolean;
  includesDecor?: boolean;
  djPriceJod?: number | null;
  lightsPriceJod?: number | null;
  hallRentalJod?: number | null;
  notes?: string;
  status?: string;
  rating?: number | null;
  visitedAt?: string | null;
};

const venueInclude = {
  availableDates: { orderBy: { date: "asc" as const } },
  addons: true,
  media: { orderBy: { createdAt: "desc" as const } },
};

export async function listVenues() {
  return prisma.venue.findMany({
    include: venueInclude,
    orderBy: { updatedAt: "desc" },
  });
}

export async function getVenue(id: string) {
  return prisma.venue.findUnique({
    where: { id },
    include: venueInclude,
  });
}

export async function createVenue(data: VenueInput) {
  const venue = await prisma.venue.create({ data: cleanVenue(data) });
  revalidatePath("/venues");
  revalidatePath("/venues/new");
  revalidatePath("/");
  revalidatePath("/compare");
  return venue;
}

export async function updateVenue(id: string, data: VenueInput) {
  const venue = await prisma.venue.update({
    where: { id },
    data: cleanVenue(data),
  });
  revalidatePath("/venues");
  revalidatePath(`/venues/${id}`);
  revalidatePath("/venues/new");
  revalidatePath("/");
  revalidatePath("/compare");
  return venue;
}

export async function deleteVenue(id: string) {
  const media = await prisma.venueMedia.findMany({ where: { venueId: id } });
  await prisma.venue.delete({ where: { id } });
  for (const m of media) {
    await removeMediaFile(m);
  }
  revalidatePath("/venues");
  revalidatePath("/");
  revalidatePath("/compare");
}

function cleanVenue(data: VenueInput) {
  return {
    ...data,
    pricePerPerson: data.pricePerPerson ?? null,
    minGuests: data.minGuests ?? null,
    maxGuests: data.maxGuests ?? null,
    hallRentalJod: data.hallRentalJod ?? null,
    djPriceJod: data.djPriceJod ?? null,
    lightsPriceJod: data.lightsPriceJod ?? null,
    rating: data.rating ?? null,
    visitedAt: data.visitedAt ? new Date(data.visitedAt) : data.visitedAt === null ? null : undefined,
  };
}

export async function addVenueDate(venueId: string, date: string, note?: string) {
  await prisma.venueDate.create({
    data: { venueId, date: new Date(date), note },
  });
  revalidatePath(`/venues/${venueId}`);
}

export async function removeVenueDate(id: string, venueId: string) {
  await prisma.venueDate.delete({ where: { id } });
  revalidatePath(`/venues/${venueId}`);
}

export async function addVenueAddon(
  venueId: string,
  data: {
    name: string;
    category?: string;
    priceJod?: number | null;
    priceType?: string;
    included?: boolean;
    notes?: string;
  }
) {
  await prisma.venueAddon.create({
    data: {
      venueId,
      name: data.name,
      category: data.category ?? "other",
      priceJod: data.priceJod ?? null,
      priceType: data.priceType ?? "fixed",
      included: data.included ?? false,
      notes: data.notes,
    },
  });
  revalidatePath(`/venues/${venueId}`);
}

export async function deleteVenueAddon(id: string, venueId: string) {
  await prisma.venueAddon.delete({ where: { id } });
  revalidatePath(`/venues/${venueId}`);
}

export async function uploadVenueMedia(venueId: string, formData: FormData) {
  if (!(await isAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const kind = String(formData.get("kind") ?? "");
  if (kind !== "photo" && kind !== "menu") {
    throw new Error("Invalid media kind");
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No file");
  }

  const allowedPhoto = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
  const allowedMenu = [...allowedPhoto, "application/pdf"];
  const allowed = kind === "photo" ? allowedPhoto : allowedMenu;
  const type = file.type || "";
  const ok =
    !type ||
    allowed.includes(type) ||
    type.startsWith("image/") ||
    (kind === "menu" && type === "application/pdf");
  if (!ok) {
    throw new Error("File type not allowed");
  }

  const { blobUrl, storagePath, sizeBytes } = await storeMediaFile("venues", venueId, file);

  await prisma.venueMedia.create({
    data: {
      venueId,
      kind,
      storagePath,
      blobUrl,
      originalName: file.name,
      mimeType: file.type || "application/octet-stream",
      sizeBytes,
    },
  });

  revalidatePath(`/venues/${venueId}`);
  revalidatePath("/venues/new");
}

export async function listVenueMedia(venueId: string) {
  return prisma.venueMedia.findMany({
    where: { venueId },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteVenueMedia(mediaId: string, venueId: string) {
  if (!(await isAuthenticated())) {
    throw new Error("Unauthorized");
  }
  const media = await prisma.venueMedia.findUnique({ where: { id: mediaId } });
  if (!media || media.venueId !== venueId) return;
  await prisma.venueMedia.delete({ where: { id: mediaId } });
  await removeMediaFile(media);
  revalidatePath(`/venues/${venueId}`);
}
