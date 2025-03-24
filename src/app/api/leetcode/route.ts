// import { NextResponse } from "next/server";
// import { db } from "~/server/db";
// import { problems } from "~/server/db/schema";
// import { sql } from "drizzle-orm";

// export async function GET() {
//   try {
//     const response = await fetch("https://leetcode.com/graphql", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "User-Agent":
//           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
//         "Referer": "https://leetcode.com/problemset/all/",
//         "Accept": "application/json",
//         "Accept-Language": "en-US,en;q=0.9",
//         "Origin": "https://leetcode.com",
//         "Cache-Control": "no-cache",
//         "Pragma": "no-cache",
//       },
//       body: JSON.stringify({
//         query: `
//           query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
//             problemsetQuestionList: questionList(
//               categorySlug: $categorySlug
//               limit: $limit
//               skip: $skip
//               filters: $filters
//             ) {
//               total: totalNum
//               questions: data {
//                 acRate
//                 difficulty
//                 frontendQuestionId: questionFrontendId
//                 paidOnly: isPaidOnly
//                 title
//                 titleSlug
//                 topicTags {
//                   name
//                   id
//                   slug
//                 }
//               }
//             }
//           }
//         `,
//         variables: {
//           categorySlug: "",
//           skip: 0,
//           limit: 3500, // Get a large batch of questions
//           filters: {}
//         }
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(
//         `Failed to fetch data from LeetCode: ${response.statusText}`,
//       );
//     }

//     const data = await response.json();

//     if (!data.data || !data.data.problemsetQuestionList || !data.data.problemsetQuestionList.questions) {
//       throw new Error("Invalid response structure");
//     }

//     const problemsData = data.data.problemsetQuestionList.questions.map((problem: any) => ({
//       title: problem.title,
//       url: `https://leetcode.com/problems/${problem.titleSlug}`,
//       difficulty: problem.difficulty,
//       free: problem.paidOnly ? 0 : 1,
//     }));

//     const batchSize = 100;
//     let totalInserted = 0;

//     for (let i = 0; i < problemsData.length; i += batchSize) {
//       const batch = problemsData.slice(i, i + batchSize);

//       const result = await db
//         .insert(problems)
//         .values(batch)
//         .onConflictDoUpdate({
//           target: [problems.url],
//           set: {
//             title: sql`excluded.title`,
//             difficulty: sql`excluded.difficulty`,
//             free: sql`excluded.free`,
//             updatedAt: sql`(unixepoch())`,
//           },
//         });

//       totalInserted += batch.length;
//       console.log(`Processed ${totalInserted} problems`);
//     }

//     return NextResponse.json({
//       success: true,
//       count: problemsData.length,
//       message: `Successfully processed ${totalInserted} problems`,
//     });
//   } catch (error) {
//     console.error("Error fetching LeetCode problems:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch problems" },
//       { status: 500 },
//     );
//   }
// }
