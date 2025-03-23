import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ModeToggle } from "./LightModeToggle";

export default async function Navbar() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">lc-note</h1>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <UserButton />
        </div>
      </div>
    </div>
  )
}
