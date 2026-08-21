import { SkeletonHero, SkeletonCards } from "@/components/skeletons";
import { Suspense } from "react";
import BookingHistory from "../_components/bookingHsitory";
import PaymentHistory from "../_components/paymentHistory";

type Props = {};
async function UserData() {
  // const data = await getUserSession();
  return (
    <>
      <h1 className="text-5xl font-bold">
        Welcome,
        {/* {data?.user?.name} */}
      </h1>
      <p className="py-6">How may we help you today.</p>
    </>
  );
}

function CustomerDashboard({}: Props) {
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

      <div className="flex justify-center items-center gap-5">
        {"Unused Section"}
      </div>
      <div className="hero w-full mt-5">
        <Suspense fallback={SkeletonCards(4)}>
          <div className="flex flex-wrap  justify-center items-center gap-4">
            <BookingHistory />
            <PaymentHistory />
          </div>
        </Suspense>
      </div>
    </div>
  );
}

export default CustomerDashboard;
