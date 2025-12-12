import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { FaEye, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const MyEvents = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: joinedEvents = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["joinedEvents", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-participations`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading)
    return <div className="py-20 text-center">Loading joined events...</div>;

  const handleUnjoinEvent = (id, eventName) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to leave the event: ${eventName}? You can rejoin later.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Unjoin it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/event-participants/${id}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              refetch();
              Swal.fire({
                title: "Unjoined!",
                text: `${eventName} has been removed from your list.`,
                icon: "success",
              });
            } else {
              Swal.fire({
                title: "Failed!",
                text: `Could not unjoin the event.`,
                icon: "error",
              });
            }
          })
          .catch((error) => {
            console.error("Unjoin error:", error);
            Swal.fire({
              title: "Error!",
              text: `Server error while unjoining.`,
              icon: "error",
            });
          });
      }
    });
  };

  if (joinedEvents.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold text-gray-700">
          You have not joined any events yet.
        </h3>
        <p className="text-gray-500 mt-2">
          Find exciting events on the{" "}
          <Link
            to="/events"
            className="text-primary hover:underline font-medium"
          >
            Events Page
          </Link>{" "}
          and join!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">
        My Joined Events ({joinedEvents.length})
      </h2>
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
                <td className="space-x-2 flex items-center">
                  <Link
                    to={`/events/${item.eventId}`}
                    className="btn btn-square hover:bg-primary hover:text-white"
                  >
                    <FaEye />
                  </Link>

                  <button
                    onClick={() => handleUnjoinEvent(item._id, item.eventName)}
                    className="btn btn-square hover:bg-red-600 hover:text-white text-red-600"
                    title="Unjoin Event"
                  >
                    <FaTrash />
                  </button>
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
