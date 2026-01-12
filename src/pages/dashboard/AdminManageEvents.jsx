import { useEffect, useState } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

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

        <div className="w-full md:w-80">
          <div className="input input-bordered flex items-center gap-2">
            <FaSearch className="text-gray-300" />
            <input
              type="search"
              placeholder="Search event..."
              className="grow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {!filteredEvents.length ? (
        <p className="text-error text-xl">No matching events found</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="table w-full">
            <thead className="bg-base-300">
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
                <tr key={e._id} className="hover:bg-base-200">
                  <td>{i + 1}</td>
                  <td>{e.eventName}</td>
                  <td>{e.clubName}</td>
                  <td>{new Date(e.eventDate).toLocaleDateString()}</td>
                  <td className="flex gap-2">
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
        </div>
      )}
    </div>
  );
};

export default AdminManageEvents;
