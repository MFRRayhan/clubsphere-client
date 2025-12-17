import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";
import {
  FaUsers,
  FaBuilding,
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
} from "react-icons/fa";

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure.get("/admin/dashboard-stats").then((res) => {
      setStats(res.data);
      setLoading(false);
    });
  }, [axiosSecure]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">
        Admin Dashboard Overview
      </h2>

      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-figure text-primary">
            <FaUsers size={28} />
          </div>
          <div className="stat-title">Total Users</div>
          <div className="stat-value">{stats.totalUsers}</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <FaBuilding size={28} />
          </div>
          <div className="stat-title">Total Clubs</div>
          <div className="stat-value">{stats.totalClubs}</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-accent">
            <FaCalendarAlt size={28} />
          </div>
          <div className="stat-title">Total Events</div>
          <div className="stat-value">{stats.totalEvents}</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-warning">
            <FaClock size={28} />
          </div>
          <div className="stat-title">Pending Approvals</div>
          <div className="stat-value">{stats.pendingApprovals}</div>
          <div className="stat-desc">
            Clubs: {stats.pendingClubs} | Events: {stats.pendingEvents}
          </div>
        </div>

        <div className="stat">
          <div className="stat-figure text-success">
            <FaMoneyBillWave size={28} />
          </div>
          <div className="stat-title">Total Payments</div>
          <div className="stat-value">{stats.totalPayments}</div>
          <div className="stat-desc">Revenue: ৳ {stats.totalRevenue}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
