import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { imgUpload } from "../../utils";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AddAnEvent = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const {
    register,
    handleSubmit,
    reset,
    // watch,
    formState: { errors },
  } = useForm();

  const handleEventForm = async (data) => {
    const { eventBanner } = data;
    const eventBannerImg = eventBanner[0];

    // try {
    //   const imgUrl = await imgUpload(eventBannerImg);

    //   const eventInfo = {
    //     eventBanner: imgUrl,
    //     eventCategory,
    //     eventDescription,
    //     eventName,
    //     location,
    //     eventCreator: {
    //       name: user?.displayName,
    //       email: user?.email,
    //       image: user?.photoURL,
    //     },
    //   };

    //   const { data } = axiosSecure.post("/events", eventInfo);
    //   console.log(data);
    // } catch (error) {
    //   console.log(error);
    // }

    imgUpload(eventBannerImg)
      .then((imgUrl) => {
        const eventInfo = {
          clubId: data.clubId,
          title: data.eventName,
          description: data.eventDescription,
          eventDate: data.eventDate,
          location: data.location,
          isPaid: data.isPaid === "paid",
          eventFee: data.eventFee || 0,
          maxAttendees: data.maxAttendees || null,
          eventBanner: imgUrl,
          createdAt: new Date().toISOString(),
          eventCreator: {
            name: user?.displayName,
            email: user?.email,
            image: user?.photoURL,
          },
        };

        const { data: result } = axiosSecure.post("/events", eventInfo);
        console.log(result);
        reset();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleEventForm)}>
        {/* clubId */}
        <fieldset className="fieldset">
          <label className="label">Club ID</label>
          <input
            type="text"
            className="input"
            placeholder="Club ID"
            {...register("clubId", { required: true })}
          />
          {errors.clubId && <p className="text-red-500">Club ID is required</p>}
        </fieldset>

        {/* Event Name */}
        <fieldset className="fieldset">
          <label className="label">Event Name</label>
          <input
            type="text"
            className="input"
            placeholder="Event Name"
            {...register("eventName", { required: true })}
          />
          {errors.eventName && (
            <p className="text-red-500">Event Name is required</p>
          )}
        </fieldset>

        {/* Event Date */}
        <fieldset className="fieldset">
          <label className="label">Event Date</label>
          <input
            type="date"
            className="input"
            {...register("eventDate", { required: true })}
          />
          {errors.eventDate && (
            <p className="text-red-500">Event Date is required</p>
          )}
        </fieldset>

        {/* Location */}
        <fieldset className="fieldset">
          <label className="label">Location</label>
          <input
            type="text"
            className="input"
            placeholder="City/Area"
            {...register("location", { required: true })}
          />
          {errors.location && (
            <p className="text-red-500">Location is required</p>
          )}
        </fieldset>

        {/* Category */}
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Category</legend>
          <select
            className="select"
            defaultValue="Pick a category"
            {...register("eventCategory", { required: true })}
          >
            <option disabled>Pick a category</option>
            <option>Photography</option>
            <option>Sports</option>
            <option>Tech</option>
          </select>
          {errors.eventCategory && (
            <p className="text-red-500">Category is required</p>
          )}
        </fieldset>

        {/* Description */}
        <fieldset className="fieldset">
          <label className="label">Description</label>
          <textarea
            className="textarea"
            placeholder="Event Description"
            {...register("eventDescription", { required: true })}
          ></textarea>
          {errors.eventDescription && (
            <p className="text-red-500">Description is required</p>
          )}
        </fieldset>

        {/* Paid or Free */}
        <fieldset className="fieldset">
          <legend className="label">Event Type</legend>
          <select
            className="select"
            defaultValue="free"
            {...register("isPaid")}
          >
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </fieldset>

        {/* Event Fee (only if paid) */}
        <fieldset className="fieldset">
          <label className="label">Event Fee (if paid)</label>
          <input
            type="number"
            className="input"
            placeholder="Event Fee"
            {...register("eventFee")}
          />
        </fieldset>

        {/* Max Attendees */}
        <fieldset className="fieldset">
          <label className="label">Maximum Attendees (optional)</label>
          <input
            type="number"
            className="input"
            placeholder="50"
            {...register("maxAttendees")}
          />
        </fieldset>

        {/* Banner */}
        <fieldset className="fieldset">
          <input
            type="file"
            className="file-input"
            {...register("eventBanner", { required: true })}
          />
          {errors.eventBanner && (
            <p className="text-red-500">Event banner is required</p>
          )}
        </fieldset>

        <button className="btn btn-neutral mt-4">Create Event</button>
      </form>
    </div>
  );
};

export default AddAnEvent;
