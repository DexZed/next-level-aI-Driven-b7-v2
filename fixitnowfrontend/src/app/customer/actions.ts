"use server";

import { db } from "@/drizzle";
import { getSession } from "@/app/data access layer/session";
import { bookings } from "@/drizzle/schemas/booking-schema";
import { technicianServices } from "@/drizzle/schemas/techService-schema";
import { technicians } from "@/drizzle/schemas/technician-schema";
import { services } from "@/drizzle/schemas/service-schema";
import { reviews } from "@/drizzle/schemas/review-schema";
import { payments } from "@/drizzle/schemas/payments-schema";
import { stripe } from "@/lib/stripe";
import { and, eq, sql, gte, lte, avg, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

const bookingSchema = z.object({
  technicianId: z.string().uuid("Invalid technician ID"),
  serviceId: z.string().uuid("Invalid service ID"),
  scheduledAt: z.string().min(1, "Please pick a scheduled date and time"),
});

const reviewSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID"),
  technicianId: z.string().uuid("Invalid technician ID"),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5 stars"),
  comment: z.string().optional(),
});

/**
 * Creates a new booking request with double-booking prevention.
 */
export async function createBookingAction(data: {
  technicianId: string;
  serviceId: string;
  scheduledAt: string;
}) {
  const customer = await getSession("customer");
  const parsed = bookingSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid booking data",
    };
  }

  const scheduledDate = new Date(parsed.data.scheduledAt);
  if (isNaN(scheduledDate.getTime()) || scheduledDate < new Date()) {
    return {
      success: false,
      error: "Please select a valid future date and time",
    };
  }

  try {
    const [offering] = await db
      .select({
        price: technicianServices.price,
        isAvailable: technicians.isAvailable,
      })
      .from(technicianServices)
      .innerJoin(
        technicians,
        eq(technicianServices.technicianId, technicians.id),
      )
      .where(
        and(
          eq(technicianServices.technicianId, parsed.data.technicianId as any),
          eq(technicianServices.serviceId, parsed.data.serviceId as any),
        ),
      );

    if (!offering) {
      return {
        success: false,
        error: "This service is not available from the selected technician.",
      };
    }

    if (!offering.isAvailable) {
      return {
        success: false,
        error:
          "This technician is currently offline and not accepting bookings.",
      };
    }

    const bufferMs = 45 * 60 * 1000;
    const windowStart = new Date(scheduledDate.getTime() - bufferMs);
    const windowEnd = new Date(scheduledDate.getTime() + bufferMs);

    const conflictingBookings = await db
      .select({ id: bookings.id })
      .from(bookings)
      .where(
        and(
          eq(bookings.technicianId, parsed.data.technicianId as any),
          gte(bookings.scheduledAt, windowStart),
          lte(bookings.scheduledAt, windowEnd),
          sql`${bookings.status} NOT IN ('cancelled', 'declined')`,
        ),
      );

    if (conflictingBookings.length > 0) {
      return {
        success: false,
        error:
          "This technician already has an active booking around this time. Please pick another slot.",
      };
    }

    const [newBooking] = await db
      .insert(bookings)
      .values({
        userId: customer.id,
        technicianId: parsed.data.technicianId as any,
        serviceId: parsed.data.serviceId as any,
        scheduledAt: scheduledDate,
        totalPrice: offering.price,
        status: "pending",
      })
      .returning();

    revalidatePath("/customer/dashboard");
    revalidatePath("/technician/dashboard");
    revalidatePath("/technician/booking");

    return {
      success: true,
      message:
        "Booking request submitted successfully! Waiting for technician acceptance.",
      bookingId: newBooking.id,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to submit booking",
    };
  }
}

export async function cancelBookingAction(bookingId: string) {
  const customer = await getSession("customer");

  try {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.id, bookingId as any),
          eq(bookings.userId, customer.id),
        ),
      );

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    if (booking.status === "in_progress" || booking.status === "completed") {
      return {
        success: false,
        error:
          "Cannot cancel a booking that is already in progress or completed.",
      };
    }

    if (booking.status === "cancelled") {
      return { success: false, error: "This booking is already cancelled." };
    }

    await db
      .update(bookings)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(bookings.id, bookingId as any));

    revalidatePath("/customer/dashboard");
    revalidatePath("/technician/dashboard");
    revalidatePath("/technician/booking");

    return { success: true, message: "Booking has been cancelled." };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to cancel booking",
    };
  }
}

