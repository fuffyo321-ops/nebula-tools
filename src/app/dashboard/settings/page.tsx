import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { SettingsPage } from "@/components/dashboard/settings";

export const metadata = { title: "Settings" };

export default async function DashboardSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, createdAt: true },
  });

  if (!user) redirect("/login");
  return <SettingsPage user={user} />;
}
