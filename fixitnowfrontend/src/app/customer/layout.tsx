import { customerSidebarLinks } from "@/lib/constants";
import Sidebar from "@/lib/sidebar";
import { ReactNode } from "react";

type Props = { children: ReactNode };

function layout({ children }: Props) {
  return (
    <div>
      <Sidebar linkItems={customerSidebarLinks} children={children} />
    </div>
  );
}

export default layout;
