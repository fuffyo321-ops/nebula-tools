"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Content Creator, 500K+ Subscribers",
    avatar: "AR",
    color: "from-violet-500 to-indigo-600",
    stars: 5,
    text: "NebulaTools replaced at least 6 separate subscriptions for me. The writing AI alone saves me 10+ hours a week. The image generation is absolutely insane.",
  },
  {
    name: "Sarah Chen",
    role: "Founder & CEO, TechStart",
    avatar: "SC",
    color: "from-cyan-500 to-blue-600",
    stars: 5,
    text: "We use NebulaTools for everything from marketing copy to code review. The ROI is unreal. It paid for itself within the first day of the trial.",
  },
  {
    name: "Marcus Johnson",
    role: "Senior Developer, Google",
    avatar: "MJ",
    color: "from-emerald-500 to-teal-600",
    stars: 5,
    text: "CodeOrbit is better than any AI coding tool I've used. It understands context across files and the code review features are production-grade.",
  },
  {
    name: "Priya Patel",
    role: "Digital Marketing Director",
    avatar: "PP",
    color: "from-pink-500 to-rose-600",
    stars: 5,
    text: "RankPulse changed our SEO strategy completely. We went from page 4 to #1 for our main keyword in just 8 weeks using the AI optimization suggestions.",
  },
  {
    name: "James Wu",
    role: "Freelance Designer",
    avatar: "JW",
    color: "from-amber-500 to-orange-600",
    stars: 5,
    text: "AstraArt is now my go-to for client mockups. The quality is photorealistic and clients can't tell the difference. I've tripled my project output.",
  },
  {
    name: "Emma Thompson",
    role: "Podcast Host & Author",
    avatar: "ET",
    color: "from-purple-500 to-violet-600",
    stars: 5,
    text: "VoxSynth is the best voice AI I've tried. The voice cloning is eerily accurate. I use it for my audiobook narration and listeners love it.",
  },
];

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 text-sm text-violet-400 mb-6">
            <Star className="w-3.5 h-3.5 fill-violet-400" />
            Loved by 50,000+ creators
          </div>
          <h2 className="font-orbitron text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-4">
            What Our Users{" "}
            <span className="gradient-text">Are Saying</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-card-hover p-6 rounded-2xl"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
