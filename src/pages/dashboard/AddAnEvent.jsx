import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { imgUpload } from "../../utils";

const AddAnEvent = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [clubs, setClubs] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch manager's clubs
  useEffect(() => {
    axiosSecure
      .get("/my-clubs")
      .then((res) => setClubs(res.data))
      .catch((err) => console.error(err));
  }, [axiosSecure]);

  const handleEventForm = async (data) => {
    try {
      // Upload event banner image
      const eventBannerImg = data.eventBanner[0];
      const imgUrl = await imgUpload(eventBannerImg);

      const eventInfo = {
        clubId: data.clubId,
        eventName: data.eventName,
        eventDescription: data.eventDescription,
        eventDate: data.eventDate,
        location: data.location,
        isPaid: data.isPaid === "paid",
        eventFee: data.eventFee || 0,
        maxAttendees: data.maxAttendees || null,
        eventBanner: imgUrl,
        eventCategory: data.eventCategory,
        createdAt: new Date().toISOString(),
        eventCreator: {
          name: user?.displayName,
          email: user?.email,
          image: user?.photoURL,
        },
      };

      await axiosSecure.post("/events", eventInfo);

      Swal.fire({
        icon: "success",
        title: "Event Created",
        text: "Your event has been successfully created!",
        timer: 2500,
        showConfirmButton: false,
      });

      reset();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Event Creation Failed",
        text: error.message || "Something went wrong. Please try again!",
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Add New Event</h2>

      <form onSubmit={handleSubmit(handleEventForm)}>
        {/* Select Club */}
        <fieldset className="mb-4">
          <label className="block mb-1 font-medium">Select Club</label>
          <select
            className="w-full border rounded px-3 py-2"
            {...register("clubId", { required: true })}
            defaultValue=""
          >
            <option value="" disabled>
              Select your club
            </option>
            {clubs.map((club) => (
              <option key={club._id} value={club._id}>
                {club.clubName}
              </option>
            ))}
          </select>
          {errors.clubId && (
            <p className="text-red-500 mt-1">Club selection is required</p>
          )}
        </fieldset>

        {/* Event Name */}
        <fieldset className="mb-4">
          <label className="block mb-1 font-medium">Event Name</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="Event Name"
            {...register("eventName", { required: true })}
          />
          {errors.eventName && (
            <p className="text-red-500 mt-1">Event Name is required</p>
          )}
        </fieldset>

        {/* Event Date */}
        <fieldset className="mb-4">
          <label className="block mb-1 font-medium">Event Date</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            {...register("eventDate", { required: true })}
          />
          {errors.eventDate && (
            <p className="text-red-500 mt-1">Event Date is required</p>
          )}
        </fieldset>

        {/* Location */}
        <fieldset className="mb-4">
          <label className="block mb-1 font-medium">Location</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="City/Area"
            {...register("location", { required: true })}
          />
          {errors.location && (
            <p className="text-red-500 mt-1">Location is required</p>
          )}
        </fieldset>

        {/* Category */}
        <fieldset className="mb-4">
          <label className="block mb-1 font-medium">Category</label>
          <select
            className="w-full border rounded px-3 py-2"
            defaultValue=""
            {...register("eventCategory", { required: true })}
          >
            <option value="" disabled>
              Pick a category
            </option>
            <option>Photography</option>
            <option>Sports</option>
            <option>Tech</option>
          </select>
          {errors.eventCategory && (
            <p className="text-red-500 mt-1">Category is required</p>
          )}
        </fieldset>

        {/* Description */}
        <fieldset className="mb-4">
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="Event Description"
            {...register("eventDescription", { required: true })}
          />
          {errors.eventDescription && (
            <p className="text-red-500 mt-1">Description is required</p>
          )}
        </fieldset>

        {/* Event Type */}
        <fieldset className="mb-4">
          <label className="block mb-1 font-medium">Event Type</label>
          <select
            className="w-full border rounded px-3 py-2"
            {...register("isPaid")}
          >
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </fieldset>

        {/* Event Fee */}
        <fieldset className="mb-4">
          <label className="block mb-1 font-medium">Event Fee (if paid)</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            placeholder="Event Fee"
            {...register("eventFee")}
          />
        </fieldset>

        {/* Max Attendees */}
        <fieldset className="mb-4">
          <label className="block mb-1 font-medium">
            Maximum Attendees (optional)
          </label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            placeholder="50"
            {...register("maxAttendees")}
          />
        </fieldset>

        {/* Banner */}
        <fieldset className="mb-4">
          <label className="block mb-1 font-medium">Event Banner</label>
          <input
            type="file"
            className="w-full border rounded px-3 py-2"
            {...register("eventBanner", { required: true })}
          />
          {errors.eventBanner && (
            <p className="text-red-500 mt-1">Event banner is required</p>
          )}
        </fieldset>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default AddAnEvent;
