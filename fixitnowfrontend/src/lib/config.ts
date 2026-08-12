import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  DATABASE_URL: z.string(),
  BASE_URL: z.string(),
  PRODUCTION_URL: z.string(),

  //Better-auth env
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),

  // STRIPE_PRODUCT_ID: z.string(),
  // STRIPE_SECRET_KEY: z.string(),
  // STRIPE_WEBHOOK_SECRET_PRODUCTION: z.string(),
  // STRIPE_WEBHOOK_SECRET_LOCAL: z.string(),
  // STRIPE_PUBLIC_KEY: z.string(),
});

try {
  // eslint-disable-next-line node/no-process-env
  envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error(
      "Missing environment variables:",
      error.issues.flatMap((issue) => issue.path),
    );
  } else {
    console.error(error);
  }
  process.exit(1);
}

// eslint-disable-next-line node/no-process-env
export const env = envSchema.parse(process.env);
