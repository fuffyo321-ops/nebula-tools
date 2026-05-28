import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { verifySolanaPayment, PLAN_USDC } from "@/lib/solana";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { signature, plan } = body as { signature: string; plan: string };

  if (!signature || (plan !== "PRO" && plan !== "ELITE")) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Prevent replay attacks — one signature can only be used once
  const existing = await db.payment.findFirst({
    where: { stripePaymentId: `sol_${signature}` },
  });
  if (existing) {
    return NextResponse.json({ error: "Transaction already used" }, { status: 400 });
  }

  const treasuryAddress = process.env.SOLANA_TREASURY_ADDRESS;
  if (!treasuryAddress) {
    return NextResponse.json({ error: "Treasury not configured" }, { status: 500 });
  }

  const valid = await verifySolanaPayment({
    signature,
    expectedAmountUsd: PLAN_USDC[plan as "PRO" | "ELITE"],
    treasuryAddress,
  });

  if (!valid) {
    return NextResponse.json({ error: "Payment verification failed. Please contact support with your transaction ID." }, { status: 400 });
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await db.$transaction([
    db.subscription.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        plan: plan as "PRO" | "ELITE",
        status: "ACTIVE",
        stripeCurrentPeriodEnd: expiresAt,
      },
      update: {
        plan: plan as "PRO" | "ELITE",
        status: "ACTIVE",
        stripeCurrentPeriodEnd: expiresAt,
        cancelAtPeriodEnd: false,
      },
    }),
    db.payment.create({
      data: {
        userId: session.user.id,
        amount: PLAN_USDC[plan as "PRO" | "ELITE"] * 100,
        currency: "usdc",
        status: "paid",
        stripePaymentId: `sol_${signature}`,
        description: `Crypto — ${plan} Plan (30 days)`,
      },
    }),
  ]);

  return NextResponse.json({ success: true });
}
