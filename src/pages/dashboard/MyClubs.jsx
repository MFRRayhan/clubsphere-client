import React, { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { FaEye, FaTrash, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";

const MyClubs = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [searchText, setSearchText] = useState("");

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
          Explore and join the
          <Link
            to="/clubs"
            className="text-primary hover:underline font-medium"
          >
            Clubs Page
          </Link>
          to become a member!
        </p>
      </div>
    );
  }

  // Filter memberships based on searchText
  const filteredMemberships = memberships.filter((m) =>
    m.clubName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl text-primary font-bold">
          My Active Memberships ({filteredMemberships.length})
        </h2>

        {/* Search Bar */}
        <div className="w-full md:w-80">
          <div className="input input-bordered flex items-center gap-2">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search clubs..."
              className="grow"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>

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
            {filteredMemberships.length > 0 ? (
              filteredMemberships.map((membership, index) => (
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
                      className="btn btn-square hover:btn-error hover:text-white"
                      title="Cancel Membership"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No matching clubs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyClubs;
