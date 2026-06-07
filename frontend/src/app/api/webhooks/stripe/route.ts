import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

let stripeInstance: Stripe | null = null;
function getStripe() {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy");
  }
  return stripeInstance;
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("Stripe Webhook Error: Missing stripe-signature or webhook secret.");
    return NextResponse.json(
      { error: "Missing stripe-signature or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Stripe Webhook Error: Signature verification failed. ${message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  console.log(`INFO: Received Stripe webhook event: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const stripeCustomerId = session.customer as string;
        const stripeSubscriptionId = session.subscription as string;

        if (!userId) {
          console.warn("WARNING: No client_reference_id (userId) found in Stripe session payload.");
          break;
        }

        // Activate user's subscription
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeCustomerId,
            stripeSubscriptionId,
            subscriptionStatus: "active",
          },
        });
        console.log(`INFO: Stripe Webhook activated user subscription for userId: ${userId}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeSubscriptionId = subscription.id;

        // Find the user matching the subscription ID
        const user = await prisma.user.findFirst({
          where: { stripeSubscriptionId },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: "inactive",
            },
          });
          console.log(`INFO: Stripe Webhook deactivated user subscription for userId: ${user.id}`);
        } else {
          console.warn(
            `WARNING: No user found matching stripeSubscriptionId: ${stripeSubscriptionId}`
          );
        }
        break;
      }

      default:
        console.log(`INFO: Unhandled Stripe event type: ${event.type}`);
    }
  } catch (dbError: unknown) {
    console.error("ERROR: Failed to update user database context in webhook:", dbError);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
