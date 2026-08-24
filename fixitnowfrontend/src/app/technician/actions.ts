"use server";

import { db } from "@/drizzle";
import { technicians } from "@/drizzle/schemas/technician-schema";
import { technicianServices } from "@/drizzle/schemas/techService-schema";
import { bookings } from "@/drizzle/schemas/booking-schema";
import { getOrCreateTechnicianProfile } from "@/app/data access layer/technician";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
  bio: z.string().min(5, "Bio must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  isAvailable: z.boolean(),
});

const serviceRateSchema = z.object({
  serviceId: z.string().uuid("Invalid service ID"),
  price: z.number().min(0, "Price must be a positive number"),
});

export async function updateTechnicianProfileAction(data: {
  bio: string;
  city: string;
  isAvailable: boolean;
}) {
  const tech = await getOrCreateTechnicianProfile();
  const parsed = profileSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid profile data",
    };
  }

  try {
    await db
      .update(technicians)
      .set({
        bio: parsed.data.bio,
        city: parsed.data.city,
        isAvailable: parsed.data.isAvailable,
      })
      .where(eq(technicians.id, tech.id));

    revalidatePath("/technician/profile");
    revalidatePath("/technician/dashboard");
    return { success: true, message: "Profile updated successfully" };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update profile",
    };
  }
}

export async function addTechnicianServiceAction(
  serviceId: string,
  price: number,
) {
  const tech = await getOrCreateTechnicianProfile();
  const parsed = serviceRateSchema.safeParse({ serviceId, price });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid service or price",
    };
  }

  try {
    const [existing] = await db
      .select()
      .from(technicianServices)
      .where(
        and(
          eq(technicianServices.technicianId, tech.id),
          eq(technicianServices.serviceId, serviceId),
        ),
      );

    if (existing) {
      return {
        success: false,
        error: "You already offer this service. You can update its price.",
      };
    }

    await db.insert(technicianServices).values({
      technicianId: tech.id,
      serviceId: parsed.data.serviceId,
      price: parsed.data.price,
    });

    revalidatePath("/technician/profile");
    return { success: true, message: "Service added to your catalog" };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to add service",
    };
  }
}

export async function updateTechnicianServicePriceAction(
  id: string,
  price: number,
) {
  const tech = await getOrCreateTechnicianProfile();
  if (price < 0) {
    return { success: false, error: "Price must be a positive number" };
  }

  try {
    await db
      .update(technicianServices)
      .set({ price })
      .where(
        and(
          eq(technicianServices.id, id),
          eq(technicianServices.technicianId, tech.id),
        ),
      );

    revalidatePath("/technician/profile");
    return { success: true, message: "Service price updated successfully" };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update price",
    };
  }
}

export async function removeTechnicianServiceAction(id: string) {
  const tech = await getOrCreateTechnicianProfile();
  try {
    await db
      .delete(technicianServices)
      .where(
        and(
          eq(technicianServices.id, id),
          eq(technicianServices.technicianId, tech.id),
        ),
      );

    revalidatePath("/technician/profile");
    return { success: true, message: "Service removed from your profile" };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to remove service",
    };
  }
}

export async function updateBookingStatusAction(
  bookingId: string,
  newStatus:
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "in_progress"
    | "declined"
    | "paid",
) {
  const tech = await getOrCreateTechnicianProfile();

  try {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(
        and(eq(bookings.id, bookingId), eq(bookings.technicianId, tech.id)),
      );

    if (!booking) {
      return { success: false, error: "Booking not found or unauthorized" };
    }

    await db
      .update(bookings)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId));

    revalidatePath("/technician/dashboard");
    revalidatePath("/technician/booking");
    return { success: true, message: `Booking status updated to ${newStatus}` };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update booking status",
    };
  }
}
