"use client";

import { useState } from "react";
import { createStripeCheckoutAction } from "../actions";
import { toast } from "react-toastify";
import { CreditCard, Loader2 } from "lucide-react";

type Props = {
  bookingId: string;
  amount: number;
  serviceName: string;
  disabled?: boolean;
};

export default function StripePay({ bookingId, amount, serviceName, disabled }: Props) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await createStripeCheckoutAction(bookingId);
      if (res.success && res.url) {
        window.location.href = res.url;
      } else {
        toast.error(res.error || "Failed to initialize payment checkout");
        setLoading(false);
      }
    } catch (err: any) {
      toast.error(err.message || "Payment initiation error");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={disabled || loading}
      className="btn btn-sm btn-primary shadow-sm gap-2"
      title={`Pay $${amount} via Stripe`}
    >
      {loading ? (
        <>
          <Loader2 size={14} className="animate-spin" /> Redirecting to Stripe...
        </>
      ) : (
        <>
          <CreditCard size={14} /> Pay Now (${amount})
        </>
      )}
    </button>
  );
}
