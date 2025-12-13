import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";
import Swal from "sweetalert2";

const EventRegistrations = () => {
  const axiosSecure = useAxiosSecure();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kickLoading, setKickLoading] = useState(false);

  useEffect(() => {
    const fetchEventsWithRegistrations = async () => {
      try {
        const res = await axiosSecure.get(
          "/manager/my-active-events-with-registrations"
        );
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events with registrations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventsWithRegistrations();
  }, [axiosSecure]);

  const handleKick = async (participantId, eventId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to kick this participant! They won't be able to join this event again.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, kick!",
    });

    if (result.isConfirmed) {
      setKickLoading(true);
      try {
        // Manager-specific kick API
        await axiosSecure.delete(
          `/manager/event-participants/${eventId}/${participantId}`
        );

        // Remove participant from local state
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
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

        Swal.fire(
          "Kicked!",
          "Participant has been removed from this event.",
          "success"
        );
      } catch (err) {
        console.error("Error kicking participant:", err);
        Swal.fire(
          "Error!",
          "Failed to kick participant. Try again later.",
          "error"
        );
      } finally {
        setKickLoading(false);
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">My Events Registrations</h2>

      {events.length === 0 && <p>No active events found.</p>}

      {events.map((event) => (
        <div key={event._id} className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-xl font-semibold mb-4">{event.eventName}</h3>

          {!event.participants || event.participants.length === 0 ? (
            <p>No participants yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Joined At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {event.participants.map((r) => (
                    <tr key={r._id}>
                      <td>{r.userName}</td>
                      <td>{r.userEmail}</td>
                      <td>{new Date(r.joinDate).toLocaleString()}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => handleKick(r._id, event._id)}
                          disabled={kickLoading}
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
      ))}
    </div>
  );
};

export default EventRegistrations;
