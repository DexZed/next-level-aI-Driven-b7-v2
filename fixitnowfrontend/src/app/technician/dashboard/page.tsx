import { SkeletonHero, SkeletonCards } from "@/components/skeletons";
import getUserSession from "@/lib/dal";
import { Suspense } from "react";
import TechStats from "./_components/techStats";
import UpcomingJobsComponent from "./_components/upcoming";
import PendingJobsComponent from "./_components/pending";

async function UserData() {
  const data = await getUserSession();
  return (
    <>
      <h1 className="text-5xl font-bold">Welcome, {data?.user?.name}</h1>
      <p className="py-6">Here's what's happening with your work today.</p>
    </>
  );
}

function TechnicianDashboard() {
  return (
    <div>
      <div className="hero bg-base-200 h-50">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <Suspense fallback={SkeletonHero()}>
              <UserData />
            </Suspense>
          </div>
        </div>
      </div>
      <TechStats />
      <div className="flex justify-center items-center gap-5">
        <UpcomingJobsComponent />
        <PendingJobsComponent />
      </div>
      <div className="hero w-full mt-5">
        <Suspense fallback={SkeletonCards(4)}>
          <div className="flex flex-wrap  justify-center items-center gap-4"></div>
        </Suspense>
      </div>
    </div>
  );
}

export default TechnicianDashboard;
