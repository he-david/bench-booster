import { prisma } from "@/lib/prisma";
import QuestionsClient from "./QuestionsClient";
import type { Seniority } from "@prisma/client";

export type QuestionRow = {
  id: string;
  text: string;
  client: string;
  technology: string;
  skillCategory: string;
  seniority: Seniority;
  createdAt: string;
  avgRating: number | null;
  cameUpCount: number;
  rating: {
    rating: number;
    cameUp: boolean;
    cameUpDate: string | null;
  } | null;
};

export default async function QuestionsPage() {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const raw = await prisma.question.findMany({
    include: { ratings: true },
    orderBy: { createdAt: "desc" },
  });

  const questions: QuestionRow[] = raw.map((q) => ({
    id: q.id,
    text: q.text,
    client: q.client,
    technology: q.technology,
    skillCategory: q.skillCategory,
    seniority: q.seniority,
    createdAt: q.createdAt.toISOString(),
    avgRating:
      q.ratings.length > 0
        ? q.ratings.reduce((s, r) => s + r.rating, 0) / q.ratings.length
        : null,
    cameUpCount: q.ratings.filter(
      (r) => r.cameUp && r.createdAt >= threeMonthsAgo
    ).length,
    rating: null,
  }));

  return <QuestionsClient questions={questions} />;
}
