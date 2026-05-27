import { PrismaClient, Plan } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌌 Seeding NebulaTools database...");

  // ─── Admin User ────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("admin123456", 12);

  const admin = await db.user.upsert({
    where: { email: "admin@nebula-tools.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@nebula-tools.com",
      password: hashedPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  await db.subscription.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      plan: "ELITE",
      status: "ACTIVE",
    },
  });

  // ─── Demo User ─────────────────────────────────────────────────────────────
  const demoPassword = await bcrypt.hash("demo123456", 12);

  const demo = await db.user.upsert({
    where: { email: "demo@nebula-tools.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@nebula-tools.com",
      password: demoPassword,
      emailVerified: new Date(),
    },
  });

  await db.subscription.upsert({
    where: { userId: demo.id },
    update: {},
    create: {
      userId: demo.id,
      plan: "PRO",
      status: "ACTIVE",
    },
  });

  // ─── Categories ────────────────────────────────────────────────────────────
  const categories = [
    { name: "AI Writing", slug: "ai-writing", icon: "✍️", color: "#7c3aed", description: "AI-powered writing and content tools" },
    { name: "Image Generation", slug: "image-generation", icon: "🎨", color: "#06b6d4", description: "Create stunning images with AI" },
    { name: "Code & Dev", slug: "code-dev", icon: "💻", color: "#10b981", description: "AI coding assistants and dev tools" },
    { name: "Video & Audio", slug: "video-audio", icon: "🎬", color: "#f59e0b", description: "AI video and audio creation tools" },
    { name: "SEO & Marketing", slug: "seo-marketing", icon: "📈", color: "#ef4444", description: "Boost your marketing with AI" },
    { name: "Research & Data", slug: "research-data", icon: "🔬", color: "#8b5cf6", description: "AI research and data analysis tools" },
    { name: "Chatbots & NLP", slug: "chatbots-nlp", icon: "🤖", color: "#3b82f6", description: "Conversational AI and language models" },
    { name: "Productivity", slug: "productivity", icon: "⚡", color: "#ec4899", description: "Supercharge your workflow with AI" },
  ];

  const categoryMap: Record<string, string> = {};

  for (const cat of categories) {
    const created = await db.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }

  // ─── Tools ─────────────────────────────────────────────────────────────────
  const tools = [
    {
      name: "NebulaWriter",
      slug: "nebula-writer",
      description: "AI-powered long-form content generator with SEO optimization",
      longDesc: "NebulaWriter uses advanced language models to generate high-quality blog posts, articles, and marketing copy. Supports 50+ content templates, SEO optimization, and multi-language output.",
      icon: "✍️",
      url: "https://nebula-tools.com/app/writer",
      tags: ["writing", "content", "seo", "blog"],
      requiredPlan: "FREE" as Plan,
      featured: true,
      trending: true,
      usageCount: 15420,
      categorySlug: "ai-writing",
    },
    {
      name: "AstraArt",
      slug: "astra-art",
      description: "Text-to-image generation powered by diffusion models",
      longDesc: "Generate photorealistic images, art, and graphics from text descriptions. Supports multiple art styles, aspect ratios, and high-resolution output up to 4K.",
      icon: "🎨",
      url: "https://nebula-tools.com/app/art",
      tags: ["image", "art", "design", "creative"],
      requiredPlan: "PRO" as Plan,
      featured: true,
      trending: true,
      usageCount: 28730,
      categorySlug: "image-generation",
    },
    {
      name: "CodeOrbit",
      slug: "code-orbit",
      description: "AI pair programmer with full-stack knowledge across 50+ languages",
      longDesc: "Get instant code completions, bug fixes, code review, and explanations. Supports all major programming languages and frameworks.",
      icon: "💻",
      url: "https://nebula-tools.com/app/code",
      tags: ["coding", "development", "debugging", "review"],
      requiredPlan: "PRO" as Plan,
      featured: true,
      trending: false,
      usageCount: 12190,
      categorySlug: "code-dev",
    },
    {
      name: "VoxSynth",
      slug: "vox-synth",
      description: "AI voice cloning and text-to-speech with 200+ voice models",
      longDesc: "Clone any voice, generate realistic speech, and create professional voiceovers. Supports 40+ languages with natural-sounding AI voices.",
      icon: "🎤",
      url: "https://nebula-tools.com/app/voice",
      tags: ["voice", "audio", "speech", "tts"],
      requiredPlan: "ELITE" as Plan,
      featured: false,
      trending: true,
      usageCount: 8450,
      categorySlug: "video-audio",
    },
    {
      name: "RankPulse",
      slug: "rank-pulse",
      description: "AI SEO suite: keyword research, content optimization, backlink analysis",
      longDesc: "Dominate search rankings with AI-powered SEO analysis, competitor research, and content scoring. Includes SERP tracking and automated reports.",
      icon: "📈",
      url: "https://nebula-tools.com/app/seo",
      tags: ["seo", "marketing", "keywords", "ranking"],
      requiredPlan: "PRO" as Plan,
      featured: false,
      trending: true,
      usageCount: 9870,
      categorySlug: "seo-marketing",
    },
    {
      name: "DataPulse",
      slug: "data-pulse",
      description: "AI data analysis and visualization — chat with your data",
      longDesc: "Upload CSV, Excel, or connect databases and have AI analyze trends, generate charts, and produce insights instantly. No SQL knowledge required.",
      icon: "📊",
      url: "https://nebula-tools.com/app/data",
      tags: ["data", "analytics", "charts", "research"],
      requiredPlan: "ELITE" as Plan,
      featured: true,
      trending: false,
      usageCount: 5320,
      categorySlug: "research-data",
    },
    {
      name: "ChatNova",
      slug: "chat-nova",
      description: "Build custom AI chatbots trained on your own data in minutes",
      longDesc: "Create intelligent chatbots for customer support, lead generation, and automation. Train on PDFs, websites, or custom data with no coding required.",
      icon: "🤖",
      url: "https://nebula-tools.com/app/chat",
      tags: ["chatbot", "nlp", "automation", "support"],
      requiredPlan: "PRO" as Plan,
      featured: false,
      trending: true,
      usageCount: 11240,
      categorySlug: "chatbots-nlp",
    },
    {
      name: "FlowMind",
      slug: "flow-mind",
      description: "AI task automation and workflow builder with 200+ integrations",
      longDesc: "Automate repetitive tasks, create AI workflows, and connect your favorite apps. Drag-and-drop interface with powerful AI decision nodes.",
      icon: "⚡",
      url: "https://nebula-tools.com/app/flow",
      tags: ["automation", "workflow", "productivity", "integrations"],
      requiredPlan: "FREE" as Plan,
      featured: true,
      trending: false,
      usageCount: 7830,
      categorySlug: "productivity",
    },
    {
      name: "PixelForge",
      slug: "pixel-forge",
      description: "AI photo editing and enhancement with one-click transforms",
      longDesc: "Remove backgrounds, enhance photos, change styles, and create variations with AI. Professional-grade results in seconds.",
      icon: "🖼️",
      url: "https://nebula-tools.com/app/pixel",
      tags: ["photo", "editing", "enhancement", "design"],
      requiredPlan: "FREE" as Plan,
      featured: false,
      trending: false,
      usageCount: 18960,
      categorySlug: "image-generation",
    },
    {
      name: "ScriptCraft",
      slug: "script-craft",
      description: "AI video script writer and storyboard generator",
      longDesc: "Create compelling video scripts, YouTube content, ads, and social media videos with AI. Includes scene-by-scene storyboards and voice direction.",
      icon: "🎬",
      url: "https://nebula-tools.com/app/script",
      tags: ["video", "script", "youtube", "content"],
      requiredPlan: "PRO" as Plan,
      featured: false,
      trending: false,
      usageCount: 6140,
      categorySlug: "video-audio",
    },
    {
      name: "BrandSpark",
      slug: "brand-spark",
      description: "AI brand identity generator: logos, palettes, and style guides",
      longDesc: "Generate complete brand identities in minutes. Get logo concepts, color palettes, typography pairings, and brand voice guidelines powered by AI.",
      icon: "✨",
      url: "https://nebula-tools.com/app/brand",
      tags: ["branding", "design", "logo", "identity"],
      requiredPlan: "ELITE" as Plan,
      featured: false,
      trending: true,
      usageCount: 4280,
      categorySlug: "seo-marketing",
    },
    {
      name: "ResearchBot",
      slug: "research-bot",
      description: "AI research assistant that reads papers, web, and documents for you",
      longDesc: "Summarize research papers, extract key insights, compare sources, and generate literature reviews. Supports PDF, web URLs, and academic databases.",
      icon: "🔬",
      url: "https://nebula-tools.com/app/research",
      tags: ["research", "summarize", "papers", "insights"],
      requiredPlan: "FREE" as Plan,
      featured: false,
      trending: false,
      usageCount: 9650,
      categorySlug: "research-data",
    },
  ];

  for (const tool of tools) {
    const { categorySlug, ...toolData } = tool;
    await db.tool.upsert({
      where: { slug: tool.slug },
      update: {},
      create: {
        ...toolData,
        rating: Math.round((3.8 + Math.random() * 1.2) * 10) / 10,
        ratingCount: Math.floor(50 + Math.random() * 500),
        categoryId: categoryMap[categorySlug],
      },
    });
  }

  console.log("✅ Seeding complete!");
  console.log("📧 Admin: admin@nebula-tools.com / admin123456");
  console.log("📧 Demo:  demo@nebula-tools.com  / demo123456");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
