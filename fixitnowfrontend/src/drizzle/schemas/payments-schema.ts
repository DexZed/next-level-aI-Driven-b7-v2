import { pgTable, serial, integer, timestamp, time, pgEnum, varchar } from "drizzle-orm/pg-core";

export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'success', 'failed', 'refunded'])

export const payments = pgTable('payments', {
    id: serial('id').primaryKey(),
    status: paymentStatusEnum('status').default('pending').notNull(),
    amount: integer('amount').notNull(),
    provider: varchar('provider', { length: 255 }).notNull(),
    // serviceId: integer('service_id').notNull(),
    // technicianId: integer('technician_id').notNull(),
    // customerId: integer('customer_id').notNull(),
    // bookingDate: timestamp('booking_date').notNull(),
    // bookingTime: time('booking_time').notNull(),
})
