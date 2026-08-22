import { db } from "@/drizzle";
import { user } from "@/drizzle/schemas/auth-schema";
import { bookings } from "@/drizzle/schemas/booking-schema";
import { categories } from "@/drizzle/schemas/category-schema";
import { services } from "@/drizzle/schemas/service-schema";
import { assertUnreachable } from "../../_lib/utils";
import { payments } from "@/drizzle/schemas/payments-schema";

type AdminSegment = "allUsers" | "bookings" | "revenue";

type Route = {
  req: Request;
  params: string[];
  body: Record<string, any>;
};

type RouteHandler = (route: Route) => Promise<Response>;

const routes: Record<AdminSegment, RouteHandler> = {
  allUsers: async () => {
    const users = await db.select().from(user);
    return Response.json(users);
  },
  bookings: async () => {
    const allBookings = await db.select().from(bookings);
    return Response.json(allBookings);
  },
  revenue: async () => {
    const allPayments = await db.select().from(payments);
    return Response.json(allPayments);
  },
};
export async function All(
  req: Request,
  { params }: { params: { action: string[] } },
) {
  const segments = params.action || [];
  const rawSegment = (segments[0] || "").toLowerCase();
  try {
    let body: Record<string, any> = {};
    if (["GET", "POST"].includes(req.method)) {
      body = await req.json().catch(() => ({}));
    }

    if (rawSegment in routes) {
      const segment = rawSegment as AdminSegment;
      switch (segment) {
        case "allUsers":
        case "bookings":
        case "revenue":
          return await routes[segment]({ req, params: segments, body });
        default:
          assertUnreachable(segment);
      }
    }
    return Response.json(
      {
        success: false,
        error: `Invalid Segment: '/api/admin/${rawSegment}' does not exist`,
      },
      { status: 404 },
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        error: error.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
export { All as GET, All as POST };
