import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";
import Swal from "sweetalert2";
import { FaTimes } from "react-icons/fa";

const EventRegistrations = () => {
  const axiosSecure = useAxiosSecure();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kickLoading, setKickLoading] = useState(false);

  const [selectedEventId, setSelectedEventId] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEventsWithRegistrations = async () => {
      try {
        const res = await axiosSecure.get(
          "/manager/my-active-events-with-registrations"
        );
        setEvents(res.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventsWithRegistrations();
  }, [axiosSecure]);

  const handleKick = async (participantId, eventId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This participant will be removed from this event.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Kick",
    });

    if (!result.isConfirmed) return;

    setKickLoading(true);
    try {
      await axiosSecure.delete(
        `/manager/event-participants/${eventId}/${participantId}`
      );

      setEvents((prev) =>
        prev.map((event) =>
          event._id === eventId
            ? {
                ...event,
                participants: event.participants.filter(
                  (p) => p._id !== participantId
                ),
              }
            : event
        )
      );

      Swal.fire("Removed!", "Participant kicked successfully.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to kick participant.", "error");
    } finally {
      setKickLoading(false);
    }
  };

  if (loading) return <Loader />;

  const filteredEvents =
    selectedEventId === "all"
      ? events
      : events.filter((e) => e._id === selectedEventId);

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="px-2 py-1 rounded-full bg-green-500 text-white text-xs font-semibold">
            {status}
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 rounded-full bg-yellow-400 text-white text-xs font-semibold">
            {status}
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 rounded-full bg-red-500 text-white text-xs font-semibold">
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full bg-gray-300 text-gray-700 text-xs font-semibold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-primary">
          My Event Registrations
        </h2>

        <input
          type="text"
          placeholder="Search by name or email..."
          className="input input-bordered w-full md:w-72 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Event Dropdown */}
      <div className="w-full md:w-72">
        <select
          className="select select-bordered w-full shadow-sm"
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
        >
          <option value="all">All Events</option>
          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.eventName}
            </option>
          ))}
        </select>
      </div>

      {/* Event Cards */}
      {filteredEvents.length === 0 && (
        <p className="text-center py-6 text-2xl text-error font-semibold">
          Looks like no one has signed up for your event yet.
        </p>
      )}

      {filteredEvents.map((event) => {
        const filteredParticipants =
          event.participants?.filter(
            (p) =>
              p.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
          ) || [];

        return (
          <div
            key={event._id}
            className="border border-gray-200 rounded-xl p-5 shadow-md bg-white hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">
                {event.eventName}
              </h3>
              <span className="text-sm text-gray-500">
                Total Participants: {event.participants?.length || 0}
              </span>
            </div>

            {filteredParticipants.length === 0 ? (
              <p className="text-sm text-gray-500">No participants found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left">User</th>
                      <th className="text-left">Email</th>
                      <th>Joined At</th>
                      <th>Event Fee</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParticipants.map((p) => (
                      <tr key={p._id}>
                        <td>{p.userName}</td>
                        <td>{p.userEmail}</td>
                        <td>{new Date(p.joinDate).toLocaleString()}</td>
                        <td className="font-semibold">
                          {p.fee === 0 ? "Free" : `BDT ${p.fee}`}
                        </td>
                        <td className="capitalize">
                          {getStatusBadge(p.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EventRegistrations;
