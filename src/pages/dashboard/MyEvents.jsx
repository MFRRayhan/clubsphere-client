import React, { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { FaEye, FaTrash, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";

const MyEvents = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [searchText, setSearchText] = useState("");

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

  if (isLoading) return <Loader></Loader>;

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

  // Filter events based on searchText
  const filteredEvents = joinedEvents.filter((e) =>
    e.eventName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      {/* Title + Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-primary">
          My Joined Events ({filteredEvents.length})
        </h2>

        <div className="w-full md:w-80">
          <div className="input input-bordered flex items-center gap-2">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              className="grow"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>

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
            {filteredEvents.length > 0 ? (
              filteredEvents.map((item, index) => (
                <tr key={item._id}>
                  <th>{index + 1}</th>
                  <td>{item.eventName}</td>
                  <td>
                    {item.fee === 0 ? (
                      "Free"
                    ) : (
                      <>
                        <strong>BDT.</strong> {item.fee}
                      </>
                    )}
                  </td>
                  <td>{new Date(item.joinDate).toLocaleString()}</td>
                  <td className="capitalize">
                    {item.status === "paid" ? "joined" : `${item.status}`}
                  </td>
                  <td className="space-x-2 flex items-center">
                    <Link
                      to={`/events/${item.eventId}`}
                      className="btn btn-square hover:bg-primary hover:text-white"
                    >
                      <FaEye />
                    </Link>

                    <button
                      onClick={() =>
                        handleUnjoinEvent(item._id, item.eventName)
                      }
                      className="btn btn-square hover:btn-error hover:text-white"
                      title="Unjoin Event"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No matching events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyEvents;
