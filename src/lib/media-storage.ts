import { put, del } from "@vercel/blob";
import { saveMediaFile, deleteStoredFile } from "@/lib/uploads";

export type StoredMedia = {
  blobUrl: string | null;
  storagePath: string;
  sizeBytes: number;
};

export async function storeMediaFile(
  folder: "venues" | "planners",
  entityId: string,
  file: File
): Promise<StoredMedia> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const maxBytes = 20 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error("File too large (max 20MB)");
  }

  if (token) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
    const pathname = `${folder}/${entityId}/${Date.now()}-${safeName}`;
    const blob = await put(pathname, file, { access: "public", token });
    return { blobUrl: blob.url, storagePath: "", sizeBytes: file.size };
  }

  const { storagePath, sizeBytes } = await saveMediaFile(folder, entityId, file);
  return { blobUrl: null, storagePath, sizeBytes };
}

export async function removeMediaFile(media: {
  blobUrl: string | null;
  storagePath: string;
}) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (media.blobUrl && token) {
    await del(media.blobUrl, { token });
  }
  if (media.storagePath) {
    await deleteStoredFile(media.storagePath);
  }
}
