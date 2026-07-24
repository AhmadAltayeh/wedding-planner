import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

export function getUploadRoot() {
  return UPLOAD_ROOT;
}

export function absolutePathForStorage(storagePath: string) {
  const resolved = path.join(UPLOAD_ROOT, storagePath);
  if (!resolved.startsWith(UPLOAD_ROOT)) {
    throw new Error("Invalid storage path");
  }
  return resolved;
}

export async function saveVenueFile(
  venueId: string,
  file: File
): Promise<{ storagePath: string; sizeBytes: number }> {
  const dir = path.join(UPLOAD_ROOT, "venues", venueId);
  await mkdir(dir, { recursive: true });

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
  const storagePath = path.join("venues", venueId, `${Date.now()}-${safeName}`);
  const abs = absolutePathForStorage(storagePath);

  const buffer = Buffer.from(await file.arrayBuffer());
  const maxBytes = 20 * 1024 * 1024;
  if (buffer.length > maxBytes) {
    throw new Error("File too large (max 20MB)");
  }

  await writeFile(abs, buffer);
  return { storagePath, sizeBytes: buffer.length };
}

export async function deleteStoredFile(storagePath: string) {
  try {
    await unlink(absolutePathForStorage(storagePath));
  } catch {
    // file may already be gone
  }
}
