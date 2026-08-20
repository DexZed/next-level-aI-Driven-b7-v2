import React from "react";
import StatusCards from "@/components/statusCards";

type Props = {};

function TechStats({}: Props) {
  return (
    <div className="flex flex-wrap justify-center md:justify-between items-center md:m-2 m-5">
      <StatusCards
        cardclassName="w-72"
        title="Upcoming"
        desc="Jobs Upcoming"
        data={10}
        descClass="text-secondary"
        dataClass="text-secondary"
      />
      <StatusCards
        cardclassName="w-72"
        title="Pending"
        desc="Total Jobs Pending"
        data={10}
        descClass="stat-desc text-primary"
        dataClass="stat-value text-primary"
      />
      <StatusCards
        cardclassName="w-72"
        title="This Month"
        desc="Jobs this month"
        data={10}
        descClass="stat-desc text-accent"
        dataClass="stat-value text-accent"
      />
      <StatusCards
        cardclassName="w-72"
        title="Earnings"
        desc="Total Earnings"
        data={10}
        descClass="stat-desc text-info"
        dataClass="stat-value tex-info"
      />
    </div>
  );
}

export default TechStats;
