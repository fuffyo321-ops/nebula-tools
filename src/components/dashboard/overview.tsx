"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Zap, BarChart3, Clock, ArrowRight,
  TrendingUp, Crown, Grid3X3, Heart,
  Sparkles, ExternalLink,
} from "lucide-react";
import { formatDate, formatRelativeTime, getPlanBadgeClass } from "@/lib/utils";
import type { Subscription, User, Activity, Tool } from "@prisma/client";

interface Props {
  user: User;
  subscription: Subscription | null;
  recentActivity: (Activity & { tool: Tool | null })[];
  toolsUsed: number;
  favoritesCount: number;
}

const PLAN_LIMITS = { FREE: 10, PRO: 100, ELITE: Infinity };

const QUICK_TOOLS = [
  { href: "/tools/nebula-writer", icon: "✍️", name: "NebulaWriter", tag: "Writing" },
  { href: "/tools/code-orbit",    icon: "💻", name: "CodeOrbit",    tag: "Code" },
  { href: "/tools/astra-art",     icon: "🎨", name: "AstraArt",     tag: "Image" },
  { href: "/tools/chat-nova",     icon: "🤖", name: "ChatNova",     tag: "Chat" },
];

export function DashboardOverview({ user, subscription, recentActivity, toolsUsed, favoritesCount }: Props) {
  const plan         = subscription?.plan ?? "FREE";
  const limit        = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS];
  const usagePercent = limit === Infinity ? 12 : Math.min(100, (toolsUsed / limit) * 100);
  const firstName    = user.name?.split(" ")[0] ?? "there";

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl">

      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden border border-violet-500/20 p-6 sm:p-8"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(79,70,229,0.08) 50%, rgba(6,182,212,0.05) 100%)",
        }}
      >
        {/* Orb */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.8) 0%, transparent 70%)" }} />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-xs text-violet-400 font-medium uppercase tracking-wider">Dashboard</span>
            </div>
            <h1 className="font-orbitron text-2xl sm:text-3xl font-black text-white mb-1">
              Welcome back, {firstName}!
            </h1>
            <p className="text-slate-400 text-sm">
              {plan === "FREE"
                ? "You're on the Free plan. Upgrade to unlock all tools."
                : `You're on the ${plan} plan. Enjoy unlimited AI power.`}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className={`text-xs px-3 py-1.5 rounded-full border font-bold ${getPlanBadgeClass(plan)}`}>
              {plan === "ELITE" ? "⚡" : plan === "PRO" ? "✦" : "○"} {plan} PLAN
            </span>
            {plan === "FREE" && (
              <Button size="sm" asChild className="font-orbitron tracking-wider text-xs shadow-lg shadow-violet-500/30">
                <Link href="/pricing">
                  <Zap className="w-3 h-3" /> UPGRADE
                </Link>
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            label: "Tools Used",
            value: toolsUsed,
            sub: `of ${limit === Infinity ? "∞" : limit} this month`,
            icon: Grid3X3,
            grad: "from-violet-600/20 to-violet-900/10",
            border: "border-violet-500/15",
            iconBg: "bg-violet-500/20",
            iconColor: "text-violet-400",
          },
          {
            label: "Favorites",
            value: favoritesCount,
            sub: "saved tools",
            icon: Heart,
            grad: "from-pink-600/20 to-pink-900/10",
            border: "border-pink-500/15",
            iconBg: "bg-pink-500/20",
            iconColor: "text-pink-400",
          },
          {
            label: "Current Plan",
            value: plan,
            sub: subscription?.stripeCurrentPeriodEnd ? `Renews ${formatDate(subscription.stripeCurrentPeriodEnd)}` : "Free forever",
            icon: Crown,
            grad: "from-amber-600/20 to-amber-900/10",
            border: "border-amber-500/15",
            iconBg: "bg-amber-500/20",
            iconColor: "text-amber-400",
          },
          {
            label: "Member Since",
            value: formatDate(user.createdAt).split(",")[0],
            sub: "account created",
            icon: Sparkles,
            grad: "from-cyan-600/20 to-cyan-900/10",
            border: "border-cyan-500/15",
            iconBg: "bg-cyan-500/20",
            iconColor: "text-cyan-400",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + i * 0.06 }}
            className={`rounded-2xl border ${s.border} bg-gradient-to-br ${s.grad} p-5`}
          >
            <div className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center mb-4`}>
              <s.icon className={`w-4 h-4 ${s.iconColor}`} />
            </div>
            <div className="font-orbitron text-xl sm:text-2xl font-bold text-white truncate mb-0.5">{s.value}</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{s.label}</div>
            <div className="text-xs text-slate-600 mt-0.5">{s.sub}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Usage bar */}
      {plan !== "ELITE" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border bg-[#0d0d1a] p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-semibold text-white">Monthly Usage</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {toolsUsed} / {limit === Infinity ? "∞" : limit}
            </span>
          </div>
          <Progress value={usagePercent} className="h-1.5" />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-600">{usagePercent.toFixed(0)}% used</span>
            {usagePercent > 80 && (
              <span className="text-xs text-amber-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Approaching limit — upgrade now
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Quick access tools */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-1 rounded-2xl border border-border bg-[#0d0d1a] p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Quick Launch</h2>
            <Link href="/tools" className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
              All tools <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {QUICK_TOOLS.map((t) => (
              <Link key={t.href} href={t.href}>
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-violet-500/20 transition-all duration-200 group cursor-pointer">
                  <span className="text-xl">{t.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.tag}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-violet-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 rounded-2xl border border-border bg-[#0d0d1a] p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
          </div>

          {recentActivity.length > 0 ? (
            <div className="space-y-1">
              {recentActivity.slice(0, 8).map((activity, i) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/3 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/10 flex items-center justify-center text-sm flex-shrink-0">
                    {activity.tool?.icon ?? "🤖"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{activity.description}</p>
                    <p className="text-xs text-slate-600">{formatRelativeTime(activity.createdAt)}</p>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500/40 flex-shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-violet-400/50" />
              </div>
              <p className="text-sm text-slate-500 mb-3">No activity yet</p>
              <Button size="sm" variant="outline" asChild>
                <Link href="/tools">Browse Tools</Link>
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
