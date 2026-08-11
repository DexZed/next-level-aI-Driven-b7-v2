import { db } from "@/drizzle";
import { services } from "@/drizzle/schemas/service-schema";


export async function GET(
) {
    try {
        const servicesData = await db.select().from(services);
        return Response.json({ servicesData }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ error: "Failed to fetch services" }, { status: 500 });
    }
}