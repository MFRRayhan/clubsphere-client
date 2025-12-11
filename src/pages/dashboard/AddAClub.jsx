import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { imgUpload } from "../../utils";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AddAClub = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleClubForm = async (data) => {
    try {
      const bannerFile = data.bannerImage[0];

      // 1. Upload image to ImgBB
      const imgUrl = await imgUpload(bannerFile);

      // 2. Prepare club object
      const clubInfo = {
        clubName: data.clubName,
        description: data.description,
        category: data.category,
        location: data.location,
        bannerImage: imgUrl,
        membershipFee: Number(data.membershipFee) || 0,
        status: "pending",
        managerEmail: user?.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 3. Save to database
      const res = await axiosSecure.post("/clubs", clubInfo);

      console.log("Club created:", res.data);

      // 4. Reset form on success
      reset();
    } catch (err) {
      console.log("Error creating club:", err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleClubForm)}>
        {/* Club Name */}
        <fieldset className="fieldset">
          <label className="label">Club Name</label>
          <input
            type="text"
            className="input"
            placeholder="Enter club name"
            {...register("clubName", { required: true })}
          />
          {errors.clubName && (
            <p className="text-red-500">Club name is required</p>
          )}
        </fieldset>

        {/* Description */}
        <fieldset className="fieldset">
          <label className="label">Description</label>
          <textarea
            className="textarea"
            placeholder="Write a short description"
            {...register("description", { required: true })}
          ></textarea>
          {errors.description && (
            <p className="text-red-500">Description is required</p>
          )}
        </fieldset>

        {/* Category */}
        <fieldset className="fieldset">
          <label className="label">Category</label>
          <select
            className="select"
            defaultValue="Pick a Category"
            {...register("category", { required: true })}
          >
            <option disabled>Pick a Category</option>
            <option>Photography</option>
            <option>Sports</option>
            <option>Tech</option>
            <option>Music</option>
            <option>Arts</option>
            <option>Others</option>
          </select>
          {errors.category && (
            <p className="text-red-500">Category is required</p>
          )}
        </fieldset>

        {/* Location */}
        <fieldset className="fieldset">
          <label className="label">Location (City/Area)</label>
          <input
            type="text"
            className="input"
            placeholder="Area, City"
            {...register("location", { required: true })}
          />
          {errors.location && (
            <p className="text-red-500">Location is required</p>
          )}
        </fieldset>

        {/* Membership Fee */}
        <fieldset className="fieldset">
          <label className="label">Membership Fee</label>
          <input
            type="number"
            className="input"
            placeholder="0 for free"
            {...register("membershipFee")}
          />
        </fieldset>

        {/* Banner Image */}
        <fieldset className="fieldset">
          <label className="label">Club Banner</label>
          <input
            type="file"
            className="file-input"
            {...register("bannerImage", { required: true })}
          />
          {errors.bannerImage && (
            <p className="text-red-500">Banner image is required</p>
          )}
        </fieldset>

        <button className="btn btn-neutral mt-4">Create Club</button>
      </form>
    </div>
  );
};

export default AddAClub;
