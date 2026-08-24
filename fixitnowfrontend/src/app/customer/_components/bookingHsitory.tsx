import React, { Suspense } from "react";
import { getCustomerBookingHistory } from "../actions";
import { SkeletonAccordian } from "@/components/skeletons";

type Props = {};

async function BookingHistory({}: Props) {
  // const bookingHistory = await getCustomerBookingHistory();
  const mockData = [
    {
      id: "1",
      serviceId: "1",
      scheduledAt: "",
      totalPrice: 100,
      status: "pending",
    },
    {
      id: "2",
      serviceId: "2",
      scheduledAt: "",
      totalPrice: 200,
      status: "accepted",
    },
    {
      id: "3",
      serviceId: "3",
      scheduledAt: "",
      totalPrice: 100,
      status: "cancelled",
    },
    {
      id: "4",
      serviceId: "4",
      scheduledAt: "",
      totalPrice: 100,
      status: "in_progress",
    },
  ];
  return (
    <div className="w-full">
      <div>
        <h2>Booking History</h2>
      </div>
      <div>
        <Suspense fallback={<SkeletonAccordian />}>
          {mockData.map((booking) => (
            <div
              key={booking.id}
              className="collapse collapse-arrow bg-base-100 border border-base-300"
            >
              <input type="radio" name="my-accordion-2" defaultChecked />
              <div className="collapse-title font-semibold">
                Booking Id: {booking.serviceId}
              </div>
              <div className="collapse-content text-sm">
                <p>
                  Booking Date:{" "}
                  {new Date(booking.scheduledAt).toLocaleDateString()}
                </p>
                <p>Price: {booking.totalPrice}</p>
                <p>Status: {booking.status}</p>
              </div>
            </div>
          ))}
        </Suspense>
      </div>
    </div>
  );
}

export default BookingHistory;
