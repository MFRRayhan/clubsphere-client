import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaUsers, FaCalendarCheck } from "react-icons/fa";

const MemberDashboard = () => {
  const axiosSecure = useAxiosSecure();

  const { data = {}, isLoading } = useQuery({
    queryKey: ["member-dashboard-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/member/dashboard-stats");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Member Dashboard Overview</h2>

      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        {/* Total Clubs */}
        <div className="stat">
          <div className="stat-figure text-primary">
            <FaUsers className="text-3xl" />
          </div>
          <div className="stat-title">Joined Clubs</div>
          <div className="stat-value text-primary">{data.totalClubs}</div>
          <div className="stat-desc">Active memberships</div>
        </div>

        {/* Total Events */}
        <div className="stat">
          <div className="stat-figure text-secondary">
            <FaCalendarCheck className="text-3xl" />
          </div>
          <div className="stat-title">Participated Events</div>
          <div className="stat-value text-secondary">{data.totalEvents}</div>
          <div className="stat-desc">Events you joined</div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
