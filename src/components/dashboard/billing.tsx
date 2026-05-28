"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  CreditCard, Zap, Crown, Star, ExternalLink,
  CheckCircle2, AlertCircle, XCircle, Clock, Loader2, Bitcoin,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Subscription, Payment } from "@prisma/client";

const planDetails = {
  FREE: { name: "Free", icon: Star, color: "text-slate-400", price: "$0/mo" },
  PRO: { name: "Pro", icon: Zap, color: "text-violet-400", price: "$19/mo" },
  ELITE: { name: "Elite", icon: Crown, color: "text-amber-400", price: "$49/mo" },
};

const statusConfig = {
  ACTIVE: { label: "Active", icon: CheckCircle2, color: "text-emerald-400" },
  TRIALING: { label: "Trial", icon: Clock, color: "text-cyan-400" },
  PAST_DUE: { label: "Past Due", icon: AlertCircle, color: "text-amber-400" },
  CANCELED: { label: "Canceled", icon: XCircle, color: "text-red-400" },
  INACTIVE: { label: "Inactive", icon: XCircle, color: "text-slate-400" },
};

interface Props {
  subscription: Subscription | null;
  payments: Payment[];
}

export function BillingPage({ subscription, payments }: Props) {
  const [portalLoading, setPortalLoading] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState<string | null>(null);
  const [cryptoLoading, setCryptoLoading] = useState<string | null>(null);

  const plan = subscription?.plan ?? "FREE";
  const status = subscription?.status ?? "INACTIVE";
  const planInfo = planDetails[plan];
  const statusInfo = statusConfig[status] ?? statusConfig.INACTIVE;

  async function openPortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error);
    } catch {
      toast.error("Could not open billing portal");
    } finally {
      setPortalLoading(false);
    }
  }

  async function payWithCrypto(targetPlan: "PRO" | "ELITE") {
    setCryptoLoading(targetPlan);
    try {
      const res = await fetch("/api/crypto/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: targetPlan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error);
    } catch {
      toast.error("Could not start crypto checkout");
    } finally {
      setCryptoLoading(null);
    }
  }

  async function upgrade(targetPlan: "PRO" | "ELITE", billing: "monthly") {
    setUpgradeLoading(targetPlan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: targetPlan, billing }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error);
    } catch {
      toast.error("Could not start checkout");
    } finally {
      setUpgradeLoading(null);
    }
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-orbitron text-2xl sm:text-3xl font-bold text-white mb-1">Billing</h1>
        <p className="text-slate-400 text-sm">Manage your subscription and payment history</p>
      </motion.div>

      {/* Current plan */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-600/20 border border-violet-500/20 flex items-center justify-center">
              <planInfo.icon className={`w-6 h-6 ${planInfo.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-orbitron font-bold text-white">{planInfo.name} Plan</span>
                <div className={`flex items-center gap-1 text-xs ${statusInfo.color}`}>
                  <statusInfo.icon className="w-3.5 h-3.5" />
                  {statusInfo.label}
                </div>
              </div>
              <p className="text-sm text-slate-400">
                {planInfo.price}
                {subscription?.stripeCurrentPeriodEnd && status === "ACTIVE" && (
                  <span className="text-slate-500 ml-2">· Renews {formatDate(subscription.stripeCurrentPeriodEnd)}</span>
                )}
                {subscription?.cancelAtPeriodEnd && subscription.stripeCurrentPeriodEnd && (
                  <span className="text-amber-400 ml-2">· Cancels {formatDate(subscription.stripeCurrentPeriodEnd)}</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {plan !== "FREE" && subscription?.stripeCustomerId && (
              <Button variant="outline" size="sm" onClick={openPortal} disabled={portalLoading} className="gap-2">
                {portalLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
                Manage
              </Button>
            )}
            {plan === "FREE" && (
              <Button size="sm" onClick={() => upgrade("PRO", "monthly")} disabled={upgradeLoading === "PRO"} className="font-orbitron tracking-wider text-xs">
                {upgradeLoading === "PRO" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                UPGRADE TO PRO
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Upgrade cards */}
      {plan === "FREE" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
        >
          {(["PRO", "ELITE"] as const).map((p) => (
            <div key={p} className={`glass-card rounded-2xl p-5 ${p === "PRO" ? "border-violet-500/20" : "border-amber-500/20"}`}>
              <div className="flex items-center gap-2 mb-2">
                {p === "ELITE" ? <Crown className="w-4 h-4 text-amber-400" /> : <Zap className="w-4 h-4 text-violet-400" />}
                <span className="font-semibold text-white">{p}</span>
                <Badge variant={p === "ELITE" ? "elite" : "pro"} className="text-[10px] ml-auto">
                  {p === "PRO" ? "$19/mo" : "$49/mo"}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                {p === "PRO" ? "100 tool launches, API access, priority support" : "Unlimited everything + exclusive tools"}
              </p>
              <Button
                size="sm"
                variant={p === "ELITE" ? "elite" : "default"}
                className="w-full font-orbitron tracking-wider text-xs mb-2"
                onClick={() => upgrade(p, "monthly")}
                disabled={upgradeLoading === p}
              >
                {upgradeLoading === p ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "PAY WITH CARD"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs gap-1.5 border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
                onClick={() => payWithCrypto(p)}
                disabled={cryptoLoading === p}
              >
                {cryptoLoading === p ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bitcoin className="w-3.5 h-3.5" />}
                PAY WITH CRYPTO
              </Button>
            </div>
          ))}
        </motion.div>
      )}

      {/* Payment history */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-4 h-4 text-violet-400" />
          <h2 className="font-semibold text-white text-sm">Payment History</h2>
        </div>

        {payments.length > 0 ? (
          <div className="space-y-2">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm text-white">{payment.description ?? "Subscription payment"}</p>
                  <p className="text-xs text-slate-500">{formatDate(payment.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{formatPrice(payment.amount, payment.currency)}</p>
                  <Badge variant={payment.status === "paid" ? "new" : "destructive"} className="text-[10px]">
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-6">No payments yet</p>
        )}
      </motion.div>
    </div>
  );
}
