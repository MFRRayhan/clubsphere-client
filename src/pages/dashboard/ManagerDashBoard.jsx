import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";
import {
  FaBuilding,
  FaUsers,
  FaCalendarAlt,
  FaClipboardList,
  FaMoneyCheckAlt,
} from "react-icons/fa";

const ManagerDashBoard = () => {
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure.get("/manager/dashboard-stats").then((res) => {
      setStats(res.data);
      setLoading(false);
    });
  }, [axiosSecure]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">
        Manager Dashboard Overview
      </h2>

      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-figure text-primary">
            <FaBuilding size={26} />
          </div>
          <div className="stat-title">Managed Clubs</div>
          <div className="stat-value">{stats.totalClubs}</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <FaUsers size={26} />
          </div>
          <div className="stat-title">Total Members</div>
          <div className="stat-value">{stats.totalMembers}</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-accent">
            <FaCalendarAlt size={26} />
          </div>
          <div className="stat-title">Managed Events</div>
          <div className="stat-value">{stats.totalEvents}</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-warning">
            <FaClipboardList size={26} />
          </div>
          <div className="stat-title">Event Registrations</div>
          <div className="stat-value">{stats.totalRegistrations}</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-success">
            <FaMoneyCheckAlt size={26} />
          </div>
          <div className="stat-title">Payments</div>
          <div className="stat-value">{stats.totalPayments}</div>
          <div className="stat-desc">Revenue: ৳ {stats.totalRevenue}</div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashBoard;
