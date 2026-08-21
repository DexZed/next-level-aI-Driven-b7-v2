import {
  BookCopy,
  BookX,
  CalendarCheck,
  ClipboardClock,
  House,
  Toolbox,
  User,
  UserPen,
} from "lucide-react";
export const adminSidebarLinks = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <House size={15} /> },
  { name: "Users", path: "/admin/users", icon: <User size={15} /> },
  { name: "Categories", path: "/admin/category", icon: <Toolbox size={15} /> },
];

export const technicianSidebarLinks = [
  {
    name: "Dashboard",
    path: "/technician/dashboard",
    icon: <House size={15} />,
  },
  { name: "Profile", path: "/technician/profile", icon: <UserPen size={15} /> },
  {
    name: "Booking Management",
    path: "/technician/booking",
    icon: <BookCopy size={15} />,
  },
];

export const customerSidebarLinks = [
  {
    name: "Dashboard",
    path: "/customer/dashboard",
    icon: <House size={15} />,
  },
  {
    name: "Booking History",
    path: "/customer/bookings",
    icon: <BookX size={15} />,
  },
  {
    name: "Payment History",
    path: "/customer/payments",
    icon: <ClipboardClock size={15} />,
  },
];
