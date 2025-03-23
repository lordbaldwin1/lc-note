import { and, eq } from "drizzle-orm";
import { db } from "~/server/db";
import { notes, type DifficultyLevel } from "~/server/db/schema";

export async function getNotes(userId: string) {
  try {
    const result = await db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId));
    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function addNote(
  userId: string,
  problem: string,
  solution: string,
  difficulty: DifficultyLevel,
) {
  try {
    const result = await db.insert(notes).values({
      userId,
      title: problem,
      content: solution,
      difficulty: difficulty,
    });
    return { result, success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to add note", success: false };
  }
}

export async function updateNote(
  id: number,
  problem: string,
  solution: string,
  difficulty: DifficultyLevel,
) {
  try {
    const result = await db
      .update(notes)
      .set({
        title: problem,
        content: solution,
        difficulty: difficulty,
        updatedAt: Date.now(),
      })
      .where(eq(notes.id, id));
    return { result, success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update note", success: false };
  }
}

export async function deleteNote(id: number, userId: string) {
  try {
    const result = await db.delete(notes).where(and(eq(notes.id, id), eq(notes.userId, userId)));
    return { result, success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete note", success: false };
  }
}
