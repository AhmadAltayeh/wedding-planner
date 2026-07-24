"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import type { PlannerMedia } from "@prisma/client";
import {
  uploadPlannerMedia,
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
}: {
  plannerId?: string;
  media: PlannerMedia[];
  locked?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [media, setMedia] = useState(mediaProp);
  const disabled = locked || !plannerId || pending;

  useEffect(() => {
    setMedia(mediaProp);
  }, [mediaProp]);

  useEffect(() => {
    if (!plannerId || locked) return;
    listPlannerMedia(plannerId).then(setMedia).catch(() => {});
  }, [plannerId, locked]);

  async function refreshMedia() {
    if (!plannerId) return;
    const next = await listPlannerMedia(plannerId);
    setMedia(next);
    router.refresh();
  }

  return (
    <Card className="mt-4">
      <div className="mb-3 flex items-center gap-2">
        <Camera className="h-5 w-5 text-gold" />
        <h2 className="font-serif text-lg font-semibold text-ink">Planner photos</h2>
      </div>

      {locked && (
        <p className="mb-4 flex items-start gap-2 rounded-xl bg-blush/40 px-3 py-2.5 text-sm text-ink-muted">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          Save the planner below (name required), then add photos here on the same page.
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
                disabled={disabled}
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
      <label
        className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gold/60 bg-blush/25 text-sm font-semibold text-sage-dark ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
      >
        <ImagePlus className="h-5 w-5" />
        {pending ? "Uploading…" : "Add photo"}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file || !plannerId) return;
            setError(null);
            const fd = new FormData();
            fd.set("file", file);
            startTransition(async () => {
              try {
                await uploadPlannerMedia(plannerId, fd);
                await refreshMedia();
              } catch (err) {
                setError(err instanceof Error ? err.message : "Upload failed");
              }
            });
            e.target.value = "";
          }}
        />
      </label>
      {error && <p className="mt-2 text-sm text-sage-dark">{error}</p>}
    </Card>
  );
}
