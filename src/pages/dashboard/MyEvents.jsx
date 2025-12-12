import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom"; // Link Import Added

const MyEvents = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Changed query to fetch participation records (joined events)
  const {
    data: joinedEvents = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["joinedEvents", user?.email],
    queryFn: async () => {
      // Fetch participations from the new API endpoint
      const res = await axiosSecure.get(`/my-participations`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading)
    return <div className="py-20 text-center">Loading joined events...</div>;

  return (
    <div>
      <div>My Joined Events ({joinedEvents.length})</div>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Event Name</th>
              <th>Fee Paid</th>
              <th>Joined On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {joinedEvents.map((item, index) => (
              <tr key={item._id}>
                <th>{index + 1}</th>
                <td>{item.eventName}</td>
                <td>${item.fee}</td>
                <td>{new Date(item.joinDate).toLocaleDateString()}</td>
                <td>{item.status}</td>
                <td className="space-x-2">
                  {/* View Event Details link */}
                  <Link
                    to={`/events/${item.eventId}`}
                    className="btn btn-square hover:bg-primary hover:text-white"
                  >
                    <FaEye />
                  </Link>
                  {/* Since this is a list of JOINED events, typically you don't delete them here.
                      If you need to un-join, a different API and button would be needed.
                      I am removing FaEdit and FaTrash for simplicity here. */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyEvents;
