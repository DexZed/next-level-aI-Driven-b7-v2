import {
  pgTable,
  timestamp,
  pgEnum,
  uuid,
  doublePrecision,
  text,
} from "drizzle-orm/pg-core";
import { bookings, statusEnum } from "./booking-schema";
import { relations } from "drizzle-orm/_relations";

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "success",
  "failed",
  "refunded",
]);

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => bookings.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  amount: doublePrecision("amount").notNull(),
  method: text("method").notNull(),
  provider: text("provider").notNull(),
  status: statusEnum("status").default("pending").notNull(),
  paidAt: timestamp("paid_at", { mode: "date" }).defaultNow(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id],
  }),
}));
