"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { VenueMedia } from "@prisma/client";
import { deleteVenueMedia, listVenueMedia } from "@/lib/actions/venues";
import { Card } from "@/components/ui";
import { CollapsibleSection } from "@/components/collapsible-section";
import { PhotoGallery } from "@/components/photo-gallery";
import { venueGalleryPhotos } from "@/lib/venue-photos";
import { mediaSrc, isImageMime } from "@/lib/media-url";
import { Trash2, ImagePlus, FileText, Camera, Lock } from "lucide-react";

export function VenueMediaSection({
  venueId,
  media: mediaProp,
  locked = false,
  onNeedsSave,
  variant = "default",
}: {
  venueId?: string;
  media: VenueMedia[];
  locked?: boolean;
  onNeedsSave?: () => void;
  variant?: "default" | "detail";
}) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const menuInputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [media, setMedia] = useState(mediaProp);

  useEffect(() => {
    setMedia(mediaProp);
  }, [mediaProp]);

  useEffect(() => {
    if (!venueId || locked) return;
    listVenueMedia(venueId).then(setMedia).catch(() => {});
  }, [venueId, locked]);

  const photos = venueGalleryPhotos(media);
  const menus = media.filter((m) => m.kind === "menu");
  const showUpload = variant !== "detail";

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

  const menuSummary =
    menus.length === 0 ? "No menu files yet" : `${menus.length} file${menus.length === 1 ? "" : "s"}`;

  const lockedHint = locked && (
    <p className="mb-4 flex items-start gap-2 rounded-xl bg-blush/40 px-3 py-2.5 text-sm text-ink-muted">
      <Lock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
      Fill in the venue details and tap <strong>Save venue</strong> first — then photos and menu uploads work here.
    </p>
  );

  const photosSection = (
    <section>
      {variant !== "detail" && (
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-gold">Venue photos</h3>
      )}
        {photos.length > 0 ? (
          <PhotoGallery
            photos={photos}
            onDelete={
              venueId && showUpload
                ? (mediaId) =>
                    startTransition(async () => {
                      await deleteVenueMedia(mediaId, venueId);
                      await refreshMedia();
                    })
                : undefined
            }
          />
        ) : (
          <p className="mb-3 rounded-xl bg-blush/30 px-3 py-6 text-center text-sm text-ink-muted">
            {variant === "detail"
              ? "No photos yet — tap Edit to add pictures from your venue visit."
              : "No photos yet — add pictures from your venue visit."}
          </p>
        )}
        {showUpload && (
          <>
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
          </>
        )}
    </section>
  );

  const menuSection = (
    <section>
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
  );

  const errorBlock = error && <p className="mt-4 text-sm font-medium text-sage-dark">{error}</p>;

  if (variant === "detail") {
    return (
      <div className="mt-4 space-y-4">
        <CollapsibleSection title="Catering menus" summary={menuSummary}>
          {lockedHint}
          {menuSection}
        </CollapsibleSection>
        <Card id="gallery">
          <div className="mb-4 flex items-center gap-2">
            <Camera className="h-5 w-5 text-gold" />
            <h2 className="font-serif text-lg font-semibold text-ink">Photo gallery</h2>
          </div>
          {photosSection}
        </Card>
        {errorBlock}
      </div>
    );
  }

  return (
    <Card className="mt-4" id="gallery">
      <div className="mb-4 flex items-center gap-2">
        <Camera className="h-5 w-5 text-gold" />
        <h2 className="font-serif text-lg font-semibold text-ink">Photo gallery & menu</h2>
      </div>
      {lockedHint}
      <div className="mb-6">{photosSection}</div>
      <div className="border-t border-gold-soft/50 pt-5">{menuSection}</div>
      {errorBlock}
    </Card>
  );
}
