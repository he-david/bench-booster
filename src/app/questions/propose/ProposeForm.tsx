"use client";

import { useState, useEffect, useRef } from "react";
import { proposeQuestion } from "../actions";

const TECHNOLOGIES = ["Azure", "Python", "React", "SQL Server", "Other"];
const SKILLS = ["System Design", "Problem Solving", "Communication", "Other"];
const SENIORITIES = ["A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4"];

type SimilarQuestion = {
  id: string;
  text: string;
  technology: string;
  skillCategory: string;
  seniority: string;
};

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600";

export default function ProposeForm() {
  const [text, setText] = useState("");
  const [similar, setSimilar] = useState<SimilarQuestion[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (text.trim().length < 10) {
      setSimilar([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoadingSimilar(true);
      try {
        const res = await fetch(
          `/api/questions/similar?q=${encodeURIComponent(text)}`
        );
        const data = await res.json();
        setSimilar(data);
      } finally {
        setLoadingSimilar(false);
      }
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [text]);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    await proposeQuestion(formData);
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="text" className={labelClass}>
          Question text
        </label>
        <textarea
          id="text"
          name="text"
          required
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={`${inputClass} resize-y`}
          placeholder="Describe the interview question…"
        />
        {(loadingSimilar || similar.length > 0) && (
          <div className="mt-3 overflow-hidden rounded-lg border border-amber-200 bg-amber-50 animate-fadeIn">
            <div className="flex items-center gap-2 border-b border-amber-200 bg-amber-100/50 px-3 py-2">
              <svg className="h-4 w-4 text-amber-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <path d="M12 9v4M12 17h.01" />
              </svg>
              <p className="text-xs font-semibold text-amber-900">
                {loadingSimilar
                  ? "Checking for similar questions…"
                  : `Found ${similar.length} similar ${
                      similar.length === 1 ? "question" : "questions"
                    } in the bank`}
              </p>
            </div>
            {!loadingSimilar && (
              <ul className="divide-y divide-amber-200/70">
                {similar.map((q) => (
                  <li key={q.id} className="px-3 py-2 text-xs text-amber-900">
                    <div className="mb-1 flex flex-wrap gap-1">
                      <span className="rounded bg-amber-200/60 px-1.5 py-0.5 text-[10px] font-medium text-amber-900">
                        {q.technology}
                      </span>
                      <span className="rounded bg-amber-200/60 px-1.5 py-0.5 text-[10px] font-medium text-amber-900">
                        {q.skillCategory}
                      </span>
                      <span className="rounded bg-amber-200/60 px-1.5 py-0.5 text-[10px] font-medium text-amber-900">
                        {q.seniority}
                      </span>
                    </div>
                    <p className="leading-snug">{q.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="client" className={labelClass}>
            Client
          </label>
          <input
            id="client"
            name="client"
            type="text"
            required
            className={inputClass}
            placeholder="e.g. Contoso"
          />
        </div>
        <div>
          <label htmlFor="technology" className={labelClass}>
            Technology
          </label>
          <select id="technology" name="technology" required className={inputClass} defaultValue="">
            <option value="" disabled>
              Select technology
            </option>
            {TECHNOLOGIES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="skillCategory" className={labelClass}>
            Skill category
          </label>
          <select id="skillCategory" name="skillCategory" required className={inputClass} defaultValue="">
            <option value="" disabled>
              Select skill
            </option>
            {SKILLS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="seniority" className={labelClass}>
            Seniority
          </label>
          <select id="seniority" name="seniority" required className={inputClass} defaultValue="">
            <option value="" disabled>
              Select seniority
            </option>
            {SENIORITIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        <a
          href="/questions"
          className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
          Cancel
        </a>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-indigo-500 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-600/30 transition hover:from-indigo-500 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit question"}
        </button>
      </div>
    </form>
  );
}
