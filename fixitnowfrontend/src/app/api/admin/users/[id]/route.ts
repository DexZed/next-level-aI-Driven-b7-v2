import { db } from "@/drizzle";
import { user } from "@/drizzle/schemas/auth-schema";
import { eq } from "drizzle-orm";

export async function GET({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const singleUser = db.select().from(user).where(eq(user.id, id));
    return Response.json(singleUser);
  } catch (error) {
    return Response.json({ message: "Failed to fetch User" }, { status: 500 });
  }
}
