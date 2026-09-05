import { Suspense } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

type Props = {
  searchParams: Promise<{
    booking_id?: string;
  }>;
};

async function CancelContent({ searchParams }: Props) {
  const { booking_id } = await searchParams;

  return (
    <div className="card bg-base-100 shadow-xl max-w-md p-6">
      <div className="flex justify-center mb-4">
        <div className="rounded-full bg-warning/20 p-4 text-warning">
          <AlertCircle size={48} />
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
      <p className="text-sm opacity-80 mb-6">
        Your Stripe checkout session was cancelled. No charges were made to your account. Your booking remains in accepted state so you can complete payment whenever you&apos;re ready.
      </p>

      {booking_id && (
        <div className="bg-base-200 p-3 rounded-box text-xs font-mono mb-6">
          Booking ID: <span className="font-bold">{booking_id.slice(0, 12)}...</span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Link
          href="/customer/dashboard"
          className="btn btn-primary w-full gap-2"
        >
          <RefreshCw size={16} /> Return to Dashboard & Pay
        </Link>
        <Link href="/" className="btn btn-ghost btn-sm w-full gap-1">
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function PaymentCancelPage({ searchParams }: Props) {
  return (
    <div className="hero min-h-[70vh] bg-base-200">
      <div className="hero-content text-center">
        <Suspense
          fallback={
            <div className="card bg-base-100 shadow-xl max-w-md p-8 text-center">
              <span className="loading loading-spinner loading-lg text-primary mx-auto"></span>
            </div>
          }
        >
          <CancelContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
