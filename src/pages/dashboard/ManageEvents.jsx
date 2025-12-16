import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";

const ManageEvents = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [bannerFile, setBannerFile] = useState(null);

  const {
    data: myEvents = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myEvents", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/manager/my-events");
      return res.data;
    },
  });

  const filteredEvents = myEvents.filter((event) =>
    event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteEvent = (eventId, eventName) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete "${eventName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/events/${eventId}`);
          refetch();
          Swal.fire("Deleted!", "Event deleted successfully.", "success");
        } catch (error) {
          Swal.fire("Error", "Failed to delete event.", "error");
        }
      }
    });
  };

  const openModal = async (eventId, mode) => {
    try {
      const res = await axiosSecure.get(`/events/${eventId}`);
      const eventData = res.data;

      setSelectedEvent(eventData);

      if (mode === "edit") {
        setFormData({
          eventName: eventData.eventName || "",
          eventDescription: eventData.eventDescription || "",
          eventDate: eventData.eventDate.split("T")[0] || "",
          location: eventData.location || "",
          isPaid: eventData.isPaid || false,
          eventFee: eventData.eventFee || 0,
          eventCategory: eventData.eventCategory || "",
          eventBanner: eventData.eventBanner || "",
          maxAttendees: eventData.maxAttendees || "",
        });
        setBannerFile(null);
        setIsEditModalOpen(true);
      } else {
        setIsViewModalOpen(true);
      }
    } catch (error) {
      Swal.fire("Error", "Failed to fetch event data.", "error");
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    setBannerFile(file);

    if (!file) return;

    const imageForm = new FormData();
    imageForm.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_image_host_key
        }`,
        {
          method: "POST",
          body: imageForm,
        }
      );

      const data = await res.json();

      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          eventBanner: data.data.url,
        }));
        Swal.fire(
          "Uploaded",
          "Event banner updated successfully! Click 'Update Event' to save changes.",
          "success"
        );
      } else {
        Swal.fire(
          "Error",
          "Banner upload failed. " + data.error.message || "",
          "error"
        );
        setBannerFile(null);
      }
    } catch (error) {
      console.error("Banner upload error:", error);
      Swal.fire(
        "Error",
        "Banner upload failed due to a network or server error.",
        "error"
      );
      setBannerFile(null);
    }
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent?._id) return;

    if (!formData.eventBanner) {
      Swal.fire(
        "Warning",
        "Please upload the event banner successfully or ensure a banner image is present.",
        "warning"
      );
      return;
    }

    try {
      await axiosSecure.patch(`/events/${selectedEvent._id}`, formData);

      Swal.fire("Updated!", "Event updated successfully.", "success");
      setIsEditModalOpen(false);
      setSelectedEvent(null);
      setBannerFile(null);
      refetch();
    } catch (error) {
      console.error("Event update error:", error);
      Swal.fire("Error", "Failed to update event.", "error");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-primary">My Managed Events</h2>
        <input
          type="text"
          placeholder="Search by event name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full md:w-72"
        />
      </div>

      <div className="overflow-x-auto rounded-box bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Event</th>
              <th>Date</th>
              <th>Location</th>
              <th>Category</th>
              <th>Fee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event, index) => (
              <tr key={event._id}>
                <td>{index + 1}</td>
                <td className="font-medium">
                  {event.eventName}

                  {event.status === "pending" && (
                    <span className="ml-2 badge badge-warning text-white">
                      Pending Approval
                    </span>
                  )}

                  {event.status === "rejected" && (
                    <span className="ml-2 badge badge-error text-white">
                      Rejected
                    </span>
                  )}
                </td>
                <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                <td>{event.location}</td>
                <td>{event.eventCategory}</td>
                <td>
                  {event.isPaid ? (
                    <span className="badge badge-success text-white">
                      BDT {event.eventFee}
                    </span>
                  ) : (
                    <span className="badge badge-info text-white">Free</span>
                  )}
                </td>
                <td className="flex gap-2">
                  <button
                    onClick={() => openModal(event._id, "view")}
                    className="btn btn-square hover:btn-primary hover:text-white"
                  >
                    <FaEye />
                  </button>
                  {event.status === "approved" && (
                    <>
                      <button
                        onClick={() => openModal(event._id, "edit")}
                        className="btn btn-square btn-warning hover:text-white"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteEvent(event._id, event.eventName)
                        }
                        className="btn btn-square btn-error hover:text-white"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {!filteredEvents.length && (
              <tr>
                <td colSpan="7" className="text-center py-8">
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-lg text-error font-medium">
                      You currently have no events created or hosted.
                    </p>
                    <Link
                      to="/dashboard/add-an-event"
                      className="btn btn-primary px-6 py-2 text-white font-semibold"
                    >
                      Create New Event
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isViewModalOpen && selectedEvent?._id && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4 text-primary">
              {selectedEvent.eventName}
            </h3>

            {selectedEvent.eventBanner && (
              <img
                src={selectedEvent.eventBanner}
                className="w-full h-64 object-cover rounded mb-5"
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p>
                <b>Club Name:</b> {selectedEvent.clubName}
              </p>
              <p>
                <b>Event Manager:</b> {selectedEvent.eventCreator.name}
              </p>
              <p>
                <b>Manager E-mail:</b> {selectedEvent.eventCreator.email}
              </p>
              <p>
                <b>Category:</b> {selectedEvent.eventCategory}
              </p>
              <p>
                <b>Location:</b> {selectedEvent.location}
              </p>
              <p>
                <b>Date:</b>
                {new Date(selectedEvent.eventDate).toLocaleDateString()}
              </p>
              <p>
                <b>Fee:</b>{" "}
                {selectedEvent.isPaid
                  ? `BDT ${selectedEvent.eventFee}`
                  : "Free"}
              </p>
              <p>
                <b>Max Attendees:</b> {selectedEvent.maxAttendees}
              </p>
            </div>

            <div className="mt-4">
              <b>Description:</b>
              <p>{selectedEvent.eventDescription}</p>
            </div>

            <div className="text-right mt-6">
              <button
                className="btn btn-error text-white"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedEvent(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedEvent?._id && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-primary">Edit Event</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label font-semibold">Event Name</label>
                <input
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleFormChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="label font-semibold">Category</label>
                <input
                  name="eventCategory"
                  value={formData.eventCategory}
                  onChange={handleFormChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="label font-semibold">Event Date</label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleFormChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="label font-semibold">Location</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="label font-semibold">Max Attendees</label>
                <input
                  type="number"
                  name="maxAttendees"
                  value={formData.maxAttendees}
                  onChange={handleFormChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="label font-semibold">Event Fee</label>
                <input
                  type="number"
                  name="eventFee"
                  value={formData.eventFee}
                  onChange={handleFormChange}
                  disabled={!formData.isPaid}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="flex items-center gap-3 mt-8">
                <input
                  type="checkbox"
                  name="isPaid"
                  checked={formData.isPaid}
                  onChange={handleFormChange}
                  className="checkbox checkbox-primary"
                />
                <span className="font-semibold">Paid Event</span>
              </div>

              <div className="md:col-span-2">
                <label className="label font-semibold">Event Banner</label>
                <input
                  type="file"
                  onChange={handleBannerChange}
                  className="file-input file-input-bordered w-full"
                />
                {formData.eventBanner && (
                  <img
                    src={formData.eventBanner}
                    className="mt-3 w-full max-h-60 object-cover rounded"
                  />
                )}
                {formData.eventBanner && (
                  <p className="text-sm text-success mt-1">
                    Current Banner Loaded. Select a new file to change it.
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="label font-semibold">Description</label>
                <textarea
                  name="eventDescription"
                  value={formData.eventDescription}
                  onChange={handleFormChange}
                  className="textarea textarea-bordered w-full"
                  rows="4"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="btn btn-error text-white"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedEvent(null);
                  setBannerFile(null);
                }}
              >
                Close
              </button>
              <button onClick={handleUpdateEvent} className="btn btn-primary">
                Update Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
