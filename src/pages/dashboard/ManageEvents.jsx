import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaEye, FaTrash } from "react-icons/fa";

const ManageEvents = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/manager/my-events");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, [axiosSecure]);

  const handleDelete = (eventId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/events/${eventId}`);
          Swal.fire("Deleted!", "Event has been deleted.", "success");
          fetchMyEvents();
        } catch (err) {
          console.error(err);
          Swal.fire("Error!", "Event could not be deleted.", "error");
        }
      }
    });
  };

  if (loading) return <p className="text-center mt-10">Loading events...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage My Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Event Name</th>
                <th>Club Name</th>
                <th>Date</th>
                <th>Location</th>
                <th>Fee</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={event._id}>
                  <td>{index + 1}</td>
                  <td className="font-medium">{event.eventName}</td>
                  <td>{event.clubName || "N/A"}</td>
                  <td>{event.eventDate}</td>
                  <td>{event.location}</td>
                  <td>{event.isPaid ? `৳ ${event.eventFee}` : "Free"}</td>
                  <td>{event.eventCategory}</td>
                  <td>
                    {event.isPaid ? (
                      <span className="badge badge-success">Paid</span>
                    ) : (
                      <span className="badge badge-info">Free</span>
                    )}
                  </td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => navigate(`/events/${event._id}`)}
                      className="btn btn-sm btn-info flex items-center gap-1"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="btn btn-sm btn-error flex items-center gap-1"
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

export default ManageEvents;
