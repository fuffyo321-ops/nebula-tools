"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, Shield, RefreshCcw, Globe, BarChart3, Cpu, Users, Lock } from "lucide-react";

const BENTO = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Access any AI tool instantly with sub-second response times powered by our global edge network.",
    glow: "rgba(124,58,237,0.4)",
    gradFrom: "#7c3aed",
    gradTo: "#4f46e5",
    large: true,
    extra: (
      <div className="mt-6 flex flex-col gap-2">
        {["Generate 2500-word article", "Create photorealistic image", "Debug & fix your code"].map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-xs text-slate-400">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
            {item}
            <span className="ml-auto text-violet-400 font-mono">{["~3s", "~12s", "~2s"][i]}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade encryption and zero-knowledge architecture protect your data at every step.",
    glow: "rgba(16,185,129,0.4)",
    gradFrom: "#10b981",
    gradTo: "#0d9488",
    large: false,
  },
  {
    icon: RefreshCcw,
    title: "Always Updated",
    description: "We continuously integrate the latest AI models so you always have cutting-edge tech.",
    glow: "rgba(6,182,212,0.4)",
    gradFrom: "#06b6d4",
    gradTo: "#3b82f6",
    large: false,
  },
  {
    icon: Globe,
    title: "50+ Languages",
    description: "Generate native-quality content for global audiences in over 50 languages.",
    glow: "rgba(59,130,246,0.4)",
    gradFrom: "#3b82f6",
    gradTo: "#6366f1",
    large: false,
  },
  {
    icon: BarChart3,
    title: "Usage Analytics",
    description: "Track your AI usage, productivity gains, and ROI with detailed analytics dashboards.",
    glow: "rgba(236,72,153,0.4)",
    gradFrom: "#ec4899",
    gradTo: "#f43f5e",
    large: false,
  },
  {
    icon: Cpu,
    title: "API Access",
    description: "Integrate any tool directly into your workflow with our unified REST API.",
    glow: "rgba(245,158,11,0.4)",
    gradFrom: "#f59e0b",
    gradTo: "#f97316",
    large: true,
    extra: (
      <div className="mt-5 rounded-xl bg-black/40 border border-border p-3 font-mono text-xs text-green-400">
        <span className="text-slate-500">POST</span> /api/tools/text<br />
        <span className="text-slate-500">{"{"}</span><br />
        &nbsp;&nbsp;<span className="text-violet-400">&quot;tool&quot;</span>: <span className="text-amber-300">&quot;nebula-writer&quot;</span>,<br />
        &nbsp;&nbsp;<span className="text-violet-400">&quot;prompt&quot;</span>: <span className="text-amber-300">&quot;...&quot;</span><br />
        <span className="text-slate-500">{"}"}</span>
      </div>
    ),
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share workspaces and AI generations with your team in real-time.",
    glow: "rgba(20,184,166,0.4)",
    gradFrom: "#14b8a6",
    gradTo: "#06b6d4",
    large: false,
  },
  {
    icon: Lock,
    title: "100% Private",
    description: "Your prompts are never used for training. Complete privacy guaranteed.",
    glow: "rgba(239,68,68,0.4)",
    gradFrom: "#ef4444",
    gradTo: "#f43f5e",
    large: false,
  },
];

export function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 max-w-3xl mx-auto px-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 text-sm text-violet-400 mb-6">
          <Zap className="w-3.5 h-3.5" />
          Why Choose NebulaTools
        </div>
        <h2 className="font-orbitron text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-4">
          Built for{" "}
          <span className="gradient-text">Serious Creators</span>
        </h2>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          One subscription unlocks an entire ecosystem of AI tools — no juggling multiple accounts or billing cycles.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">
          {BENTO.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-[#0d0d1a] p-6 hover:border-opacity-60 transition-all duration-300 cursor-default
                ${feature.large ? "lg:col-span-2" : "lg:col-span-1"}
              `}
              style={{ "--glow": feature.glow } as React.CSSProperties}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${feature.glow}`;
                (e.currentTarget as HTMLElement).style.borderColor = feature.gradFrom + "60";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "";
                (e.currentTarget as HTMLElement).style.borderColor = "";
              }}
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${feature.gradFrom}, ${feature.gradTo})`,
                  boxShadow: `0 4px 20px ${feature.glow}`,
                }}
              >
                <feature.icon className="w-5 h-5 text-white" />
              </div>

              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>

              {feature.extra}

              {/* Corner glow */}
              <div
                className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{ background: feature.gradFrom }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
