import StatusCards from "@/components/statusCards";

type Props = {
  stats: {
    pendingCount: number;
    upcomingCount: number;
    completedCount: number;
    totalEarnings: number;
  };
};

export default function TechStats({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatusCards
        cardclassName="w-full shadow-md bg-base-100"
        title="Pending Requests"
        desc="Awaiting your response"
        data={stats.pendingCount.toString()}
        descClass="stat-desc text-warning"
        dataClass="stat-value text-warning"
      />
      <StatusCards
        cardclassName="w-full shadow-md bg-base-100"
        title="Upcoming Jobs"
        desc="Confirmed & in-progress"
        data={stats.upcomingCount.toString()}
        descClass="stat-desc text-primary"
        dataClass="stat-value text-primary"
      />
      <StatusCards
        cardclassName="w-full shadow-md bg-base-100"
        title="Completed Jobs"
        desc="Total jobs fulfilled"
        data={stats.completedCount.toString()}
        descClass="stat-desc text-success"
        dataClass="stat-value text-success"
      />
      <StatusCards
        cardclassName="w-full shadow-md bg-base-100"
        title="Total Earnings"
        desc="Accumulated revenue"
        data={`$${stats.totalEarnings.toFixed(2)}`}
        descClass="stat-desc text-info"
        dataClass="stat-value text-info"
      />
    </div>
  );
}
