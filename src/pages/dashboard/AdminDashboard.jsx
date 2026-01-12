import { useEffect, useState } from "react";
import { FaBuilding, FaCalendarAlt, FaClock, FaUsers } from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import Loader from "../../components/Loader";
import useAxiosSecure from "../../hooks/useAxiosSecure";

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
    <div className="py-5">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-5">
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
            <div className="stat-figure text-primary">
              <FaBuilding size={28} />
            </div>
            <div className="stat-title">Total Clubs</div>
            <div className="stat-value">{stats.totalClubs}</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-primary">
              <FaCalendarAlt size={28} />
            </div>
            <div className="stat-title">Total Events</div>
            <div className="stat-value">{stats.totalEvents}</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-primary">
              <FaClock size={28} />
            </div>
            <div className="stat-title">Pending Approvals</div>
            <div className="stat-value">{stats.pendingApprovals}</div>
            <div className="stat-desc">
              Clubs: {stats.pendingClubs} | Events: {stats.pendingEvents}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-primary">
              <FaBangladeshiTakaSign size={28} />
            </div>
            <div className="stat-title">Total Payments</div>
            <div className="stat-value">{stats.totalPayments}</div>
            <div className="stat-desc">Revenue: ৳ {stats.totalRevenue}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
