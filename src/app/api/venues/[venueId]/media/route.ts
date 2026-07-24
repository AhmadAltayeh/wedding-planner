import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/auth";
import { storeMediaFile, formatUploadError } from "@/lib/media-storage";

async function requireSession(request: Request): Promise<boolean> {
  const sessionToken = process.env.SESSION_TOKEN;
  const password = process.env.APP_PASSWORD;
  if (!password || !sessionToken) return true;
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  return match?.[1] === sessionToken;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ venueId: string }> }
) {
  if (!(await requireSession(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { venueId } = await context.params;
  const venue = await prisma.venue.findUnique({ where: { id: venueId }, select: { id: true } });
  if (!venue) {
    return NextResponse.json({ error: "Venue not found" }, { status: 404 });
  }

  try {
    const formData = await request.formData();
    const kind = String(formData.get("kind") ?? "");
    if (kind !== "photo" && kind !== "menu") {
      return NextResponse.json({ error: "Invalid media kind" }, { status: 400 });
    }

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
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
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
    }

    const { blobUrl, storagePath, sizeBytes } = await storeMediaFile("venues", venueId, file);

    const media = await prisma.venueMedia.create({
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

    return NextResponse.json({ media });
  } catch (err) {
    console.error("[venue media upload]", err);
    return NextResponse.json({ error: formatUploadError(err) }, { status: 500 });
  }
}
