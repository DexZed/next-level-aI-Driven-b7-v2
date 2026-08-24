"use client";

import { useState } from "react";
import { submitReviewAction } from "@/app/customer/actions";
import { toast } from "react-toastify";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    technicianId: string;
    technicianName: string | null;
    serviceName: string | null;
  } | null;
};

export default function ReviewModal({ isOpen, onClose, booking }: Props) {
  const router = useRouter();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5 stars");
      return;
    }

    setIsSubmitting(true);
    const res = await submitReviewAction({
      bookingId: booking.id,
      technicianId: booking.technicianId,
      rating,
      comment,
    });
    setIsSubmitting(false);

    if (res.success) {
      toast.success(res.message);
      onClose();
      router.refresh();
    } else {
      toast.error(res.error || "Failed to submit review");
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
        <h3 className="font-bold text-lg mb-1">Rate & Review Service</h3>
        <p className="text-xs opacity-70 mb-4">
          Service: <span className="font-semibold">{booking.serviceName}</span> • Technician:{" "}
          <span className="font-semibold">{booking.technicianName}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Picker */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Your Rating</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star
                      size={28}
                      className={
                        isFilled
                          ? "text-warning fill-warning"
                          : "text-base-content/30"
                      }
                    />
                  </button>
                );
              })}
              <span className="text-sm font-bold ml-2 text-warning">{rating} / 5</span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Feedback Comment (Optional)</span>
            </label>
            <textarea
              placeholder="How was the quality of service, punctuality, and overall experience?..."
              className="textarea textarea-bordered textarea-info w-full"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
