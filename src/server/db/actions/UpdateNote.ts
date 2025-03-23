"use server";

import { revalidatePath } from "next/cache";
import { updateNote } from "../queries";
import type { DifficultyLevel } from "../schema";


export async function updateNoteAction(id: number, problem: string, solution: string, difficulty: DifficultyLevel) {
  try {
    const result = await updateNote(id, problem, solution, difficulty);
    revalidatePath("/notes");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update note", success: false };
  }
}

