import StatusCards from "@/components/statusCards";
import { getUsers } from "@/lib/dal";

type Props = {};

async function UsersCard({}: Props) {
  // const users = await getUsers();
  return (
    <>
      <StatusCards
        title="Total Users"
        data={
          /* {users.length} */
          100
        }
        desc="21% more than last month"
      />
    </>
  );
}

export default UsersCard;
