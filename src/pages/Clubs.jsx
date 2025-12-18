import React, { useState } from "react";
import { Link } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loader from "../components/Loader";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

const Clubs = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["clubs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/clubs");
      return res.data;
    },
  });

  const approvedClubs = clubs.filter((club) => club.status === "approved");

  const filteredClubs = approvedClubs.filter((club) =>
    club.clubName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="px-6 py-16 bg-base-100">
      <div className="max-w-7xl mx-auto">
        {/* Title + Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <h2 className="text-3xl font-bold">Explore Clubs</h2>

          <form className="relative w-full md:w-80">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-2" />
            <input
              type="text"
              id="clubSearch"
              placeholder="Search clubs by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </form>
        </div>

        {/* Clubs Grid */}
        {filteredClubs.length === 0 ? (
          <p className="text-center text-gray-500">No clubs found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClubs.map((club) => (
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

                  <p className="flex gap-1 items-center text-sm text-gray-700">
                    <FaLocationDot />
                    {club.location}
                  </p>

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
        )}
      </div>
    </section>
  );
};

export default Clubs;
