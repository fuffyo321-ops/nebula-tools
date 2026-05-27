import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

const createToolSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100),
  description: z.string().min(10).max(500),
  longDesc: z.string().optional(),
  icon: z.string().optional(),
  url: z.string().url(),
  tags: z.array(z.string()).default([]),
  requiredPlan: z.enum(["FREE", "PRO", "ELITE"]).default("FREE"),
  categoryId: z.string(),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const plan = searchParams.get("plan");

  const tools = await db.tool.findMany({
    where: {
      active: true,
      ...(category && { category: { slug: category } }),
      ...(plan && { requiredPlan: plan as "FREE" | "PRO" | "ELITE" }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { tags: { has: search } },
        ],
      }),
    },
    include: { category: true },
    orderBy: [{ featured: "desc" }, { usageCount: "desc" }],
  });

  return NextResponse.json(tools);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createToolSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
  }

  const tool = await db.tool.create({ data: parsed.data, include: { category: true } });
  return NextResponse.json(tool, { status: 201 });
}
