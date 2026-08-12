import { db } from "@/drizzle";
import { payments } from "@/drizzle/schemas/payments-schema";

export async function GET() {
  try {
    const paymentsData = await db.select().from(payments);

    return Response.json(paymentsData);
  } catch (error) {
    return Response.json(
      { message: "Failed to fetch all Payments" },
      { status: 500 },
    );
  }
}