export async function createStripeCheckoutAction(bookingId: string) {
  const customer = await getSession("customer");
  const headerList = await headers();
  const host = headerList.get("host") || "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") || "http";
  const origin = `${protocol}://${host}`;

  try {
    const [booking] = await db
      .select({
        id: bookings.id,
        userId: bookings.userId,
        status: bookings.status,
        totalPrice: bookings.totalPrice,
        serviceName: services.name,
      })
      .from(bookings)
      .innerJoin(services, eq(bookings.serviceId, services.id))
      .where(
        and(
          eq(bookings.id, bookingId as any),
          eq(bookings.userId, customer.id),
        ),
      );

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    if (booking.status !== "confirmed") {
      return {
        success: false,
        error: `Cannot pay for booking with status "${booking.status}". Payment is allowed only after technician acceptance.`,
      };
    }

    const amountInCents = Math.round(booking.totalPrice * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `FixItNow: ${booking.serviceName}`,
              description: `Booking reference: ${booking.id.slice(0, 8)}`,
            },
            unit_amount: amountInCents > 0 ? amountInCents : 1000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: customer.email,
      client_reference_id: booking.id,
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`,
      cancel_url: `${origin}/payment/cancel?booking_id=${booking.id}`,
      metadata: {
        bookingId: booking.id,
        customerId: customer.id,
      },
    });

    return { success: true, url: session.url };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to initiate Stripe Checkout",
    };
  }
}

export async function confirmStripePaymentAction(
  sessionId: string,
  bookingId: string,
) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const [existingPayment] = await db
        .select()
        .from(payments)
        .where(eq(payments.bookingId, bookingId as any));

      if (!existingPayment) {
        await db.insert(payments).values({
          bookingId: bookingId as any,
          amount: (session.amount_total || 0) / 100,
          method: "card",
          provider: "STRIPE",
          status: "confirmed",
          paidAt: new Date(),
        });
      }

      await db
        .update(bookings)
        .set({ status: "paid", updatedAt: new Date() })
        .where(eq(bookings.id, bookingId as any));

      revalidatePath("/customer/dashboard");
      revalidatePath("/technician/dashboard");
      revalidatePath("/technician/booking");

      return { success: true, message: "Payment confirmed successfully" };
    }

    return { success: false, error: "Payment was not completed." };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to verify Stripe payment",
    };
  }
}

export async function submitReviewAction(data: {
  bookingId: string;
  technicianId: string;
  rating: number;
  comment?: string;
}) {
  const customer = await getSession("customer");
  const parsed = reviewSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid review data",
    };
  }

  try {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.id, parsed.data.bookingId as any),
          eq(bookings.userId, customer.id),
        ),
      );

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    if (booking.status !== "completed") {
      return {
        success: false,
        error: "You can only leave a review for completed bookings.",
      };
    }

    const [existing] = await db
      .select()
      .from(reviews)
      .where(eq(reviews.bookingId, parsed.data.bookingId as any));

    if (existing) {
      return {
        success: false,
        error: "You have already reviewed this booking.",
      };
    }

    await db.insert(reviews).values({
      userId: customer.id,
      technicianId: parsed.data.technicianId as any,
      bookingId: parsed.data.bookingId as any,
      rating: parsed.data.rating,
      comment: parsed.data.comment || "",
    });
    const [avgResult] = await db
      .select({ avgRating: avg(reviews.rating) })
      .from(reviews)
      .where(eq(reviews.technicianId, parsed.data.technicianId as any));

    const newAvg = parseFloat(avgResult?.avgRating || "5.0");

    await db
      .update(technicians)
      .set({ ratingAvg: newAvg })
      .where(eq(technicians.id, parsed.data.technicianId as any));

    revalidatePath("/customer/dashboard");
    revalidatePath(`/public/profile/${parsed.data.technicianId}`);

    return { success: true, message: "Thank you for your review!" };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to submit review",
    };
  }
}
export async function getCustomerBookingHistory() {
  const customer = await getSession("customer");
  const bookingData = await db
    .select()
    .from(bookings)
    .where(eq(bookings.userId, customer.id))
    .orderBy(desc(bookings.createdAt));
  return bookingData;
}
export async function getCustomerPaymentHistory() {
  const customer = await getSession("customer");
  const paymentData = await db
    .select()
    .from(payments)
    .innerJoin(bookings, eq(payments.bookingId, bookings.id))
    .where(eq(bookings.userId, customer.id))
    .orderBy(desc(payments.paidAt));
  return paymentData;
}

export async function getAvailableTechnicians() {
  const technicianData = await db.select().from(technicianServices);

  return technicianData;
}
export async function getAvalilableServices() {
  const servicesData = await db.select().from(services);
  return servicesData;
}
