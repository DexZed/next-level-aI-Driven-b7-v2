import { booking } from "@/drizzle/schemas/booking-schema";
import { db } from "@/drizzle";

export async function GET() {
  try {
    const bookings = await db.select().from(booking);

    return Response.json(bookings);
  } catch (error) {
    return Response.json(
      { message: "Failed to fetch all Bookings" },
      { status: 500 },
    );
  }
}
