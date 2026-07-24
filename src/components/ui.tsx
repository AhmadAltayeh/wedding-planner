import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{subtitle}</p>}
        <div className="gold-rule mt-3 w-12" />
      </div>
      {action}
    </header>
  );
}

export function Card({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gold-soft/50 bg-surface/90 p-4 shadow-sm shadow-sage/5 backdrop-blur-[2px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        className
      )}
    >
      {children}
    </span>
  );
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50",
        variant === "primary" &&
          "bg-sage text-ivory shadow-md shadow-sage/20 ring-1 ring-gold-soft/30",
        variant === "secondary" &&
          "border border-gold-soft bg-blush/40 text-sage-dark",
        variant === "ghost" && "text-sage-dark",
        variant === "danger" && "bg-blush text-sage-dark",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input(props: React.ComponentProps<"input">) {
  return (
    <input
      className="min-h-11 w-full rounded-xl border border-gold-soft/80 bg-ivory px-3 text-base text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25"
      {...props}
    />
  );
}

export function Textarea(props: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className="w-full rounded-xl border border-gold-soft/80 bg-ivory px-3 py-2.5 text-base text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25"
      rows={3}
      {...props}
    />
  );
}

export function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink-muted">
      {children}
    </label>
  );
}

export function Select(props: React.ComponentProps<"select">) {
  return (
    <select
      className="min-h-11 w-full rounded-xl border border-gold-soft/80 bg-ivory px-3 text-base text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/25"
      {...props}
    />
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="text-center">
      <p className="font-serif text-lg font-medium text-ink">{title}</p>
      <p className="mt-2 text-sm text-ink-muted">{description}</p>
    </Card>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-xl font-semibold tracking-tight text-ink">{children}</h2>
  );
}
