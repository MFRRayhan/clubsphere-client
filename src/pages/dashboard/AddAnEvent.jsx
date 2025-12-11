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

  // Fetch clubs for this manager
  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/my-clubs/${user.email}`)
        .then((res) => setClubs(res.data))
        .catch((err) => console.error(err));
    }
  }, [user, axiosSecure]);

  const handleEventForm = async (data) => {
    try {
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

      const { data: result } = await axiosSecure.post("/events", eventInfo);
      console.log(result);

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
        <fieldset className="fieldset mb-4">
          <label className="label">Select Club</label>
          <select
            className="select w-full"
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
        <fieldset className="fieldset mb-4">
          <label className="label">Event Name</label>
          <input
            type="text"
            className="input w-full"
            placeholder="Event Name"
            {...register("eventName", { required: true })}
          />
          {errors.eventName && (
            <p className="text-red-500 mt-1">Event Name is required</p>
          )}
        </fieldset>

        {/* Event Date */}
        <fieldset className="fieldset mb-4">
          <label className="label">Event Date</label>
          <input
            type="date"
            className="input w-full"
            {...register("eventDate", { required: true })}
          />
          {errors.eventDate && (
            <p className="text-red-500 mt-1">Event Date is required</p>
          )}
        </fieldset>

        {/* Location */}
        <fieldset className="fieldset mb-4">
          <label className="label">Location</label>
          <input
            type="text"
            className="input w-full"
            placeholder="City/Area"
            {...register("location", { required: true })}
          />
          {errors.location && (
            <p className="text-red-500 mt-1">Location is required</p>
          )}
        </fieldset>

        {/* Category */}
        <fieldset className="fieldset mb-4">
          <label className="label">Category</label>
          <select
            className="select w-full"
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
        <fieldset className="fieldset mb-4">
          <label className="label">Description</label>
          <textarea
            className="textarea w-full"
            placeholder="Event Description"
            {...register("eventDescription", { required: true })}
          />
          {errors.eventDescription && (
            <p className="text-red-500 mt-1">Description is required</p>
          )}
        </fieldset>

        {/* Paid or Free */}
        <fieldset className="fieldset mb-4">
          <label className="label">Event Type</label>
          <select className="select w-full" {...register("isPaid")}>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </fieldset>

        {/* Event Fee */}
        <fieldset className="fieldset mb-4">
          <label className="label">Event Fee (if paid)</label>
          <input
            type="number"
            className="input w-full"
            placeholder="Event Fee"
            {...register("eventFee")}
          />
        </fieldset>

        {/* Max Attendees */}
        <fieldset className="fieldset mb-4">
          <label className="label">Maximum Attendees (optional)</label>
          <input
            type="number"
            className="input w-full"
            placeholder="50"
            {...register("maxAttendees")}
          />
        </fieldset>

        {/* Banner */}
        <fieldset className="fieldset mb-4">
          <label className="label">Event Banner</label>
          <input
            type="file"
            className="file-input w-full"
            {...register("eventBanner", { required: true })}
          />
          {errors.eventBanner && (
            <p className="text-red-500 mt-1">Event banner is required</p>
          )}
        </fieldset>

        <button type="submit" className="btn btn-primary w-full mt-4">
          Create Event
        </button>
      </form>
    </div>
  );
};

export default AddAnEvent;
