"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ToolCard } from "./tool-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, TrendingUp, Sparkles, Grid3X3 } from "lucide-react";
import type { ToolWithCategory } from "@/types";

interface ToolsDirectoryProps {
  tools: ToolWithCategory[];
  categories: Array<{ id: string; name: string; slug: string; icon: string | null; color: string | null }>;
  userPlan?: "FREE" | "PRO" | "ELITE";
}

const filters = [
  { id: "all", label: "All Tools", icon: Grid3X3 },
  { id: "featured", label: "Featured", icon: Sparkles },
  { id: "trending", label: "Trending", icon: TrendingUp },
];

export function ToolsDirectory({ tools, categories, userPlan }: ToolsDirectoryProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activePlan, setActivePlan] = useState<string>("all");

  const filtered = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        !search ||
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase()) ||
        tool.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        activeCategory === "all" || tool.category.slug === activeCategory;

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "featured" && tool.featured) ||
        (activeFilter === "trending" && tool.trending);

      const matchesPlan =
        activePlan === "all" || tool.requiredPlan === activePlan;

      return matchesSearch && matchesCategory && matchesFilter && matchesPlan;
    });
  }, [tools, search, activeCategory, activeFilter, activePlan]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-orbitron text-3xl sm:text-4xl font-bold text-white mb-2">
            AI Tools <span className="gradient-text">Directory</span>
          </h1>
          <p className="text-slate-400">{tools.length} tools available across all plans</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-6"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search tools by name, category, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-12 text-sm bg-[#111127] border-border focus-visible:border-violet-500/50"
          />
        </motion.div>

        {/* Filter row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col gap-3 mb-8"
        >
          {/* Quick filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeFilter === f.id
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                    : "bg-[#111127] border border-border text-slate-400 hover:text-white hover:border-violet-500/30"
                }`}
              >
                <f.icon className="w-3 h-3" />
                {f.label}
              </button>
            ))}
          </div>

          {/* Plan filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {["all", "FREE", "PRO", "ELITE"].map((plan) => (
              <button
                key={plan}
                onClick={() => setActivePlan(plan)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  activePlan === plan
                    ? plan === "ELITE"
                      ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                      : plan === "PRO"
                      ? "bg-violet-600/20 text-violet-400 border-violet-500/30"
                      : "bg-slate-500/20 text-slate-300 border-slate-500/30"
                    : "bg-transparent border-border text-slate-500 hover:text-white hover:border-violet-500/20"
                }`}
              >
                {plan === "all" ? "All Plans" : plan}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 flex-wrap mb-8 pb-4 overflow-x-auto"
        >
          <button
            onClick={() => setActiveCategory("all")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
              activeCategory === "all"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                : "glass-card text-slate-400 hover:text-white"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                activeCategory === cat.slug
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                  : "glass-card text-slate-400 hover:text-white"
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">
            {filtered.length} tool{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Tools grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} userPlan={userPlan} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-4xl mb-4">🔭</div>
            <h3 className="font-semibold text-white mb-2">No tools found</h3>
            <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
