"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star, TrendingUp, Sparkles, Lock } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { ToolWithCategory } from "@/types";

interface ToolCardProps {
  tool: ToolWithCategory;
  userPlan?: "FREE" | "PRO" | "ELITE";
  index?: number;
}

const planOrder = { FREE: 0, PRO: 1, ELITE: 2 };

function isAccessible(toolPlan: string, userPlan?: string): boolean {
  if (!userPlan) return toolPlan === "FREE";
  return planOrder[userPlan as keyof typeof planOrder] >= planOrder[toolPlan as keyof typeof planOrder];
}

export function ToolCard({ tool, userPlan, index = 0 }: ToolCardProps) {
  const accessible = isAccessible(tool.requiredPlan, userPlan);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative glass-card-hover rounded-2xl overflow-hidden flex flex-col"
    >
      {/* Badges */}
      <div className="absolute top-3 right-3 flex gap-1.5 z-10">
        {tool.trending && (
          <Badge variant="trending" className="text-[10px] gap-1">
            <TrendingUp className="w-2.5 h-2.5" />
            Trending
          </Badge>
        )}
        {tool.featured && (
          <Badge variant="featured" className="text-[10px] gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            Featured
          </Badge>
        )}
      </div>

      {/* Plan lock overlay */}
      {!accessible && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="text-center px-4">
            <Lock className="w-8 h-8 text-violet-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white mb-1">
              {tool.requiredPlan} Required
            </p>
            <Link href="/pricing">
              <Button size="sm" className="mt-2">Upgrade</Button>
            </Link>
          </div>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Icon + name */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-600/20 border border-violet-500/20 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            {tool.icon ?? "🤖"}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm truncate">{tool.name}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs text-slate-500">{tool.category.icon} {tool.category.name}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4 flex-1">
          {tool.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/5 text-violet-400/60 border border-violet-500/10"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs text-slate-400">{tool.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-slate-600">{formatNumber(tool.usageCount)} uses</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={tool.requiredPlan === "ELITE" ? "elite" : tool.requiredPlan === "PRO" ? "pro" : "free"}
              className="text-[10px]"
            >
              {tool.requiredPlan}
            </Badge>
          </div>
        </div>

        {/* Launch button */}
        <Link href={`/tools/${tool.slug}`} className="mt-4">
          <Button
            variant={accessible ? "default" : "outline"}
            size="sm"
            className="w-full font-orbitron tracking-wider text-xs"
            disabled={!accessible}
          >
            {accessible ? (
              <>
                <ExternalLink className="w-3.5 h-3.5" />
                LAUNCH TOOL
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                UPGRADE TO ACCESS
              </>
            )}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
