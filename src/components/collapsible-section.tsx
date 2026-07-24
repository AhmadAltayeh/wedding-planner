"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

export function CollapsibleSection({
  title,
  summary,
  defaultOpen = false,
  className,
  children,
}: {
  title: string;
  summary?: string;
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className={cn("mt-4", className)}>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 text-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="min-w-0">
          <h2 className="font-serif text-lg font-semibold text-ink">{title}</h2>
          {summary && !open && <p className="mt-0.5 text-sm text-ink-muted">{summary}</p>}
        </div>
        <ChevronDown
          className={cn("h-5 w-5 shrink-0 text-gold transition-transform", open && "rotate-180")}
        />
      </button>
      {open && <div className="mt-4 border-t border-gold-soft/50 pt-4">{children}</div>}
    </Card>
  );
}
