import { Suspense } from "react";
import { confirmStripePaymentAction } from "@/app/customer/actions";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";

type Props = {
  searchParams: Promise<{
    session_id?: string;
    booking_id?: string;
  }>;
};

async function SuccessContent({ searchParams }: Props) {
  const { session_id, booking_id } = await searchParams;

  let isConfirmed = false;
  let errorMessage = "";

  if (session_id && booking_id) {
    const res = await confirmStripePaymentAction(session_id, booking_id);
    isConfirmed = res.success;
    if (!res.success) {
      errorMessage = res.error || "Could not confirm payment";
    }
  }

  return (
    <div className="card bg-base-100 shadow-xl max-w-md p-6">
      <div className="flex justify-center mb-4">
        <div className="rounded-full bg-success/20 p-4 text-success">
          <CheckCircle2 size={48} />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-success mb-2">
        Payment Successful!
      </h1>
      <p className="text-sm opacity-80 mb-6">
        Your booking payment has been securely processed via Stripe. Your technician has been notified and will begin the job soon.
      </p>

      {booking_id && (
        <div className="bg-base-200 p-3 rounded-box text-xs font-mono mb-6">
          Booking ID: <span className="font-bold">{booking_id.slice(0, 12)}...</span>
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-warning text-xs mb-4">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Link
          href="/customer/dashboard"
          className="btn btn-primary w-full gap-2"
        >
          Go to Customer Dashboard <ArrowRight size={16} />
        </Link>
        <Link href="/" className="btn btn-ghost btn-sm w-full gap-1">
          <Home size={14} /> Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage({ searchParams }: Props) {
  return (
    <div className="hero min-h-[70vh] bg-base-200">
      <div className="hero-content text-center">
        <Suspense
          fallback={
            <div className="card bg-base-100 shadow-xl max-w-md p-8 text-center">
              <span className="loading loading-spinner loading-lg text-success mx-auto"></span>
            </div>
          }
        >
          <SuccessContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
