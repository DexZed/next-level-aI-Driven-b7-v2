import { bookings } from "@/drizzle/schemas/booking-schema";
import { db } from "@/drizzle";

export async function GET() {
  try {
    const bookingsData = await db.select().from(bookings);

    return Response.json(bookingsData);
  } catch (error) {
    return Response.json(
      { message: "Failed to fetch all Bookings" },
      { status: 500 },
    );
  }
}
