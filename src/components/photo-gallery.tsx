"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { VenueMedia } from "@prisma/client";
import { mediaSrc } from "@/lib/media-url";
import { ChevronLeft, ChevronRight, X, Trash2 } from "lucide-react";

type PhotoItem = Pick<VenueMedia, "id" | "blobUrl" | "originalName">;

function scrollIndex(container: HTMLDivElement): number {
  const w = container.clientWidth;
  if (w <= 0) return 0;
  return Math.round(container.scrollLeft / w);
}

export function PhotoGallery({
  photos,
  onDelete,
}: {
  photos: PhotoItem[];
  onDelete?: (id: string) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const syncFromRail = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setIndex(scrollIndex(el));
  }, []);

  useEffect(() => {
    if (index >= photos.length) setIndex(Math.max(0, photos.length - 1));
  }, [photos.length, index]);

  if (photos.length === 0) return null;

  return (
    <>
      <div
        ref={railRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 scrollbar-none"
        onScroll={syncFromRail}
      >
        {photos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className="w-[88%] shrink-0 snap-center sm:w-full"
            onClick={() => {
              setIndex(i);
              setLightbox(true);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaSrc(p)}
              alt={p.originalName || `Venue photo ${i + 1}`}
              className="aspect-[4/3] w-full rounded-2xl border border-gold-soft/60 object-cover"
            />
          </button>
        ))}
      </div>

      <p className="mt-2 text-center text-xs text-ink-muted">
        Swipe sideways · tap a photo to view full screen ({index + 1} / {photos.length})
      </p>

      {lightbox && (
        <PhotoLightbox
          photos={photos}
          startIndex={index}
          onClose={() => setLightbox(false)}
          onIndexChange={setIndex}
          onDelete={onDelete}
        />
      )}
    </>
  );
}

function PhotoLightbox({
  photos,
  startIndex,
  onClose,
  onIndexChange,
  onDelete,
}: {
  photos: PhotoItem[];
  startIndex: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
  onDelete?: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(startIndex);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const goTo = useCallback((i: number) => {
    const next = Math.max(0, Math.min(photos.length - 1, i));
    setIndex(next);
    onIndexChange(next);
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    }
  }, [photos.length, onIndexChange]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: startIndex * el.clientWidth, behavior: "auto" });
    setIndex(startIndex);
  }, [startIndex]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.dispatchEvent(new Event("wedding-gallery-open"));
    return () => {
      document.body.style.overflow = "";
      window.dispatchEvent(new Event("wedding-gallery-close"));
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goTo(index - 1);
      if (e.key === "ArrowRight") goTo(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, goTo, onClose]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const i = scrollIndex(el);
    if (i !== index) {
      setIndex(i);
      onIndexChange(i);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex flex-col bg-black/95" role="dialog" aria-modal>
      <div className="flex items-center justify-between gap-2 px-4 py-3 text-ivory">
        <span className="text-sm font-medium">
          {index + 1} / {photos.length}
        </span>
        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              type="button"
              className="rounded-full p-2 active:bg-white/10"
              aria-label="Remove photo"
              onClick={() => {
                const id = photos[index]?.id;
                if (!id) return;
                if (!confirm("Remove this photo?")) return;
                onDelete(id);
                onClose();
              }}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
          <button type="button" className="rounded-full p-2 active:bg-white/10" aria-label="Close" onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center">
        {photos.length > 1 && (
          <button
            type="button"
            className="absolute left-1 z-10 rounded-full bg-black/40 p-2 text-ivory disabled:opacity-30"
            disabled={index <= 0}
            aria-label="Previous photo"
            onClick={() => goTo(index - 1)}
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scrollbar-none"
          onScroll={onScroll}
        >
          {photos.map((p, i) => (
            <div
              key={p.id}
              className="flex h-full min-w-full shrink-0 snap-center items-center justify-center px-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaSrc(p)}
                alt={p.originalName || `Photo ${i + 1}`}
                className="max-h-[75vh] max-w-full object-contain"
              />
            </div>
          ))}
        </div>

        {photos.length > 1 && (
          <button
            type="button"
            className="absolute right-1 z-10 rounded-full bg-black/40 p-2 text-ivory disabled:opacity-30"
            disabled={index >= photos.length - 1}
            aria-label="Next photo"
            onClick={() => goTo(index + 1)}
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        )}
      </div>

      <p className="pb-[max(1rem,env(safe-area-inset-bottom))] text-center text-xs text-white/60">
        Swipe left or right
      </p>
    </div>,
    document.body
  );
}
