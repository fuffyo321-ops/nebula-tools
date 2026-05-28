"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Sparkles, Copy, Trash2, Check } from "lucide-react";

interface Field {
  name: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

interface ToolConfig {
  description: string;
  buttonLabel: string;
  fields: Field[];
  buildPrompt: (v: Record<string, string>) => string;
}

const CONFIGS: Record<string, ToolConfig> = {
  "nebula-writer": {
    description: "Generate high-quality blog posts, articles, and marketing copy with AI.",
    buttonLabel: "Generate Content",
    fields: [
      { name: "contentType", label: "Content Type", type: "select", options: ["Blog Post", "Article", "Marketing Copy", "Email Newsletter", "Social Media Post", "Product Description"] },
      { name: "topic", label: "Topic / Title", type: "text", placeholder: "e.g. 10 Ways AI is Changing Marketing in 2025", required: true },
      { name: "tone", label: "Tone", type: "select", options: ["Professional", "Casual & Friendly", "Persuasive", "Educational", "Humorous", "Inspirational"] },
      { name: "length", label: "Length", type: "select", options: ["Short (~300 words)", "Medium (~700 words)", "Long (~1500 words)", "Detailed (~2500 words)"] },
    ],
    buildPrompt: (v) => `Write a ${v.contentType} about: ${v.topic}\nTone: ${v.tone}\nTarget length: ${v.length}\n\nMake it engaging, well-structured, and ready to publish.`,
  },
  "script-craft": {
    description: "Create platform-optimized video scripts with hooks, content structure, and CTAs.",
    buttonLabel: "Generate Script",
    fields: [
      { name: "platform", label: "Platform", type: "select", options: ["YouTube (Long Form)", "YouTube Shorts", "TikTok", "Instagram Reels", "Podcast", "LinkedIn Video"] },
      { name: "topic", label: "Video Topic", type: "text", placeholder: "e.g. How to Start a Dropshipping Business in 2025", required: true },
      { name: "duration", label: "Duration", type: "select", options: ["30 seconds", "1 minute", "3 minutes", "5-7 minutes", "10-15 minutes", "20+ minutes"] },
      { name: "style", label: "Style", type: "select", options: ["Educational / Tutorial", "Entertaining / Story", "News / Review", "Motivational", "Interview Style", "Vlog"] },
    ],
    buildPrompt: (v) => `Create a ${v.platform} video script about: ${v.topic}\nDuration: ${v.duration}\nStyle: ${v.style}\n\nInclude a strong hook, clear structure with timestamps, and a compelling CTA.`,
  },
  "flow-mind": {
    description: "Break down any goal into an actionable workflow with tasks, timelines, and automation ideas.",
    buttonLabel: "Create Workflow",
    fields: [
      { name: "goal", label: "Goal or Project", type: "textarea", placeholder: "e.g. Launch a SaaS product in 3 months with a team of 2 developers", required: true },
      { name: "workflowType", label: "Output Type", type: "select", options: ["Step-by-Step Workflow", "Task Breakdown & Priorities", "Weekly Schedule", "Automation Opportunities", "Sprint Planning (Agile)", "Full Project Roadmap"] },
      { name: "timeline", label: "Timeline", type: "select", options: ["1 day", "1 week", "2 weeks", "1 month", "3 months", "6 months", "1 year"] },
    ],
    buildPrompt: (v) => `Create a ${v.workflowType} for this goal: ${v.goal}\nTimeline: ${v.timeline}\n\nBe specific, actionable, and include realistic time estimates and priorities.`,
  },
  "rank-pulse": {
    description: "Get AI-powered SEO analysis, keyword research, and content optimization recommendations.",
    buttonLabel: "Analyze SEO",
    fields: [
      { name: "keyword", label: "Target Keyword / Topic", type: "text", placeholder: "e.g. best project management software for startups", required: true },
      { name: "website", label: "Website URL (optional)", type: "text", placeholder: "https://yoursite.com" },
      { name: "analysisType", label: "Analysis Type", type: "select", options: ["Full SEO Audit", "Keyword Research", "Content Optimization", "Competitor Analysis", "Local SEO", "E-commerce SEO"] },
      { name: "industry", label: "Industry", type: "select", options: ["SaaS / Tech", "E-commerce", "Healthcare", "Finance", "Education", "Travel", "Real Estate", "Food & Restaurant", "Other"] },
    ],
    buildPrompt: (v) => `Perform a ${v.analysisType} for the keyword: "${v.keyword}"\nIndustry: ${v.industry}${v.website ? `\nWebsite: ${v.website}` : ""}\n\nProvide specific, actionable insights with priority levels (High/Medium/Low).`,
  },
  "brand-spark": {
    description: "Generate a complete brand identity including colors, fonts, taglines, and brand voice.",
    buttonLabel: "Generate Brand Identity",
    fields: [
      { name: "brandName", label: "Brand Name", type: "text", placeholder: "e.g. NebulaTools", required: true },
      { name: "industry", label: "Industry / Niche", type: "text", placeholder: "e.g. AI SaaS tools for creators", required: true },
      { name: "values", label: "Brand Values & Description", type: "textarea", placeholder: "e.g. Innovation, simplicity, empowering creators. We help people do more with AI." },
      { name: "audience", label: "Target Audience", type: "text", placeholder: "e.g. Freelancers, content creators, small business owners" },
    ],
    buildPrompt: (v) => `Create a complete brand identity for: ${v.brandName}\nIndustry: ${v.industry}\nValues/Description: ${v.values}\nTarget Audience: ${v.audience}\n\nProvide colors (with hex codes), typography, 5 tagline options, brand voice, and positioning statement.`,
  },
  "research-bot": {
    description: "Get comprehensive AI-powered research summaries on any topic.",
    buttonLabel: "Start Research",
    fields: [
      { name: "topic", label: "Research Topic or Question", type: "textarea", placeholder: "e.g. What are the latest breakthroughs in quantum computing and their potential applications?", required: true },
      { name: "depth", label: "Research Depth", type: "select", options: ["Quick Overview (brief summary)", "Standard Analysis (balanced detail)", "Deep Dive (comprehensive)", "Academic Style (thorough with citations)"] },
      { name: "format", label: "Output Format", type: "select", options: ["Executive Summary", "Detailed Report", "Bullet Points", "Q&A Format", "Comparison Analysis"] },
    ],
    buildPrompt: (v) => `Research this topic thoroughly: ${v.topic}\nDepth: ${v.depth}\nFormat: ${v.format}\n\nProvide accurate, well-structured information with key facts, statistics, and actionable insights.`,
  },
  "data-pulse": {
    description: "Analyze data, identify trends, and get AI-powered insights instantly.",
    buttonLabel: "Analyze Data",
    fields: [
      { name: "data", label: "Your Data or Context", type: "textarea", placeholder: "Paste your data here (CSV, numbers, metrics) or describe what you want to analyze...", required: true },
      { name: "question", label: "What do you want to know?", type: "textarea", placeholder: "e.g. What are the key trends? Which months performed best? What anomalies do you see?" },
      { name: "outputType", label: "Analysis Type", type: "select", options: ["Trend Analysis", "Statistical Summary", "Anomaly Detection", "Forecasting", "Comparison Report", "Full Dashboard Report"] },
    ],
    buildPrompt: (v) => `Analyze this data:\n\n${v.data}\n\nQuestion: ${v.question}\nAnalysis Type: ${v.outputType}\n\nProvide specific numbers, patterns, anomalies, and actionable recommendations.`,
  },
  "code-orbit": {
    description: "Your AI pair programmer — generate, debug, review, and explain code in any language.",
    buttonLabel: "Run",
    fields: [
      { name: "action", label: "Action", type: "select", options: ["Generate Code", "Debug / Fix", "Review & Improve", "Explain Code", "Add Comments", "Optimize Performance", "Write Tests"] },
      { name: "language", label: "Programming Language", type: "select", options: ["JavaScript", "TypeScript", "Python", "Go", "Rust", "Java", "C++", "C#", "PHP", "Ruby", "Swift", "Kotlin", "SQL", "Bash", "Other"] },
      { name: "code", label: "Code or Description", type: "textarea", placeholder: "Paste your code here, or describe what you want to build...", required: true },
    ],
    buildPrompt: (v) => `Task: ${v.action}\nLanguage: ${v.language}\n\n${v.code}\n\nBe thorough, use best practices, and explain your reasoning.`,
  },
};

async function streamText(
  slug: string,
  prompt: string,
  toolId: string,
  onChunk: (t: string) => void,
): Promise<void> {
  const res = await fetch("/api/tools/text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, prompt, toolId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error ?? "Generation failed");
  }
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value));
  }
}

