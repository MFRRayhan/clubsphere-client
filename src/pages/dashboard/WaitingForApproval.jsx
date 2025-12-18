import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaEye, FaCheck, FaTimes } from "react-icons/fa";
import Loader from "../../components/Loader";

const WaitingForApproval = () => {
  const axiosSecure = useAxiosSecure();
  const [pendingClubs, setPendingClubs] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchText, setSearchText] = useState("");

  const fetchPendingData = async () => {
    try {
      const [clubsRes, eventsRes] = await Promise.all([
        axiosSecure.get("/clubs?status=pending"),
        axiosSecure.get("/events?status=pending"),
      ]);
      setPendingClubs(clubsRes.data);
      setPendingEvents(eventsRes.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch pending data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingData();
  }, []);

  // Clubs Approve / Reject
  const updateClubStatus = async (clubId, status) => {
    try {
      await axiosSecure.patch(`/clubs/${clubId}/status`, { status });
      Swal.fire(
        "Success",
        `Club ${status === "approved" ? "approved" : "rejected"} successfully`,
        "success"
      );
      fetchPendingData();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update club status", "error");
    }
  };

  // Events Approve / Reject
  const updateEventStatus = async (eventId, status) => {
    try {
      await axiosSecure.patch(`/admin/events/${eventId}/status`, { status });
      Swal.fire(
        "Success",
        `Event ${status === "approved" ? "approved" : "rejected"} successfully`,
        "success"
      );
      fetchPendingData();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update event status", "error");
    }
  };

  const filteredClubs = pendingClubs.filter(
    (club) =>
      club.clubName.toLowerCase().includes(searchText.toLowerCase()) ||
      club.managerEmail.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredEvents = pendingEvents.filter(
    (event) =>
      event.eventName.toLowerCase().includes(searchText.toLowerCase()) ||
      event.clubName.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-primary font-bold">
          Pending Clubs & Events Approvals
        </h2>
        <input
          type="text"
          placeholder="Search clubs/events..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="input input-bordered w-64"
        />
      </div>

      {filteredClubs.length + filteredEvents.length === 0 ? (
        <p className="text-center py-6 text-2xl text-error font-semibold">
          No pending clubs or events
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Index</th>
                <th>Name</th>
                <th>Type</th>
                <th>Associated Club / Manager</th>
                <th>Date / Info</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Pending Clubs */}
              {filteredClubs.map((club, i) => (
                <tr key={club._id}>
                  <td>{i + 1}</td>
                  <td>{club.clubName}</td>
                  <td>Club</td>
                  <td>{club.managerEmail}</td>
                  <td>{new Date(club.createdAt).toLocaleDateString()}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => setSelectedItem(club)}
                      className="btn btn-square hover:btn-primary flex items-center gap-1"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => updateClubStatus(club._id, "approved")}
                      className="btn btn-square hover:btn-success flex items-center gap-1"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => updateClubStatus(club._id, "rejected")}
                      className="btn btn-square hover:btn-error flex items-center gap-1"
                    >
                      <FaTimes />
                    </button>
                  </td>
                </tr>
              ))}

              {/* Pending Events */}
              {filteredEvents.map((event, i) => (
                <tr key={event._id}>
                  <td>{filteredClubs.length + i + 1}</td>
                  <td>{event.eventName}</td>
                  <td>Event</td>
                  <td>{event.clubName}</td>
                  <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => setSelectedItem(event)}
                      className="btn btn-square hover:btn-primary flex items-center gap-1"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => updateEventStatus(event._id, "approved")}
                      className="btn btn-square hover:btn-success hover:text-white flex items-center gap-1"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => updateEventStatus(event._id, "rejected")}
                      className="btn btn-square hover:btn-error hover:text-white flex items-center gap-1"
                    >
                      <FaTimes />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-30"
            onClick={() => setSelectedItem(null)}
          ></div>

          <div className="relative bg-white rounded-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto p-6 z-10 shadow-lg">
            {selectedItem.bannerImage && (
              <img
                src={selectedItem.bannerImage}
                alt={selectedItem.clubName || selectedItem.eventName}
                className="w-full h-96 object-cover rounded mb-4"
              />
            )}
            <h3 className="text-2xl font-bold mb-2">
              {selectedItem.clubName || selectedItem.eventName}
            </h3>

            {selectedItem.description && (
              <p className="mb-2">
                <strong>Description:</strong> {selectedItem.description}
              </p>
            )}
            {selectedItem.category && (
              <p className="mb-2">
                <strong>Category:</strong> {selectedItem.category}
              </p>
            )}
            {selectedItem.location && (
              <p className="mb-2">
                <strong>Location:</strong> {selectedItem.location}
              </p>
            )}
            {selectedItem.membershipFee !== undefined && (
              <p className="mb-2">
                <strong>Membership Fee:</strong> BDT{" "}
                {selectedItem.membershipFee}
              </p>
            )}
            {selectedItem.eventDate && (
              <p className="mb-2">
                <strong>Event Date:</strong>{" "}
                {new Date(selectedItem.eventDate).toLocaleString()}
              </p>
            )}
            <p className="mb-2 capitalize">
              <strong>Status:</strong> {selectedItem.status}
            </p>
            <p className="mb-2">
              <strong>Manager Email:</strong> {selectedItem.managerEmail}
            </p>
            <p className="mb-2">
              <strong>Created At:</strong>{" "}
              {new Date(selectedItem.createdAt).toLocaleString()}
            </p>
            <p className="mb-2">
              <strong>Updated At:</strong>{" "}
              {new Date(selectedItem.updatedAt).toLocaleString()}
            </p>

            <div className="mt-4 flex justify-end">
              <button
                className="btn btn-primary"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaitingForApproval;
