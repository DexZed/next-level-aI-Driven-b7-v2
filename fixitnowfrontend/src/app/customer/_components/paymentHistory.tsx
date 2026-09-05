"use client";

import { CreditCard, Calendar, CheckCircle2, AlertCircle } from "lucide-react";

export type CustomerPaymentItem = {
  id: string;
  bookingId: string;
  amount: number;
  provider: string;
  method: string;
  status: string;
  paidAt: Date | null;
  serviceName: string;
};

type Props = {
  payments: CustomerPaymentItem[];
};

export default function CustomerPaymentHistoryTable({ payments }: Props) {
  if (payments.length === 0) {
    return (
      <div className="card bg-base-100 border border-base-200 p-8 text-center">
        <div className="text-3xl mb-2">💳</div>
        <h3 className="text-base font-bold">No payment records</h3>
        <p className="text-xs opacity-70 mt-1 max-w-xs mx-auto">
          Completed transactions for your service bookings will appear here.
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
              <th>Provider & Method</th>
              <th>Amount</th>
              <th>Payment Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-base-200/40 transition-colors">
                {/* Service & Booking reference */}
                <td>
                  <div className="font-bold text-sm">{p.serviceName}</div>
                  <div className="text-[11px] opacity-60 font-mono">
                    Txn: #{p.id.slice(0, 8)}
                  </div>
                </td>

                {/* Gateway Provider */}
                <td>
                  <div className="flex items-center gap-1.5 font-medium text-xs">
                    <CreditCard size={13} className="opacity-70 text-primary" />
                    <span>{p.provider || "STRIPE"}</span>
                    <span className="badge badge-xs badge-ghost uppercase">
                      {p.method}
                    </span>
                  </div>
                </td>

                {/* Amount */}
                <td>
                  <span className="font-bold text-sm text-success">
                    ${p.amount.toFixed(2)}
                  </span>
                </td>

                {/* Date */}
                <td className="text-xs">
                  <div className="flex items-center gap-1 opacity-80">
                    <Calendar size={12} className="opacity-60" />
                    {p.paidAt
                      ? new Date(p.paidAt).toLocaleDateString()
                      : "Pending"}
                  </div>
                  {p.paidAt && (
                    <div className="text-[11px] opacity-50">
                      {new Date(p.paidAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                </td>

                {/* Status */}
                <td>
                  <span
                    className={`badge badge-sm font-semibold ${
                      p.status === "confirmed" || p.status === "success"
                        ? "badge-success text-white"
                        : p.status === "failed"
                        ? "badge-error text-white"
                        : "badge-warning"
                    }`}
                  >
                    {p.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
