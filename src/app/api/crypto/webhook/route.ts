import { NextRequest, NextResponse } from "next/server";
import { verifyCoinbaseSignature } from "@/lib/coinbase";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-cc-webhook-signature") ?? "";
  const rawBody = await req.text();

  let verified = false;
  try {
    verified = verifyCoinbaseSignature(rawBody, signature);
  } catch {
    return NextResponse.json({ error: "Signature error" }, { status: 400 });
  }

  if (!verified) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const eventType: string = event.event?.type ?? "";

  if (eventType === "charge:confirmed" || eventType === "charge:resolved") {
    const chargeData = event.event?.data ?? {};
    const { user_id, plan } = chargeData.metadata ?? {};

    if (!user_id || (plan !== "PRO" && plan !== "ELITE")) {
      return NextResponse.json({ error: "Invalid metadata" }, { status: 400 });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const amountUsd = parseFloat(chargeData.pricing?.local?.amount ?? "0");

    await db.$transaction([
      db.subscription.upsert({
        where: { userId: user_id },
        create: {
          userId: user_id,
          plan,
          status: "ACTIVE",
          stripeCurrentPeriodEnd: expiresAt,
        },
        update: {
          plan,
          status: "ACTIVE",
          stripeCurrentPeriodEnd: expiresAt,
          cancelAtPeriodEnd: false,
        },
      }),
      db.payment.create({
        data: {
          userId: user_id,
          amount: Math.round(amountUsd * 100),
          currency: "usd",
          status: "paid",
          stripePaymentId: `crypto_${chargeData.code ?? chargeData.id}`,
          description: `Crypto payment — ${plan} Plan (30 days)`,
        },
      }),
    ]);
  }

  return NextResponse.json({ received: true });
}
