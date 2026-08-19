import {
  uuid,
  pgTable,
  doublePrecision,
  unique,
} from "drizzle-orm/pg-core";
import { technicians } from "./technician-schema";
import { services } from "./service-schema";
import { relations } from "drizzle-orm/_relations";
export const technicianServices = pgTable(
  "technicianServices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
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
    price: doublePrecision("price").default(0.0).notNull(),
  },
  (table) => [
    unique("technicianServices_technician_id_service_id_unique").on(
      table.technicianId,
      table.serviceId
    ),
  ]
);

export const technicianServicesRelations = relations(
  technicianServices,
  ({ one }) => ({
    technician: one(technicians, {
      fields: [technicianServices.technicianId],
      references: [technicians.id],
    }),
    service: one(services, {
      fields: [technicianServices.serviceId],
      references: [services.id],
    }),
  })
);