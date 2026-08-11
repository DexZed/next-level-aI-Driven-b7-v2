import { db } from "@/drizzle";
import { payments } from "@/drizzle/schemas/payments-schema";



export async function GET(
) {
    try {
        const paymentsData = await db.select().from(payments);
        return Response.json({ paymentsData }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ error: "Failed to fetch payments" }, { status: 500 });
    }
}