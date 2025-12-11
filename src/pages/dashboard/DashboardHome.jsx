import React from "react";
import {
  FaUsers,
  FaRegCalendarCheck,
  FaMoneyCheckAlt,
  FaClipboardList,
} from "react-icons/fa";

const DashboardHome = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
        <p className="text-gray-500">Dashboard overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-5 flex items-center space-x-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            <FaUsers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500">Total Members</p>
            <p className="text-xl font-semibold">1,245</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-5 flex items-center space-x-4">
          <div className="bg-green-100 text-green-600 p-3 rounded-full">
            <FaRegCalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500">Upcoming Events</p>
            <p className="text-xl font-semibold">32</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-5 flex items-center space-x-4">
          <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
            <FaMoneyCheckAlt className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500">Payments Received</p>
            <p className="text-xl font-semibold">$12,450</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-5 flex items-center space-x-4">
          <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
            <FaClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500">Events Managed</p>
            <p className="text-xl font-semibold">15</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white shadow rounded-lg p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
            Add New Event
          </button>
          <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition">
            Add New Club
          </button>
          <button className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition">
            View Members
          </button>
          <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition">
            Manage Payments
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Recent Activity
        </h2>
        <ul className="space-y-2">
          <li className="flex justify-between items-center border-b py-2">
            <span>John Doe joined "Photography Club"</span>
            <span className="text-gray-400 text-sm">2 hrs ago</span>
          </li>
          <li className="flex justify-between items-center border-b py-2">
            <span>New event "Hiking Trip" created</span>
            <span className="text-gray-400 text-sm">5 hrs ago</span>
          </li>
          <li className="flex justify-between items-center border-b py-2">
            <span>Payment received from Jane Smith</span>
            <span className="text-gray-400 text-sm">1 day ago</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardHome;
