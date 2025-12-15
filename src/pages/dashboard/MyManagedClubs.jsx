import React, { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { FaEye, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";

const MyManagedClubs = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredClubs = myClubs.filter((club) =>
    club.clubName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        axiosSecure.delete(`/clubs/${clubId}`).then((res) => {
          if (res.data.deletedCount > 0) {
            refetch();
            Swal.fire("Deleted!", `${clubName} has been deleted.`, "success");
          }
        });
      }
    });
  };

  if (isLoading) return <Loader />;

  if (!myClubs.length)
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold text-gray-700">
          You are not managing any clubs yet.
        </h3>
        <p className="text-gray-500 mt-2">
          Create your first club on the
          <Link
            to="/dashboard/add-a-club"
            className="text-primary hover:underline font-medium"
          >
            Create a Club
          </Link>
        </p>
      </div>
    );

  return (
    <div>
      {/* Title + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-primary">My Managed Clubs</h2>

        <input
          type="text"
          placeholder="Search by club name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full md:w-72"
        />
      </div>

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Club Name</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredClubs.map((club, index) => (
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

            {!filteredClubs.length && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No clubs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyManagedClubs;
