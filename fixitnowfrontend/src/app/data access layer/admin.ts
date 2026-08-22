"use server";

import { env } from "@/lib/config";
import { getSession } from "./session";
import { cacheLife, cacheTag } from "next/cache";

export async function getAllUsers() {
  await getSession("admin");
  return getAllUsersCached();
}

async function getAllUsersCached() {
  "use cache";
  cacheLife("minutes");
  cacheTag("admin-all-users");

  const result = await fetch(`${env.BASE_URL}/api/admin/allusers`);

  const data = await result.json();
  return data;
}
export async function getAllBookings() {
  await getSession("admin");
  return getAllBookingsCached();
}

async function getAllBookingsCached() {
  "use cache";
  cacheLife("minutes");
  cacheTag("admin-all-Bookings");

  const result = await fetch(`${env.BASE_URL}/api/admin/bookings`);

  const data = await result.json();
  return data;
}
export async function getAllRevenue() {
  await getSession("admin");
  return getAllRevenueCached();
}

async function getAllRevenueCached() {
  "use cache";
  cacheLife("minutes");
  cacheTag("admin-all-revenue");

  const result = await fetch(`${env.BASE_URL}/api/admin/revenue`);

  const data = await result.json();
  return data;
}
