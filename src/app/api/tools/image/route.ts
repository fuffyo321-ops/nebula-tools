import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOpenAI } from "@/lib/openai";
import { db } from "@/lib/db";

const STYLE_SUFFIXES: Record<string, string> = {
  photorealistic: ", photorealistic, hyperdetailed, 8K, professional photography",
  anime: ", anime style, Studio Ghibli inspired, vibrant colors, detailed illustration",
  "oil-painting": ", oil painting, textured canvas, classical art style, rich colors",
  watercolor: ", watercolor painting, soft edges, transparent layers, artistic",
  sketch: ", pencil sketch, detailed line art, black and white, artistic drawing",
  "3d-render": ", 3D render, octane render, volumetric lighting, cinema 4D, photorealistic CGI",
  "pixel-art": ", pixel art, 16-bit style, retro game aesthetic, colorful",
  fantasy: ", fantasy art, epic, magical, detailed environment, concept art",
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { prompt, style, size, toolId } = await req.json() as {
    prompt: string;
    style: string;
    size: "1024x1024" | "1792x1024" | "1024x1792";
    toolId?: string;
  };

  if (!prompt?.trim()) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  let openai;
  try {
    openai = getOpenAI();
  } catch {
    return NextResponse.json({ error: "AI service not configured. Add OPENAI_API_KEY to Vercel." }, { status: 503 });
  }

  const enhancedPrompt = prompt + (STYLE_SUFFIXES[style] ?? "");

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: enhancedPrompt,
    size: (size as "1024x1024" | "1792x1024" | "1024x1792") ?? "1024x1024",
    quality: "standard",
    n: 1,
  });

  const imageUrl = response.data?.[0]?.url;
  if (!imageUrl) {
    return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
  }

  if (toolId) {
    db.tool.update({ where: { id: toolId }, data: { usageCount: { increment: 1 } } }).catch(() => {});
    db.activity.create({
      data: { userId: session.user.id, toolId, type: "TOOL_USE", description: "Generated image" },
    }).catch(() => {});
  }

  return NextResponse.json({ url: imageUrl });
}
