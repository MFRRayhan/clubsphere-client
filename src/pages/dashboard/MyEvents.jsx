import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

const MyEvents = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  console.log("User Email:", user.email);
  const { data: events = [], refetch } = useQuery({
    queryKey: ["myEvents", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/events?email=${user.email}`);
      return res.data;
    },
  });

  const handleEventDelete = (id) => {
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
        axiosSecure.delete(`/events/${id}`).then((res) => {
          if (res.data.deletedCount) {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };

  return (
    <div>
      <div>MyEvents {events.length}</div>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Index</th>
              <th>Event Name</th>
              <th>Category</th>
              <th>Manager</th>
              <th>Manager Email</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={event._id}>
                <th>{index + 1}</th>
                <td>{event.eventName}</td>
                <td>{event.eventCategory}</td>
                <td>{event.eventCreator.name}</td>
                <td>{event.eventCreator.email}</td>
                <td>{new Date(event.createdAt).toLocaleString()}</td>
                <td className="space-x-2">
                  <button className="btn btn-square hover:bg-primary hover:text-white">
                    <FaEdit />
                  </button>
                  <button className="btn btn-square hover:bg-primary hover:text-white">
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleEventDelete(event._id)}
                    className="btn btn-square hover:bg-primary hover:text-white"
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

export default MyEvents;
