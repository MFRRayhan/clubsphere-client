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

  const query = new URLSearchParams(location.search);
  const isPaymentSuccess = query.get("payment") === "success";

  const { data: club, isLoading: isLoadingClub } = useQuery({
    queryKey: ["club", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/${id}`);
      return res.data;
    },
  });

  const {
    data: membershipStatus = { isMember: false },
    isLoading: isLoadingMembership,
    refetch: refetchMembershipStatus,
  } = useQuery({
    queryKey: ["membershipStatus", id, user?.email],
    queryFn: async () => {
      if (!user?.email) return { isMember: false };
      const res = await axiosSecure.get(`/memberships/check-status/${id}`);
      return res.data;
    },
    enabled: !!id && !!user?.email,
  });

  const isMember = membershipStatus.isMember || isPaymentSuccess;

  useEffect(() => {
    if (isPaymentSuccess && club && !membershipStatus.isMember) {
      const createMembership = async () => {
        if (!user) {
          console.error(
            "User object is null, cannot proceed with token refresh."
          );
          return;
        }

        try {
          await user.getIdToken(true);

          await axiosSecure.post("/memberships", {
            clubId: club._id,
            clubName: club.clubName,
            clubFee: club.membershipFee,
          });
          refetchMembershipStatus();
          Swal.fire({
            title: "Membership Purchased!",
            text: "Your Club Membership has been activated and added to 'My Clubs'.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Error creating membership:", error);
          const check = await refetchMembershipStatus();
          if (check.data.isMember) {
            Swal.fire({
              title: "Membership Purchased!",
              text: "Membership record failed to confirm immediately, but verification shows you are a member.",
              icon: "success",
              confirmButtonText: "OK",
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: "An error occurred while confirming membership. Please contact support.",
              icon: "error",
            });
          }
        }
      };

      createMembership();
    }
  }, [
    isPaymentSuccess,
    club,
    membershipStatus.isMember,
    refetchMembershipStatus,
    axiosSecure,
    user,
  ]);

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

  if (isLoadingClub || isLoadingMembership) {
    return (
      <div className="py-20 text-center text-lg font-medium">
        Loading club details...{" "}
      </div>
    );
  }

  return (
    <div className="my-10">
      {" "}
      <div className="container mx-auto px-4">
        {" "}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {" "}
          <figure>
            {" "}
            <img
              src={club.bannerImage}
              alt={club.clubName}
              className="w-full rounded-lg shadow"
            />{" "}
          </figure>{" "}
          <div className="space-y-4">
            {" "}
            <h2 className="text-3xl font-semibold">{club.clubName}</h2>
            <p className="text-gray-700">{club.description}</p>{" "}
            <p>
              <span className="font-semibold">Category: </span>
              {club.category}{" "}
            </p>{" "}
            <p>
              <span className="font-semibold">Location: </span>
              {club.location}{" "}
            </p>{" "}
            <p>
              {" "}
              <span className="font-semibold">Membership Fee: </span>$
              {club.membershipFee}{" "}
            </p>{" "}
            <p
              className={`font-semibold ${
                club.status === "approved"
                  ? "text-green-600"
                  : club.status === "pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              Status: {club.status}{" "}
            </p>{" "}
            <button
              disabled={isMember}
              onClick={() => setIsModalOpen(true)}
              className={`btn btn-primary ${
                isMember ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isMember ? "Membership Active" : "Buy Membership"}{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {isModalOpen && !isMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          {" "}
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg relative">
            {" "}
            <h3 className="text-xl font-bold mb-4">
              Review Membership Details{" "}
            </h3>{" "}
            <p>
              <strong>Club:</strong> {club.clubName}{" "}
            </p>{" "}
            <p>
              <strong>Location:</strong> {club.location}{" "}
            </p>{" "}
            <p>
              <strong>Membership Fee:</strong> ${club.membershipFee}{" "}
            </p>{" "}
            <div className="mt-4 p-3 border rounded bg-gray-50">
              <p className="font-semibold">User:</p> <p>{user?.displayName}</p>{" "}
              <p className="text-sm text-gray-600">{user?.email}</p>{" "}
            </div>{" "}
            <div className="flex justify-end gap-3 mt-6">
              {" "}
              <button
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel{" "}
              </button>{" "}
              <button className="btn btn-primary" onClick={handlePayNow}>
                Proceed to Payment{" "}
              </button>{" "}
            </div>{" "}
            <button
              className="absolute top-3 right-3 text-gray-600 text-xl"
              onClick={() => setIsModalOpen(false)}
            >
              &times;{" "}
            </button>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
};

export default ClubDetails;
