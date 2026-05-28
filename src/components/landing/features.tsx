"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Zap, Shield, RefreshCcw, Globe, BarChart3,
  Cpu, Users, Lock,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Access any AI tool instantly with sub-second response times powered by our global edge network.",
    color: "from-violet-500 to-purple-600",
    glow: "rgba(124,58,237,0.3)",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade encryption, SOC2 compliance, and zero-knowledge architecture protect your data.",
    color: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.3)",
  },
  {
    icon: RefreshCcw,
    title: "Always Updated",
    description: "We continuously integrate the latest AI models so you always have access to cutting-edge tech.",
    color: "from-cyan-500 to-blue-600",
    glow: "rgba(6,182,212,0.3)",
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Generate content in 50+ languages with native-quality output for global audiences.",
    color: "from-blue-500 to-indigo-600",
    glow: "rgba(59,130,246,0.3)",
  },
  {
    icon: BarChart3,
    title: "Usage Analytics",
    description: "Track your AI usage, productivity gains, and ROI with detailed analytics dashboards.",
    color: "from-pink-500 to-rose-600",
    glow: "rgba(236,72,153,0.3)",
  },
  {
    icon: Cpu,
    title: "API Access",
    description: "Integrate any tool directly into your workflow with our unified REST API and webhooks.",
    color: "from-orange-500 to-amber-600",
    glow: "rgba(245,158,11,0.3)",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share workspaces, templates, and AI generations with your team in real-time.",
    color: "from-teal-500 to-cyan-600",
    glow: "rgba(20,184,166,0.3)",
  },
  {
    icon: Lock,
    title: "Private & Secure",
    description: "Your prompts and outputs are never used for training. Complete privacy guaranteed.",
    color: "from-red-500 to-rose-600",
    glow: "rgba(239,68,68,0.3)",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 relative">
      {/* Section header */}
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
          Everything You Need to{" "}
          <span className="gradient-text">Move Faster</span>
        </h2>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          One subscription unlocks an entire ecosystem of AI tools — no juggling multiple accounts or billing cycles.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={itemVariants}
            className="glass-card-hover p-6 rounded-2xl group cursor-default"
          >
            <div
              className="w-11 h-11 rounded-xl bg-gradient-to-br mb-4 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
              style={{ background: `linear-gradient(135deg, ${feature.glow.replace("0.3", "0.5")}, ${feature.glow.replace("0.3", "0.2")})`, boxShadow: `0 4px 16px ${feature.glow}` }}
            >
              <feature.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-2 text-sm">{feature.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
