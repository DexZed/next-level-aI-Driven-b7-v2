import { getAllBookings } from "@/app/data access layer/admin";
import StatusCard from "@/components/statusCards";

type Props = {};

async function BookingsCard({}: Props) {
  const bookings = await getAllBookings();

  return (
    <>
      <StatusCard
        title="Total Bookings"
        data={bookings.length.toString()}
        desc="4% more than last month"
      />
    </>
  );
}

export default BookingsCard;
