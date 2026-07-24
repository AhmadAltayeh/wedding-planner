import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { absolutePathForStorage } from "@/lib/uploads";
import { SESSION_COOKIE } from "@/lib/auth";

type StoredMedia = {
  blobUrl: string | null;
  storagePath: string;
  mimeType: string;
  originalName: string;
};

async function resolveMedia(id: string): Promise<StoredMedia | null> {
  const venue = await prisma.venueMedia.findUnique({ where: { id } });
  if (venue) return venue;
  const planner = await prisma.plannerMedia.findUnique({ where: { id } });
  return planner;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const sessionToken = process.env.SESSION_TOKEN;
  const password = process.env.APP_PASSWORD;
  if (password && sessionToken) {
    const cookieHeader = _request.headers.get("cookie") ?? "";
    const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
    if (match?.[1] !== sessionToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  const { id } = await context.params;
  const media = await resolveMedia(id);
  if (!media) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (media.blobUrl) {
    return NextResponse.redirect(media.blobUrl);
  }

  if (!media.storagePath) {
    return new NextResponse("File missing", { status: 404 });
  }

  try {
    const data = await readFile(absolutePathForStorage(media.storagePath));
    return new NextResponse(data, {
      headers: {
        "Content-Type": media.mimeType,
        "Content-Disposition": `inline; filename="${encodeURIComponent(media.originalName)}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return new NextResponse("File missing", { status: 404 });
  }
}
