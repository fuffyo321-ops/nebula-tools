import Stripe from "stripe";
import { db } from "./db";
import { PLANS } from "./utils";

// Lazy initialization — avoids Stripe throwing during build when env vars aren't set
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
    _stripe = new Stripe(key, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return _stripe;
}

// Named export for convenience (use getStripe() in route handlers instead)
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return Reflect.get(getStripe(), prop);
  },
});

export const PRICE_IDS = {
  PRO: {
    monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? "",
    yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID ?? "",
  },
  ELITE: {
    monthly: process.env.STRIPE_ELITE_MONTHLY_PRICE_ID ?? "",
    yearly: process.env.STRIPE_ELITE_YEARLY_PRICE_ID ?? "",
  },
} as const;

export async function getOrCreateStripeCustomer(userId: string, email: string, name?: string | null) {
  const s = getStripe();
  const subscription = await db.subscription.findUnique({
    where: { userId },
    select: { stripeCustomerId: true },
  });

  if (subscription?.stripeCustomerId) {
    return subscription.stripeCustomerId;
  }

  const customer = await s.customers.create({
    email,
    name: name ?? undefined,
    metadata: { userId },
  });

  await db.subscription.upsert({
    where: { userId },
    update: { stripeCustomerId: customer.id },
    create: {
      userId,
      stripeCustomerId: customer.id,
      plan: "FREE",
      status: "ACTIVE",
    },
  });

  return customer.id;
}

export async function getPlanFromPriceId(priceId: string): Promise<"PRO" | "ELITE" | null> {
  if (priceId === PRICE_IDS.PRO.monthly || priceId === PRICE_IDS.PRO.yearly) return "PRO";
  if (priceId === PRICE_IDS.ELITE.monthly || priceId === PRICE_IDS.ELITE.yearly) return "ELITE";
  return null;
}

export async function syncSubscriptionToDatabase(subscriptionId: string) {
  const s = getStripe();
  const subscription = await s.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"],
  });

  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price.id;
  const plan = priceId ? await getPlanFromPriceId(priceId) : null;

  const dbSubscription = await db.subscription.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!dbSubscription) return;

  const statusMap: Record<string, "ACTIVE" | "INACTIVE" | "CANCELED" | "PAST_DUE" | "TRIALING"> = {
    active: "ACTIVE",
    canceled: "CANCELED",
    incomplete: "INACTIVE",
    incomplete_expired: "INACTIVE",
    past_due: "PAST_DUE",
    trialing: "TRIALING",
    unpaid: "PAST_DUE",
    paused: "INACTIVE",
  };

  await db.subscription.update({
    where: { userId: dbSubscription.userId },
    data: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      plan: plan ?? "FREE",
      status: statusMap[subscription.status] ?? "INACTIVE",
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    },
  });
}

export { PLANS };
