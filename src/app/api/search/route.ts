import { type NextRequest, NextResponse } from "next/server";
import { searchProblems } from "~/server/db/queries";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const problems = await searchProblems(query);
    return NextResponse.json(problems);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json([]);
  }
}


