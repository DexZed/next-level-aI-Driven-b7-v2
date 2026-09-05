import { Suspense } from "react";
import CustomerBookingHistoryTable from "../_components/bookingHsitory";
import CustomerPaymentHistoryTable from "../_components/paymentHistory";
import { getCustomerDashboardData } from "@/app/data access layer/customer";
import { SkeletonCards, SkeletonHero } from "@/components/skeletons";
import Link from "next/link";
import { Calendar, CreditCard, Search, ArrowRight, ShieldCheck } from "lucide-react";

async function DashboardContent() {
  const data = await getCustomerDashboardData();

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="hero bg-base-200 rounded-box p-8 border border-base-300">
        <div className="hero-content flex-col lg:flex-row justify-between w-full max-w-6xl">
          <div className="text-left">
            <span className="badge badge-primary badge-outline mb-2">Customer Portal</span>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              Welcome back, {data.customer.name}!
            </h1>
            <p className="py-2 text-sm opacity-80 max-w-xl">
              Track your service appointments in real-time, complete secure payments with Stripe, and share feedback with your technicians.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/public/services" className="btn btn-primary shadow-sm gap-2">
              <Search size={16} /> Explore Services <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat bg-base-100 border border-base-200 rounded-box shadow-sm">
          <div className="stat-figure text-primary">
            <Calendar className="inline-block w-8 h-8 stroke-current" />
          </div>
          <div className="stat-title text-xs">Total Bookings</div>
          <div className="stat-value text-2xl text-primary">{data.bookings.length}</div>
          <div className="stat-desc text-[11px]">
            {data.bookings.filter((b) => b.status === "in_progress" || b.status === "confirmed" || b.status === "paid").length} active appointments
          </div>
        </div>

        <div className="stat bg-base-100 border border-base-200 rounded-box shadow-sm">
          <div className="stat-figure text-success">
            <CreditCard className="inline-block w-8 h-8 stroke-current" />
          </div>
          <div className="stat-title text-xs">Completed Payments</div>
          <div className="stat-value text-2xl text-success">{data.payments.length}</div>
          <div className="stat-desc text-[11px]">
            ${data.payments.reduce((acc, p) => acc + p.amount, 0).toFixed(2)} total spent
          </div>
        </div>

        <div className="stat bg-base-100 border border-base-200 rounded-box shadow-sm">
          <div className="stat-figure text-warning">
            <ShieldCheck className="inline-block w-8 h-8 stroke-current" />
          </div>
          <div className="stat-title text-xs">Reviews Submitted</div>
          <div className="stat-value text-2xl text-warning">{data.reviewedBookingIds.length}</div>
          <div className="stat-desc text-[11px]">Helping technicians improve</div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Service Bookings & Status
            </h2>
            <p className="text-xs opacity-70">
              Manage requests, complete payments, or cancel upcoming visits.
            </p>
          </div>
          <Link href="/public/services" className="btn btn-outline btn-xs gap-1">
            Book New Service
          </Link>
        </div>

        <CustomerBookingHistoryTable
          bookings={data.bookings}
          reviewedBookingIds={data.reviewedBookingIds}
        />
      </div>

      {/* Payments Section */}
      <div className="space-y-4 pt-4 border-t border-base-200">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-success" /> Payment History
          </h2>
          <p className="text-xs opacity-70">
            Receipts and transaction references for your paid jobs.
          </p>
        </div>

        <CustomerPaymentHistoryTable payments={data.payments} />
      </div>
    </div>
  );
}

export default function CustomerDashboard() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Suspense fallback={<SkeletonHero />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
