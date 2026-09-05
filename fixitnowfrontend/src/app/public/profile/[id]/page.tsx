import { Suspense } from "react";
import { getTechnicianPublicDetails } from "@/app/data access layer/customer";
import TechnicianProfileView from "../_components/profileView";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SkeletonHero } from "@/components/skeletons";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function ProfileContent({ params }: Props) {
  const { id } = await params;
  const data = await getTechnicianPublicDetails(id);

  if (!data) {
    return (
      <div className="card bg-base-100 border border-base-200 p-8 shadow-sm max-w-md mx-auto text-center my-12">
        <div className="text-4xl mb-3">👨‍🔧</div>
        <h2 className="text-xl font-bold mb-2">Technician Not Found</h2>
        <p className="text-xs opacity-70 mb-6">
          The requested technician profile could not be found or has been removed.
        </p>
        <Link href="/public/services" className="btn btn-primary btn-sm gap-2 mx-auto">
          <ArrowLeft size={14} /> Back to Services Catalog
        </Link>
      </div>
    );
  }

  return (
    <TechnicianProfileView
      technician={data.technician}
      services={data.services}
      reviews={data.reviews}
    />
  );
}

export default function ProfilePage({ params }: Props) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Link
          href="/public/services"
          className="btn btn-ghost btn-sm gap-2 text-xs opacity-80 hover:opacity-100"
        >
          <ArrowLeft size={14} /> Back to Services Catalog
        </Link>
      </div>

      <Suspense fallback={<SkeletonHero />}>
        <ProfileContent params={params} />
      </Suspense>
    </div>
  );
}
