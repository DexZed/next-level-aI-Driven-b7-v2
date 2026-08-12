import { db } from "@/drizzle";
import { user } from "@/drizzle/schemas/auth-schema";

export async function GET() {
  try {
    const users = await db.select().from(user);

    return Response.json(users);
  } catch (error) {
    return Response.json(
      { message: "Failed to fetch all Users" },
      { status: 500 },
    );
  }
}
