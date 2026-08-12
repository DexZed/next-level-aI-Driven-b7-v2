import getUserSession from "@/lib/dal";
import { Suspense } from "react";
import UsersCard from "./dashboard/_components/users-card";
import BookingsCard from "./dashboard/_components/bookings-card";
import PaymentsCard from "./dashboard/_components/payments-card";

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

function SkeletonCards(number: number) {
  return (
    <div className="flex justify-center items-center gap-4 w-full m-2">
      {[...new Array(number)].map((_, i) => {
        return (
          <div key={i} className="flex w-52 flex-col gap-4">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
        );
      })}
    </div>
  );
}

function SkeletonHero() {
  return (
    <div className="flex justify-center items-center gap-4 w-full m-2">
      <div className="flex w-96 flex-col gap-4 justify-center items-center">
        <div className="skeleton h-10 w-250"></div>
        <div className="skeleton h-4 w-200"></div>
        <div className="skeleton h-4 w-150"></div>
        <div className="skeleton h-4 w-100"></div>
      </div>
    </div>
  );
}
