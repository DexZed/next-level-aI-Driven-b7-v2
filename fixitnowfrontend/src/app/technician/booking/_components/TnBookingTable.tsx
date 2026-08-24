"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { updateBookingStatusAction } from "@/app/technician/actions";
import { toast } from "react-toastify";
import {
  Search,
  CheckCircle,
  XCircle,
  PlayCircle,
  CheckCheck,
  Clock,
  Calendar,
  DollarSign,
  User,
} from "lucide-react";

type BookingItem = {
  id: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "in_progress" | "declined" | "paid";
  totalPrice: number;
  scheduledAt: Date;
  createdAt: Date;
  customerId: string | null;
  customerName: string | null;
  customerEmail: string | null;
  serviceId: string | null;
  serviceName: string | null;
  serviceDescription: string | null;
};

type Props = {
  initialData: {
    bookings: BookingItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  currentSearch: string;
  currentStatus: string;
};

export default function TnBookingTable({ initialData, currentSearch, currentStatus }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(currentSearch);
  const [status, setStatus] = useState(currentStatus);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleFilterChange = (newSearch: string, newStatus: string, newPage = 1) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSearch.trim()) {
      params.set("search", newSearch.trim());
    } else {
      params.delete("search");
    }

    if (newStatus && newStatus !== "all") {
      params.set("status", newStatus);
    } else {
      params.delete("status");
    }

    params.set("page", newPage.toString());

    startTransition(() => {
      router.push(`/technician/booking?${params.toString()}`);
    });
  };

  const handleStatusTransition = async (
    bookingId: string,
    targetStatus: "pending" | "confirmed" | "completed" | "cancelled" | "in_progress" | "declined" | "paid",
    confirmMsg?: string
  ) => {
    if (confirmMsg && !confirm(confirmMsg)) return;

    setLoadingId(bookingId);
    const res = await updateBookingStatusAction(bookingId, targetStatus);
    setLoadingId(null);

    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update booking status");
    }
  };

  const getStatusBadge = (bStatus: string) => {
    switch (bStatus) {
      case "pending":
        return <span className="badge badge-warning badge-outline badge-sm font-medium">REQUESTED</span>;
      case "confirmed":
        return <span className="badge badge-primary badge-outline badge-sm font-medium">ACCEPTED</span>;
      case "paid":
        return <span className="badge badge-secondary badge-outline badge-sm font-medium">PAID</span>;
      case "in_progress":
        return <span className="badge badge-accent badge-outline badge-sm font-medium">IN PROGRESS</span>;
      case "completed":
        return <span className="badge badge-neutral badge-outline badge-sm font-medium">COMPLETED</span>;
      case "declined":
        return <span className="badge badge-error badge-outline badge-sm font-medium">DECLINED</span>;
      case "cancelled":
        return <span className="badge badge-error badge-outline badge-sm font-medium">CANCELLED</span>;
      default:
        return <span className="badge badge-ghost badge-sm font-medium">{bStatus}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="card bg-base-100 shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFilterChange(search, status, 1);
            }}
            className="flex flex-1 w-full md:w-auto gap-2"
          >
            <label className="input input-bordered flex items-center gap-2 flex-1">
              <Search size={16} className="opacity-60" />
              <input
                type="text"
                placeholder="Search by customer name or service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="grow"
              />
            </label>
            <button type="submit" className="btn btn-primary btn-outline" disabled={isPending}>
              Search
            </button>
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-sm font-medium opacity-70">Status:</span>
            <select
              className="select select-bordered"
              value={status}
              onChange={(e) => {
                const newStatus = e.target.value;
                setStatus(newStatus);
                handleFilterChange(search, newStatus, 1);
              }}
              disabled={isPending}
            >
              <option value="all">All Bookings</option>
              <option value="pending">Requested (Pending)</option>
              <option value="confirmed">Accepted (Confirmed)</option>
              <option value="paid">Paid (Ready to Start)</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="declined">Declined</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card bg-base-100 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200 text-base-content/80">
                <th>Customer</th>
                <th>Service Details</th>
                <th>Scheduled Date</th>
                <th>Price</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {initialData.bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-base-content/60">
                    No bookings found matching your filters.
                  </td>
                </tr>
              ) : (
                initialData.bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-base-200/50">
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-8 h-8 text-xs font-bold">
                            {b.customerName?.slice(0, 2).toUpperCase() || "CU"}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-sm">{b.customerName || "Customer"}</div>
                          <div className="text-xs opacity-60">{b.customerEmail}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div>
                        <div className="font-semibold text-sm">{b.serviceName || "Service"}</div>
                        <div className="text-xs opacity-60 font-mono">{b.id.slice(0, 8)}...</div>
                      </div>
                    </td>

                    <td className="text-xs">
                      <div className="flex items-center gap-1 font-medium">
                        <Calendar size={12} />
                        {new Date(b.scheduledAt).toLocaleDateString()}
                      </div>
                      <div className="opacity-60 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(b.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>

                    <td className="font-bold text-sm text-primary">
                      ${b.totalPrice?.toFixed(2)}
                    </td>

                    <td>{getStatusBadge(b.status)}</td>

                    <td className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        {/* State Action: Pending -> Accept or Decline */}
                        {b.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleStatusTransition(b.id, "confirmed")}
                              disabled={loadingId === b.id}
                              className="btn btn-xs btn-success gap-1"
                              title="Accept Booking"
                            >
                              <CheckCircle size={14} /> Accept
                            </button>
                            <button
                              onClick={() => handleStatusTransition(b.id, "declined", "Decline this booking request?")}
                              disabled={loadingId === b.id}
                              className="btn btn-xs btn-error btn-outline gap-1"
                              title="Decline Booking"
                            >
                              <XCircle size={14} /> Decline
                            </button>
                          </>
                        )}

                        {/* State Action: Confirmed -> Awaiting customer payment */}
                        {b.status === "confirmed" && (
                          <span className="text-xs opacity-60 italic">Awaiting Payment</span>
                        )}

                        {/* State Action: Paid -> Start Job */}
                        {b.status === "paid" && (
                          <button
                            onClick={() => handleStatusTransition(b.id, "in_progress", "Start this job now?")}
                            disabled={loadingId === b.id}
                            className="btn btn-xs btn-accent gap-1"
                            title="Start Job"
                          >
                            <PlayCircle size={14} /> Start Job
                          </button>
                        )}

                        {/* State Action: In Progress -> Complete Job */}
                        {b.status === "in_progress" && (
                          <button
                            onClick={() => handleStatusTransition(b.id, "completed", "Mark this job as completed?")}
                            disabled={loadingId === b.id}
                            className="btn btn-xs btn-success gap-1"
                            title="Complete Job"
                          >
                            <CheckCheck size={14} /> Complete Job
                          </button>
                        )}

                        {/* Terminal States */}
                        {b.status === "completed" && (
                          <span className="text-xs opacity-60">Finished</span>
                        )}
                        {(b.status === "cancelled" || b.status === "declined") && (
                          <span className="text-xs opacity-40">Closed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-base-200 gap-3">
          <div className="text-sm opacity-70">
            Showing <span className="font-semibold">{initialData.bookings.length}</span> of{" "}
            <span className="font-semibold">{initialData.total}</span> bookings
          </div>
          <div className="join">
            <button
              className="join-item btn btn-sm"
              disabled={initialData.page <= 1 || isPending}
              onClick={() => handleFilterChange(search, status, initialData.page - 1)}
            >
              « Prev
            </button>
            <button className="join-item btn btn-sm btn-active">
              Page {initialData.page} of {initialData.totalPages}
            </button>
            <button
              className="join-item btn btn-sm"
              disabled={initialData.page >= initialData.totalPages || isPending}
              onClick={() => handleFilterChange(search, status, initialData.page + 1)}
            >
              Next »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
