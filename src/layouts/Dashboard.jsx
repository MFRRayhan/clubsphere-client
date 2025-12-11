import { FaUserCheck, FaUsersCog } from "react-icons/fa";
import { VscSettings } from "react-icons/vsc";
import { RiEBike2Fill } from "react-icons/ri";
import { LuNotepadText, LuPackageCheck } from "react-icons/lu";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { Link, NavLink, Outlet } from "react-router";
import { IoHomeOutline } from "react-icons/io5";
import { MdEventAvailable } from "react-icons/md";
import { TiGroup } from "react-icons/ti";

// import useRole from "../hooks/useRole";

const Dashboard = () => {
  // const { role } = useRole();
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      {/* Main Dashboard Content */}
      <div className="drawer-content">
        {/* Logo */}
        <div className="px-4 my-5">
          <Link className="inline-block" to="/">
            <div className="flex items-end">
              <h3 className="text-3xl font-bold text-primary">ClubSphere</h3>
            </div>
          </Link>
        </div>

        {/* Navbar */}
        <nav className="navbar w-full bg-base-300">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            {/* Sidebar Icon */}
            <TbLayoutSidebarLeftExpand className="my-1.5 inline-block size-6" />
          </label>
          <div className="px-4 font-semibold text-lg">Dashboard</div>
        </nav>

        <div className="p-5">
          {/* Route content */}
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          <ul className="dashboard-sidebar menu w-full grow space-y-1">
            {/* Home */}
            <li>
              <Link
                to="/dashboard"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Homepage"
              >
                <IoHomeOutline className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Homepage</span>
              </Link>
            </li>

            {/* add an event */}
            <li>
              <NavLink
                to="/dashboard/add-an-event"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Add an Event"
              >
                <MdEventAvailable className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Add an Event</span>
              </NavLink>
            </li>

            {/* Payment History */}
            <li>
              <NavLink
                to="/dashboard/add-a-club"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Clubs"
              >
                <TiGroup className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Clubs</span>
              </NavLink>
            </li>

            {/* Rider Routes / Links */}
            {/* {role === "rider" && (
              <> */}
            <li>
              <NavLink
                to="/dashboard/assigned-deliveries"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Assigned Deliveries"
              >
                <LuNotepadText className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">
                  Assigned Deliveries
                </span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/completed-deliveries"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Completed Deliveries"
              >
                <LuPackageCheck className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">
                  Completed Deliveries
                </span>
              </NavLink>
            </li>
            {/* </>
            )} */}

            {/* Admin Routes / Links */}
            {/* {role === "admin" && (
              <> */}
            {/* Approve Riders */}
            <li>
              <NavLink
                to="/dashboard/assign-riders"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Assign Riders"
              >
                <RiEBike2Fill className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Assign Riders</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/approve-riders"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Approve Riders"
              >
                <FaUserCheck className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Approve Riders</span>
              </NavLink>
            </li>

            {/* Manage Users */}
            <li>
              <NavLink
                to="/dashboard/manage-users"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Manage Users"
              >
                <FaUsersCog className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Manage Users</span>
              </NavLink>
            </li>
            {/* </>
            )} */}

            {/* Settings */}
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
