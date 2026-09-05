"use server";

import { db } from "@/drizzle";
import { getSession } from "./session";
import { technicians } from "@/drizzle/schemas/technician-schema";
import { technicianServices } from "@/drizzle/schemas/techService-schema";
import { services } from "@/drizzle/schemas/service-schema";
import { categories } from "@/drizzle/schemas/category-schema";
import { bookings } from "@/drizzle/schemas/booking-schema";
import { user } from "@/drizzle/schemas/auth-schema";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

/**
 * Gets or creates the technician record for the authenticated user.
 */
export async function getOrCreateTechnicianProfile() {
  const sessionUser = await getSession("technician");

  const [existing] = await db
    .select()
    .from(technicians)
    .where(eq(technicians.userId, sessionUser.id));

  if (existing) {
    return { ...existing, user: sessionUser };
  }

  const [created] = await db
    .insert(technicians)
    .values({
      userId: sessionUser.id,
      bio: "Experienced professional technician ready to assist.",
      city: "Dhaka",
      isAvailable: true,
      ratingAvg: 5.0,
    })
    .returning();

  return { ...created, user: sessionUser };
}

/**
 * Fetches stats and recent job requests for the technician dashboard.
 */
export async function getTechnicianDashboardData() {
  const tech = await getOrCreateTechnicianProfile();

  const allTechBookings = await db
    .select({
      id: bookings.id,
      status: bookings.status,
      totalPrice: bookings.totalPrice,
      scheduledAt: bookings.scheduledAt,
      createdAt: bookings.createdAt,
      customerName: user.name,
      customerEmail: user.email,
      serviceName: services.name,
    })
    .from(bookings)
    .leftJoin(user, eq(bookings.userId, user.id))
    .leftJoin(services, eq(bookings.serviceId, services.id))
    .where(eq(bookings.technicianId, tech.id))
    .orderBy(desc(bookings.scheduledAt));

  const pendingJobs = allTechBookings.filter((b) => b.status === "pending");

  const upcomingJobs = allTechBookings.filter(
    (b) =>
      b.status === "confirmed" ||
      b.status === "in_progress" ||
      b.status === "paid",
  );

  const completedJobs = allTechBookings.filter((b) => b.status === "completed");

  const totalEarnings = completedJobs.reduce(
    (acc, job) => acc + (job.totalPrice || 0),
    0,
  );

  return {
    technician: tech,
    stats: {
      pendingCount: pendingJobs.length,
      upcomingCount: upcomingJobs.length,
      completedCount: completedJobs.length,
      totalEarnings,
    },
    pendingJobs: pendingJobs.slice(0, 5),
    upcomingJobs: upcomingJobs.slice(0, 5),
  };
}

/**
 * Fetches paginated & filtered bookings for the technician.
 */
export async function getTechnicianBookings(params: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const tech = await getOrCreateTechnicianProfile();
  const { search = "", status = "all", page = 1, limit = 10 } = params;

  const conditions = [eq(bookings.technicianId, tech.id)];

  if (status && status !== "all") {
    conditions.push(eq(bookings.status, status as any));
  }

  if (search.trim()) {
    const pattern = `%${search.trim()}%`;
    conditions.push(
      or(ilike(user.name, pattern), ilike(services.name, pattern))!,
    );
  }

  const whereClause = and(...conditions);

  const [countResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(bookings)
    .leftJoin(user, eq(bookings.userId, user.id))
    .leftJoin(services, eq(bookings.serviceId, services.id))
    .where(whereClause);

  const total = countResult?.count ?? 0;
  const offset = (page - 1) * limit;

  const bookingsList = await db
    .select({
      id: bookings.id,
      status: bookings.status,
      totalPrice: bookings.totalPrice,
      scheduledAt: bookings.scheduledAt,
      createdAt: bookings.createdAt,
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      serviceId: services.id,
      serviceName: services.name,
      serviceDescription: services.description,
    })
    .from(bookings)
    .leftJoin(user, eq(bookings.userId, user.id))
    .leftJoin(services, eq(bookings.serviceId, services.id))
    .where(whereClause)
    .orderBy(desc(bookings.scheduledAt))
    .limit(limit)
    .offset(offset);

  return {
    bookings: bookingsList,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

/**
 * Fetches the services offered by the technician and all available platform services.
 */
export async function getTechnicianServicesData() {
  const tech = await getOrCreateTechnicianProfile();

  const myServices = await db
    .select({
      id: technicianServices.id,
      serviceId: technicianServices.serviceId,
      price: technicianServices.price,
      serviceName: services.name,
      serviceDescription: services.description,
      categoryName: categories.name,
    })
    .from(technicianServices)
    .innerJoin(services, eq(technicianServices.serviceId, services.id))
    .leftJoin(categories, eq(services.categoryId, categories.id))
    .where(eq(technicianServices.technicianId, tech.id))
    .orderBy(services.name);

  const allPlatformServices = await db
    .select({
      id: services.id,
      name: services.name,
      description: services.description,
      categoryName: categories.name,
      isActive: services.isActive,
    })
    .from(services)
    .leftJoin(categories, eq(services.categoryId, categories.id))
    .where(eq(services.isActive, true))
    .orderBy(services.name);

  return {
    technician: tech,
    myServices,
    allPlatformServices,
  };
}
