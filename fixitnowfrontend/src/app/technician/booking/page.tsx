import { Suspense } from "react";
import { getTechnicianBookings } from "@/app/data access layer/technician";
import TnBookingTable from "./_components/TnBookingTable";
import { SkeletonCards } from "@/components/skeletons";

type Props = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
    limit?: string;
  }>;
};

async function BookingContent({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  const status = resolvedParams.status || "all";
  const page = parseInt(resolvedParams.page || "1", 10);
  const limit = parseInt(resolvedParams.limit || "10", 10);

  const data = await getTechnicianBookings({
    search,
    status,
    page: isNaN(page) ? 1 : page,
    limit: isNaN(limit) ? 10 : limit,
  });

  return (
    <TnBookingTable
      initialData={data}
      currentSearch={search}
      currentStatus={status}
    />
  );
}

export default function TechnicianBookingPage({ searchParams }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Booking Management</h1>
        <p className="text-sm opacity-70 mt-1">
          Review job requests, accept or decline bookings, track active assignments, and update job progress.
        </p>
      </div>

      <Suspense fallback={SkeletonCards(3)}>
        <BookingContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
