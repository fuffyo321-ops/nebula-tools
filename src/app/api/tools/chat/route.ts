import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOpenAI } from "@/lib/openai";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messages, toolId } = await req.json() as {
    messages: { role: "user" | "assistant"; content: string }[];
    toolId?: string;
  };

  if (!messages?.length) {
    return NextResponse.json({ error: "No messages provided" }, { status: 400 });
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
      {
        role: "system",
        content:
          "You are ChatNova, a highly capable and friendly AI assistant. You provide clear, accurate, and helpful responses. You're knowledgeable across many domains and communicate in a conversational yet professional tone.",
      },
      ...messages,
    ],
    max_tokens: 1500,
    temperature: 0.8,
    stream: true,
  });

  if (toolId && messages.length === 1) {
    db.tool.update({ where: { id: toolId }, data: { usageCount: { increment: 1 } } }).catch(() => {});
    db.activity.create({
      data: { userId: session.user.id, toolId, type: "TOOL_USE", description: "Used ChatNova" },
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
