import { getBookings } from "@/lib/dal";

type Props = {};

async function BookingsCard({}: Props) {
  const bookings = await getBookings();
  return (
    <>
      <div className="aura aura-dual">
        <div className="card w-96 bg-base-100 card-xl shadow-sm">
          <div className="card-body">
            <div className="flex flex-col justify-center items-center text-center">
              <div className="stat-title">Total Bookings</div>
              <div className="stat-value text-secondary">{bookings.length}</div>
              <div className="stat-desc">4% more than last month</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingsCard;
