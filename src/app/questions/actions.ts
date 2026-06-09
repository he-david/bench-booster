"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Seniority } from "@prisma/client";

const VALID_SENIORITIES: Seniority[] = [
  "A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4",
];

export async function proposeQuestion(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const text = (formData.get("text") as string)?.trim();
  const client = (formData.get("client") as string)?.trim();
  const technology = (formData.get("technology") as string)?.trim();
  const skillCategory = (formData.get("skillCategory") as string)?.trim();
  const seniority = formData.get("seniority") as Seniority;

  if (!text || !client || !technology || !skillCategory || !seniority) {
    throw new Error("All fields are required");
  }
  if (!VALID_SENIORITIES.includes(seniority)) {
    throw new Error("Invalid seniority value");
  }

  await prisma.question.create({
    data: { text, client, technology, skillCategory, seniority },
  });

  redirect("/questions");
}

export async function deleteQuestion(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  if (!id) throw new Error("Question id is required");

  // Ratings are removed automatically via onDelete: Cascade.
  await prisma.question.delete({ where: { id } });

  revalidatePath("/questions");
}
