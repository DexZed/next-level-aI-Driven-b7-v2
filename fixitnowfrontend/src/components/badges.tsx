// REQUESTED → Yellow/Orange Badge (Technician sees Accept/Decline buttons)
// ACCEPTED → Blue Badge (Customer sees "Pay Now" button)
// DECLINED → Red Badge
// PAID → Purple Badge (Technician sees "Start Job" button)
// IN_PROGRESS → Green Badge (Technician sees "Complete Job" button; Customer cannot cancel)
// COMPLETED → Gray Badge (Customer sees "Leave Review" button)
// CANCELLED → Dark Red Badge

type BadgeTypes = {
  kind:
    | "requested"
    | "accepted"
    | "declined"
    | "paid"
    | "in_progress"
    | "completed"
    | "cancelled";
  content: string;
};

function badges(type: BadgeTypes, content: BadgeTypes) {
  switch (type.kind) {
    case "requested":
      return (
        <>
          <div className="badge badge-outline badge-warning">
            {content.content}
          </div>
        </>
      );
    case "accepted":
      return (
        <>
          <div className="badge badge-outline badge-primary">
            {content.content}
          </div>
        </>
      );
    case "declined":
      return (
        <>
          <div className="badge badge-outline badge-error">
            {content.content}
          </div>
        </>
      );
    case "paid":
      return (
        <>
          <div className="badge badge-outline badge-soft badge-primary">
            {content.content}
          </div>
        </>
      );
    case "in_progress":
      return (
        <>
          <div className="badge badge-outline badge-soft badge-accent">
            {content.content}
          </div>
        </>
      );
    case "completed":
      return (
        <>
          <div className="badge badge-outline badge-neutral">
            {content.content}
          </div>
        </>
      );
    case "cancelled":
      return (
        <>
          <div className="badge badge-outline badge-ghost">
            {content.content}
          </div>
        </>
      );
    default:
      break;
  }
}

export default badges;
