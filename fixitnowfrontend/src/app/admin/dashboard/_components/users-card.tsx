import { getUsers } from "@/lib/dal";

type Props = {};

async function UsersCard({}: Props) {
  const users = await getUsers();
  return (
    <>
      <div className="aura aura-dual">
        <div className="card w-96 bg-base-100 card-xl shadow-sm">
          <div className="card-body">
            <div className="flex flex-col justify-center items-center text-center">
              <div className="stat-title">Total Users</div>
              <div className="stat-value text-primary">{users.length}</div>
              <div className="stat-desc">21% more than last month</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UsersCard;
