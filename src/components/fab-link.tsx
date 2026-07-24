import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function FabLink({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-full bg-sage text-ivory shadow-lg shadow-sage/25 ring-2 ring-gold-soft/50 transition active:scale-95",
        className
      )}
    >
      <Plus className="h-6 w-6" strokeWidth={2.25} />
    </Link>
  );
}
