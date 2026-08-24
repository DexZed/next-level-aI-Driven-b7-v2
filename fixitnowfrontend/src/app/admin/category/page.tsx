import { Suspense } from "react";
import { getAllCategories, getAllServices } from "@/app/data access layer/admin";
import CategoryManager from "./_component/category-manager";
import { SkeletonCards } from "@/components/skeletons";

async function CategoryData() {
  const [categories, services] = await Promise.all([
    getAllCategories(),
    getAllServices(),
  ]);

  return <CategoryManager categories={categories} services={services} />;
}

export default function CategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Service Catalog & Categories</h1>
        <p className="text-sm opacity-70 mt-1">
          Manage platform service categories, configure service offerings, and toggle availability in the customer catalog.
        </p>
      </div>

      <Suspense fallback={SkeletonCards(3)}>
        <CategoryData />
      </Suspense>
    </div>
  );
}
