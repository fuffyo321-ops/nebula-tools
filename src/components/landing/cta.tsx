"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Check } from "lucide-react";

const perks = [
  "Free plan — no credit card required",
  "GPT-4o + DALL-E 3 powered",
  "Cancel anytime",
  "Instant access to all tools",
];

export function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,58,237,0.12) 0%, transparent 70%)",
          }}
        />
        {/* Animated grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(rgba(124,58,237,1) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          {/* Icon */}
          <motion.div
            animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 items-center justify-center mb-8 shadow-2xl shadow-violet-500/50"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>

          <h2 className="font-orbitron text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-4 leading-tight">
            YOUR AI TOOLKIT
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #a78bfa 0%, #67e8f9 100%)" }}
            >
              STARTS TODAY
            </span>
          </h2>

          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Join 50,000+ creators and teams already using NebulaToolsnipes to work smarter, create faster, and grow bigger.
          </p>

          {/* Perks */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-10">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-2 text-sm text-slate-400">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                {perk}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            <Button
              size="xl"
              asChild
              className="group shadow-2xl shadow-violet-500/40 font-orbitron tracking-wider w-full sm:w-auto text-base"
            >
              <Link href="/register">
                GET STARTED FREE
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="xl"
              variant="outline"
              asChild
              className="font-orbitron tracking-wider w-full sm:w-auto text-base"
            >
              <Link href="/pricing">VIEW PRICING</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
