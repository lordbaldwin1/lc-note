"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { addNote as addNoteToDb } from "../queries";
import type { DifficultyLevel } from "../schema";

export async function addNoteAction(problem: string, solution: string, difficulty: DifficultyLevel) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const note = await addNoteToDb(userId, problem, solution, difficulty);

  if (!note.success) {
    return { success: false, error: note.error };
  }

  revalidatePath("/notes");
  return { success: true };
}
