import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOpenAI } from "@/lib/openai";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { text, voice, speed, toolId } = await req.json() as {
    text: string;
    voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
    speed: number;
    toolId?: string;
  };

  if (!text?.trim()) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }
  if (text.length > 4000) {
    return NextResponse.json({ error: "Text too long (max 4000 characters)" }, { status: 400 });
  }

  let openai;
  try {
    openai = getOpenAI();
  } catch {
    return NextResponse.json({ error: "AI service not configured. Add OPENAI_API_KEY to Vercel." }, { status: 503 });
  }

  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: voice ?? "nova",
    input: text,
    speed: Math.min(Math.max(speed ?? 1.0, 0.25), 4.0),
  });

  if (toolId) {
    db.tool.update({ where: { id: toolId }, data: { usageCount: { increment: 1 } } }).catch(() => {});
    db.activity.create({
      data: { userId: session.user.id, toolId, type: "TOOL_USE", description: "Generated speech" },
    }).catch(() => {});
  }

  const buffer = Buffer.from(await mp3.arrayBuffer());

  return new Response(buffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": buffer.length.toString(),
    },
  });
}
