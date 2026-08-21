import TnBookingTable from "./_components/TnBookingTable";

type Props = {};

function BookingPage({}: Props) {
  const bookings = [
    {
      id: 1,
      customer: "Jhon",
      service: "Ac repair",
      description: "Busted Compressor",
      status: "pending",
      date: "2024-01-15T10:00:00Z",
      payment: "100",
    },
  ];
  return (
    <div className="h-screen flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-center m-2">Bookings</h1>
      </div>
      <div className="m-5">
        <label className="input">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input type="search" required placeholder="Search for a booking" />
        </label>
      </div>
      <div>
        <div className="w-full">
          <TnBookingTable data={bookings} />
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
