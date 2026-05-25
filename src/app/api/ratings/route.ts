import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    questionId: string;
    rating: number;
    cameUp: boolean;
    cameUpDate: string | null;
  };

  const { questionId, rating, cameUp, cameUpDate } = body;
  if (!questionId || typeof rating !== "number" || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await prisma.questionRating.create({
    data: {
      questionId,
      rating,
      cameUp: cameUp ?? false,
      cameUpDate: cameUpDate ? new Date(cameUpDate) : null,
    },
  });

  return NextResponse.json({ ok: true });
}
