import { pgTable, serial, integer, timestamp, time, pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'completed', 'cancelled'])

export const booking = pgTable('booking', {
    id: serial('id').primaryKey(),
    status: statusEnum('status').default('pending').notNull(),
    total_price: integer('total_price').notNull(),
    // serviceId: integer('service_id').notNull(),
    // technicianId: integer('technician_id').notNull(),
    // customerId: integer('customer_id').notNull(),
    // bookingDate: timestamp('booking_date').notNull(),
    // bookingTime: time('booking_time').notNull(),
})

