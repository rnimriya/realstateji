"use server";

import Stripe from "stripe";
import { getOrCreateDefaultUser } from "@/lib/user";

// Initialize Stripe Client using env secrets
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

/**
 * Server Action to initialize a Stripe Checkout Session for subscription billing.
 * Links the session to our default seeded user using client_reference_id.
 */
export async function createCheckoutSessionAction() {
  try {
    const user = await getOrCreateDefaultUser();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "DocuExtract AI Premium Membership",
              description: "Infinite legal document & real estate PDF ingestion, structured clause extractions, and verification dashboards.",
            },
            unit_amount: 20000, // $200.00 in cents
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: user.email,
      client_reference_id: user.id, // Maps checkout context to our database user on successful completion
      success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout session URL.");
    }

    return {
      success: true,
      url: session.url,
    };
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return {
      success: false,
      error: error.message || "Failed to initiate checkout session.",
    };
  }
}
