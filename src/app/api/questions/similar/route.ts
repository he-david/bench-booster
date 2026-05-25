import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jaccardSimilarity } from "@/lib/dedupe";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (q.trim().length < 10) {
    return NextResponse.json([]);
  }

  const questions = await prisma.question.findMany({
    select: {
      id: true,
      text: true,
      technology: true,
      skillCategory: true,
      seniority: true,
    },
  });

  const results = questions
    .map((question) => ({
      ...question,
      score: jaccardSimilarity(q, question.text),
    }))
    .filter((item) => item.score > 0.1)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score: _score, ...rest }) => rest);

  return NextResponse.json(results);
}
