import { getAllUsers } from "@/app/data access layer/admin";
import StatusCards from "@/components/statusCards";

type Props = {};

async function UsersCard({}: Props) {
  const users = await getAllUsers();
  return (
    <>
      <StatusCards
        title="Total Users"
        data={users.length}
        desc="21% more than last month"
      />
    </>
  );
}

export default UsersCard;
