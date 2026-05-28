import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCryptoCharge } from "@/lib/coinbase";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const plan = body.plan as string;

  if (plan !== "PRO" && plan !== "ELITE") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const origin = process.env.NEXTAUTH_URL ?? "https://nebula-tools.vercel.app";

  const charge = await createCryptoCharge({
    plan,
    userId: session.user.id,
    redirectUrl: `${origin}/dashboard/billing?crypto=success`,
    cancelUrl: `${origin}/pricing`,
  });

  return NextResponse.json({ url: charge.hosted_url });
}
