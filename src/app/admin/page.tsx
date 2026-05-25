import { prisma } from "@/lib/prisma";
import KpiCard from "./KpiCard";
import { TechBarChart, SkillRatingChart } from "./Charts";

export default async function AdminPage() {
  const [
    totalQuestions,
    thisMonthCount,
    cameUpCount,
    ratingAgg,
    byTechnology,
    bySkill,
  ] = await Promise.all([
    prisma.question.count(),
    prisma.question.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    prisma.questionRating.count({ where: { cameUp: true } }),
    prisma.questionRating.aggregate({ _avg: { rating: true } }),
    prisma.question.groupBy({
      by: ["technology"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 8,
    }),
    prisma.questionRating.groupBy({
      by: ["questionId"],
      _avg: { rating: true },
    }),
  ]);

  const avgRating = ratingAgg._avg.rating;

  const ratedQuestionIds = bySkill.map((r) => r.questionId);
  const ratedQuestions = await prisma.question.findMany({
    where: { id: { in: ratedQuestionIds } },
    select: { id: true, skillCategory: true },
  });
  const idToSkill = Object.fromEntries(
    ratedQuestions.map((q) => [q.id, q.skillCategory])
  );
  const skillRatingMap: Record<string, { sum: number; count: number }> = {};
  for (const row of bySkill) {
    const cat = idToSkill[row.questionId];
    if (!cat || row._avg.rating === null) continue;
    if (!skillRatingMap[cat]) skillRatingMap[cat] = { sum: 0, count: 0 };
    skillRatingMap[cat].sum += row._avg.rating;
    skillRatingMap[cat].count += 1;
  }
  const skillRatingData = Object.entries(skillRatingMap).map(
    ([skillCategory, { sum, count }]) => ({
      skillCategory,
      avgRating: Math.round((sum / count) * 10) / 10,
    })
  );

  const techData = byTechnology.map((r) => ({
    technology: r.technology,
    count: r._count.id,
  }));

  const monthName = new Date().toLocaleString("en-US", { month: "long" });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          Admin
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
          Metrics dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of question bank activity and team feedback.
        </p>
      </header>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard
          label="Total questions"
          value={totalQuestions}
          accent="indigo"
          icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6M8 13h8M8 17h5" />
            </svg>
          }
        />
        <KpiCard
          label="Avg rating"
          value={avgRating !== null ? avgRating.toFixed(1) : "—"}
          accent="amber"
          hint="across all ratings"
          icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.92 6.18 6.58.96-4.75 4.7 1.12 6.66L12 17.85l-5.87 3.15 1.12-6.66L2.5 9.14l6.58-.96L12 2z" />
            </svg>
          }
        />
        <KpiCard
          label="Added in"
          value={thisMonthCount}
          hint={monthName}
          accent="violet"
          icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          }
        />
        <KpiCard
          label="Came up in interviews"
          value={cameUpCount}
          accent="emerald"
          icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <path d="M22 4L12 14.01l-3-3" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TechBarChart data={techData} />
        <SkillRatingChart data={skillRatingData} />
      </div>
    </div>
  );
}
