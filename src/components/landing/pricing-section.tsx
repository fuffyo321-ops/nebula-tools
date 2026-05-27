"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Star } from "lucide-react";

const plans = [
  {
    id: "FREE",
    name: "Free",
    icon: Star,
    price: 0,
    yearlyPrice: 0,
    description: "Perfect to get started",
    badge: null,
    highlighted: false,
    color: "from-slate-500 to-slate-600",
    features: [
      "10 tool launches/month",
      "5 AI tool categories",
      "Basic writing tools",
      "Image viewer",
      "Community support",
      "Standard response speed",
    ],
    missing: [
      "Premium tools",
      "API access",
      "Priority support",
    ],
  },
  {
    id: "PRO",
    name: "Pro",
    icon: Zap,
    price: 19,
    yearlyPrice: 152,
    description: "For serious creators & teams",
    badge: "MOST POPULAR",
    highlighted: true,
    color: "from-violet-500 to-indigo-600",
    features: [
      "100 tool launches/month",
      "All 50+ AI tools",
      "Advanced writing & coding",
      "Image generation — 500/mo",
      "API access (10K req/mo)",
      "Priority email support",
      "Usage analytics",
      "Team workspace (3 seats)",
    ],
    missing: [
      "Unlimited usage",
      "Dedicated account manager",
    ],
  },
  {
    id: "ELITE",
    name: "Elite",
    icon: Crown,
    price: 49,
    yearlyPrice: 392,
    description: "Unlimited power, zero limits",
    badge: "BEST VALUE",
    highlighted: false,
    color: "from-amber-500 to-orange-500",
    features: [
      "Unlimited tool launches",
      "All 100+ AI tools",
      "Exclusive Elite-only tools",
      "Image generation — unlimited",
      "API access (unlimited)",
      "Dedicated account manager",
      "White-label outputs",
      "Team workspace (10 seats)",
      "Custom integrations",
      "SLA uptime guarantee",
    ],
    missing: [],
  },
];

export function PricingSection({ minimal = false }: { minimal?: boolean }) {
  const [yearly, setYearly] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 relative" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {!minimal && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 text-sm text-violet-400 mb-6">
              <Crown className="w-3.5 h-3.5" />
              Simple Pricing
            </div>
          )}
          <h2 className="font-orbitron text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Choose Your{" "}
            <span className="gradient-text">Subscription</span>
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Start free. Scale when you&apos;re ready. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 p-1 bg-[#111127] border border-border rounded-2xl">
            <button
              onClick={() => setYearly(false)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                !yearly ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30" : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                yearly ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30" : "text-slate-400 hover:text-white"
              }`}
            >
              Yearly
              <Badge variant="new" className="text-[10px] px-1.5 py-0">-20%</Badge>
            </button>
          </div>
        </motion.div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl p-px overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                plan.highlighted
                  ? "bg-gradient-to-b from-violet-500/50 to-transparent shadow-2xl shadow-violet-500/20"
                  : "bg-border"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 z-10">
                  <Badge
                    className={`rounded-none rounded-b-lg px-4 text-xs font-semibold tracking-wider border-0 ${
                      plan.id === "ELITE"
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                        : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                    }`}
                  >
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div
                className={`h-full rounded-2xl p-6 flex flex-col ${
                  plan.highlighted ? "bg-[#0d0a1f]" : "bg-[#0d0d1a]"
                }`}
              >
                {/* Plan icon and name */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg`}
                  >
                    <plan.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-orbitron font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-500">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="font-orbitron text-4xl font-black text-white">
                      ${yearly ? Math.round(plan.yearlyPrice / 12) : plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-slate-500 mb-1.5 text-sm">/month</span>
                    )}
                    {plan.price === 0 && (
                      <span className="text-slate-500 mb-1.5 text-sm">forever</span>
                    )}
                  </div>
                  {yearly && plan.price > 0 && (
                    <p className="text-xs text-emerald-400 mt-1">
                      Billed ${plan.yearlyPrice}/year — save ${plan.price * 12 - plan.yearlyPrice}
                    </p>
                  )}
                </div>

                {/* CTA */}
                <Button
                  className="w-full mb-6 font-orbitron tracking-wider"
                  variant={plan.id === "ELITE" ? "elite" : plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.price === 0 ? "/register" : `/register?plan=${plan.id.toLowerCase()}&billing=${yearly ? "yearly" : "monthly"}`}>
                    GET STARTED
                  </Link>
                </Button>

                {/* Features */}
                <div className="space-y-2.5 flex-1">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center flex-shrink-0`}>
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="text-sm text-slate-300">{feature}</span>
                    </div>
                  ))}
                  {plan.missing.map((feature) => (
                    <div key={feature} className="flex items-center gap-2.5 opacity-30">
                      <div className="w-4 h-4 rounded-full border border-slate-600 flex-shrink-0" />
                      <span className="text-sm text-slate-500 line-through">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-slate-600 mt-8"
        >
          All plans include a 7-day free trial. No credit card required to start.
        </motion.p>
      </div>
    </section>
  );
}
