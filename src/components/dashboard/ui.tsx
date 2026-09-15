export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-paper/10 bg-paper/[0.03] p-5 ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card>
      <p className="text-[0.68rem] uppercase tracking-[0.14em] text-paper/45">{label}</p>
      <p className="mt-2 font-display text-3xl italic">{value}</p>
      {hint && <p className="mt-1 text-xs text-paper/40">{hint}</p>}
    </Card>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-paper/15 p-10 text-center">
      <p className="text-sm">{title}</p>
      <p className="mt-1.5 text-xs text-paper/50">{body}</p>
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-paper/10 ${className}`} />;
}

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "warning" | "success" | "danger";
  children: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-paper/10 text-paper/70",
    warning: "bg-amber-400/15 text-amber-300",
    success: "bg-emerald-400/15 text-emerald-300",
    danger: "bg-red-400/15 text-red-300",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.1em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl italic sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-paper/55">{description}</p>}
      </div>
      {action}
    </div>
  );
}
