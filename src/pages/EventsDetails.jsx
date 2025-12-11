import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import Loader from "../components/Loader";

const EventsDetails = () => {
  const { id } = useParams();
  const location = useLocation();

  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Detect payment success
  const query = new URLSearchParams(location.search);
  const isPaid = query.get("payment") === "success";

  // SweetAlert on successful payment
  useEffect(() => {
    if (isPaid) {
      Swal.fire({
        title: "Payment Successful!",
        text: "Thanks for joining the event.",
        icon: "success",
        confirmButtonText: "OK",
      });
    }
  }, [isPaid]);

  // Fetch event
  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/events/${id}`);
      return res.data;
    },
  });

  // Redirect to Stripe Checkout
  const handlePayNow = async () => {
    try {
      const { data } = await axiosSecure.post("/create-checkout-session", {
        event,
        user,
      });

      window.location.href = data.url;
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Payment Failed!",
        text: "Something went wrong.",
        icon: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-lg font-medium">
        <Loader />
      </div>
    );
  }

  console.log(user);

  return (
    <div className="my-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10">
          {/* LEFT */}
          <div className="relative rounded-xl overflow-hidden shadow-lg">
            <img
              src={event.eventBanner}
              alt={event.eventName}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-4">
              <h2 className="text-3xl text-white font-bold">
                {event.eventName}
              </h2>
              <p className="text-white">
                {new Date(event.eventDate).toLocaleDateString()} |{" "}
                {event.location}
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <div className="p-6 bg-white shadow rounded-xl border">
              <h3 className="text-xl font-semibold mb-4">Event Details</h3>
              <p className="text-gray-700 mb-2">{event.description}</p>

              <div className="grid grid-cols-2 gap-4 text-gray-800 mt-4">
                <div>
                  <p className="font-semibold">Category</p>
                  <p>{event.eventCategory}</p>
                </div>

                <div>
                  <p className="font-semibold">Event Type</p>
                  <p>{event.isPaid ? `Paid ($${event.eventFee})` : "Free"}</p>
                </div>

                <div>
                  <p className="font-semibold">Location</p>
                  <p>{event.location}</p>
                </div>

                <div>
                  <p className="font-semibold">Max Attendees</p>
                  <p>{event.maxAttendees || "Unlimited"}</p>
                </div>
              </div>
            </div>

            {/* Creator Info */}
            <div className="flex items-center gap-4 p-4 border rounded-xl bg-gray-50 shadow-sm">
              <img
                src={event.eventCreator?.image}
                alt={event.eventCreator?.name}
                className="w-16 h-16 rounded-full border"
              />
              <div>
                <p className="text-lg font-semibold">
                  {event.eventCreator?.name}
                </p>
                <p className="text-sm text-gray-600">
                  {event.eventCreator?.email}
                </p>
              </div>
            </div>

            {/* Pay Button */}
            <button
              disabled={isPaid}
              onClick={() => !isPaid && setIsModalOpen(true)}
              className={`btn btn-primary w-full py-3 text-lg font-semibold ${
                isPaid ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isPaid ? "Paid" : "Pay Now"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && !isPaid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg relative">
            <h3 className="text-xl font-bold mb-4">Review Event Details</h3>

            <p>
              <strong>Event:</strong> {event.eventName}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(event.eventDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Location:</strong> {event.location}
            </p>
            <p>
              <strong>Fee:</strong>{" "}
              {event.isPaid ? `$${event.eventFee}` : "Free"}
            </p>

            <div className="mt-4 p-3 border rounded bg-gray-50">
              <p className="font-semibold">User:</p>
              <p>{user?.displayName}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handlePayNow}>
                Proceed to Payment
              </button>
            </div>

            <button
              className="absolute top-3 right-3 text-gray-600 text-xl"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsDetails;
