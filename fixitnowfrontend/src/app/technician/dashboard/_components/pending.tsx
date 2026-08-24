"use client";

import { useState } from "react";
import { updateBookingStatusAction } from "@/app/technician/actions";
import { toast } from "react-toastify";
import { Check, X, Clock, Calendar, User } from "lucide-react";
import Link from "next/link";

type PendingJob = {
  id: string;
  totalPrice: number;
  scheduledAt: Date;
  customerName: string | null;
  customerEmail: string | null;
  serviceName: string | null;
};

type Props = {
  jobs: PendingJob[];
};

export default function PendingJobsComponent({ jobs }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (jobId: string, action: "confirmed" | "declined") => {
    setLoadingId(jobId);
    const res = await updateBookingStatusAction(jobId, action);
    setLoadingId(null);

    if (res.success) {
      toast.success(
        action === "confirmed"
          ? "Booking accepted! Customer can now proceed with payment."
          : "Booking request declined."
      );
    } else {
      toast.error(res.error || "Failed to update booking status");
    }
  };

  return (
    <div className="card bg-base-100 shadow-md flex-1">
      <div className="card-body p-5">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Clock className="text-warning" size={18} />
            <h2 className="card-title text-base">Pending Job Requests ({jobs.length})</h2>
          </div>
          <Link href="/technician/booking?status=pending" className="link link-primary text-xs">
            View all
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-8 text-base-content/60 text-sm">
            No pending requests at the moment.
          </div>
        ) : (
          <div className="divide-y divide-base-200">
            {jobs.map((job) => (
              <div key={job.id} className="py-3 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-semibold text-sm">{job.serviceName || "Service Request"}</div>
                  <div className="flex items-center gap-3 text-xs opacity-70">
                    <span className="flex items-center gap-1">
                      <User size={12} /> {job.customerName || "Customer"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {new Date(job.scheduledAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-primary">
                    ${job.totalPrice?.toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAction(job.id, "confirmed")}
                    disabled={loadingId === job.id}
                    className="btn btn-sm btn-circle btn-success btn-outline"
                    title="Accept Booking"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => handleAction(job.id, "declined")}
                    disabled={loadingId === job.id}
                    className="btn btn-sm btn-circle btn-error btn-outline"
                    title="Decline Booking"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
