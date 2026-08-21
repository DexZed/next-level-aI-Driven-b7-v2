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
      return <></>;
    case "accepted":
      return <></>;
    case "declined":
      return <></>;
    case "paid":
      return <></>;
    case "in_progress":
      return <></>;
    case "completed":
      return <></>;
    case "cancelled":
      return <></>;
    default:
      break;
  }
}

export default badges;
