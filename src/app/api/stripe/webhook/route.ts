import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe, syncSubscriptionToDatabase } from "@/lib/stripe";
import { db } from "@/lib/db";
import type Stripe from "stripe";

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("[WEBHOOK_VERIFY]", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription) {
          await syncSubscriptionToDatabase(session.subscription as string);
        }

        // Record payment
        if (session.payment_intent && session.amount_total && session.metadata?.userId) {
          await db.payment.create({
            data: {
              userId: session.metadata.userId,
              amount: session.amount_total,
              currency: session.currency ?? "usd",
              status: "paid",
              stripePaymentId: session.payment_intent as string,
              description: "Subscription payment",
            },
          }).catch(() => {});
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await syncSubscriptionToDatabase(subscription.id);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await db.subscription.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            plan: "FREE",
            status: "CANCELED",
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
          },
        });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await syncSubscriptionToDatabase(invoice.subscription as string);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await db.subscription.updateMany({
            where: { stripeSubscriptionId: invoice.subscription as string },
            data: { status: "PAST_DUE" },
          });
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[WEBHOOK_HANDLER]", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
