"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users, CreditCard, Zap, TrendingUp, DollarSign,
  Grid3X3, ArrowLeft, Shield, CheckCircle, XCircle, Clock,
} from "lucide-react";
import { formatPrice, formatDate, formatNumber } from "@/lib/utils";
import type { AdminStats } from "@/types";
import type { Subscription, Payment, User } from "@prisma/client";

interface Props {
  stats: AdminStats;
  recentUsers: (User & { subscription: { plan: string; status: string } | null })[];
  recentPayments: (Payment & { user: { name: string | null; email: string } })[];
}

const statusBadge = (status: string) => {
  switch (status) {
    case "ACTIVE": return <Badge variant="new" className="text-[10px]">Active</Badge>;
    case "TRIALING": return <Badge className="text-[10px]">Trial</Badge>;
    case "CANCELED": return <Badge variant="destructive" className="text-[10px]">Canceled</Badge>;
    default: return <Badge variant="secondary" className="text-[10px]">{status}</Badge>;
  }
};

export function AdminDashboard({ stats, recentUsers, recentPayments }: Props) {
  const statCards = [
    { label: "Total Users", value: formatNumber(stats.totalUsers), icon: Users, color: "from-violet-500/20 to-indigo-600/10", iconColor: "text-violet-400", sub: `+${stats.newUsersToday} today` },
    { label: "Active Subs", value: formatNumber(stats.activeSubscriptions), icon: Zap, color: "from-cyan-500/20 to-blue-600/10", iconColor: "text-cyan-400", sub: "paying customers" },
    { label: "MRR", value: formatPrice(stats.mrr), icon: DollarSign, color: "from-emerald-500/20 to-teal-600/10", iconColor: "text-emerald-400", sub: "monthly recurring" },
    { label: "Total Revenue", value: formatPrice(stats.totalRevenue), icon: TrendingUp, color: "from-amber-500/20 to-orange-600/10", iconColor: "text-amber-400", sub: "all time" },
    { label: "Active Tools", value: stats.totalTools, icon: Grid3X3, color: "from-pink-500/20 to-rose-600/10", iconColor: "text-pink-400", sub: "in directory" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-amber-400" />
            <h1 className="font-orbitron text-2xl font-bold text-white">Admin Panel</h1>
          </div>
          <p className="text-slate-400 text-sm">Monitor users, revenue, and platform health</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`glass-card p-4 rounded-2xl bg-gradient-to-br ${card.color}`}
          >
            <div className={`w-8 h-8 rounded-xl bg-black/20 flex items-center justify-center ${card.iconColor} mb-3`}>
              <card.icon className="w-4 h-4" />
            </div>
            <div className="font-orbitron text-xl font-bold text-white">{card.value}</div>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide mt-0.5">{card.label}</p>
            <p className="text-[10px] text-slate-600">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-400" />
              <h2 className="font-semibold text-white text-sm">Recent Users</h2>
            </div>
            <Badge variant="default" className="text-[10px]">{stats.totalUsers} total</Badge>
          </div>

          <div className="space-y-2.5">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/3 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {user.name?.charAt(0).toUpperCase() ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{user.name ?? "Unknown"}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Badge
                    variant={user.subscription?.plan === "ELITE" ? "elite" : user.subscription?.plan === "PRO" ? "pro" : "free"}
                    className="text-[10px]"
                  >
                    {user.subscription?.plan ?? "FREE"}
                  </Badge>
                  {user.banned ? (
                    <XCircle className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Payments */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-violet-400" />
            <h2 className="font-semibold text-white text-sm">Recent Payments</h2>
          </div>

          <div className="space-y-3">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/3 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate">{payment.user.name ?? payment.user.email}</p>
                    <p className="text-[10px] text-slate-500">{formatDate(payment.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-white">{formatPrice(payment.amount)}</p>
                  <Badge variant="new" className="text-[10px]">{payment.status}</Badge>
                </div>
              </div>
            ))}
            {recentPayments.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-6">No payments yet</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
