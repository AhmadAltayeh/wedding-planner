"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { VenueMedia } from "@prisma/client";
import { deleteVenueMedia, listVenueMedia } from "@/lib/actions/venues";
import { Card } from "@/components/ui";
import { mediaSrc, isImageMime } from "@/lib/media-url";
import { Trash2, ImagePlus, FileText, Camera, Lock } from "lucide-react";

export function VenueMediaSection({
  venueId,
  media: mediaProp,
  locked = false,
  onNeedsSave,
}: {
  venueId?: string;
  media: VenueMedia[];
  locked?: boolean;
  onNeedsSave?: () => void;
}) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const menuInputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const [media, setMedia] = useState(mediaProp);

  useEffect(() => {
    setMedia(mediaProp);
  }, [mediaProp]);

  useEffect(() => {
    if (!venueId || locked) return;
    listVenueMedia(venueId).then(setMedia).catch(() => {});
  }, [venueId, locked]);

  const photos = media.filter((m) => m.kind === "photo");
  const menus = media.filter((m) => m.kind === "menu");

  function requireVenue(): boolean {
    if (locked || !venueId) {
      setError("Save the venue first (name required), then you can upload here.");
      onNeedsSave?.();
      return false;
    }
    return true;
  }

  async function refreshMedia() {
    if (!venueId) return;
    const next = await listVenueMedia(venueId);
    setMedia(next);
  }

  async function uploadViaApi(kind: "photo" | "menu", file: File) {
    if (!venueId) return;
    setError(null);
    const fd = new FormData();
    fd.set("kind", kind);
    fd.set("file", file);
    const res = await fetch(`/api/venues/${venueId}/media`, {
      method: "POST",
      body: fd,
      credentials: "same-origin",
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      throw new Error(data.error || `Upload failed (${res.status})`);
    }
    await refreshMedia();
  }

  function upload(kind: "photo" | "menu", file: File | null) {
    if (!file || !venueId) return;
    startTransition(async () => {
      try {
        await uploadViaApi(kind, file);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      }
    });
  }

  const pickClass =
    "flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gold/60 bg-blush/25 text-sm font-semibold text-sage-dark cursor-pointer active:bg-blush/40 disabled:cursor-wait disabled:opacity-70";

  return (
    <Card className="mt-4" id="gallery">
      <div className="mb-4 flex items-center gap-2">
        <Camera className="h-5 w-5 text-gold" />
        <h2 className="font-serif text-lg font-semibold text-ink">Photo gallery & menu</h2>
      </div>

      {locked && (
        <p className="mb-4 flex items-start gap-2 rounded-xl bg-blush/40 px-3 py-2.5 text-sm text-ink-muted">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          Fill in the venue details and tap <strong>Save venue</strong> first — then photos and menu uploads work here.
        </p>
      )}

      <section className="mb-6">
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-gold">Venue photos</h3>
        {photos.length > 0 ? (
          <>
            <div className="mb-3 overflow-hidden rounded-2xl border border-gold-soft/60 bg-blush/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaSrc(photos[activePhoto] ?? photos[0])}
                alt=""
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {photos.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActivePhoto(i)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                    i === activePhoto ? "border-gold" : "border-transparent"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mediaSrc(p)} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <div className="mb-3 flex flex-wrap gap-2">
              {photos.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="text-xs font-medium text-sage underline"
                  onClick={() =>
                    startTransition(async () => {
                      if (!venueId) return;
                      await deleteVenueMedia(p.id, venueId);
                      await refreshMedia();
                    })
                  }
                >
                  Remove photo
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="mb-3 rounded-xl bg-blush/30 px-3 py-6 text-center text-sm text-ink-muted">
            No photos yet — add pictures from your venue visit.
          </p>
        )}
        <button
          type="button"
          disabled={pending}
          className={pickClass}
          onClick={() => {
            if (!requireVenue()) return;
            photoInputRef.current?.click();
          }}
        >
          <ImagePlus className="h-5 w-5" />
          {pending ? "Uploading…" : "Add photos (camera or gallery)"}
        </button>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            const files = e.target.files;
            if (!files?.length) return;
            Array.from(files).forEach((f) => upload("photo", f));
            e.target.value = "";
          }}
        />
      </section>

      <section className="border-t border-gold-soft/50 pt-5">
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-gold">Catering menu</h3>
        {menus.length > 0 ? (
          <ul className="mb-3 space-y-3">
            {menus.map((m) => {
              const src = mediaSrc(m);
              const isPdf = m.mimeType === "application/pdf" || m.originalName.toLowerCase().endsWith(".pdf");
              return (
                <li key={m.id} className="overflow-hidden rounded-xl border border-gold-soft/40 bg-blush/20">
                  {isImageMime(m.mimeType) && (
                    <a href={src} target="_blank" rel="noreferrer">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={m.originalName} className="max-h-48 w-full object-cover" />
                    </a>
                  )}
                  <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                    <a href={src} target="_blank" rel="noreferrer" className="flex min-w-0 items-center gap-2 font-medium text-sage">
                      <FileText className="h-5 w-5 shrink-0 text-gold" />
                      <span className="truncate">{m.originalName}</span>
                      <span className="shrink-0 text-xs text-ink-muted">{isPdf ? "PDF" : "Image"}</span>
                    </a>
                    <button
                      type="button"
                      className="shrink-0 text-sage"
                      onClick={() =>
                        startTransition(async () => {
                          if (!venueId) return;
                          await deleteVenueMedia(m.id, venueId);
                          await refreshMedia();
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mb-3 text-sm text-ink-muted">Upload the PDF or a photo of the menu they sent you.</p>
        )}
        <button
          type="button"
          disabled={pending}
          className={pickClass}
          onClick={() => {
            if (!requireVenue()) return;
            menuInputRef.current?.click();
          }}
        >
          <FileText className="h-5 w-5" />
          {pending ? "Uploading…" : "Upload menu (PDF or photo)"}
        </button>
        <input
          ref={menuInputRef}
          type="file"
          accept="application/pdf,image/*,.pdf"
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            upload("menu", e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
      </section>

      {error && <p className="mt-4 text-sm font-medium text-sage-dark">{error}</p>}
    </Card>
  );
}
