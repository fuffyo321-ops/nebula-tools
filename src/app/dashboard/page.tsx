import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { DashboardOverview } from "@/components/dashboard/overview";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [user, recentActivity, toolsCount, favoritesCount] = await Promise.all([
    db.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    }),
    db.activity.findMany({
      where: { userId: session.user.id },
      include: { tool: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.activity.count({ where: { userId: session.user.id, type: "TOOL_VIEW" } }),
    db.favorite.count({ where: { userId: session.user.id } }),
  ]);

  if (!user) redirect("/login");

  return (
    <DashboardOverview
      user={user}
      subscription={user.subscription}
      recentActivity={recentActivity}
      toolsUsed={toolsCount}
      favoritesCount={favoritesCount}
    />
  );
}
