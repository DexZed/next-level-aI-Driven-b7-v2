type Props = {};

function UsersCard({}: Props) {
  return (
    <>
      <div className="stat place-items-center">
        <div className="stat-title">Total Users</div>
        <div className="stat-value">31K</div>
        <div className="stat-desc">From January 1st to February 1st</div>
      </div>
    </>
  );
}

export default UsersCard;
