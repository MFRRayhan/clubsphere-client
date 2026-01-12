import Loader from "../../components/Loader";
import useRole from "../../hooks/useRole";
import AdminDashboard from "./AdminDashboard";
import ManagerDashboard from "./ManagerDashBoard";
import MemberDashboard from "./MemberDashboard";

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
