import { Suspense } from "react";
import { getUsersWithFilters } from "@/app/data access layer/admin";
import UsersTable from "./_components/users-table";
import { SkeletonCards } from "@/components/skeletons";

type Props = {
  searchParams: Promise<{
    search?: string;
    role?: string;
    page?: string;
    limit?: string;
  }>;
};

async function UsersContent({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  const role = resolvedParams.role || "all";
  const page = parseInt(resolvedParams.page || "1", 10);
  const limit = parseInt(resolvedParams.limit || "10", 10);

  const data = await getUsersWithFilters({
    search,
    role,
    page: isNaN(page) ? 1 : page,
    limit: isNaN(limit) ? 10 : limit,
  });

  return (
    <UsersTable
      initialData={data}
      currentSearch={search}
      currentRole={role}
    />
  );
}

export default function UsersPage({ searchParams }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-sm opacity-70 mt-1">
            View, search, filter, and manage permissions and access status for all platform users.
          </p>
        </div>
      </div>

      <Suspense fallback={SkeletonCards(3)}>
        <UsersContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
