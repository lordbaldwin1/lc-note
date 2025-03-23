import Navbar from "~/components/Navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getNotes } from "~/server/db/queries";
import NoteRow from "~/components/NoteRow";

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const notes = await getNotes(userId);

  return (
    <div className="w-full">
      <Navbar />
      <NoteRow notes={notes} />
    </div>
  )
}