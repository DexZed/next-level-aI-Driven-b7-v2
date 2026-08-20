import StatusCard from "@/components/statusCards";
import { getBookings } from "@/lib/dal";

type Props = {};

async function BookingsCard({}: Props) {
  // const bookings = await getBookings();
  return (
    <>
      <StatusCard
        title="Total Bookings"
        data={
          /* {bookings.length} */
          1000
        }
        desc="4% more than last month"
      />
    </>
  );
}

export default BookingsCard;
