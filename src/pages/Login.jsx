import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import SocialLogin from "../components/SocialLogin";

const Login = () => {
  const { signInUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleSignIn = (data) => {
    const from = location.state?.from?.pathname || "/";
    signInUser(data.email, data.password)
      .then((result) => {
        console.log(result.user);
        reset();
        navigate(from, { replace: true });
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="card w-full max-w-md shadow-xl bg-base-100 p-6">
        <h2 className="text-3xl font-bold text-primary mb-3 text-center">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-center mb-5">Login with ClubSphere</p>

        <form onSubmit={handleSubmit(handleSignIn)}>
          <fieldset className="space-y-4">
            {/* Email */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="Enter your email"
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
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center">
              <Link to="/forgot-password" className="link link-hover text-sm">
                Forgot password?
              </Link>
            </div>

            <button className="btn btn-primary w-full mt-3">Login</button>

            <p className="text-center mt-3">
              Don't have an account?{" "}
              <Link
                to="/register"
                state={location.state}
                className="text-primary font-semibold"
              >
                Register
              </Link>
            </p>
          </fieldset>
        </form>

        <div className="divider">OR</div>
        <SocialLogin type="login" />
      </div>
    </div>
  );
};

export default Login;
