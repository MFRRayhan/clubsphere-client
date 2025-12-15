// MyManagedClubs.jsx
import React, { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";
import Loader from "../../components/Loader";

const MyManagedClubs = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClub, setSelectedClub] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [bannerFile, setBannerFile] = useState(null);

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

  // DELETE CLUB
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

  // OPEN MODAL
  const openModal = async (clubId, mode) => {
    try {
      const res = await axiosSecure.get(`/clubs/${clubId}`);
      setSelectedClub(res.data);

      if (mode === "edit") {
        setFormData({
          clubName: res.data.clubName || "",
          description: res.data.description || "",
          category: res.data.category || "",
          location: res.data.location || "",
          membershipFee: res.data.membershipFee || 0,
          bannerImage: res.data.bannerImage || "",
          status: res.data.status || "",
        });
        setIsEditModalOpen(true);
      } else if (mode === "view") {
        setIsViewModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch club details:", error);
    }
  };

  // FORM CHANGE
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // BANNER FILE CHANGE
  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_image_host_key
        }`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, bannerImage: data.data.url }));
        Swal.fire("Uploaded", "Banner uploaded successfully", "success");
      } else {
        Swal.fire("Error", "Failed to upload banner", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to upload banner", "error");
    }
  };

  // UPDATE CLUB
  const handleUpdateClub = async () => {
    try {
      let updatedData = { ...formData };

      if (bannerFile) {
        // Create FormData to upload banner image
        const imageForm = new FormData();
        imageForm.append("image", bannerFile);
        const imageRes = await axiosSecure.post("/upload-banner", imageForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        updatedData.bannerImage = imageRes.data.url;
      }

      await axiosSecure.patch(`/clubs/${selectedClub._id}`, updatedData);
      Swal.fire("Updated!", "Club details updated successfully.", "success");
      setIsEditModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to update club:", error);
      Swal.fire("Error", "Failed to update club.", "error");
    }
  };

  if (isLoading) return <Loader />;

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="badge badge-success capitalize text-white font-semibold">
            {status}
          </span>
        );
      case "pending":
        return (
          <span className="badge badge-warning capitalize text-white font-semibold">
            {status}
          </span>
        );
      case "rejected":
        return (
          <span className="badge badge-error capitalize text-white font-semibold">
            {status}
          </span>
        );
      default:
        return (
          <span className="badge badge-outline capitalize text-white font-semibold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-4">
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
              <th>Category</th>
              <th>Membership Fee</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClubs.map((club, index) => (
              <tr key={club._id}>
                <th>{index + 1}</th>
                <td>{club.clubName}</td>
                <td>{getStatusBadge(club.status)}</td>
                <td>{club.category}</td>
                <td>BDT {club.membershipFee}</td>
                <td>{new Date(club.createdAt).toLocaleDateString()}</td>
                <td className="flex space-x-2">
                  <button
                    onClick={() => openModal(club._id, "view")}
                    className="btn btn-square"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => openModal(club._id, "edit")}
                    className="btn btn-square btn-warning"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteClub(club._id, club.clubName)}
                    className="btn btn-square btn-error"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {!filteredClubs.length && (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-2xl text-error font-semibold"
                >
                  No clubs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {isViewModalOpen && selectedClub && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{selectedClub.clubName}</h3>
            <div className="space-y-2">
              <p>
                <strong>Description:</strong> {selectedClub.description}
              </p>
              <p>
                <strong>Category:</strong> {selectedClub.category}
              </p>
              <p>
                <strong>Location:</strong> {selectedClub.location}
              </p>
              <p>
                <strong>Membership Fee:</strong> BDT{" "}
                {selectedClub.membershipFee}
              </p>
              <p>
                <strong>Status:</strong> {selectedClub.status}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(selectedClub.createdAt).toLocaleString()}
              </p>
              {selectedClub.bannerImage && (
                <div>
                  <strong>Banner:</strong>
                  <img
                    src={selectedClub.bannerImage}
                    alt="Banner"
                    className="mt-2 w-full max-h-64 object-cover rounded"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="btn btn-error"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && selectedClub && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-4 text-primary">Edit Club:</h3>

            <div className="space-y-3">
              <div>
                <label className="block mb-1 font-semibold">Club Name</label>
                <input
                  type="text"
                  name="clubName"
                  value={formData.clubName}
                  onChange={handleFormChange}
                  placeholder="Club Name"
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Description"
                  className="textarea textarea-bordered w-full"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  placeholder="Category"
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  placeholder="Location"
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">
                  Membership Fee
                </label>
                <input
                  type="number"
                  name="membershipFee"
                  value={formData.membershipFee}
                  onChange={handleFormChange}
                  placeholder="Membership Fee"
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Banner Image</label>
                <input
                  type="file"
                  onChange={handleBannerChange}
                  className="file-input file-input-bordered w-full"
                />
                {formData.bannerImage && !bannerFile && (
                  <img
                    src={formData.bannerImage}
                    alt="Banner"
                    className="mt-2 w-full max-h-48 object-cover rounded"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="btn btn-error text-white"
                onClick={() => setIsEditModalOpen(false)}
              >
                Close
              </button>
              <button className="btn btn-primary" onClick={handleUpdateClub}>
                Update Club
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyManagedClubs;
