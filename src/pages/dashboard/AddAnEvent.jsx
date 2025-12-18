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
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const isPaid = watch("isPaid");

  // Fetch manager clubs
  useEffect(() => {
    axiosSecure
      .get("/my-clubs")
      .then((res) => setClubs(res.data))
      .catch((err) => console.error(err));
  }, [axiosSecure]);

  const handleEventForm = async (data) => {
    try {
      setLoading(true);

      const bannerFile = data.eventBanner[0];
      const imgUrl = await imgUpload(bannerFile);

      const eventInfo = {
        clubId: data.clubId,
        eventName: data.eventName,
        eventDescription: data.eventDescription,
        eventDate: data.eventDate,
        location: data.location,
        eventCategory: data.eventCategory,
        isPaid: data.isPaid === "paid",
        eventFee: data.isPaid === "paid" ? Number(data.eventFee) || 0 : 0,
        maxAttendees: Number(data.maxAttendees) || null,
        eventBanner: imgUrl,
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
        title: "Event Created!",
        text: "Your event has been created successfully and is pending admin approval.",
        confirmButtonText: "OK",
      });

      reset();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Create a New Event</h2>

      <form onSubmit={handleSubmit(handleEventForm)}>
        {/* Select Club */}
        <fieldset className="fieldset">
          <label className="label">Select Club</label>
          <select
            className="select w-full"
            defaultValue=""
            {...register("clubId", { required: true })}
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
            <p className="text-red-500 text-sm mt-1">
              Club selection is required.
            </p>
          )}
        </fieldset>

        {/* Event Name */}
        <fieldset className="fieldset">
          <label className="label">Event Name</label>
          <input
            type="text"
            className="input w-full"
            placeholder="Enter event name"
            {...register("eventName", { required: true })}
          />
          {errors.eventName && (
            <p className="text-red-500 text-sm mt-1">Event name is required.</p>
          )}
        </fieldset>

        {/* Event Date */}
        <fieldset className="fieldset">
          <label className="label">Event Date</label>
          <input
            type="date"
            className="input w-full"
            {...register("eventDate", { required: true })}
          />
          {errors.eventDate && (
            <p className="text-red-500 text-sm mt-1">Event date is required.</p>
          )}
        </fieldset>

        {/* Location */}
        <fieldset className="fieldset">
          <label className="label">Location</label>
          <input
            type="text"
            className="input w-full"
            placeholder="City / Area"
            {...register("location", { required: true })}
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">Location is required.</p>
          )}
        </fieldset>

        {/* Category */}
        <fieldset className="fieldset">
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
            <option>Music</option>
            <option>Arts</option>
            <option>Others</option>
          </select>
          {errors.eventCategory && (
            <p className="text-red-500 text-sm mt-1">Category is required.</p>
          )}
        </fieldset>

        {/* Description */}
        <fieldset className="fieldset">
          <label className="label">Description</label>
          <textarea
            className="textarea w-full"
            placeholder="Write event description"
            {...register("eventDescription", { required: true })}
          />
          {errors.eventDescription && (
            <p className="text-red-500 text-sm mt-1">
              Description is required.
            </p>
          )}
        </fieldset>

        {/* Event Type */}
        <fieldset className="fieldset">
          <label className="label">Event Type</label>
          <select className="select w-full" {...register("isPaid")}>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </fieldset>

        {/* Event Fee */}
        {isPaid === "paid" && (
          <fieldset className="fieldset">
            <label className="label">Event Fee</label>
            <input
              type="number"
              className="input w-full"
              placeholder="Enter fee amount"
              {...register("eventFee")}
            />
          </fieldset>
        )}

        {/* Max Attendees */}
        <fieldset className="fieldset">
          <label className="label">Maximum Attendees (optional)</label>
          <input
            type="number"
            className="input w-full"
            placeholder="e.g. 50"
            {...register("maxAttendees")}
          />
        </fieldset>

        {/* Banner */}
        <fieldset className="fieldset">
          <label className="label">Event Banner</label>
          <input
            type="file"
            className="file-input w-full"
            {...register("eventBanner", { required: true })}
          />
          {errors.eventBanner && (
            <p className="text-red-500 text-sm mt-1">
              Event banner is required.
            </p>
          )}
        </fieldset>

        <button className="btn btn-neutral mt-4 w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default AddAnEvent;
