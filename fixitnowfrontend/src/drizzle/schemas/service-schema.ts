import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const services = pgTable('services', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: varchar('description', { length: 1000 }).notNull(),
})