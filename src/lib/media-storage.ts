import { put, del } from "@vercel/blob";
import { saveMediaFile, deleteStoredFile } from "@/lib/uploads";

export type StoredMedia = {
  blobUrl: string | null;
  storagePath: string;
  sizeBytes: number;
};

function isVercelRuntime(): boolean {
  return Boolean(process.env.VERCEL);
}

export function formatUploadError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/no such column.*blobUrl/i.test(msg) || /Unknown column.*blobUrl/i.test(msg)) {
    return "Database is missing photo columns. Run scripts/turso-add-media.sql on Turso, then redeploy.";
  }
  if (/no such table.*VenueMedia|PlannerMedia/i.test(msg)) {
    return "Database is missing media tables. Run scripts/turso-add-media.sql on Turso, then redeploy.";
  }
  if (/public access on a private store/i.test(msg)) {
    return "Blob store is private — redeploy the latest app (uploads now use private access).";
  }
  if (/EROFS|read-only file system/i.test(msg)) {
    return "File storage is not configured on Vercel. Connect a Blob store to this project.";
  }
  return msg || "Upload failed";
}

export async function storeMediaFile(
  folder: "venues" | "planners",
  entityId: string,
  file: File
): Promise<StoredMedia> {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  const maxBytes = 20 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error("File too large (max 20MB)");
  }

  if (token) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
    const pathname = `${folder}/${entityId}/${Date.now()}-${safeName}`;
    const body = Buffer.from(await file.arrayBuffer());
    const blob = await put(pathname, body, {
      access: "private",
      token,
      contentType: file.type || "application/octet-stream",
    } as unknown as { access: "public"; token?: string; contentType?: string });
    return { blobUrl: blob.url, storagePath: "", sizeBytes: body.length };
  }

  if (isVercelRuntime()) {
    throw new Error(
      "Blob storage is not configured. In Vercel: Storage → Blob → connect to this project, then redeploy."
    );
  }

  const { storagePath, sizeBytes } = await saveMediaFile(folder, entityId, file);
  return { blobUrl: null, storagePath, sizeBytes };
}

export async function removeMediaFile(media: {
  blobUrl: string | null;
  storagePath: string;
}) {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (media.blobUrl && token) {
    await del(media.blobUrl, { token });
  }
  if (media.storagePath) {
    await deleteStoredFile(media.storagePath);
  }
}
