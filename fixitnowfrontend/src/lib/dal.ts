"use server";
import { headers } from "next/headers";
import { auth } from "./auth";
import { cacheLife, cacheTag } from "next/cache";
import { env } from "./config";

export default async function getUserSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function getUsers() {
  const result = await fetch(`${env.BASE_URL}/api/admin/users`);
  const data = await result.json();
  return data;
}

export async function getBookings() {
  const result = await fetch(`${env.BASE_URL}/api/admin/bookings`);
  const data = await result.json();
  return data;
}

export async function getPayments() {
  const result = await fetch(`${env.BASE_URL}/api/admin/payments`);
  const data = await result.json();
  return data;
}
