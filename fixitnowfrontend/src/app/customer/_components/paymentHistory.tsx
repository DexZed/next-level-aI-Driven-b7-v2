import { Suspense } from "react";
import { getCustomerPaymentHistory } from "../actions";
import { SkeletonAccordian } from "@/components/skeletons";

type Props = {};

async function PaymentHistory({}: Props) {
  // const paymentHistory = await getCustomerPaymentHistory();
  const mockData = [
    {
      payments: {
        id: "1",
        amount: 100,
        status: "pending",
        paidAt: "",
      },
    },
    {
      payments: {
        id: "2",
        amount: 200,
        status: "success",
        paidAt: "",
      },
    },
    {
      payments: {
        id: "3",
        amount: 100,
        status: "failed",
        paidAt: "",
      },
    },
    {
      payments: {
        id: "4",
        amount: 100,
        status: "success",
        paidAt: "",
      },
    },
  ];
  return (
    <div className="w-full">
      <div>
        <h2>Payment History</h2>
      </div>
      <div>
        <Suspense fallback={<SkeletonAccordian />}>
          {mockData.map((payment) => (
            <div
              key={payment.payments.id}
              className="collapse collapse-arrow bg-base-100 border border-base-300"
            >
              <input type="radio" name="my-accordion-2" defaultChecked />
              <div className="collapse-title font-semibold">
                Payment Id: {payment.payments.id}
              </div>
              <div className="collapse-content text-sm">
                <p>
                  Paid At:{" "}
                  {new Date(payment.payments.paidAt!).toLocaleDateString()}
                </p>
                <p>Amount: {payment.payments.amount}</p>
                <p>Payment Status: {payment.payments.status}</p>
              </div>
            </div>
          ))}
        </Suspense>
      </div>
    </div>
  );
}

export default PaymentHistory;
