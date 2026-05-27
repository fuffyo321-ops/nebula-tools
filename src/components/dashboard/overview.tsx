"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Zap, Star, BarChart3, Clock, ArrowRight,
  TrendingUp, Crown, Grid3X3, Heart,
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

export function DashboardOverview({ user, subscription, recentActivity, toolsUsed, favoritesCount }: Props) {
  const plan = subscription?.plan ?? "FREE";
  const limit = PLAN_LIMITS[plan];
  const usagePercent = limit === Infinity ? 15 : Math.min(100, (toolsUsed / limit) * 100);

  const stats = [
    {
      label: "Tools Used",
      value: toolsUsed,
      icon: Grid3X3,
      color: "from-violet-500/20 to-indigo-600/10",
      iconColor: "text-violet-400",
      sub: `of ${limit === Infinity ? "∞" : limit} this month`,
    },
    {
      label: "Favorites",
      value: favoritesCount,
      icon: Heart,
      color: "from-pink-500/20 to-rose-600/10",
      iconColor: "text-pink-400",
      sub: "saved tools",
    },
    {
      label: "Current Plan",
      value: plan,
      icon: Crown,
      color: "from-amber-500/20 to-orange-600/10",
      iconColor: "text-amber-400",
      sub: subscription?.stripeCurrentPeriodEnd
        ? `Renews ${formatDate(subscription.stripeCurrentPeriodEnd)}`
        : "Free forever",
    },
    {
      label: "Member Since",
      value: formatDate(user.createdAt),
      icon: Star,
      color: "from-cyan-500/20 to-blue-600/10",
      iconColor: "text-cyan-400",
      sub: "account created",
    },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-6xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-orbitron text-2xl sm:text-3xl font-bold text-white mb-1">
              Welcome back, {user.name?.split(" ")[0] ?? "there"} 👋
            </h1>
            <p className="text-slate-400 text-sm">Here&apos;s what&apos;s happening with your account</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-3 py-1.5 rounded-full border font-medium ${getPlanBadgeClass(plan)}`}>
              {plan === "ELITE" ? "⚡" : plan === "PRO" ? "✦" : "○"} {plan} PLAN
            </span>
            {plan === "FREE" && (
              <Button size="sm" asChild className="font-orbitron tracking-wider text-xs">
                <Link href="/pricing">
                  <Zap className="w-3 h-3" />
                  UPGRADE
                </Link>
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            className={`glass-card p-5 rounded-2xl bg-gradient-to-br ${stat.color}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center ${stat.iconColor}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="font-orbitron text-2xl font-bold text-white mb-0.5 truncate">
              {stat.value}
            </div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{stat.label}</p>
            <p className="text-xs text-slate-600 mt-0.5">{stat.sub}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Usage bar */}
      {plan !== "ELITE" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card rounded-2xl p-5 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium text-white">Monthly Usage</span>
            </div>
            <span className="text-xs text-slate-500">
              {toolsUsed} / {limit === Infinity ? "∞" : limit} tool launches
            </span>
          </div>
          <Progress value={usagePercent} className="h-2" />
          {usagePercent > 80 && (
            <p className="text-xs text-amber-400 mt-2 flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3" />
              You&apos;re approaching your limit — consider upgrading
            </p>
          )}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-400" />
              <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
            </div>
          </div>

          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/3 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-sm flex-shrink-0">
                    {activity.tool?.icon ?? "🤖"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-slate-600">{formatRelativeTime(activity.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500">No activity yet</p>
              <Link href="/tools">
                <Button size="sm" variant="outline" className="mt-3">Browse Tools</Button>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-card rounded-2xl p-5"
        >
          <h2 className="text-sm font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-2.5">
            {[
              { href: "/tools", label: "Browse AI Tools", icon: Grid3X3, desc: "Explore 100+ tools" },
              { href: "/dashboard/billing", label: "Manage Billing", icon: Crown, desc: "View invoices & upgrade" },
              { href: "/dashboard/settings", label: "Account Settings", icon: Zap, desc: "Profile & preferences" },
            ].map((action) => (
              <Link key={action.href} href={action.href}>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-200 group">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
                    <action.icon className="w-4 h-4 text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{action.label}</p>
                    <p className="text-xs text-slate-500">{action.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
