import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";

const ClubDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if payment success
  const query = new URLSearchParams(location.search);
  const isPaid = query.get("payment") === "success";

  useEffect(() => {
    if (isPaid) {
      Swal.fire({
        title: "Membership Purchased!",
        text: "Your Club Membership has been activated.",
        icon: "success",
        confirmButtonText: "OK",
      });
    }
  }, [isPaid]);

  // Fetch single club
  const { data: club, isLoading } = useQuery({
    queryKey: ["club", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/${id}`);
      return res.data;
    },
  });

  // Handle Membership Payment
  const handlePayNow = async () => {
    try {
      const { data } = await axiosSecure.post(
        "/create-club-membership-session",
        { club, user }
      );

      window.location.href = data.url;
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Payment Failed!",
        text: "Something went wrong.",
        icon: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-lg font-medium">
        Loading club details...
      </div>
    );
  }

  return (
    <div className="my-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Image */}
          <figure>
            <img
              src={club.bannerImage}
              alt={club.clubName}
              className="w-full rounded-lg shadow"
            />
          </figure>

          {/* Right Content */}
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold">{club.clubName}</h2>

            <p className="text-gray-700">{club.description}</p>

            <p>
              <span className="font-semibold">Category: </span>
              {club.category}
            </p>

            <p>
              <span className="font-semibold">Location: </span>
              {club.location}
            </p>

            <p>
              <span className="font-semibold">Membership Fee: </span>$
              {club.membershipFee}
            </p>

            <p
              className={`font-semibold ${
                club.status === "approved"
                  ? "text-green-600"
                  : club.status === "pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              Status: {club.status}
            </p>

            <button
              disabled={isPaid}
              onClick={() => setIsModalOpen(true)}
              className={`btn btn-primary ${
                isPaid ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isPaid ? "Membership Active" : "Buy Membership"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && !isPaid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg relative">
            <h3 className="text-xl font-bold mb-4">
              Review Membership Details
            </h3>

            {/* Club Info */}
            <p>
              <strong>Club:</strong> {club.clubName}
            </p>
            <p>
              <strong>Location:</strong> {club.location}
            </p>
            <p>
              <strong>Membership Fee:</strong> ${club.membershipFee}
            </p>

            {/* User Info */}
            <div className="mt-4 p-3 border rounded bg-gray-50">
              <p className="font-semibold">User:</p>
              <p>{user?.displayName}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>

              <button className="btn btn-primary" onClick={handlePayNow}>
                Proceed to Payment
              </button>
            </div>

            {/* Close Icon */}
            <button
              className="absolute top-3 right-3 text-gray-600 text-xl"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubDetails;
