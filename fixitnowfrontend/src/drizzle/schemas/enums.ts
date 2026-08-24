import { pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "in_progress",
  "declined",
  "paid",
]);
