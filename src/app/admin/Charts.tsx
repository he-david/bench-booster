"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const TECH_PALETTE = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#f43f5e",
];

const TOOLTIP_STYLE = {
  contentStyle: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "0.5rem",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.08)",
    fontSize: "12px",
    color: "#0f172a",
  },
  labelStyle: { color: "#475569", fontWeight: 500 },
  cursor: { fill: "rgba(99,102,241,0.08)" },
};

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function TechBarChart({
  data,
}: {
  data: { technology: string; count: number }[];
}) {
  return (
    <ChartCard
      title="Questions by technology"
      subtitle="Distribution across the question bank"
    >
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="technology"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip {...TOOLTIP_STYLE} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={TECH_PALETTE[i % TECH_PALETTE.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function SkillRatingChart({
  data,
}: {
  data: { skillCategory: string; avgRating: number }[];
}) {
  return (
    <ChartCard
      title="Avg rating by skill"
      subtitle="Higher means more useful to the team"
    >
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="skillCategory"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 5]}
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip {...TOOLTIP_STYLE} />
          <Bar dataKey="avgRating" fill="url(#ratingGradient)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
