import { relations } from "drizzle-orm/_relations";
import {
  pgTable,
  timestamp,
  uuid,
  doublePrecision,
  index,
  text,
} from "drizzle-orm/pg-core";
import { technicians } from "./technician-schema";
import { user } from "./auth-schema";
import { services } from "./service-schema";
import { payments } from "./payments-schema";
import { reviews } from "./review-schema";
import { statusEnum } from "./enums";

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    technicianId: uuid("technician_id")
      .notNull()
      .references(() => technicians.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    status: statusEnum("status").default("pending").notNull(),
    scheduledAt: timestamp("scheduled_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    totalPrice: doublePrecision("total_price").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("bookings_user_id_status_idx").on(table.userId, table.status),
  ],
);
export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  user: one(user, {
    fields: [bookings.userId],
    references: [user.id],
  }),
  service: one(services, {
    fields: [bookings.serviceId],
    references: [services.id],
  }),
  technician: one(technicians, {
    fields: [bookings.technicianId],
    references: [technicians.id],
  }),
  payments: many(payments),
  reviews: many(reviews),
}));