export function TextTool({ slug, toolId }: { slug: string; toolId: string }) {
  const config = CONFIGS[slug];
  const [values, setValues] = useState<Record<string, string>>({});
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!config) return null;

  function setValue(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const required = config.fields.filter((f) => f.required);
    const missing = required.find((f) => !values[f.name]?.trim());
    if (missing) { toast.error(`${missing.label} is required`); return; }

    setLoading(true);
    setOutput("");
    try {
      const prompt = config.buildPrompt(values);
      await streamText(slug, prompt, toolId, (chunk) => setOutput((prev) => prev + chunk));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <p className="text-slate-400 text-sm">{config.description}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {config.fields.map((field) => (
          <div key={field.name} className="space-y-1.5">
            <Label>{field.label}</Label>
            {field.type === "select" ? (
              <select
                value={values[field.name] ?? field.options![0]}
                onChange={(e) => setValue(field.name, e.target.value)}
                className="w-full h-10 rounded-xl border border-border bg-[#111127] px-3 text-sm text-white focus:outline-none focus:border-violet-500/50"
              >
                {field.options!.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                value={values[field.name] ?? ""}
                onChange={(e) => setValue(field.name, e.target.value)}
                placeholder={field.placeholder}
                rows={4}
                className="w-full rounded-xl border border-border bg-[#111127] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 resize-none"
              />
            ) : (
              <Input
                value={values[field.name] ?? ""}
                onChange={(e) => setValue(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="bg-[#111127] border-border focus-visible:border-violet-500/50"
              />
            )}
          </div>
        ))}

        <Button type="submit" className="w-full font-orbitron tracking-wider shadow-lg shadow-violet-500/25 gap-2" disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> {config.buttonLabel}</>}
        </Button>
      </form>

      {(output || loading) && (
        <div className="rounded-2xl border border-border bg-[#0d0d1a] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-xs text-slate-500 font-medium">OUTPUT</span>
            <div className="flex gap-2">
              {output && (
                <>
                  <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button onClick={() => setOutput("")} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /> Clear
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="p-5 max-h-[600px] overflow-y-auto">
            {output ? (
              <pre className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">{output}</pre>
            ) : (
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Generating your content...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
