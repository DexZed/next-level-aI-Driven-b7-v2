"use server";

import { db } from "@/drizzle";
import { getSession } from "./session";
import { bookings } from "@/drizzle/schemas/booking-schema";
import { services } from "@/drizzle/schemas/service-schema";
import { categories } from "@/drizzle/schemas/category-schema";
import { technicians } from "@/drizzle/schemas/technician-schema";
import { technicianServices } from "@/drizzle/schemas/techService-schema";
import { user } from "@/drizzle/schemas/auth-schema";
import { payments } from "@/drizzle/schemas/payments-schema";
import { reviews } from "@/drizzle/schemas/review-schema";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

export async function getCustomerDashboardData() {
  const customer = await getSession("customer");

  const customerBookings = await db
    .select({
      id: bookings.id,
      status: bookings.status,
      totalPrice: bookings.totalPrice,
      scheduledAt: bookings.scheduledAt,
      createdAt: bookings.createdAt,
      serviceId: services.id,
      serviceName: services.name,
      technicianId: technicians.id,
      technicianName: user.name,
      technicianEmail: user.email,
      technicianCity: technicians.city,
    })
    .from(bookings)
    .innerJoin(technicians, eq(bookings.technicianId, technicians.id))
    .innerJoin(user, eq(technicians.userId, user.id))
    .innerJoin(services, eq(bookings.serviceId, services.id))
    .where(eq(bookings.userId, customer.id))
    .orderBy(desc(bookings.createdAt));

  const customerPayments = await db
    .select({
      id: payments.id,
      bookingId: payments.bookingId,
      amount: payments.amount,
      provider: payments.provider,
      method: payments.method,
      status: payments.status,
      paidAt: payments.paidAt,
      serviceName: services.name,
    })
    .from(payments)
    .innerJoin(bookings, eq(payments.bookingId, bookings.id))
    .innerJoin(services, eq(bookings.serviceId, services.id))
    .where(eq(bookings.userId, customer.id))
    .orderBy(desc(payments.paidAt));

  const customerReviews = await db
    .select({
      id: reviews.id,
      bookingId: reviews.bookingId,
      rating: reviews.rating,
      comment: reviews.comment,
    })
    .from(reviews)
    .where(eq(reviews.userId, customer.id));

  const reviewedBookingIds = new Set(customerReviews.map((r) => r.bookingId));

  return {
    customer,
    bookings: customerBookings,
    payments: customerPayments,
    reviewedBookingIds: Array.from(reviewedBookingIds),
  };
}

export async function getPublicServicesWithCategories(params: {
  search?: string;
  categoryId?: string;
}) {
  const { search = "", categoryId = "all" } = params;

  const allCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(categories.name);

  const conditions = [eq(services.isActive, true)];

  if (categoryId && categoryId !== "all") {
    conditions.push(eq(services.categoryId, categoryId));
  }

  if (search.trim()) {
    const pattern = `%${search.trim()}%`;
    conditions.push(
      or(ilike(services.name, pattern), ilike(services.description, pattern))!,
    );
  }

  const servicesList = await db
    .select({
      id: services.id,
      name: services.name,
      description: services.description,
      categoryId: services.categoryId,
      categoryName: categories.name,
    })
    .from(services)
    .leftJoin(categories, eq(services.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(services.name);

  const techOfferings = await db
    .select({
      serviceId: technicianServices.serviceId,
      technicianId: technicians.id,
      technicianName: user.name,
      technicianCity: technicians.city,
      ratingAvg: technicians.ratingAvg,
      isAvailable: technicians.isAvailable,
      price: technicianServices.price,
    })
    .from(technicianServices)
    .innerJoin(technicians, eq(technicianServices.technicianId, technicians.id))
    .innerJoin(user, eq(technicians.userId, user.id))
    .where(eq(technicians.isAvailable, true));

  return {
    categories: allCategories,
    services: servicesList,
    techOfferings,
  };
}

export async function getTechnicianPublicDetails(technicianId: string) {
  const [tech] = await db
    .select({
      id: technicians.id,
      userId: technicians.userId,
      bio: technicians.bio,
      city: technicians.city,
      ratingAvg: technicians.ratingAvg,
      isAvailable: technicians.isAvailable,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: technicians.id,
    })
    .from(technicians)
    .innerJoin(user, eq(technicians.userId, user.id))
    .where(
      or(
        eq(technicians.id, technicianId as any),
        eq(technicians.userId, technicianId),
      ),
    );

  if (!tech) return null;

  const offeredServices = await db
    .select({
      id: technicianServices.id,
      serviceId: services.id,
      name: services.name,
      description: services.description,
      categoryName: categories.name,
      price: technicianServices.price,
    })
    .from(technicianServices)
    .innerJoin(services, eq(technicianServices.serviceId, services.id))
    .leftJoin(categories, eq(services.categoryId, categories.id))
    .where(eq(technicianServices.technicianId, tech.id));

  const techReviews = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      customerName: user.name,
    })
    .from(reviews)
    .innerJoin(user, eq(reviews.userId, user.id))
    .where(eq(reviews.technicianId, tech.id))
    .orderBy(desc(reviews.createdAt));

  return {
    technician: tech,
    services: offeredServices,
    reviews: techReviews,
  };
}

export async function getBookingForPayment(bookingId: string) {
  const customer = await getSession("customer");

  const [booking] = await db
    .select({
      id: bookings.id,
      userId: bookings.userId,
      status: bookings.status,
      totalPrice: bookings.totalPrice,
      scheduledAt: bookings.scheduledAt,
      serviceName: services.name,
      technicianName: user.name,
    })
    .from(bookings)
    .innerJoin(services, eq(bookings.serviceId, services.id))
    .innerJoin(technicians, eq(bookings.technicianId, technicians.id))
    .innerJoin(user, eq(technicians.userId, user.id))
    .where(
      and(eq(bookings.id, bookingId as any), eq(bookings.userId, customer.id)),
    );

  return booking || null;
}
