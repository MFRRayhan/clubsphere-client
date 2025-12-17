import React from "react";
import { Link, NavLink } from "react-router";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import UserDropdown from "./UserDropdown";

const Navbar = () => {
  const { user } = useAuth();

  // const handleLogout = () => {
  //   logout()
  //     .then(() => {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Logout Successful!",
  //         timer: 2000,
  //         showConfirmButton: false,
  //         position: "center",
  //       });
  //     })
  //     .catch((err) => {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Logout Failed!",
  //         text: err.message,
  //         timer: 2000,
  //         showConfirmButton: false,
  //         position: "center",
  //       });
  //     });
  // };

  const links = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/clubs">Clubs</NavLink>
      </li>
      <li>
        <NavLink to="/events">Events</NavLink>
      </li>

      {user && (
        <li>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
      )}
    </>
  );

  return (
    <div className="bg-base-100 shadow-sm">
      <div className="container mx-auto">
        <div className="navbar">
          {/* Left - Logo + Mobile Menu */}
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>

              <ul
                tabIndex="-1"
                className="primary-menu menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
              >
                {links}
              </ul>
            </div>

            <Link className="inline-block" to="/">
              <div className="flex items-end">
                <h3 className="text-3xl font-bold text-primary">ClubSphere</h3>
              </div>
            </Link>
          </div>

          {/* Center - Desktop Menu */}
          <div className="navbar-center hidden lg:flex">
            <ul className="primary-menu menu menu-horizontal px-1 space-x-2">
              {links}
            </ul>
          </div>

          {/* Right — Buttons & Avatar Dropdown */}
          <div className="navbar-end gap-3">
            {/* If user logged in, show avatar dropdown */}
            {user ? (
              <UserDropdown />
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-primary">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-outline btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
