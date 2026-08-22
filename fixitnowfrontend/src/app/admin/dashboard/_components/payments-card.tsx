import { getAllRevenue } from "@/app/data access layer/admin";
import StatusCards from "@/components/statusCards";

type Props = {};

async function PaymentsCard({}: Props) {
  const payments = await getAllRevenue();
  console.log(payments);
  const total = payments.reduce(
    (acc: number, payment: { amount: number }) => acc + payment.amount,
    0,
  );
  return (
    <>
      <StatusCards
        title="Total Payments"
        data={total.toString()}
        desc="30% more than last month"
      />
    </>
  );
}

export default PaymentsCard;
