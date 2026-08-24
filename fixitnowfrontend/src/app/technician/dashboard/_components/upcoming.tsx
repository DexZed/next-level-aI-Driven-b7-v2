import { CalendarCheck, Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";

type UpcomingJob = {
  id: string;
  status: string;
  totalPrice: number;
  scheduledAt: Date;
  customerName: string | null;
  customerEmail: string | null;
  serviceName: string | null;
};

type Props = {
  jobs: UpcomingJob[];
};

export default function UpcomingJobsComponent({ jobs }: Props) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
        return <span className="badge badge-accent badge-outline badge-xs">In Progress</span>;
      case "paid":
        return <span className="badge badge-secondary badge-outline badge-xs">Paid</span>;
      case "confirmed":
      default:
        return <span className="badge badge-primary badge-outline badge-xs">Confirmed</span>;
    }
  };

  return (
    <div className="card bg-base-100 shadow-md flex-1">
      <div className="card-body p-5">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <CalendarCheck className="text-primary" size={18} />
            <h2 className="card-title text-base">Upcoming Confirmed Jobs ({jobs.length})</h2>
          </div>
          <Link href="/technician/booking" className="link link-primary text-xs flex items-center gap-1">
            Manage <ArrowRight size={12} />
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-8 text-base-content/60 text-sm">
            No upcoming jobs scheduled yet.
          </div>
        ) : (
          <div className="divide-y divide-base-200">
            {jobs.map((job) => (
              <div key={job.id} className="py-3 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{job.serviceName || "Service Job"}</span>
                    {getStatusBadge(job.status)}
                  </div>
                  <div className="flex items-center gap-3 text-xs opacity-70">
                    <span className="flex items-center gap-1">
                      <User size={12} /> {job.customerName || "Customer"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {new Date(job.scheduledAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-sm text-primary">
                    ${job.totalPrice?.toFixed(2)}
                  </div>
                  <div className="text-[10px] opacity-50 font-mono">
                    {job.id.slice(0, 8)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
