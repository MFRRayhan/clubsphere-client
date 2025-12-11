import React from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

const FeaturedClubs = () => {
  const axiosSecure = useAxiosSecure();

  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["recent-clubs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/clubs");
      return res.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;

  const recentSix = [...clubs].reverse().slice(0, 6);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Featured Clubs</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentSix.map((club) => (
          <div key={club._id} className="card shadow-md p-4 border">
            <img
              src={club.bannerImage}
              alt={club.clubName}
              className="w-full h-48 object-cover rounded"
            />

            <h3 className="text-xl font-bold mt-3">{club.clubName}</h3>
            <p className="text-gray-600">{club.category}</p>

            <Link to={`/clubs/${club._id}`}>
              <button className="btn btn-primary mt-3">View Details</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedClubs;
