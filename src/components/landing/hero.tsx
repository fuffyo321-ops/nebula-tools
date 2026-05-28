"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Star } from "lucide-react";

const stats = [
  { value: "100+", label: "AI Tools" },
  { value: "50K+", label: "Active Users" },
  { value: "10M+", label: "Generations" },
  { value: "99.9%", label: "Uptime" },
];

const PREVIEW_TOOLS = [
  { icon: "✍️", name: "NebulaWriter", plan: "FREE",  cat: "Writing" },
  { icon: "🎨", name: "AstraArt",     plan: "PRO",   cat: "Image" },
  { icon: "💻", name: "CodeOrbit",    plan: "PRO",   cat: "Code" },
  { icon: "🤖", name: "ChatNova",     plan: "PRO",   cat: "Chat" },
  { icon: "📈", name: "RankPulse",    plan: "PRO",   cat: "SEO" },
  { icon: "🎤", name: "VoxSynth",     plan: "ELITE", cat: "Audio" },
  { icon: "⚡", name: "FlowMind",     plan: "FREE",  cat: "Productivity" },
  { icon: "🔬", name: "ResearchBot",  plan: "FREE",  cat: "Research" },
];

const planColor: Record<string, string> = {
  FREE: "text-slate-500",
  PRO: "text-violet-400",
  ELITE: "text-amber-400",
};

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-0">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 -left-40 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(79,70,229,0.25) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.06, 0.14, 0.06] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)" }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(rgba(124,58,237,1) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Hero content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-sm text-violet-300">
            <span className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
            </span>
            <span className="text-slate-400">Loved by 50,000+ creators</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-orbitron text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-6"
        >
          <span className="text-white">ONE SUITE.</span>
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #a78bfa 0%, #818cf8 40%, #67e8f9 100%)" }}
          >
            100+ AI TOOLS.
          </span>
          <br />
          <span className="text-white/80 text-4xl sm:text-5xl lg:text-6xl">INFINITE POSSIBILITIES.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Writing, images, code, voice, SEO, research — all powered by GPT-4o and DALL-E 3.
          One subscription replaces six.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14 w-full px-2"
        >
          <Button size="xl" asChild className="group shadow-2xl shadow-violet-500/40 font-orbitron tracking-wider w-full sm:w-auto text-base">
            <Link href="/register">
              START FREE TODAY
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button size="xl" variant="outline" asChild className="font-orbitron tracking-wider w-full sm:w-auto text-base">
            <Link href="/tools">
              <Sparkles className="w-5 h-5" />
              BROWSE TOOLS
            </Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto mb-16"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              className="glass-card p-4 rounded-2xl text-center"
            >
              <div className="font-orbitron text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Product preview mock */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-5xl mx-auto px-4"
      >
        <div
          className="rounded-2xl border border-violet-500/20 bg-[#07070f] overflow-hidden"
          style={{ boxShadow: "0 0 60px rgba(124,58,237,0.2), 0 40px 80px rgba(0,0,0,0.6)" }}
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-[#0d0d1a]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 max-w-xs">
              <div className="h-6 rounded-md bg-[#111127] border border-border flex items-center px-3 gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-500/60" />
                <span className="text-xs text-slate-600 font-mono">nebula-tools.vercel.app/tools</span>
              </div>
            </div>
          </div>

          {/* Inner toolbar */}
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-[#0a0a16]">
            <div className="flex gap-2">
              {["All", "Writing", "Image", "Code", "Audio"].map((tab, i) => (
                <span
                  key={tab}
                  className={`text-xs px-3 py-1 rounded-full ${i === 0 ? "bg-violet-600 text-white" : "text-slate-500 hover:text-slate-300"} transition-colors cursor-default`}
                >
                  {tab}
                </span>
              ))}
            </div>
            <div className="text-xs text-slate-600">12 tools</div>
          </div>

          {/* Tool cards grid */}
          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PREVIEW_TOOLS.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.05 }}
                className="p-4 rounded-xl border border-border bg-[#111127] hover:border-violet-500/40 hover:bg-[#13132a] transition-all duration-200 cursor-default group"
              >
                <div className="text-2xl mb-3">{tool.icon}</div>
                <div className="text-xs font-semibold text-white truncate mb-1">{tool.name}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">{tool.cat}</span>
                  <span className={`text-xs font-medium ${planColor[tool.plan]}`}>{tool.plan}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Gradient fade */}
          <div className="h-16 bg-gradient-to-t from-[#07070f] to-transparent" />
        </div>

        {/* Glow under preview */}
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.6) 0%, transparent 70%)" }}
        />
      </motion.div>
    </section>
  );
}
