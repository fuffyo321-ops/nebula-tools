import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ToolsDirectory } from "@/components/tools/tools-directory";

export const metadata = { title: "My Tools" };

export default async function DashboardToolsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [tools, categories, subscription] = await Promise.all([
    db.tool.findMany({ where: { active: true }, include: { category: true }, orderBy: [{ featured: "desc" }, { usageCount: "desc" }] }),
    db.category.findMany({ orderBy: { name: "asc" } }),
    db.subscription.findUnique({ where: { userId: session.user.id } }),
  ]);

  const userPlan = subscription?.plan ?? "FREE";

  return (
    <div className="p-6 sm:p-8">
      <ToolsDirectory tools={tools} categories={categories} userPlan={userPlan} />
    </div>
  );
}
