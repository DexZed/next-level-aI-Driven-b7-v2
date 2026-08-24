import { boolean, pgTable, uuid, text, index } from "drizzle-orm/pg-core";
import { services } from "./service-schema";
import { relations } from "drizzle-orm/_relations";

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
  },
  (table) => [index("categories_name_idx").on(table.name)],
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  services: many(services),
}));
