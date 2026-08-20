import StatusCards from "@/components/statusCards";
import { getPayments } from "@/lib/dal";

type Props = {};

async function PaymentsCard({}: Props) {
  // const payments = await getPayments();
  return (
    <>
      <StatusCards
        title="Total Payments"
        data={
          /* {payments.length} */
          5000
        }
        desc="30% more than last month"
      />
    </>
  );
}

export default PaymentsCard;
