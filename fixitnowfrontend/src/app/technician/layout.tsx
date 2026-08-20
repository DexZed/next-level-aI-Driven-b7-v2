import { technicianSidebarLinks } from "@/lib/constants";
import Sidebar from "@/lib/sidebar";
import React, { ReactNode } from "react";

type Props = { children: ReactNode };

function TechnicianLayout({ children }: Props) {
  return <Sidebar children={children} linkItems={technicianSidebarLinks} />;
}

export default TechnicianLayout;
