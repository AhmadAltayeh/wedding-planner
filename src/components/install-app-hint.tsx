"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

function isStandalone(): boolean {
  if (typeof window === "undefined") return true;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    nav.standalone === true ||
    window.matchMedia("(display-mode: fullscreen)").matches
  );
}

export function InstallAppHint({ className }: { className?: string }) {
  const [standalone, setStandalone] = useState(true);

  useEffect(() => {
    setStandalone(isStandalone());
  }, []);

  if (standalone) return null;

  return (
    <Card className={cn("border-sage/20 bg-surface", className)}>
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blush">
          <Smartphone className="h-5 w-5 text-sage" />
        </div>
        <div className="text-sm text-ink-muted">
          <p className="font-semibold text-ink">Open like a real app (no Safari bar)</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4">
            <li>
              In Safari, tap <strong>Share</strong> (square with arrow)
            </li>
            <li>
              Tap <strong>Add to Home Screen</strong>
            </li>
            <li>
              Open <strong>A &amp; N</strong> from your home screen — not from a bookmark
            </li>
          </ol>
          <p className="mt-2 text-xs">
            If it still opens inside Safari, delete the old icon and add again after the latest update.
          </p>
        </div>
      </div>
    </Card>
  );
}
