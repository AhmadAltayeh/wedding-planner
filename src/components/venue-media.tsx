"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { VenueMedia } from "@prisma/client";
import { uploadVenueMedia, deleteVenueMedia } from "@/lib/actions/venues";
import { Card } from "@/components/ui";
import { Trash2, ImagePlus, FileText, Camera } from "lucide-react";

export function VenueMediaSection({
  venueId,
  media,
}: {
  venueId: string;
  media: VenueMedia[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const photos = media.filter((m) => m.kind === "photo");
  const menus = media.filter((m) => m.kind === "menu");

  function upload(kind: "photo" | "menu", file: File | null) {
    if (!file) return;
    setError(null);
    const fd = new FormData();
    fd.set("kind", kind);
    fd.set("file", file);
    startTransition(async () => {
      try {
        await uploadVenueMedia(venueId, fd);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      }
    });
  }

  return (
    <Card className="mt-4">
      <div className="mb-4 flex items-center gap-2">
        <Camera className="h-5 w-5 text-gold" />
        <h2 className="font-serif text-lg font-semibold text-ink">Photos & menu</h2>
      </div>
      <p className="mb-5 text-sm text-ink-muted">
        Snap the hall on your visit, and save the catering menu as a PDF or photo.
      </p>

      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-gold">Venue photos</h3>
          {photos.length > 0 ? (
            <div className="mb-3 grid grid-cols-2 gap-2">
              {photos.map((p) => (
                <div key={p.id} className="relative overflow-hidden rounded-xl border border-gold-soft/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/media/${p.id}`}
                    alt={p.originalName}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 rounded-full bg-surface/95 p-1.5 text-sage shadow"
                    aria-label="Remove photo"
                    onClick={() =>
                      startTransition(async () => {
                        await deleteVenueMedia(p.id, venueId);
                        router.refresh();
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="mb-2 text-sm text-ink-muted">No photos yet.</p>
          )}
          <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gold/60 bg-blush/25 px-3 text-sm font-semibold text-sage-dark active:bg-blush/50">
            <ImagePlus className="h-5 w-5 shrink-0" />
            <span>{pending ? "Uploading…" : "Add venue photos"}</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              className="hidden"
              disabled={pending}
              onChange={(e) => {
                const files = e.target.files;
                if (!files?.length) return;
                Array.from(files).forEach((file) => upload("photo", file));
                e.target.value = "";
              }}
            />
          </label>
        </div>

        <div className="border-t border-gold-soft/50 pt-5">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-gold">Food menu</h3>
          {menus.length > 0 ? (
            <ul className="mb-3 space-y-2">
              {menus.map((m) => {
                const isPdf = m.mimeType === "application/pdf" || m.originalName.toLowerCase().endsWith(".pdf");
                return (
                  <li
                    key={m.id}
                    className="flex items-center justify-between gap-2 rounded-xl bg-blush/35 px-3 py-2.5 text-sm"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <FileText className="h-5 w-5 shrink-0 text-gold" />
                      <a
                        href={`/api/media/${m.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate font-medium text-sage"
                      >
                        {m.originalName}
                      </a>
                      <span className="shrink-0 text-xs text-ink-muted">{isPdf ? "PDF" : "Image"}</span>
                    </div>
                    <button
                      type="button"
                      className="shrink-0 text-sage"
                      aria-label="Remove menu file"
                      onClick={() =>
                        startTransition(async () => {
                          await deleteVenueMedia(m.id, venueId);
                          router.refresh();
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mb-2 text-sm text-ink-muted">No menu file yet.</p>
          )}
          <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gold/60 bg-blush/25 px-3 text-sm font-semibold text-sage-dark active:bg-blush/50">
            <FileText className="h-5 w-5 shrink-0" />
            <span>{pending ? "Uploading…" : "Upload menu PDF or photo"}</span>
            <input
              type="file"
              accept="application/pdf,image/*,.pdf"
              className="hidden"
              disabled={pending}
              onChange={(e) => {
                upload("menu", e.target.files?.[0] ?? null);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>

      {error && <p className="mt-4 text-sm font-medium text-sage-dark">{error}</p>}
    </Card>
  );
}
