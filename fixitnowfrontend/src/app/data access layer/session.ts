"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function getSession(role: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session?.user?.role !== role) {
    auth.api.signOut();
    redirect(`/auth/login`);
  }
  return session?.user;
}
