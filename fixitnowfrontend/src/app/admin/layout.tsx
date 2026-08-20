import { adminSidebarLinks } from "@/lib/constants";
import Sidebar from "@/lib/sidebar";
function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar children={children} linkItems={adminSidebarLinks} />
    </>
  );
}

export default AdminLayout;
