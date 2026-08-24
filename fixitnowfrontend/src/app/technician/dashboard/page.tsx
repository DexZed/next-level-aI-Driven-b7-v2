import { SkeletonHero, SkeletonCards } from "@/components/skeletons";
import { Suspense } from "react";
import TechStats from "./_components/techStats";
import UpcomingJobsComponent from "./_components/upcoming";
import PendingJobsComponent from "./_components/pending";
import { getTechnicianDashboardData } from "@/app/data access layer/technician";

async function DashboardContent() {
  const data = await getTechnicianDashboardData();

  return (
    <>
      <div className="hero bg-base-200 rounded-box p-6 mb-6">
        <div className="hero-content text-center py-2">
          <div className="max-w-xl">
            <h1 className="text-3xl font-bold">
              Welcome back, {data.technician.user.name || "Technician"}!
            </h1>
            <p className="py-2 text-sm opacity-80">
              {data.technician.isAvailable ? (
                <span className="badge badge-success badge-sm gap-1">● Online & Available for Bookings</span>
              ) : (
                <span className="badge badge-ghost badge-sm gap-1">○ Offline / Blocked</span>
              )}
              {" "}• {data.technician.city}
            </p>
          </div>
        </div>
      </div>

      <TechStats stats={data.stats} />

      <div className="flex flex-col lg:flex-row gap-6">
        <PendingJobsComponent jobs={data.pendingJobs} />
        <UpcomingJobsComponent jobs={data.upcomingJobs} />
      </div>
    </>
  );
}

export default function TechnicianDashboard() {
  return (
    <div className="space-y-6">
      <Suspense fallback={SkeletonCards(4)}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
