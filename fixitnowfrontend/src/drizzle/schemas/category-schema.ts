import { boolean, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const categories = pgTable('categories', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: varchar('description', { length: 1000 }).notNull(),
    is_active: boolean('is_active').default(true).notNull(),
})

