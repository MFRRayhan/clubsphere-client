import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";
import Swal from "sweetalert2";

const EventRegistrations = () => {
  const axiosSecure = useAxiosSecure();

  const [events, setEvents] = useState([]);
  console.log(events);
  const [loading, setLoading] = useState(true);
  const [kickLoading, setKickLoading] = useState(false);

  const [selectedEventId, setSelectedEventId] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch events with registrations
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

  // Kick participant
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

  // Event filter
  const filteredEvents =
    selectedEventId === "all"
      ? events
      : events.filter((e) => e._id === selectedEventId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-primary">
          My Events Registrations
        </h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or email..."
          className="input input-bordered w-full md:w-72"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Event Dropdown */}
      <div className="w-full md:w-72">
        <select
          className="select select-bordered w-full"
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
        <p className="text-gray-500">No events found.</p>
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
            className="border border-gray-300 rounded-xl p-5 shadow-sm bg-base-100"
          >
            <h3 className="text-lg font-semibold mb-4">{event.eventName}</h3>

            {filteredParticipants.length === 0 ? (
              <p className="text-sm text-gray-500">No participants found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Joined At</th>
                      <th>Event Fee</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParticipants.map((r) => (
                      <tr key={r._id}>
                        <td>{r.userName}</td>
                        <td>{r.userEmail}</td>
                        <td>{new Date(r.joinDate).toLocaleString()}</td>
                        <td>{r.fee === 0 ? "Free" : `BDT ${r.fee}`}</td>
                        <td className="capitalize">{r.status}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-error"
                            disabled={kickLoading}
                            onClick={() => handleKick(r._id, event._id)}
                          >
                            Kick
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
      })}
    </div>
  );
};

export default EventRegistrations;
