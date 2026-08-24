import { Suspense } from "react";
import { getTechnicianServicesData } from "@/app/data access layer/technician";
import ProfileManager from "./_components/profile-manager";
import { SkeletonCards } from "@/components/skeletons";

async function ProfileContent() {
  const data = await getTechnicianServicesData();

  return (
    <ProfileManager
      technician={data.technician}
      myServices={data.myServices}
      allPlatformServices={data.allPlatformServices}
    />
  );
}

export default function TechnicianProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile & Services</h1>
        <p className="text-sm opacity-70 mt-1">
          Manage your public profile, set your availability, and configure custom pricing for services you offer.
        </p>
      </div>

      <Suspense fallback={SkeletonCards(3)}>
        <ProfileContent />
      </Suspense>
    </div>
  );
}
