import { Suspense } from "react";
import { getAllPublicTechnicians } from "@/app/data access layer/customer";
import TechniciansList from "./_components/techniciansList";
import { SkeletonCards } from "@/components/skeletons";

async function TechniciansContent() {
  const technicians = await getAllPublicTechnicians();
  return <TechniciansList technicians={technicians} />;
}

export default function TechniciansPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Banner */}
      <div className="hero bg-base-200 rounded-box p-8 mb-8 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="badge badge-primary badge-outline mb-3">
            FixItNow Verified Professionals
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
            Find & Connect with Expert Technicians
          </h1>
          <p className="mt-3 text-base opacity-80">
            Browse our network of background-checked, skilled service providers. Filter by city, check real ratings, and view their individual profiles.
          </p>
        </div>
      </div>

      {/* Directory Grid */}
      <Suspense fallback={SkeletonCards(6)}>
        <TechniciansContent />
      </Suspense>
    </div>
  );
}
