import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaEye, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const AdminManageEvents = () => {
  const axiosSecure = useAxiosSecure();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadEvents = async () => {
    const res = await axiosSecure.get("/events?status=approved");
    setEvents(res.data);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/events/${id}`);
      Swal.fire("Deleted!", "Event deleted successfully", "success");
      loadEvents();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete event", "error");
    }
  };

  const filteredEvents = events.filter(
    (e) =>
      e.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.clubName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Title + Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold text-primary">Manage Events</h2>

        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            id="eventAdminSearch"
            name="eventAdminSearch"
            placeholder="Search by event or club..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full pl-10"
          />
        </div>
      </div>

      {!filteredEvents.length ? (
        <p className="text-error text-xl">No matching events found</p>
      ) : (
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Index</th>
              <th>Event</th>
              <th>Club</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((e, i) => (
              <tr key={e._id}>
                <td>{i + 1}</td>
                <td>{e.eventName}</td>
                <td>{e.clubName}</td>
                <td>{new Date(e.eventDate).toLocaleDateString()}</td>
                <td className="flex gap-2">
                  <button className="btn btn-square hover:btn-primary">
                    <FaEye />
                  </button>
                  <button className="btn btn-square hover:btn-warning hover:text-white">
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(e._id)}
                    className="btn btn-square hover:btn-error hover:text-white"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminManageEvents;
