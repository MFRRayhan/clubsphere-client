import React from "react";
import useRole from "../../hooks/useRole";
import Loader from "../../components/Loader";
import AdminDashboard from "./AdminDashboard";
import MemberDashboard from "./MemberDashboard";
import ManagerDashboard from "./ManagerDashBoard";

const DashboardHome = () => {
  const { role, roleLoading } = useRole();

  if (roleLoading) {
    return <Loader></Loader>;
  }

  if (role === "admin") {
    return <AdminDashboard></AdminDashboard>;
  } else if (role === "clubManager") {
    return <ManagerDashboard></ManagerDashboard>;
  } else {
    return <MemberDashboard></MemberDashboard>;
  }
};

export default DashboardHome;
