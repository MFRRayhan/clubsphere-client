import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import Loader from "../components/Loader";
import { FaBuilding, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";

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
        if (!user) return;

        try {
          await user.getIdToken(true);

          await axiosSecure.post("/memberships", {
            clubId: club._id,
            clubName: club.clubName,
            clubFee: Number(club.membershipFee),
          });

          const transactionIdFromUrl =
            query.get("session_id") || `TID_CLUB_${Date.now()}`;
          const paymentRecord = {
            amount: club.membershipFee,
            transactionId: transactionIdFromUrl,
            clubId: club._id,
            clubName: club.clubName,
            paymentType: "Membership Fee",
          };

          await axiosSecure.post("/payments", paymentRecord);

          refetchMembershipStatus();
          Swal.fire({
            title: "Membership Purchased!",
            text: "Your Club Membership has been activated and payment recorded.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Error creating membership:", error);
          const check = await refetchMembershipStatus();
          if (check.data.isMember) {
            Swal.fire({
              title: "Membership Purchased!",
              text: "Verification shows you are a member.",
              icon: "success",
              confirmButtonText: "OK",
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: "An error occurred. Please contact support.",
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
    query,
  ]);

  const handlePayNow = async () => {
    try {
      const { data } = await axiosSecure.post(
        "/create-club-membership-session",
        { club, user }
      );
      window.location.href = data.url;
    } catch (error) {
      Swal.fire({
        title: "Payment Failed!",
        text: "Something went wrong.",
        icon: "error",
      });
    }
  };

  if (isLoadingClub || isLoadingMembership) return <Loader />;

  return (
    <section className="py-16 bg-base-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          {/* Club Image */}
          <figure className="rounded overflow-hidden shadow-sm">
            <img
              src={club.bannerImage}
              alt={club.clubName}
              className="w-full h-full object-cover rounded"
            />
          </figure>

          {/* Club Content */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">{club.clubName}</h2>
              <p className="text-gray-700 mb-3">{club.description}</p>

              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" />
                <strong>Location:</strong> {club.location}
              </p>

              <p className="flex items-center gap-2">
                <FaMoneyBillWave className="text-green-500" />
                <strong>Fee:</strong>{" "}
                {club.membershipFee === 0
                  ? "Free"
                  : `BDT. ${club.membershipFee}`}
              </p>

              <p>
                <b>Manager: </b> {club.managerEmail}
              </p>
            </div>

            <button
              disabled={isMember}
              onClick={() => setIsModalOpen(true)}
              className={`btn btn-primary mt-4 ${
                isMember ? "cursor-not-allowed" : ""
              }`}
            >
              {isMember ? "Membership Active" : "Buy Membership"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && !isMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl relative">
            <h3 className="text-2xl font-bold mb-4">Review Membership</h3>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <FaBuilding className="text-blue-500" />
                <strong>Club:</strong> {club.clubName}
              </p>

              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" />
                <strong>Location:</strong> {club.location}
              </p>

              <p className="flex items-center gap-2">
                <FaMoneyBillWave className="text-green-500" />
                <strong>Fee:</strong>{" "}
                {club.membershipFee === 0
                  ? "Free"
                  : `BDT. ${club.membershipFee}`}
              </p>
            </div>
            <div className="mt-4 p-3 border rounded bg-gray-50">
              <p className="font-semibold">User:</p>
              <p>{user?.displayName}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
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
            <button
              className="absolute top-3 right-3 text-gray-600 text-2xl hover:text-gray-800 transition"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ClubDetails;
