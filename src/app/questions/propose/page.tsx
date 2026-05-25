import Link from "next/link";
import ProposeForm from "./ProposeForm";

export default function ProposePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <Link
          href="/questions"
          className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to questions
        </Link>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
          Propose a question
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Submit a question that came up in a client interview. We will check
          for duplicates as you type.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <ProposeForm />
      </div>
    </div>
  );
}
