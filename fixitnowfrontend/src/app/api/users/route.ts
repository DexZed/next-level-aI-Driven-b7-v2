import { db } from "@/drizzle";
import { user } from "@/drizzle/schemas/auth-schema";

export async function GET(
) {
    try {
        const users = await db.select().from(user);
        return Response.json({ users }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}