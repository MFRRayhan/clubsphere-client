import React from "react";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import Loader from "../components/Loader";

const ManagerRoute = ({ children }) => {
  const { loading, user } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || !user || roleLoading) {
    return <Loader></Loader>;
  }

  if (role !== "clubManager") {
    return <Forbidden></Forbidden>;
  }

  return children;
};

export default ManagerRoute;
