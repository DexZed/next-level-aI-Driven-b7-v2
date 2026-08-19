import {
  uuid,
  pgTable,
  text,
  boolean,
  doublePrecision,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { relations } from "drizzle-orm/_relations";
import { bookings } from "./booking-schema";
import { reviews } from "./review-schema";
import { technicianServices } from "./techService-schema";

export const technicians = pgTable(
  "technicians",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bio: text("bio").notNull(),
    isAvailable: boolean("is_available").default(true).notNull(),
    ratingAvg: doublePrecision("ratingAvg").default(0.0).notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    city: text("city").default("Dhaka").notNull(),
  },
  (table) => [
    index("technicians_availability_rating_idx").on(
      table.isAvailable,
      table.ratingAvg
    ),
  ]
);

export const techniciansRelations = relations(technicians, ({ one, many }) => ({
  user: one(user, {
    fields: [technicians.userId],
    references: [user.id],
  }),
  bookings: many(bookings),
  reviews: many(reviews),
  technicianServices: many(technicianServices),
}));