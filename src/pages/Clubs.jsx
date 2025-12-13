import React from "react";
import { Link } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loader from "../components/Loader";
import { FaLocationDot } from "react-icons/fa6";

const Clubs = () => {
  const axiosSecure = useAxiosSecure();

  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["clubs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/clubs");
      return res.data;
    },
  });

  const approvedClubs = clubs.filter((club) => club.status === "approved");

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="px-6 py-16 bg-base-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Explore Clubs</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {approvedClubs.map((club) => (
            <div
              key={club._id}
              className="group bg-white rounded overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-gray-300 p-4"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={club.bannerImage}
                  alt={club.clubName}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-3 left-3 bg-primary text-white text-xs px-3 py-1 rounded-full">
                  {club.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <h3 className="text-xl font-semibold">{club.clubName}</h3>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {club.description}
                </p>

                <div className="text-sm text-gray-700 space-y-1">
                  <p className="flex gap-1 items-center">
                    <FaLocationDot />
                    {club.location}
                  </p>
                </div>

                {/* Button */}
                <Link
                  to={`/clubs/${club._id}`}
                  className="btn btn-primary w-full mt-4"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clubs;
