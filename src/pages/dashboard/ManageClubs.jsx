import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";
import { FaEye, FaTrash, FaSearch } from "react-icons/fa";

const ManageClubs = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedClub, setSelectedClub] = useState(null);
  const [searchText, setSearchText] = useState("");

  const {
    data: clubs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["clubs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/clubs");
      return res.data;
    },
  });

  if (isLoading) return <Loader />;

  const filteredClubs = clubs.filter((club) =>
    `${club.clubName} ${club.category} ${club.location}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const handleDelete = (club) => {
    Swal.fire({
      title: "Delete Club?",
      text: `Are you sure you want to delete ${club.clubName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/clubs/${club._id}`).then((res) => {
          if (res.data.deletedCount) {
            refetch();
            Swal.fire("Deleted!", "Club has been deleted.", "success");
          }
        });
      }
    });
  };

  return (
    <div className="px-4 py-10">
      {/* Title + Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-primary">Manage Clubs</h2>

        <div className="w-full md:w-80">
          <div className="input input-bordered flex items-center gap-2">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search club..."
              className="grow"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* DaisyUI Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="table table-zebra">
          <thead className="bg-base-200">
            <tr>
              <th>Index</th>
              <th>Club</th>
              <th>Manager Email</th>
              <th>Category</th>
              <th>Location</th>
              <th>Fee</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredClubs.length > 0 ? (
              filteredClubs.map((club, index) => (
                <tr key={club._id}>
                  <td>{index + 1}</td>

                  <td>
                    <div className="flex items-center gap-3">
                      <img
                        src={club.bannerImage}
                        alt="club"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <span className="font-semibold">{club.clubName}</span>
                    </div>
                  </td>

                  <td>{club.managerEmail}</td>
                  <td>{club.category}</td>
                  <td>{club.location}</td>

                  <td>
                    {club.membershipFee === 0
                      ? "Free"
                      : `BDT. ${club.membershipFee}`}
                  </td>

                  <td>
                    <span
                      className={`badge capitalize font-semibold text-white ${
                        club.status === "approved"
                          ? "badge-success"
                          : club.status === "pending"
                          ? "badge-warning"
                          : "badge-error"
                      }`}
                    >
                      {club.status}
                    </span>
                  </td>

                  <td className="flex gap-2">
                    <button
                      className="btn btn-square btn-sm hover:btn-primary"
                      onClick={() => setSelectedClub(club)}
                    >
                      <FaEye />
                    </button>

                    <button
                      className="btn btn-square btn-sm hover:btn-error hover:text-white"
                      onClick={() => handleDelete(club)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No clubs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {selectedClub && (
        <dialog open className="modal">
          <div className="modal-box max-w-lg">
            <h3 className="font-bold text-xl mb-4 text-center">Club Details</h3>

            <img
              src={selectedClub.bannerImage}
              alt="banner"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />

            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedClub.clubName}
              </p>
              <p>
                <strong>Category:</strong> {selectedClub.category}
              </p>
              <p>
                <strong>Location:</strong> {selectedClub.location}
              </p>
              <p>
                <strong>Membership Fee:</strong>{" "}
                {selectedClub.membershipFee === 0
                  ? "Free"
                  : `BDT ${selectedClub.membershipFee}`}
              </p>
              <p className="capitalize">
                <strong>Status:</strong> {selectedClub.status}
              </p>
              <p>
                <strong>Manager Email:</strong> {selectedClub.managerEmail}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(selectedClub.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Description:</strong> {selectedClub.description}
              </p>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={() => setSelectedClub(null)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ManageClubs;
