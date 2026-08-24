"use server";

import { db } from "@/drizzle";
import { user } from "@/drizzle/schemas/auth-schema";
import { categories } from "@/drizzle/schemas/category-schema";
import { services } from "@/drizzle/schemas/service-schema";
import { bookings } from "@/drizzle/schemas/booking-schema";
import { payments } from "@/drizzle/schemas/payments-schema";
import { getSession } from "./session";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

export async function getAllUsers() {
  await getSession("admin");
  return db.select().from(user).orderBy(desc(user.createdAt));
}

export async function getUsersWithFilters(params: {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}) {
  await getSession("admin");
  const { search = "", role = "all", page = 1, limit = 10 } = params;

  const conditions = [];

  if (search.trim()) {
    const pattern = `%${search.trim()}%`;
    conditions.push(
      or(ilike(user.name, pattern), ilike(user.email, pattern))
    );
  }

  if (role && role !== "all") {
    conditions.push(eq(user.role, role as "admin" | "customer" | "technician"));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [countResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(user)
    .where(whereClause);

  const total = countResult?.count ?? 0;
  const offset = (page - 1) * limit;

  const usersList = await db
    .select()
    .from(user)
    .where(whereClause)
    .orderBy(desc(user.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    users: usersList,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function getAllBookings() {
  await getSession("admin");
  return db.select().from(bookings).orderBy(desc(bookings.createdAt));
}

export async function getAllRevenue() {
  await getSession("admin");
  return db.select().from(payments);
}

export async function getAllCategories() {
  await getSession("admin");
  return db.select().from(categories).orderBy(categories.name);
}

export async function getAllServices() {
  await getSession("admin");
  const serviceList = await db
    .select({
      id: services.id,
      name: services.name,
      description: services.description,
      categoryId: services.categoryId,
      isActive: services.isActive,
      categoryName: categories.name,
    })
    .from(services)
    .leftJoin(categories, eq(services.categoryId, categories.id))
    .orderBy(services.name);

  return serviceList;
}
