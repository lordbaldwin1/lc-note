"use server";

export async function getLeetCodeProblemsAction() {
  try {
    const response = await fetch("http://localhost:3000/api/leetcode", {
      method: "GET",
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching LeetCode problems:", error);
    throw new Error("Failed to fetch problems");
  }
}
