"use server";

import { searchProblems } from "../queries";

export async function searchProblemsAction(query: string) {
  try {
    const result = await searchProblems(query);
    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
}
