import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaEye, FaCheck, FaTimes } from "react-icons/fa";
import Loader from "../../components/Loader";

const WaitingForApproval = () => {
  const axiosSecure = useAxiosSecure();
  const [pendingClubs, setPendingClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState(null);
  const [searchText, setSearchText] = useState("");

  const fetchPendingClubs = async () => {
    try {
      const res = await axiosSecure.get("/clubs?status=pending");
      setPendingClubs(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch pending clubs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingClubs();
  }, []);

  // Approve / Reject
  const updateClubStatus = async (clubId, status) => {
    try {
      await axiosSecure.patch(`/clubs/${clubId}/status`, { status });
      Swal.fire(
        "Success",
        `Club ${status === "approved" ? "approved" : "rejected"} successfully`,
        "success"
      );
      fetchPendingClubs();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update club status", "error");
    }
  };

  const filteredClubs = pendingClubs.filter(
    (club) =>
      club.clubName.toLowerCase().includes(searchText.toLowerCase()) ||
      club.managerEmail.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-primary font-bold">
          Pending Club Approvals
        </h2>
        <input
          type="text"
          placeholder="Search clubs..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="input input-bordered w-64"
        />
      </div>

      {filteredClubs.length === 0 ? (
        <p className="text-center py-6 text-2xl text-error font-semibold">
          No clubs pending approval
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Index</th>
                <th>Club Name</th>
                <th>Manager Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClubs.map((club, index) => (
                <tr key={club._id}>
                  <td>{index + 1}</td>
                  <td>{club.clubName}</td>
                  <td>{club.managerEmail}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => setSelectedClub(club)}
                      className="btn btn-square hover:btn-primary flex items-center gap-1"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => updateClubStatus(club._id, "approved")}
                      className="btn btn-square hover:btn-success flex items-center gap-1"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => updateClubStatus(club._id, "rejected")}
                      className="btn btn-square hover:btn-error flex items-center gap-1"
                    >
                      <FaTimes />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedClub && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-30"
            onClick={() => setSelectedClub(null)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto p-6 z-10 shadow-lg">
            {/* Banner Image */}
            {selectedClub.bannerImage && (
              <img
                src={selectedClub.bannerImage}
                alt={selectedClub.clubName}
                className="w-full h-96 object-cover rounded mb-4"
              />
            )}

            <h3 className="text-2xl font-bold mb-2">{selectedClub.clubName}</h3>

            <p className="mb-2">
              <strong>Description:</strong> {selectedClub.description || "N/A"}
            </p>
            <p className="mb-2">
              <strong>Category:</strong> {selectedClub.category || "N/A"}
            </p>
            <p className="mb-2">
              <strong>Location:</strong> {selectedClub.location || "N/A"}
            </p>
            <p className="mb-2">
              <strong>Membership Fee:</strong> BDT{" "}
              {selectedClub.membershipFee || 0}
            </p>
            <p className="mb-2 capitalize">
              <strong>Status:</strong> {selectedClub.status}
            </p>
            <p className="mb-2">
              <strong>Manager Email:</strong> {selectedClub.managerEmail}
            </p>
            <p className="mb-2">
              <strong>Created At:</strong>{" "}
              {new Date(selectedClub.createdAt).toLocaleString()}
            </p>
            <p className="mb-2">
              <strong>Updated At:</strong>{" "}
              {new Date(selectedClub.updatedAt).toLocaleString()}
            </p>

            {/* Close Button */}
            <div className="mt-4 flex justify-end">
              <button
                className="btn btn-primary"
                onClick={() => setSelectedClub(null)}
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

export default WaitingForApproval;
