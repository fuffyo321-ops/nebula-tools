import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { ToolsDirectory } from "@/components/tools/tools-directory";

export const metadata = {
  title: "AI Tools Directory",
  description: "Browse 100+ premium AI tools for writing, images, coding, video, and more.",
};

async function getTools() {
  return db.tool.findMany({
    where: { active: true },
    include: { category: true },
    orderBy: [{ featured: "desc" }, { usageCount: "desc" }],
  });
}

async function getCategories() {
  return db.category.findMany({ orderBy: { name: "asc" } });
}

export default async function ToolsPage() {
  const session = await auth();
  const [tools, categories] = await Promise.all([getTools(), getCategories()]);

  const userPlan = session?.user?.id
    ? (await db.subscription.findUnique({ where: { userId: session.user.id } }))?.plan ?? "FREE"
    : undefined;

  return (
    <main>
      <Navbar />
      <ToolsDirectory tools={tools} categories={categories} userPlan={userPlan} />
      <Footer />
    </main>
  );
}
