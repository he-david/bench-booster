import type { ReactNode } from "react";

type Accent = "indigo" | "amber" | "emerald" | "violet";

const ACCENT_STYLES: Record<
  Accent,
  { bar: string; icon: string; iconBg: string }
> = {
  indigo: {
    bar: "from-indigo-500 to-indigo-700",
    icon: "text-indigo-600",
    iconBg: "bg-indigo-50 ring-indigo-100",
  },
  amber: {
    bar: "from-amber-400 to-amber-600",
    icon: "text-amber-600",
    iconBg: "bg-amber-50 ring-amber-100",
  },
  emerald: {
    bar: "from-emerald-400 to-emerald-600",
    icon: "text-emerald-600",
    iconBg: "bg-emerald-50 ring-emerald-100",
  },
  violet: {
    bar: "from-violet-400 to-violet-600",
    icon: "text-violet-600",
    iconBg: "bg-violet-50 ring-violet-100",
  },
};

export default function KpiCard({
  label,
  value,
  accent = "indigo",
  icon,
  hint,
}: {
  label: string;
  value: string | number;
  accent?: Accent;
  icon?: ReactNode;
  hint?: string;
}) {
  const a = ACCENT_STYLES[accent];
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${a.bar}`} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
        {icon && (
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ${a.iconBg} ${a.icon}`}
          >
            {icon}
          </span>
        )}
      </div>
    </div>
  );
}
