import { cn } from "@/lib/tailwindMerge";

type Props = {
  title: string;
  data: any;
  desc: string;
  titleClass?: string;
  descClass?: string;
  dataClass?: string;
  cardclassName?: string;
};

function StatusCard({
  title,
  data,
  desc,
  titleClass,
  descClass,
  dataClass,
  cardclassName,
}: Props) {
  return (
    <div className="aura aura-dual">
      <div
        className={cn("card w-96 bg-base-100 card-xl shadow-sm", cardclassName)}
      >
        <div className="card-body">
          <div className="flex flex-col justify-center items-center text-center">
            <div className={cn("stat-title", titleClass)}>
              {title ?? "Random Title"}
            </div>
            <div className={cn("stat-value", dataClass)}>
              {data ? (
                data
              ) : (
                <span className={cn("skeleton skeleton-text", dataClass)}>
                  TODO: Add logic here
                </span>
              )}
            </div>
            <div className={cn("stat-desc", descClass)}>
              {desc ?? "Random Change Percentage"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatusCard;
