import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { imgUpload } from "../../utils";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AddAClub = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleClubForm = async (data) => {
    try {
      setLoading(true);

      const bannerFile = data.bannerImage[0];

      // 1. Upload banner
      const imgUrl = await imgUpload(bannerFile);

      // 2. Prepare club data
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

      // 3. Save to DB
      const res = await axiosSecure.post("/clubs", clubInfo);

      if (res.data.insertedId) {
        Swal.fire({
          title: "Club Submitted!",
          text: "Your club is awaiting admin approval.",
          icon: "success",
          confirmButtonText: "OK",
        });
        reset();
      } else {
        Swal.fire({
          title: "Submission Failed!",
          text: "Please try again.",
          icon: "error",
        });
      }
    } catch (err) {
      console.log("Error creating club:", err);
      Swal.fire({
        title: "Something went wrong!",
        text: "Please try again.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Create a New Club</h2>

      <form onSubmit={handleSubmit(handleClubForm)}>
        {/* Club Name */}
        <fieldset className="fieldset">
          <label className="label">Club Name</label>
          <input
            type="text"
            className="input w-full"
            placeholder="Enter club name"
            {...register("clubName", { required: true })}
          />
          {errors.clubName && (
            <p className="text-red-500 text-sm mt-1">Club name is required.</p>
          )}
        </fieldset>

        {/* Description */}
        <fieldset className="fieldset">
          <label className="label">Description</label>
          <textarea
            className="textarea w-full"
            placeholder="Write a short description"
            {...register("description", { required: true })}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              Description is required.
            </p>
          )}
        </fieldset>

        {/* Category */}
        <fieldset className="fieldset">
          <label className="label">Category</label>
          <select
            className="select w-full"
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
            <p className="text-red-500 text-sm mt-1">Category is required.</p>
          )}
        </fieldset>

        {/* Location */}
        <fieldset className="fieldset">
          <label className="label">Location (City/Area)</label>
          <input
            type="text"
            className="input w-full"
            placeholder="Area, City"
            {...register("location", { required: true })}
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">Location is required.</p>
          )}
        </fieldset>

        {/* Membership Fee */}
        <fieldset className="fieldset">
          <label className="label">Membership Fee</label>
          <input
            type="number"
            className="input w-full"
            placeholder="0 for free"
            {...register("membershipFee")}
          />
        </fieldset>

        {/* Banner Image */}
        <fieldset className="fieldset">
          <label className="label">Club Banner</label>
          <input
            type="file"
            className="file-input w-full"
            {...register("bannerImage", { required: true })}
          />
          {errors.bannerImage && (
            <p className="text-red-500 text-sm mt-1">
              Banner image is required.
            </p>
          )}
        </fieldset>

        <button className="btn btn-neutral mt-4 w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Club"}
        </button>
      </form>
    </div>
  );
};

export default AddAClub;
