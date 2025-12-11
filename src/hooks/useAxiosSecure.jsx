import axios from "axios";
import React, { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosSecure = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    // Intercept Request
    const reqInterceptors = axiosSecure.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${user?.accessToken}`;
      return config;
    });
    // Intercept Response
    const resInterceptors = axiosSecure.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.log(error);

        const statusCode = error.response?.status;
        if (statusCode === 401 || statusCode === 403) {
          logout().then(() => {
            navigate("/login");
          });
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptors);
      axiosSecure.interceptors.response.eject(resInterceptors);
    };
  }, [user, logout, navigate]);
  return axiosSecure;
};

export default useAxiosSecure;
