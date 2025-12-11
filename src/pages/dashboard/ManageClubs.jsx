import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaCheck, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

const ManageClubs = () => {
  const axiosSecure = useAxiosSecure();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load pending clubs
  const fetchPendingClubs = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/clubs");
      // Only pending clubs
      const pendingClubs = res.data.filter((c) => c.status === "pending");
      setClubs(pendingClubs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingClubs();
  }, []);

  // Approve / Reject handler
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
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  if (loading) return <div>Loading...</div>;

  if (clubs.length === 0) return <div>No pending clubs for approval.</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Pending Clubs</h2>
      <div className="space-y-4">
        {clubs.map((club) => (
          <div
            key={club._id}
            className="p-4 border rounded flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-lg">{club.clubName}</h3>
              <p>{club.description}</p>
              <p className="text-sm text-gray-500">
                Manager: {club.managerEmail}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleStatusChange(club._id, "approved")}
                className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-1"
              >
                <FaCheck /> Approve
              </button>
              <button
                onClick={() => handleStatusChange(club._id, "rejected")}
                className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-1"
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
