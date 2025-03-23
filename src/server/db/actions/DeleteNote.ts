"use server";

import { deleteNote } from "../queries";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
export const deleteNoteAction = async (id: number) => {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized", success: false };
  }
  try {
    const result = await deleteNote(id, userId);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};
