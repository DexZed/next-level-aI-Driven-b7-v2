import { getPayments } from "@/lib/dal";

type Props = {};

async function PaymentsCard({}: Props) {
  const payments = await getPayments();
  return (
    <>
      <div className="aura aura-dual">
        <div className="card w-96 bg-base-100 card-xl shadow-sm">
          <div className="card-body">
            <div className="flex flex-col justify-center items-center text-center">
              <div className="stat-title">Total Payments</div>
              <div className="stat-value text-primary">{payments.length}</div>
              <div className="stat-desc">30% more than last month</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentsCard;
