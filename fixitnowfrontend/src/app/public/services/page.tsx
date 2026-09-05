import { getPublicServicesWithCategories } from "@/app/data access layer/customer";
import ServicesCatalog from "./_components/servicesCatalog";
import { Suspense } from "react";
import { SkeletonCards } from "@/components/skeletons";

type Props = {
  searchParams: Promise<{
    search?: string;
    categoryId?: string;
  }>;
};

async function ServicesContent({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const data = await getPublicServicesWithCategories({
    search: resolvedParams.search,
    categoryId: resolvedParams.categoryId,
  });

  return (
    <ServicesCatalog
      categories={data.categories}
      services={data.services}
      techOfferings={data.techOfferings}
    />
  );
}

export default async function ServicePage({ searchParams }: Props) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Banner */}
      <div className="hero bg-base-200 rounded-box p-8 mb-8 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="badge badge-primary badge-outline mb-3">FixItNow Marketplace</span>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
            Find Trusted Services & Technicians
          </h1>
          <p className="mt-3 text-base opacity-80">
            Browse verified local professionals, compare transparent pricing, and book your service appointments with confidence.
          </p>
        </div>
      </div>

      {/* Main Catalog View */}
      <Suspense fallback={SkeletonCards(6)}>
        <ServicesContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
