import React, { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useRole from "../../hooks/useRole";
import { FaSearch, FaUserShield, FaUserEdit, FaEye } from "react-icons/fa";
import { BsFillShieldSlashFill, BsTrash } from "react-icons/bs";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { role, isLoading } = useRole();
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const { refetch, data: users = [] } = useQuery({
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

  // CHANGE ROLE
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

  // DELETE USER
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
    if (role === "admin") return "badge-success";
    if (role === "clubManager") return "badge-warning";
    return "badge-info"; // member
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-semibold text-secondary mb-4">
          Manage Users
        </h2>

        <label className="input">
          <FaSearch />
          <input
            onChange={(e) => setSearchText(e.target.value)}
            type="search"
            className="grow"
            placeholder="Search User"
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>

                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-circle h-12 w-12">
                        <img src={user.photoURL} alt="User Avatar" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{user.displayName}</div>
                      <div className="text-sm opacity-50">{user.district}</div>
                    </div>
                  </div>
                </td>

                <td>{user.email}</td>

                <td>
                  <span
                    className={`badge text-white capitalize ${roleBadge(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="flex gap-2">
                  {/* VIEW USER */}
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="btn btn-sm btn-primary text-white"
                  >
                    <FaEye />
                  </button>

                  {/* CHANGE ROLE BUTTONS */}
                  {user.role !== "admin" && (
                    <>
                      <button
                        onClick={() => handleChangeRole(user, "admin")}
                        className="btn btn-sm btn-info text-white"
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

                  {user.role === "admin" && (
                    <button
                      onClick={() => handleChangeRole(user, "member")}
                      className="btn btn-sm btn-warning text-white"
                    >
                      Remove Admin
                    </button>
                  )}

                  {/* DELETE USER */}
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

      {/* USER DETAILS MODAL */}
      {selectedUser && (
        <dialog id="user_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-2xl mb-3">User Details</h3>

            <img
              src={selectedUser.photoURL}
              className="w-24 h-24 rounded-full mx-auto mb-4"
              alt="avatar"
            />

            <p>
              <strong>Name:</strong> {selectedUser.displayName}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Role:</strong> {selectedUser.role}
            </p>
            <p>
              <strong>Joined:</strong>{" "}
              {new Date(selectedUser.createdAt).toLocaleDateString()}
            </p>

            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedUser(null)}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ManageUsers;
