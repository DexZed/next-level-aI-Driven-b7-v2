import { Expand } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  linkItems: { name: string; path: string; icon: ReactNode }[];
};

function Sidebar({ children, linkItems }: Props) {
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input
          id="my-drawer-4"
          type="checkbox"
          className="drawer-toggle inline"
        />
        <div className="drawer-content">
          {/* Navbar */}

          {/* Page content here */}
          <div className="p-4">{children}</div>
        </div>

        <div className="drawer-side is-drawer-close:overflow-visible">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
            {/* Sidebar content here */}
            <ul className="menu w-full grow">
              {/* List item */}
              <li>
                <label
                  htmlFor="my-drawer-4"
                  aria-label="open sidebar"
                  className="btn btn-square btn-ghost drawer-button"
                >
                  {/* Sidebar toggle icon */}
                  <div
                    className="tooltip tooltip-right tooltip-start"
                    data-tip="Show Sidebar"
                  >
                    <Expand size={15} />
                  </div>
                </label>
              </li>
              {/* List item */}
              {linkItems.map((link, idx) => (
                <li key={idx}>
                  <button
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip={link.name}
                  >
                    {/* Home icon */}
                    <Link href={link.path}>{link.icon}</Link>
                    <span className="is-drawer-close:hidden">
                      <Link href={link.path}>{link.name}</Link>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
