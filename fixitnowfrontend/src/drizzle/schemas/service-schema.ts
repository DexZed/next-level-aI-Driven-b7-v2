import { pgTable, uuid, text, boolean, index } from "drizzle-orm/pg-core";
import { categories } from "./category-schema";
import { relations } from "drizzle-orm/_relations";
import { bookings } from "./booking-schema";
import { technicianServices } from "./techService-schema";

export const services = pgTable(
  "services",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    isActive: boolean("is_active").default(true).notNull(),
  },
  (table) => [
    index("services_name_idx").on(table.name),
    index("services_category_id_idx").on(table.categoryId),
  ],
);
export const servicesRelations = relations(services, ({ one, many }) => ({
  category: one(categories, {
    fields: [services.categoryId],
    references: [categories.id],
  }),
  bookings: many(bookings),
  technicianServices: many(technicianServices),
}));
