import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToolRunner } from "@/components/tools/runner";
import { Star, Users, ArrowLeft, Lock } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const tool = await db.tool.findUnique({ where: { slug } });
  if (!tool) return {};
  return {
    title: tool.name,
    description: tool.description,
  };
}

const planOrder = { FREE: 0, PRO: 1, ELITE: 2 };

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const session = await auth();

  const tool = await db.tool.findUnique({
    where: { slug, active: true },
    include: { category: true },
  });

  if (!tool) notFound();

  const userPlan = session?.user?.id
    ? (await db.subscription.findUnique({ where: { userId: session.user.id } }))?.plan ?? "FREE"
    : undefined;

  const accessible = userPlan
    ? planOrder[userPlan] >= planOrder[tool.requiredPlan as keyof typeof planOrder]
    : tool.requiredPlan === "FREE";

  // Log usage if accessible and logged in
  if (accessible && session?.user?.id) {
    await db.activity.create({
      data: {
        userId: session.user.id,
        toolId: tool.id,
        type: "TOOL_VIEW",
        description: `Viewed ${tool.name}`,
      },
    }).catch(() => {});
  }

  return (
    <main>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back */}
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>

          <div className="glass-card rounded-3xl p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-600/20 border border-violet-500/20 flex items-center justify-center text-4xl flex-shrink-0">
                {tool.icon ?? "🤖"}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="font-orbitron text-2xl sm:text-3xl font-bold text-white">{tool.name}</h1>
                  <Badge variant={tool.requiredPlan === "ELITE" ? "elite" : tool.requiredPlan === "PRO" ? "pro" : "free"}>
                    {tool.requiredPlan}
                  </Badge>
                </div>
                <p className="text-slate-400 mb-4">{tool.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      {tool.category.icon} {tool.category.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{tool.rating.toFixed(1)} ({tool.ratingCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{formatNumber(tool.usageCount)} uses</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-violet-500/5 text-violet-400/70 border border-violet-500/15"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Long description */}
            {tool.longDesc && (
              <div className="mb-8 p-5 rounded-2xl bg-[#0d0d1a] border border-border">
                <h2 className="font-semibold text-white mb-3">About this tool</h2>
                <p className="text-slate-400 text-sm leading-relaxed">{tool.longDesc}</p>
              </div>
            )}

            {/* Tool runner or upgrade gate */}
            {accessible ? (
              <div className="mt-2">
                <div className="border-t border-border pt-6">
                  <ToolRunner slug={tool.slug} toolId={tool.id} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Lock className="w-4 h-4 text-violet-400" />
                  Requires <span className="font-semibold text-violet-400">{tool.requiredPlan}</span> plan
                </div>
                <Button size="lg" className="w-full sm:w-auto font-orbitron tracking-wider" asChild>
                  <Link href="/pricing">
                    UPGRADE TO ACCESS
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
