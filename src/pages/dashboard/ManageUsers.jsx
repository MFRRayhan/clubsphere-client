import React, { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useRole from "../../hooks/useRole";
import { FaSearch, FaEye } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { role, isLoading } = useRole();

  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: users = [], refetch } = useQuery({
    queryKey: ["users", searchText],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?searchText=${searchText}`);
      return res.data;
    },
  });

  if (isLoading) return <Loader />;

  if (role !== "admin") {
    return (
      <div className="text-center text-2xl text-red-500 py-10">
        Access Denied: Only Admin Can Manage Users
      </div>
    );
  }

  const handleChangeRole = (user, newRole) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Change role of ${user.displayName} to ${newRole}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch(`/users/${user._id}/role`, { role: newRole })
          .then((res) => {
            if (res.data.modifiedCount) {
              refetch();
              Swal.fire(
                "Success!",
                `${user.displayName}'s role changed to ${newRole}.`,
                "success"
              );
            }
          });
      }
    });
  };

  const handleDelete = (user) => {
    Swal.fire({
      title: "Delete User?",
      text: `Are you sure you want to delete ${user.displayName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/users/${user._id}`).then((res) => {
          if (res.data.deletedCount) {
            refetch();
            Swal.fire("Deleted!", "User has been removed.", "success");
          }
        });
      }
    });
  };

  const roleBadge = (role) => {
    if (role === "admin") return "bg-green-500";
    if (role === "clubManager") return "bg-yellow-500";
    return "bg-blue-500";
  };

  return (
    <div className="py-10 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-primary">Manage Users</h2>

        <div className="flex items-center gap-2 w-full md:w-1/3 bg-white border border-gray-300 rounded-lg shadow px-3 py-2">
          <FaSearch className="text-gray-400" />
          <input
            type="search"
            placeholder="Search User"
            className="w-full outline-none"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>Index</th>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td>{index + 1}</td>

                <td>
                  <div className="flex items-center gap-3">
                    <img
                      referrerPolicy="no-referrer"
                      src={user.photoURL}
                      alt="avatar"
                      className="w-12 h-12 rounded-full border"
                    />
                    <div>
                      <div className="font-semibold">{user.displayName}</div>
                      <div className="text-sm text-gray-500">
                        {user.district}
                      </div>
                    </div>
                  </div>
                </td>

                <td>{user.email}</td>

                <td>
                  <span
                    className={`text-white capitalize px-3 py-1 rounded-full text-sm ${roleBadge(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="flex flex-wrap gap-2">
                  {/* View */}
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="btn btn-sm btn-primary text-white flex items-center gap-1"
                  >
                    <FaEye />
                    View
                  </button>

                  {/* MEMBER ACTIONS */}
                  {user.role === "member" && (
                    <>
                      <button
                        onClick={() => handleChangeRole(user, "admin")}
                        className="btn btn-sm btn-success text-white"
                      >
                        Make Admin
                      </button>

                      <button
                        onClick={() => handleChangeRole(user, "clubManager")}
                        className="btn btn-sm btn-warning text-white"
                      >
                        Make Manager
                      </button>
                    </>
                  )}

                  {/* ADMIN ACTION */}
                  {user.role === "admin" && (
                    <button
                      onClick={() => handleChangeRole(user, "member")}
                      className="btn btn-sm btn-info text-white"
                    >
                      Remove Admin
                    </button>
                  )}

                  {/* MANAGER ACTION */}
                  {user.role === "clubManager" && (
                    <button
                      onClick={() => handleChangeRole(user, "member")}
                      className="btn btn-sm btn-secondary text-white"
                    >
                      Remove Manager
                    </button>
                  )}

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(user)}
                    className="btn btn-sm btn-error text-white"
                  >
                    <BsTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-600 text-2xl"
              onClick={() => setSelectedUser(null)}
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold mb-4 text-center">
              User Details
            </h3>

            <img
              src={selectedUser.photoURL}
              alt="avatar"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />

            <div className="space-y-2 text-center">
              <p>
                <strong>Name:</strong> {selectedUser.displayName}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p className="capitalize">
                <strong>Role:</strong> {selectedUser.role}
              </p>
              <p>
                <strong>Joined:</strong>{" "}
                {new Date(selectedUser.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setSelectedUser(null)}
                className="btn btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
