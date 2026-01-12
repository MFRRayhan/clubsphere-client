import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import useAxiosSecure from "../../hooks/useAxiosSecure";

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
    <div className="py-5">
      <div className="container mx-auto">
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
                  <p className="text-sm text-gray-500">
                    No participants found.
                  </p>
                ) : (
                  <div className="overflow-x-auto shadow rounded-xl">
                    <table className="table w-full">
                      <thead className="bg-gray-300">
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
                          <tr key={p._id} className="hover:bg-base-200">
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
      </div>
    </div>
  );
};

export default EventRegistrations;
