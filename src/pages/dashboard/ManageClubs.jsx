import React, { useEffect, useState, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaCheck, FaTimes, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";

const ManageClubs = () => {
  const axiosSecure = useAxiosSecure();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClubs, setFilteredClubs] = useState([]);

  const fetchPendingClubs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/clubs?status=pending");
      setClubs(res.data);
      setFilteredClubs(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch clubs", "error");
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => {
    fetchPendingClubs();
  }, [fetchPendingClubs]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = clubs.filter((club) =>
      club.clubName.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredClubs(results);
  }, [searchTerm, clubs]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusChange = async (clubId, newStatus) => {
    try {
      const confirm = await Swal.fire({
        title: `Are you sure?`,
        text: `You want to ${newStatus} this club.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
      });

      if (confirm.isConfirmed) {
        await axiosSecure.patch(`/clubs/${clubId}/status`, {
          status: newStatus,
        });
        Swal.fire("Updated!", `Club has been ${newStatus}.`, "success");
        fetchPendingClubs();
        setSearchTerm("");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  if (loading) return <Loader />;

  if (clubs.length === 0 && searchTerm === "")
    return (
      <div className="text-center mt-4">No pending clubs for approval.</div>
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Pending Clubs</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Club Name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-150"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {filteredClubs.length === 0 && clubs.length > 0 && (
        <div className="text-center mt-4">
          No clubs match your search for "{searchTerm}".
        </div>
      )}

      <div className="space-y-4">
        {filteredClubs.map((club) => (
          <div
            key={club._id}
            className="p-4 border rounded flex justify-between items-center bg-white shadow-md hover:shadow-lg transition duration-200"
          >
            <div>
              <h3 className="font-semibold text-xl">{club.clubName}</h3>
              {club.description && (
                <p className="text-gray-700 mt-1">{club.description}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Manager:{" "}
                <span className="font-medium">{club.managerEmail}</span>
              </p>
            </div>
            <div className="space-x-2 flex">
              <button
                onClick={() => handleStatusChange(club._id, "approved")}
                className="btn bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-150 transform hover:scale-105"
                title="Approve Club"
              >
                <FaCheck /> Approve
              </button>
              <button
                onClick={() => handleStatusChange(club._id, "rejected")}
                className="btn bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-150 transform hover:scale-105"
                title="Reject Club"
              >
                <FaTimes /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageClubs;
