import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

export function absolutePathForStorage(storagePath: string) {
  const resolved = path.join(UPLOAD_ROOT, storagePath);
  if (!resolved.startsWith(UPLOAD_ROOT)) {
    throw new Error("Invalid storage path");
  }
  return resolved;
}

export async function saveMediaFile(
  folder: string,
  entityId: string,
  file: File
): Promise<{ storagePath: string; sizeBytes: number }> {
  const dir = path.join(UPLOAD_ROOT, folder, entityId);
  await mkdir(dir, { recursive: true });

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
  const storagePath = path.join(folder, entityId, `${Date.now()}-${safeName}`);
  const abs = absolutePathForStorage(storagePath);

  const buffer = Buffer.from(await file.arrayBuffer());
  const maxBytes = 20 * 1024 * 1024;
  if (buffer.length > maxBytes) {
    throw new Error("File too large (max 20MB)");
  }

  await writeFile(abs, buffer);
  return { storagePath, sizeBytes: buffer.length };
}

/** @deprecated use saveMediaFile */
export async function saveVenueFile(venueId: string, file: File) {
  return saveMediaFile("venues", venueId, file);
}

export async function deleteStoredFile(storagePath: string) {
  if (!storagePath) return;
  try {
    await unlink(absolutePathForStorage(storagePath));
  } catch {
    // file may already be gone
  }
}
