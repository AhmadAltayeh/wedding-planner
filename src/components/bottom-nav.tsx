"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  Users,
  Store,
  Wallet,
  ListChecks,
  GitCompare,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/venues", label: "Venues", icon: Building2 },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/planners", label: "Planners", icon: Users },
  { href: "/vendors", label: "Vendors", icon: Store },
  { href: "/budget", label: "Budget", icon: Wallet },
  { href: "/tasks", label: "Tasks", icon: ListChecks },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  if (pathname === "/login") return null;

  return (
    <nav className="pointer-events-none fixed bottom-0 left-0 right-0 z-50 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div
        className={cn(
          "pointer-events-auto flex w-full max-w-lg overflow-x-auto rounded-2xl border border-gold-soft/70",
          "bg-surface/92 shadow-xl shadow-sage/15 backdrop-blur-xl scrollbar-none"
        )}
      >
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex min-w-[4.1rem] flex-1 flex-col items-center gap-0.5 px-1 py-2.5 text-[10px] font-semibold transition-colors",
                active ? "text-sage-dark" : "text-ink-muted"
              )}
            >
              {active && (
                <span className="absolute inset-x-2 top-1 h-0.5 rounded-full bg-gold" aria-hidden />
              )}
              <Icon className={cn("h-5 w-5", active && "stroke-[2.25] text-sage")} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
