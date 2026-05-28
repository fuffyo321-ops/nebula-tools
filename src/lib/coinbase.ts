import crypto from "crypto";

const BASE_URL = "https://api.commerce.coinbase.com";

export const CRYPTO_PLAN_PRICES: Record<"PRO" | "ELITE", number> = {
  PRO: 19,
  ELITE: 49,
};

export async function createCryptoCharge({
  plan,
  userId,
  redirectUrl,
  cancelUrl,
}: {
  plan: "PRO" | "ELITE";
  userId: string;
  redirectUrl: string;
  cancelUrl: string;
}) {
  const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
  if (!apiKey) throw new Error("COINBASE_COMMERCE_API_KEY is not configured");

  const res = await fetch(`${BASE_URL}/charges`, {
    method: "POST",
    headers: {
      "X-CC-Api-Key": apiKey,
      "X-CC-Version": "2018-03-22",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `NebulaTools ${plan} Plan — 1 Month`,
      description: `Access all ${plan === "PRO" ? "50+" : "100+"} AI tools for 30 days`,
      pricing_type: "fixed_price",
      local_price: {
        amount: CRYPTO_PLAN_PRICES[plan].toFixed(2),
        currency: "USD",
      },
      metadata: { user_id: userId, plan },
      redirect_url: redirectUrl,
      cancel_url: cancelUrl,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Coinbase Commerce error ${res.status}: ${body}`);
  }

  const { data } = await res.json();
  return data as { id: string; code: string; hosted_url: string };
}

export function verifyCoinbaseSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;
  if (!secret) throw new Error("COINBASE_COMMERCE_WEBHOOK_SECRET is not configured");

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"));
  } catch {
    return false;
  }
}
