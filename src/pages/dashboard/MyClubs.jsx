import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { FaEye, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";

const MyClubs = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: memberships = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myMemberships", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/memberships/active");
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleCancelMembership = (membershipId, clubName) => {
    Swal.fire({
      title: `Cancel Membership for ${clubName}?`,
      text: "This will revoke your active membership for this club. You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel Membership!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch(`/memberships/cancel/${membershipId}`)
          .then((res) => {
            if (res.data.modifiedCount > 0) {
              refetch();
              Swal.fire({
                title: "Cancelled!",
                text: `Your membership for ${clubName} has been cancelled.`,
                icon: "success",
              });
            } else if (res.data.message) {
              Swal.fire({
                title: "Failed!",
                text: res.data.message,
                icon: "error",
              });
            }
          })
          .catch(() => {
            Swal.fire(
              "Error",
              "Could not cancel membership due to a server error.",
              "error"
            );
          });
      }
    });
  };

  if (isLoading) return <Loader />;

  if (memberships.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold text-gray-700">
          You are not an active member of any club yet.
        </h3>
        <p className="text-gray-500 mt-2">
          Explore and join the{" "}
          <Link
            to="/clubs"
            className="text-primary hover:underline font-medium"
          >
            Clubs Page
          </Link>{" "}
          to become a member!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">
        My Active Memberships ({memberships.length})
      </h2>

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Club Name</th>
              <th>Fee Paid</th>
              <th>Joined On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {memberships.map((membership, index) => (
              <tr key={membership._id}>
                <th>{index + 1}</th>
                <td>{membership.clubName}</td>
                <td>${membership.membershipFee}</td>
                <td>
                  {new Date(membership.purchaseDate).toLocaleDateString()}
                </td>
                <td>{membership.status}</td>
                <td className="space-x-2">
                  <Link
                    to={`/clubs/${membership.clubId}`}
                    className="btn btn-square hover:bg-primary hover:text-white"
                    title="View Club Details"
                  >
                    <FaEye />
                  </Link>

                  <button
                    onClick={() =>
                      handleCancelMembership(
                        membership._id,
                        membership.clubName
                      )
                    }
                    className="btn btn-square btn-error text-white"
                    title="Cancel Membership"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyClubs;
