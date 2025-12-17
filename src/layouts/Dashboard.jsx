import React from "react";
import { NavLink, Outlet } from "react-router";
import { IoHomeOutline } from "react-icons/io5";
import { GoGear } from "react-icons/go";
import useRole from "../hooks/useRole";
import Loader from "../components/Loader";
import { VscSettings } from "react-icons/vsc";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { Link } from "react-router";
import {
  MdEventAvailable,
  MdAddBusiness,
  MdPendingActions,
  MdEvent,
} from "react-icons/md";
import { TiGroup } from "react-icons/ti";
import { LuNotebook } from "react-icons/lu";
import { PiUsersFourFill } from "react-icons/pi";
import {
  FaUsers,
  FaRegCalendarCheck,
  FaClipboardList,
  FaMoneyCheckAlt,
  FaUserShield,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";
import { FaToggleOn } from "react-icons/fa";
import { FaToggleOff } from "react-icons/fa";
import UserDropdown from "../components/UserDropdown";

const Dashboard = () => {
  const { role, roleLoading } = useRole();
  if (roleLoading) {
    return <Loader></Loader>;
  }
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-300 px-4">
          {/* LEFT */}
          <div className="navbar-start">
            <label
              htmlFor="my-drawer-4"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
                className="my-1.5 inline-block size-4"
              >
                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
                <path d="M9 4v16" />
                <path d="M14 10l2 2l-2 2" />
              </svg>
            </label>

            <Link to="/" className="text-2xl font-bold text-primary ml-2">
              ClubSphere
              <span className="ml-2 text-base text-gray-700 font-semibold">
                Dashboard
              </span>
            </Link>
          </div>

          {/* RIGHT */}
          <div className="navbar-end">
            <UserDropdown />
          </div>
        </nav>

        {/* Page content here */}
        <div className="p-4">
          <Outlet></Outlet>
        </div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          {/* Sidebar content here */}
          <ul className="dashboard-sidebar menu w-full grow space-y-2">
            {/* List item */}
            <li>
              <NavLink
                end
                to="/dashboard"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Homepage"
              >
                {/* Home icon */}
                <IoHomeOutline className="my-1.5 inline-block size-4"></IoHomeOutline>
                <span className="is-drawer-close:hidden">Homepage</span>
              </NavLink>
            </li>
            {role === "admin" && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/manage-users"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Manage Users"
                  >
                    <FaUserShield className="my-1.5 inline-block size-4"></FaUserShield>
                    <span className="is-drawer-close:hidden">Manage Users</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/manage-clubs"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Manage Clubs"
                  >
                    <FaUsers className="my-1.5 inline-block size-4"></FaUsers>
                    <span className="is-drawer-close:hidden">Manage Clubs</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/admin-manage-events"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Manage Events"
                  >
                    <MdEvent className="my-1.5 inline-block size-4"></MdEvent>
                    <span className="is-drawer-close:hidden">
                      Manage Events
                    </span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/waiting-for-approval"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Waiting For Approval"
                  >
                    <MdPendingActions className="my-1.5 inline-block size-4"></MdPendingActions>
                    <span className="is-drawer-close:hidden">
                      Waiting For Approval
                    </span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/all-payments"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Payments"
                  >
                    <FaMoneyCheckAlt className="my-1.5 inline-block size-4"></FaMoneyCheckAlt>
                    <span className="is-drawer-close:hidden">Payments</span>
                  </NavLink>
                </li>
              </>
            )}

            {role === "clubManager" && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/my-managed-clubs"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="My Managed Clubs"
                  >
                    <FaUsers className="my-1.5 inline-block size-4"></FaUsers>
                    <span className="is-drawer-close:hidden">
                      My Managed Clubs
                    </span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/club-members"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Club Members"
                  >
                    <PiUsersFourFill className="my-1.5 inline-block size-4"></PiUsersFourFill>
                    <span className="is-drawer-close:hidden">Club Members</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/manage-events"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Manage Events"
                  >
                    <FaClipboardList className="my-1.5 inline-block size-4"></FaClipboardList>
                    <span className="is-drawer-close:hidden">
                      Manage Events
                    </span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/events-registration"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Events Registration"
                  >
                    <LuNotebook className="my-1.5 inline-block size-4"></LuNotebook>
                    <span className="is-drawer-close:hidden">
                      Events Registration
                    </span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/add-a-club"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Add A Club"
                  >
                    <MdAddBusiness className="my-1.5 inline-block size-4"></MdAddBusiness>
                    <span className="is-drawer-close:hidden">Add A Club</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/add-an-event"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Add An Event"
                  >
                    <FaCalendarAlt className="my-1.5 inline-block size-4"></FaCalendarAlt>
                    <span className="is-drawer-close:hidden">Add An Event</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/manager-payments"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Payments"
                  >
                    <FaMoneyCheckAlt className="my-1.5 inline-block size-4"></FaMoneyCheckAlt>
                    <span className="is-drawer-close:hidden">Payments</span>
                  </NavLink>
                </li>
              </>
            )}

            {role === "member" && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/my-clubs"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="My Clubs"
                  >
                    <FaUsers className="my-1.5 inline-block size-4"></FaUsers>
                    <span className="is-drawer-close:hidden">My Clubs</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/my-events"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="My Events"
                  >
                    <FaRegCalendarCheck className="my-1.5 inline-block size-4"></FaRegCalendarCheck>
                    <span className="is-drawer-close:hidden">My Events</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/payments"
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Payments"
                  >
                    <FaMoneyCheckAlt className="my-1.5 inline-block size-4"></FaMoneyCheckAlt>
                    <span className="is-drawer-close:hidden">Payments</span>
                  </NavLink>
                </li>
              </>
            )}

            {/* List item */}
            {/* <li>
              <button
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Settings"
              >
                <GoGear className="my-1.5 inline-block size-4"></GoGear>
                <span className="is-drawer-close:hidden">Settings</span>
              </button>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
