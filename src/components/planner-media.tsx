"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { PlannerMedia } from "@prisma/client";
import {
  deletePlannerMedia,
  listPlannerMedia,
} from "@/lib/actions/planner-media";
import { Card } from "@/components/ui";
import { mediaSrc } from "@/lib/media-url";
import { ImagePlus, Trash2, Camera, Lock } from "lucide-react";

export function PlannerMediaSection({
  plannerId,
  media: mediaProp,
  locked = false,
  onNeedsSave,
}: {
  plannerId?: string;
  media: PlannerMedia[];
  locked?: boolean;
  onNeedsSave?: () => void;
}) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [media, setMedia] = useState(mediaProp);

  useEffect(() => {
    setMedia(mediaProp);
  }, [mediaProp]);

  useEffect(() => {
    if (!plannerId || locked) return;
    listPlannerMedia(plannerId).then(setMedia).catch(() => {});
  }, [plannerId, locked]);

  function requirePlanner(): boolean {
    if (locked || !plannerId) {
      setError("Save the planner first (name required), then you can upload here.");
      onNeedsSave?.();
      return false;
    }
    return true;
  }

  async function refreshMedia() {
    if (!plannerId) return;
    const next = await listPlannerMedia(plannerId);
    setMedia(next);
  }

  function uploadFile(file: File) {
    if (!plannerId) return;
    setError(null);
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("file", file);
        const res = await fetch(`/api/planners/${plannerId}/media`, {
          method: "POST",
          body: fd,
          credentials: "same-origin",
        });
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) {
          throw new Error(data.error || `Upload failed (${res.status})`);
        }
        await refreshMedia();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    });
  }

  const pickClass =
    "flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gold/60 bg-blush/25 text-sm font-semibold text-sage-dark cursor-pointer active:bg-blush/40 disabled:cursor-wait disabled:opacity-70";

  return (
    <Card className="mt-4">
      <div className="mb-3 flex items-center gap-2">
        <Camera className="h-5 w-5 text-gold" />
        <h2 className="font-serif text-lg font-semibold text-ink">Planner photos</h2>
      </div>

      {locked && (
        <p className="mb-4 flex items-start gap-2 rounded-xl bg-blush/40 px-3 py-2.5 text-sm text-ink-muted">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          Fill in the planner details and tap <strong>Save planner</strong> first — then photo uploads work here.
        </p>
      )}

      {media.length > 0 ? (
        <div className="mb-3 grid grid-cols-2 gap-2">
          {media.map((p) => (
            <div key={p.id} className="relative overflow-hidden rounded-xl border border-gold-soft/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mediaSrc(p)} alt={p.originalName} className="aspect-square w-full object-cover" />
              <button
                type="button"
                className="absolute right-2 top-2 rounded-full bg-surface/95 p-1.5 text-sage shadow"
                onClick={() =>
                  startTransition(async () => {
                    if (!plannerId) return;
                    await deletePlannerMedia(p.id, plannerId);
                    await refreshMedia();
                  })
                }
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-3 text-sm text-ink-muted">Add portfolio shots or notes from your meeting.</p>
      )}
      <button
        type="button"
        disabled={pending}
        className={pickClass}
        onClick={() => {
          if (!requirePlanner()) return;
          photoInputRef.current?.click();
        }}
      >
        <ImagePlus className="h-5 w-5" />
        {pending ? "Uploading…" : "Add photo"}
      </button>
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file || !plannerId) return;
          uploadFile(file);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-2 text-sm text-sage-dark">{error}</p>}
    </Card>
  );
}
