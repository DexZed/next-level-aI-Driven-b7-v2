import { db } from "@/drizzle";
import { categories } from "@/drizzle/schemas/category-schema";


export async function GET(
) {
    try {
        const categoriesData = await db.select().from(categories);
        return Response.json({ categoriesData }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}