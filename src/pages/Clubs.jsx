import React from "react";
import { Link } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

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
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <section className="bg-base-200 py-14">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-2">Explore Clubs</h2>
        </div>

        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {approvedClubs.map((club) => (
            <div
              key={club._id}
              className="group bg-white rounded overflow-hidden border border-gray-300 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="overflow-hidden">
                <img
                  src={club.bannerImage}
                  alt={club.clubName}
                  className="h-52 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  {club.clubName}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {club.description}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="badge badge-outline rounded border border-gray-300">
                    {club.category}
                  </span>
                  <span className="badge badge-outline rounded border border-gray-300">
                    {club.location}
                  </span>
                </div>

                {/* CTA */}
                <Link
                  to={`/clubs/${club._id}`}
                  className="inline-flex items-center justify-center w-full mt-3 btn btn-primary"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {approvedClubs.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No approved clubs available at the moment.
          </p>
        )}
      </div>
    </section>
  );
};

export default Clubs;
