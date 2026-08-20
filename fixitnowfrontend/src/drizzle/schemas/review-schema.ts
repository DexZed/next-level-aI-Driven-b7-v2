import { relations } from "drizzle-orm/_relations";
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { bookings } from "./booking-schema";
import { technicians } from "./technician-schema";

export const reviews = pgTable(
  "reviews",
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
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookings.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [index("reviews_technician_id_idx").on(table.technicianId)],
);

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(user, {
    fields: [reviews.userId],
    references: [user.id],
  }),
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
  technician: one(technicians, {
    fields: [reviews.technicianId],
    references: [technicians.id],
  }),
}));
