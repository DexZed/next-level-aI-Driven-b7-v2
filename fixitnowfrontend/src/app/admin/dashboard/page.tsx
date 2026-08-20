import getUserSession from "@/lib/dal";
import { Suspense } from "react";
import UsersCard from "./_components/users-card";
import BookingsCard from "./_components/bookings-card";
import PaymentsCard from "./_components/payments-card";
import { SkeletonHero, SkeletonCards } from "@/components/skeletons";

async function UserData() {
  const data = await getUserSession();
  return (
    <>
      <h1 className="text-5xl font-bold">Welcome</h1>
      <p className="py-6">
        <span className="font-bold text-lg">{data?.user?.name}</span> You are
        logged in as {data?.user?.role}
      </p>
    </>
  );
}

async function AdminPage() {
  return (
    <>
      <div className="">
        <div className="hero bg-base-200 h-50">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <Suspense fallback={SkeletonHero()}>
                <UserData />
              </Suspense>
            </div>
          </div>
        </div>
        <div className="hero w-full mt-5">
          <Suspense fallback={SkeletonCards(4)}>
            <div className="flex flex-wrap  justify-center items-center gap-4">
              <UsersCard />
              <BookingsCard />
              <PaymentsCard />
            </div>
          </Suspense>
        </div>
      </div>
    </>
  );
}

export default AdminPage;
