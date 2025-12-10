import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import SocialLogin from "../components/SocialLogin";
import useAxiosSecure from "../hooks/useAxiosSecure";
import axios from "axios";

const Register = () => {
  const { registerUser, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleRegistration = (data) => {
    const profileImg = data.photo[0];
    const from = location.state?.from?.pathname || "/";

    registerUser(data.email, data.password)
      .then(() => {
        const formData = new FormData();
        formData.append("image", profileImg);

        const img_API_URL = `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_image_host_key
        }`;

        axios.post(img_API_URL, formData).then((res) => {
          const photoURL = res.data.data.url;

          const userInfo = {
            email: data.email,
            displayName: data.name,
            photoURL,
          };

          // Save user in DB
          axiosSecure.post("/users", userInfo).then((res) => {
            if (res.data.insertedId) console.log("User saved to DB");
          });

          // Update Firebase profile
          updateUserProfile({ displayName: data.name, photoURL })
            .then(() => {
              reset();
              navigate(from, { replace: true });
            })
            .catch((err) => console.error(err));
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="card w-full max-w-md shadow-xl bg-base-100 p-6">
        <h2 className="text-3xl font-bold text-primary mb-3 text-center">
          Create an Account
        </h2>
        <p className="text-gray-500 text-center mb-5">
          Register with ClubSphere
        </p>

        <form onSubmit={handleSubmit(handleRegistration)}>
          <fieldset className="space-y-4">
            {/* Name */}
            <div className="form-control w-full">
              <label className="label">Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Your Name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Photo */}
            <div className="form-control w-full">
              <label className="label">Photo</label>
              <input
                type="file"
                className="file-input w-full"
                {...register("photo", { required: "Photo is required" })}
              />
              {errors.photo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.photo.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="form-control w-full">
              <label className="label">Email</label>
              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="Your Email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="form-control w-full">
              <label className="label">Password</label>
              <input
                type="password"
                className="input input-bordered w-full"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                    message:
                      "Password must have uppercase, lowercase, number & special character",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button className="btn btn-primary w-full mt-3">Register</button>

            <p className="text-center mt-3">
              Already have an account?{" "}
              <Link
                to="/login"
                state={location.state}
                className="text-primary font-semibold"
              >
                Login
              </Link>
            </p>
          </fieldset>
        </form>

        <div className="divider">OR</div>
        <SocialLogin type="register" />
      </div>
    </div>
  );
};

export default Register;
