import React from "react";
import { Link } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const FeaturedClubs = () => {
  const axiosSecure = useAxiosSecure();

  const { data: clubs = [] } = useQuery({
    queryKey: ["clubs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/clubs");
      return res.data;
    },
  });

  const approvedClubs = clubs.filter((club) => club.status === "approved");
  const recentClubs = approvedClubs.slice(0, 6);

  return (
    <div className="px-6 py-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Recent Clubs</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentClubs.map((club) => (
          <div
            key={club._id}
            className="bg-white shadow-md rounded-lg overflow-hidden border"
          >
            <img
              src={club.bannerImage}
              alt={club.clubName}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-2">
              <h3 className="text-xl font-semibold">{club.clubName}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {club.description}
              </p>
              <p className="text-sm">
                <span className="font-medium">Category:</span> {club.category}
              </p>
              <p className="text-sm">
                <span className="font-medium">Location:</span> {club.location}
              </p>
              <p className="text-sm">
                <span className="font-medium">Membership Fee:</span> $
                {club.membershipFee}
              </p>
              <p className="text-sm font-medium text-green-600">
                Status: {club.status}
              </p>
              <Link
                to={`/clubs/${club._id}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedClubs;
