"use client";

import { useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What AI tools are included?",
    answer: "NebulaTools includes 100+ AI tools across writing, image generation, coding, video, audio, SEO, data analysis, chatbots, and productivity. We add new tools every month. Check our full directory for the complete list.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Absolutely. You can cancel your subscription at any time from your billing dashboard. You'll retain access until the end of your current billing period with no cancellation fees.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! All paid plans include a 7-day free trial with full access to all features. No credit card required to start the trial.",
  },
  {
    question: "How does billing work?",
    answer: "We bill monthly or yearly (with 20% discount). Payments are processed securely via Stripe. You'll receive invoices by email and can manage everything from the billing portal.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer: "Yes. You can change plans at any time. Upgrades take effect immediately with prorated billing. Downgrades take effect at the end of the current billing period.",
  },
  {
    question: "Is my data secure?",
    answer: "We take security seriously. All data is encrypted at rest and in transit using AES-256 and TLS 1.3. Your prompts and outputs are never used to train AI models.",
  },
  {
    question: "Do you offer team or enterprise plans?",
    answer: "Pro includes 3 team seats and Elite includes 10. For enterprise needs with custom seat counts, SSO, dedicated support, and custom integrations, contact our sales team.",
  },
  {
    question: "What's the API rate limit?",
    answer: "Free: no API access. Pro: 10,000 API requests/month. Elite: unlimited. All API requests use the same powerful models available in the dashboard.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 text-sm text-violet-400 mb-6">
            <HelpCircle className="w-3.5 h-3.5" />
            FAQ
          </div>
          <h2 className="font-orbitron text-3xl sm:text-4xl font-bold text-white mb-4">
            Frequently Asked{" "}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-slate-400">
            Everything you need to know about NebulaTools.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className={`glass-card rounded-2xl overflow-hidden transition-all duration-200 ${
                openIndex === i ? "border-violet-500/30" : "hover:border-violet-500/20"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left gap-4"
              >
                <span className="text-sm font-medium text-white">{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-violet-400 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5">
                      <div className="h-px bg-border mb-4" />
                      <p className="text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
