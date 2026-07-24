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
  context: { params: Promise<{ plannerId: string }> }
) {
  if (!(await requireSession(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plannerId } = await context.params;
  const planner = await prisma.planner.findUnique({ where: { id: plannerId }, select: { id: true } });
  if (!planner) {
    return NextResponse.json({ error: "Planner not found" }, { status: 404 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const type = file.type || "";
    const ok = !type || type.startsWith("image/") || ["image/jpeg", "image/png", "image/webp"].includes(type);
    if (!ok) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
    }

    const { blobUrl, storagePath, sizeBytes } = await storeMediaFile("planners", plannerId, file);

    const media = await prisma.plannerMedia.create({
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

    return NextResponse.json({ media });
  } catch (err) {
    console.error("[planner media upload]", err);
    return NextResponse.json({ error: formatUploadError(err) }, { status: 500 });
  }
}
