import { SkeletonCards, SkeletonHero } from "@/components/skeletons";
import { Suspense } from "react";
import BookingHistory from "../_components/bookingHsitory";
import PaymentHistory from "../_components/paymentHistory";
import { getCustomerDashboardData } from "@/app/data access layer/customer";
import { BookingComponent } from "../_components/booking-modal";

type Props = {};
async function UserData() {
  const data = await getCustomerDashboardData();
  return (
    <>
      <h1 className="text-5xl font-bold">
        Welcome,
        {data.customer.name}
      </h1>
      <p className="py-6">How may we help you today.</p>
    </>
  );
}

function CustomerDashboard({}: Props) {
  return (
    <div>
      <div className="hero bg-base-200 rounded-box p-6 mb-6">
        <div className="hero-content text-center py-2">
          <div className="max-w-xl">
            <Suspense fallback={<SkeletonHero />}>
              <UserData />
            </Suspense>
          </div>
        </div>
      </div>
      <BookingComponent />

      <div className="w-full mt-5">
        <h2 className="text-center text-2xl font-bold">
          Feature Not Added Yet
        </h2>
        {/* <Suspense fallback={SkeletonCards(4)}>
          <div className="flex justify-center items-center gap-4">
            <BookingHistory />
            <PaymentHistory />
          </div>
        </Suspense> */}
      </div>
    </div>
  );
}

export default CustomerDashboard;
