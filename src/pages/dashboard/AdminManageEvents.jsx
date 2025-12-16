import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const AdminManageEvents = () => {
  const axiosSecure = useAxiosSecure();
  const [events, setEvents] = useState([]);

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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-primary">Manage Events</h2>

      {!events.length ? (
        <p className="text-error text-xl">No approved events</p>
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
            {events.map((e, i) => (
              <tr key={e._id}>
                <td>{i + 1}</td>
                <td>{e.eventName}</td>
                <td>{e.clubName}</td>
                <td>{new Date(e.eventDate).toLocaleDateString()}</td>
                <td className="flex gap-2">
                  <button className="btn btn-square btn-primary btn-sm">
                    <FaEye />
                  </button>
                  <button className="btn btn-square btn-warning btn-sm">
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(e._id)}
                    className="btn btn-square btn-error btn-sm"
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
