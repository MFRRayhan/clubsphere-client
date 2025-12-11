import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const BeAManager = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    axiosSecure
      .post("/club-managers", data)
      .then((res) => {
        if (res.data.insertedId) {
          Swal.fire({
            icon: "success",
            title: "Application Submitted",
            text: "We will review your manager application soon.",
            timer: 2500,
            showConfirmButton: false,
          });
        }
      })
      .catch((err) => console.log(err));

    reset();
  };

  // Static example regions & districts (You can load from DB later)
  const regions = ["Dhaka", "Chattogram", "Sylhet", "Khulna", "Rajshahi"];
  const districts = {
    Dhaka: ["Mirpur", "Uttara", "Gulshan"],
    Chattogram: ["Pahartali", "Agrabad"],
    Sylhet: ["Zindabazar", "Bondor"],
    Khulna: ["Sonadanga", "Khalishpur"],
    Rajshahi: ["Boalia", "Rajpara"],
  };

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="font-black text-secondary text-4xl md:text-5xl mb-6">
          Be A Club Manager
        </h2>

        <p className="text-gray-400 max-w-2xl mb-10">
          Become a manager, create your own local club, organize events, and
          lead your community with confidence. Fill out the form below to get
          started.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="border-t border-gray-300 pt-5 mt-5">
            <h3 className="text-secondary text-lg font-semibold">
              Tell Us About Yourself
            </h3>
          </div>

          <div className="pt-5 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT FORM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
              <fieldset className="fieldset">
                <label className="label">Full Name</label>
                <input
                  type="text"
                  className="input w-full"
                  defaultValue={user?.displayName}
                  placeholder="Full Name"
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <p className="text-red-500">Name is required</p>
                )}
              </fieldset>

              <fieldset className="fieldset">
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input w-full"
                  defaultValue={user?.email}
                  placeholder="Email"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <p className="text-red-500">Email is required</p>
                )}
              </fieldset>

              <fieldset className="fieldset">
                <label className="label">Contact Number</label>
                <input
                  type="number"
                  className="input w-full"
                  placeholder="Contact Number"
                  {...register("contact", { required: true })}
                />
                {errors.contact && (
                  <p className="text-red-500">Contact is required</p>
                )}
              </fieldset>

              <fieldset className="fieldset">
                <label className="label">Club Name</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Club Name"
                  {...register("clubName", { required: true })}
                />
                {errors.clubName && (
                  <p className="text-red-500">Club Name is required</p>
                )}
              </fieldset>

              <fieldset className="fieldset">
                <label className="label">Region</label>
                <select
                  defaultValue=""
                  className="select w-full"
                  {...register("region", { required: true })}
                >
                  <option value="" disabled>
                    Select Region
                  </option>

                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <p className="text-red-500">Region is required</p>
                )}
              </fieldset>

              <fieldset className="fieldset">
                <label className="label">District</label>
                <select
                  defaultValue=""
                  className="select w-full"
                  {...register("district", { required: true })}
                >
                  <option value="" disabled>
                    Select District
                  </option>
                  {regions.flatMap((r) =>
                    districts[r].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))
                  )}
                </select>
                {errors.district && (
                  <p className="text-red-500">District is required</p>
                )}
              </fieldset>

              <fieldset className="fieldset md:col-span-2">
                <label className="label">Short Description</label>
                <textarea
                  className="textarea w-full"
                  placeholder="Describe your club vision & purpose"
                  rows={3}
                  {...register("description", { required: true })}
                ></textarea>
                {errors.description && (
                  <p className="text-red-500">Description is required</p>
                )}
              </fieldset>

              <fieldset className="fieldset col-span-2">
                <input
                  type="submit"
                  value="Apply As a Manager"
                  className="btn btn-primary w-full text-secondary"
                />
              </fieldset>
            </div>

            {/* RIGHT IMAGE */}
            <div className="flex justify-center items-center">
              <img
                src=""
                alt="Manager"
                className="max-w-xs md:max-w-sm lg:max-w-md"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BeAManager;
