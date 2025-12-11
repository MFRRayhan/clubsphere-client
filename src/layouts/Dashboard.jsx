import { VscSettings } from "react-icons/vsc";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { Link, NavLink, Outlet } from "react-router";
import { IoHomeOutline } from "react-icons/io5";
import { MdEventAvailable, MdAddBusiness } from "react-icons/md";
import { TiGroup } from "react-icons/ti";
import { LuNotebook } from "react-icons/lu";
import {
  FaUsers,
  FaRegCalendarCheck,
  FaClipboardList,
  FaMoneyCheckAlt,
  FaUserShield,
  FaUser,
} from "react-icons/fa";

import useRole from "../hooks/useRole";

const Dashboard = () => {
  const { role, isLoading } = useRole();

  if (isLoading) {
    return <div className="p-10 text-xl font-bold">Loading Dashboard...</div>;
  }

  // -------------------------------
  // ROLE-BASED MENU ITEMS
  // -------------------------------
  const adminMenu = [
    { path: "/dashboard/admin", name: "Admin Overview", icon: IoHomeOutline },
    {
      path: "/dashboard/manage-users",
      name: "Manage Users",
      icon: FaUserShield,
    },
    { path: "/dashboard/manage-clubs", name: "Manage Clubs", icon: FaUsers },
    {
      path: "/dashboard/payments",
      name: "All Payments",
      icon: FaMoneyCheckAlt,
    },
  ];

  const managerMenu = [
    {
      path: "/dashboard/manager",
      name: "Manager Overview",
      icon: IoHomeOutline,
    },
    { path: "/dashboard/my-clubs", name: "My Clubs", icon: FaUsers },
    { path: "/dashboard/club-members", name: "Club Members", icon: TiGroup },
    {
      path: "/dashboard/manage-events",
      name: "Manage Events",
      icon: FaClipboardList,
    },
    {
      path: "/dashboard/events-registration",
      name: "Event Registrations",
      icon: LuNotebook,
    },
    { path: "/dashboard/add-a-club", name: "Add Club", icon: MdAddBusiness },
    {
      path: "/dashboard/add-an-event",
      name: "Create Event",
      icon: MdEventAvailable,
    },
  ];

  const memberMenu = [
    { path: "/dashboard/member", name: "Member Overview", icon: IoHomeOutline },
    { path: "/dashboard/my-clubs", name: "My Clubs", icon: FaUsers },
    {
      path: "/dashboard/my-events",
      name: "My Events",
      icon: FaRegCalendarCheck,
    },
    {
      path: "/dashboard/payments",
      name: "Payment History",
      icon: FaMoneyCheckAlt,
    },
  ];

  // -------------------------------------
  // CHOOSE MENU BASED ON ROLE
  // -------------------------------------
  let sideMenu = [];

  if (role === "admin") sideMenu = adminMenu;
  if (role === "clubManager") sideMenu = managerMenu;
  if (role === "member") sideMenu = memberMenu;

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      {/* MAIN CONTENT */}
      <div className="drawer-content">
        {/* Logo */}
        <div className="px-4 my-5">
          <Link className="inline-block" to="/">
            <div className="flex items-end">
              <h3 className="text-3xl font-bold text-primary">ClubSphere</h3>
            </div>
          </Link>
        </div>

        {/* TOP NAV */}
        <nav className="navbar w-full bg-base-300">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            <TbLayoutSidebarLeftExpand className="my-1.5 inline-block size-6" />
          </label>

          <div className="px-4 font-semibold text-lg">Dashboard ({role})</div>
        </nav>

        <div className="p-5">
          <Outlet />
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="drawer-side is-drawer-close:overflow-visible">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>

        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          <ul className="dashboard-sidebar menu w-full grow space-y-1">
            {/* DYNAMIC MENU LOOP */}
            {sideMenu.map(({ path, name, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                  data-tip={name}
                >
                  <Icon className="my-1.5 inline-block size-4" />
                  <span className="is-drawer-close:hidden">{name}</span>
                </NavLink>
              </li>
            ))}

            {/* SETTINGS always visible */}
            <li>
              <NavLink
                to="/dashboard/settings"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Settings"
              >
                <VscSettings className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Settings</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
