import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOpenAI } from "@/lib/openai";
import { db } from "@/lib/db";

const SYSTEM_PROMPTS: Record<string, string> = {
  "nebula-writer":
    "You are NebulaWriter, an expert AI content writer. Create high-quality, engaging, well-structured content. Use markdown formatting: ## for headings, **bold** for emphasis, - for bullet points. Write compelling, professional content ready to publish.",
  "script-craft":
    "You are ScriptCraft, an expert video script writer. Create platform-optimized scripts with clear sections: HOOK (0-5s), INTRO, MAIN CONTENT (with timestamps), OUTRO, and CTA. Include stage directions in [brackets]. Make dialogue natural and conversational.",
  "flow-mind":
    "You are FlowMind, an expert productivity coach. Break down goals into clear actionable workflows. Format with: ## Workflow Overview, ## Step-by-Step Process (numbered), ## Time Estimates, ## Tools Recommended, ## Automation Opportunities, ## Quick Wins.",
  "rank-pulse":
    "You are RankPulse, an expert SEO specialist. Provide comprehensive, actionable SEO analysis. Format with: ## Primary Keywords (with search intent), ## Content Gaps, ## On-Page Recommendations, ## Technical SEO Tips, ## Content Ideas. Be specific and actionable with priority levels.",
  "brand-spark":
    "You are BrandSpark, an expert brand strategist. Create comprehensive brand identities. Format with: ## Brand Essence, ## Brand Voice & Tone, ## Color Palette (with hex codes), ## Typography Recommendations, ## Tagline Options (5 variations), ## Elevator Pitch, ## Target Audience Profile.",
  "research-bot":
    "You are ResearchBot, an expert AI research assistant. Provide thorough, well-structured research. Format with: ## Executive Summary, ## Key Findings (numbered), ## Detailed Analysis, ## Key Statistics & Facts, ## Implications, ## Further Reading.",
  "data-pulse":
    "You are DataPulse, an expert data analyst. Analyze data and provide clear insights. Format with: ## Key Metrics, ## Trends & Patterns, ## Statistical Insights, ## Anomalies Detected, ## Actionable Recommendations. Be precise with numbers.",
  "code-orbit":
    "You are CodeOrbit, an expert AI pair programmer. Write clean, well-commented code. When debugging, identify the exact issue and fix it with explanation. When reviewing, list specific improvements. Always use markdown code blocks with the language specified (e.g. ```python).",
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug, prompt, toolId } = await req.json() as {
    slug: string;
    prompt: string;
    toolId?: string;
  };

  const systemPrompt = SYSTEM_PROMPTS[slug];
  if (!systemPrompt || !prompt?.trim()) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  let openai;
  try {
    openai = getOpenAI();
  } catch {
    return NextResponse.json({ error: "AI service not configured. Add OPENAI_API_KEY to Vercel." }, { status: 503 });
  }

  const aiStream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    max_tokens: 2500,
    temperature: 0.7,
    stream: true,
  });

  // Track usage
  if (toolId) {
    db.tool.update({ where: { id: toolId }, data: { usageCount: { increment: 1 } } }).catch(() => {});
    db.activity.create({
      data: { userId: session.user.id, toolId, type: "TOOL_USE", description: `Used ${slug}` },
    }).catch(() => {});
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const chunk of aiStream) {
        const text = chunk.choices[0]?.delta?.content;
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
