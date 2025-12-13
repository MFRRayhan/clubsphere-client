import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { FaEye, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const MyManagedClubs = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: myClubs = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["myClubs", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/my-clubs");
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleDeleteClub = (clubId, clubName) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete the club: ${clubName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/clubs/${clubId}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              refetch();
              Swal.fire("Deleted!", `${clubName} has been deleted.`, "success");
            } else {
              Swal.fire("Failed!", `Could not delete the club.`, "error");
            }
          })
          .catch((err) => {
            console.error("Delete error:", err);
            Swal.fire(
              "Error!",
              "Server error while deleting the club.",
              "error"
            );
          });
      }
    });
  };

  if (isLoading)
    return <div className="py-20 text-center">Loading your clubs...</div>;

  if (!myClubs.length)
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold text-gray-700">
          You are not managing any clubs yet.
        </h3>
        <p className="text-gray-500 mt-2">
          Create your first club on the{" "}
          <Link
            to="/create-club"
            className="text-primary hover:underline font-medium"
          >
            Create Club Page
          </Link>
          .
        </p>
      </div>
    );

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">
        My Managed Clubs ({myClubs.length})
      </h2>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Club Name</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {myClubs.map((club, index) => (
              <tr key={club._id}>
                <th>{index + 1}</th>
                <td>{club.clubName}</td>
                <td className="capitalize">{club.status}</td>
                <td>{new Date(club.createdAt).toLocaleDateString()}</td>
                <td className="space-x-2 flex items-center">
                  <Link
                    to={`/clubs/${club._id}`}
                    className="btn btn-square hover:bg-primary hover:text-white"
                    title="View Club"
                  >
                    <FaEye />
                  </Link>
                  <button
                    onClick={() => handleDeleteClub(club._id, club.clubName)}
                    className="btn btn-square hover:bg-red-600 hover:text-white text-red-600"
                    title="Delete Club"
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

export default MyManagedClubs;
