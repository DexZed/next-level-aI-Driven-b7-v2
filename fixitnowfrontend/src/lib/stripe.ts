import Stripe from "stripe";

const stripeSecretKey =
  process.env.STRIPE_SECRET ||
  process.env.STRIPE_SECRET_KEY ||
  "sk_test_placeholder_key";

export const stripe = new Stripe(stripeSecretKey, {
  typescript: true,
});
