import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const MyClubs = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: clubs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myClubs", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/my-clubs");
      return res.data;
    },
  });

  const handleMyClubDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/clubs/${id}`).then((res) => {
          if (res.data.deletedCount) {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: "Your club has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };

  if (isLoading)
    return <div className="py-20 text-center">Loading clubs...</div>;

  return (
    <div>
      <div>MyClubs ({clubs.length})</div>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Club Name</th>
              <th>Category</th>
              <th>Manager</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clubs.map((club, index) => (
              <tr key={club._id}>
                <th>{index + 1}</th>
                <td>{club.clubName}</td>
                <td>{club.category}</td>
                <td>{club.managerEmail}</td>
                <td>{new Date(club.createdAt).toLocaleString()}</td>
                <td className="space-x-2">
                  {user.role === "clubManager" && (
                    <button className="btn btn-square hover:bg-primary hover:text-white">
                      <FaEdit />
                    </button>
                  )}
                  <button className="btn btn-square hover:bg-primary hover:text-white">
                    <FaEye />
                  </button>
                  {user.role === "clubManager" && (
                    <button
                      onClick={() => handleMyClubDelete(club._id)}
                      className="btn btn-square hover:bg-primary hover:text-white"
                    >
                      <FaTrash />
                    </button>
                  )}
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
