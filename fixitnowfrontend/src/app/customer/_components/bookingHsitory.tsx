"use client";

import { useState } from "react";
import StripePay from "./StripePay";
import ReviewModal from "./review-modal";
import { cancelBookingAction } from "../actions";
import { toast } from "react-toastify";
import { Calendar, Clock, DollarSign, XCircle, Star, AlertCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export type CustomerBookingItem = {
  id: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "in_progress" | "declined" | "paid";
  totalPrice: number;
  scheduledAt: Date;
  createdAt: Date;
  serviceId: string;
  serviceName: string;
  technicianId: string;
  technicianName: string;
  technicianEmail: string;
  technicianCity: string;
};

type Props = {
  bookings: CustomerBookingItem[];
  reviewedBookingIds: string[];
};

export default function CustomerBookingHistoryTable({ bookings, reviewedBookingIds }: Props) {
  const router = useRouter();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [reviewBooking, setReviewBooking] = useState<{
    id: string;
    technicianId: string;
    technicianName: string | null;
    serviceName: string | null;
  } | null>(null);

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setCancellingId(bookingId);
    const res = await cancelBookingAction(bookingId);
    setCancellingId(null);

    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to cancel booking");
    }
  };

  const getStatusBadge = (status: CustomerBookingItem["status"]) => {
    switch (status) {
      case "pending":
        return <span className="badge badge-outline badge-warning font-semibold">REQUESTED</span>;
      case "confirmed":
        return <span className="badge badge-outline badge-primary font-semibold">ACCEPTED</span>;
      case "paid":
        return <span className="badge badge-outline badge-secondary font-semibold">PAID</span>;
      case "in_progress":
        return <span className="badge badge-outline badge-accent font-semibold">IN PROGRESS</span>;
      case "completed":
        return <span className="badge badge-outline badge-success font-semibold">COMPLETED</span>;
      case "cancelled":
        return <span className="badge badge-outline badge-ghost opacity-60">CANCELLED</span>;
      case "declined":
        return <span className="badge badge-outline badge-error font-semibold">DECLINED</span>;
      default:
        return <span className="badge badge-ghost font-semibold">{status}</span>;
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="card bg-base-100 border border-base-200 p-8 text-center">
        <div className="text-3xl mb-2">📋</div>
        <h3 className="text-base font-bold">No bookings yet</h3>
        <p className="text-xs opacity-70 mt-1 max-w-xs mx-auto">
          You haven&apos;t requested any services yet. Explore available services and book a technician today.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="overflow-x-auto rounded-box border border-base-200 bg-base-100">
        <table className="table table-sm md:table-md">
          <thead className="bg-base-200/50 text-xs">
            <tr>
              <th>Service</th>
              <th>Technician</th>
              <th>Appointment</th>
              <th>Status</th>
              <th>Amount</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const isReviewed = reviewedBookingIds.includes(booking.id);
              const canCancel = booking.status === "pending" || booking.status === "confirmed";
              const canPay = booking.status === "confirmed";
              const canReview = booking.status === "completed" && !isReviewed;

              return (
                <tr key={booking.id} className="hover:bg-base-200/40 transition-colors">
                  {/* Service info */}
                  <td>
                    <div className="font-bold text-sm">{booking.serviceName}</div>
                    <div className="text-[11px] opacity-60 font-mono">
                      #{booking.id.slice(0, 8)}
                    </div>
                  </td>

                  {/* Technician info */}
                  <td>
                    <div className="font-medium text-xs">{booking.technicianName}</div>
                    <div className="text-[11px] opacity-60">{booking.technicianCity}</div>
                  </td>

                  {/* Scheduled Date */}
                  <td className="text-xs">
                    <div className="flex items-center gap-1 font-medium">
                      <Calendar size={12} className="opacity-60" />
                      {new Date(booking.scheduledAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] opacity-60">
                      <Clock size={11} />
                      {new Date(booking.scheduledAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>

                  {/* Status */}
                  <td>{getStatusBadge(booking.status)}</td>

                  {/* Total price */}
                  <td>
                    <span className="font-bold text-sm text-primary">
                      ${booking.totalPrice}
                    </span>
                  </td>

                  {/* Actions based on lifecycle */}
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Pay Now Button (on confirmed/accepted) */}
                      {canPay && (
                        <StripePay
                          bookingId={booking.id}
                          amount={booking.totalPrice}
                          serviceName={booking.serviceName}
                        />
                      )}

                      {/* Cancel Action */}
                      {canCancel && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="btn btn-xs btn-outline btn-error gap-1"
                          title="Cancel Booking"
                        >
                          <XCircle size={12} />
                          {cancellingId === booking.id ? "Cancelling..." : "Cancel"}
                        </button>
                      )}

                      {/* Leave Review Action */}
                      {canReview && (
                        <button
                          onClick={() =>
                            setReviewBooking({
                              id: booking.id,
                              technicianId: booking.technicianId,
                              technicianName: booking.technicianName,
                              serviceName: booking.serviceName,
                            })
                          }
                          className="btn btn-xs btn-warning btn-outline gap-1"
                          title="Rate & Review Technician"
                        >
                          <Star size={12} className="fill-warning" /> Leave Review
                        </button>
                      )}

                      {isReviewed && (
                        <span className="text-[11px] opacity-60 italic text-success flex items-center gap-1">
                          <Star size={11} className="fill-success" /> Reviewed
                        </span>
                      )}

                      {!canCancel && !canPay && !canReview && !isReviewed && (
                        <span className="text-[11px] opacity-40">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {reviewBooking && (
        <ReviewModal
          isOpen={!!reviewBooking}
          onClose={() => setReviewBooking(null)}
          booking={reviewBooking}
        />
      )}
    </div>
  );
}
