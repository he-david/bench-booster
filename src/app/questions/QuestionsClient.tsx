"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StarRating from "@/components/StarRating";
import type { QuestionRow } from "./page";

const SENIORITY_ORDER = ["A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4"];

const selectClass =
  "rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm transition hover:border-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30";

export default function QuestionsClient({
  questions,
}: {
  questions: QuestionRow[];
}) {
  const router = useRouter();
  const [tech, setTech] = useState("all");
  const [skill, setSkill] = useState("all");
  const [seniority, setSeniority] = useState("all");
  const [company, setCompany] = useState("all");
  const [sortByRating, setSortByRating] = useState(false);
  const [openCards, setOpenCards] = useState<Set<string>>(new Set());

  const technologies = [
    "all",
    ...Array.from(new Set(questions.map((q) => q.technology))).sort(),
  ];
  const skills = [
    "all",
    ...Array.from(new Set(questions.map((q) => q.skillCategory))).sort(),
  ];
  const companies = [
    "all",
    ...Array.from(new Set(questions.map((q) => q.client))).sort(),
  ];

  function toggleCard(id: string) {
    setOpenCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function refresh() {
    router.refresh();
  }

  function resetFilters() {
    setTech("all");
    setSkill("all");
    setSeniority("all");
    setCompany("all");
    setSortByRating(false);
  }

  const filtersActive =
    tech !== "all" || skill !== "all" || seniority !== "all" || company !== "all" || sortByRating;

  let filtered = questions.filter((q) => {
    if (tech !== "all" && q.technology !== tech) return false;
    if (skill !== "all" && q.skillCategory !== skill) return false;
    if (seniority !== "all" && q.seniority !== seniority) return false;
    if (company !== "all" && q.client !== company) return false;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    const aDim = a.avgRating !== null && a.avgRating < 3.5;
    const bDim = b.avgRating !== null && b.avgRating < 3.5;
    if (aDim !== bDim) return aDim ? 1 : -1;
    if (sortByRating) return (b.avgRating ?? 0) - (a.avgRating ?? 0);
    return 0;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Knowledge base
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            Question Bank
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Browse interview questions, mark what came up, and rate their value.
          </p>
        </div>
        <Link
          href="/questions/propose"
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-indigo-500 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-600/30 transition hover:from-indigo-500 hover:to-indigo-700"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Propose question
        </Link>
      </header>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 pr-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M6 12h12M10 18h4" />
            </svg>
            Filter
          </div>
          <select
            value={tech}
            onChange={(e) => setTech(e.target.value)}
            className={selectClass}
            aria-label="Filter by technology"
          >
            {technologies.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All technologies" : t}
              </option>
            ))}
          </select>
          <select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className={selectClass}
            aria-label="Filter by skill"
          >
            {skills.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All skills" : s}
              </option>
            ))}
          </select>
          <select
            value={seniority}
            onChange={(e) => setSeniority(e.target.value)}
            className={selectClass}
            aria-label="Filter by seniority"
          >
            <option value="all">All seniorities</option>
            {SENIORITY_ORDER.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={selectClass}
            aria-label="Filter by company"
          >
            {companies.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All companies" : c}
              </option>
            ))}
          </select>
          <button
            onClick={() => setSortByRating((v) => !v)}
            className={
              sortByRating
                ? "inline-flex items-center gap-1.5 rounded-md border border-indigo-600 bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
                : "inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            }
            aria-pressed={sortByRating}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.92 6.18 6.58.96-4.75 4.7 1.12 6.66L12 17.85l-5.87 3.15 1.12-6.66L2.5 9.14l6.58-.96L12 2z" />
            </svg>
            Sort by rating
          </button>
          <div className="ml-auto flex items-center gap-3 text-xs text-slate-500">
            <span>
              <span className="font-semibold text-slate-900">{filtered.length}</span>{" "}
              of {questions.length} questions
            </span>
            {filtersActive && (
              <button
                onClick={resetFilters}
                className="rounded-md px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((q) => {
          const dim = q.avgRating !== null && q.avgRating < 3.5;
          const isOpen = openCards.has(q.id);
          return (
            <article
              key={q.id}
              className={`group overflow-hidden rounded-xl border bg-white shadow-sm transition ${
                dim
                  ? "border-slate-200 opacity-70"
                  : "border-slate-200 hover:border-slate-300 hover:shadow-md"
              } ${isOpen ? "ring-1 ring-indigo-200" : ""}`}
            >
              <button
                className="w-full p-5 text-left transition-colors hover:bg-slate-50/50"
                onClick={() => toggleCard(q.id)}
                aria-expanded={isOpen}
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="flex-1 text-sm leading-relaxed text-slate-900">
                    {q.text}
                  </p>
                  <div className="flex shrink-0 items-center gap-3">
                    {q.avgRating !== null ? (
                      <div className="flex items-center gap-1.5">
                        <StarRating value={q.avgRating} size="sm" />
                        <span className="text-xs font-medium text-slate-600">
                          {q.avgRating.toFixed(1)}
                        </span>
                      </div>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                        Not rated
                      </span>
                    )}
                    <svg
                      className={`h-4 w-4 text-slate-400 transition-transform ${
                        isOpen ? "rotate-180 text-indigo-500" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Tag tone="indigo">{q.technology}</Tag>
                  <Tag tone="violet">{q.skillCategory}</Tag>
                  <Tag tone="slate">{q.seniority}</Tag>
                  <Tag tone="neutral">{q.client}</Tag>
                  {q.cameUpCount > 0 && (
                    <Tag tone="emerald">Came up {q.cameUpCount}×</Tag>
                  )}
                </div>
              </button>
              {isOpen && <RatePanel question={q} onSaved={refresh} />}
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/50 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </div>
          <p className="mt-3 text-sm font-medium text-slate-900">No matching questions</p>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your filters or{" "}
            <Link href="/questions/propose" className="font-medium text-indigo-600 hover:underline">
              propose a new question
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}

type TagTone = "indigo" | "violet" | "slate" | "neutral" | "emerald";

const TONE_CLASS: Record<TagTone, string> = {
  indigo: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  violet: "bg-violet-50 text-violet-700 ring-violet-100",
  slate: "bg-slate-50 text-slate-700 ring-slate-200",
  neutral: "bg-slate-100 text-slate-600 ring-slate-200",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
};

function Tag({
  children,
  tone = "indigo",
}: {
  children: React.ReactNode;
  tone?: TagTone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TONE_CLASS[tone]}`}
    >
      {children}
    </span>
  );
}

function RatePanel({
  question,
  onSaved,
}: {
  question: QuestionRow;
  onSaved: () => void;
}) {
  const [rating, setRating] = useState<number>(question.rating?.rating ?? 0);
  const [cameUp, setCameUp] = useState(question.rating?.cameUp ?? false);
  const [cameUpDate, setCameUpDate] = useState(
    question.rating?.cameUpDate?.slice(0, 10) ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    if (rating === 0) return;
    setSaving(true);
    await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: question.id,
        rating,
        cameUp,
        cameUpDate: cameUpDate || null,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onSaved();
  }

  return (
    <div className="border-t border-slate-200 bg-slate-50/70 px-5 py-4 animate-fadeIn">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Your rating
          </p>
          <StarRating value={rating} interactive onChange={setRating} size="lg" />
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm transition hover:border-slate-300">
          <input
            type="checkbox"
            checked={cameUp}
            onChange={(e) => setCameUp(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          Came up in interview
        </label>

        {cameUp && (
          <input
            type="date"
            value={cameUpDate}
            onChange={(e) => setCameUpDate(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        )}

        <button
          onClick={save}
          disabled={saving || rating === 0}
          className={`ml-auto inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
            saved
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-700"
          }`}
        >
          {saved ? (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </>
          ) : saving ? (
            "Saving…"
          ) : (
            "Save"
          )}
        </button>
      </div>
    </div>
  );
}
