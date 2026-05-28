"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, MessageSquare } from "lucide-react";

export function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] rounded-full opacity-20" style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.6) 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="glass-card p-6 sm:p-12 rounded-3xl text-center border-violet-500/20"
          style={{ boxShadow: "0 0 60px rgba(124,58,237,0.15), inset 0 1px 0 0 rgba(255,255,255,0.04)" }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 items-center justify-center mb-6 shadow-2xl shadow-violet-500/40"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>

          <h2 className="font-orbitron text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-4">
            Ready to Supercharge
            <br />
            <span className="gradient-text">Your Workflow?</span>
          </h2>

          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Join 50,000+ creators and teams already using NebulaTools.
            Start free — no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            <Button size="xl" asChild className="group shadow-2xl shadow-violet-500/30 font-orbitron tracking-wider w-full sm:w-auto">
              <Link href="/register">
                GET STARTED FREE
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild className="font-orbitron tracking-wider w-full sm:w-auto">
              <Link href="#" target="_blank">
                <MessageSquare className="w-5 h-5" />
                JOIN DISCORD
              </Link>
            </Button>
          </div>

          <p className="text-sm text-slate-600 mt-6">
            7-day free trial on all plans · Cancel anytime · No hidden fees
          </p>
        </motion.div>
      </div>
    </section>
  );
}
