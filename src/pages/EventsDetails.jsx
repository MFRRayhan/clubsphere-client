import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

const EventsDetails = () => {
  const { id } = useParams();
  const location = useLocation();

  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Detect payment success
  const query = new URLSearchParams(location.search);
  const isPaid = query.get("payment") === "success";

  // Fetch event
  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/events/${id}`);
      return res.data;
    },
  });

  // Fetch participation status
  const {
    data: participationStatus = { isParticipant: false },
    refetch: refetchParticipationStatus,
    isLoading: isLoadingParticipation,
  } = useQuery({
    queryKey: ["participationStatus", id, user?.email],
    queryFn: async () => {
      if (!user?.email) return { isParticipant: false };
      const res = await axiosSecure.get(`/events/check-participant/${id}`);
      return res.data;
    },
    enabled: !!id && !!user?.email,
  });

  const isAlreadyJoined = participationStatus.isParticipant || isPaid;

  // Handle post-payment action: Record participation and show alert
  useEffect(() => {
    if (isPaid && event && !participationStatus.isParticipant) {
      const createParticipation = async () => {
        // --- 🎯 FIX: টোকেন রিফ্রেশ এবং ইউজার চেক ---
        if (!user) {
          console.error(
            "User object is null, cannot proceed with token refresh."
          );
          return;
        }
        try {
          // টোকেন রিফ্রেশ করার জন্য ফোর্স করুন যাতে axiosSecure আপডেট হয়
          await user.getIdToken(true);

          const eventFee = event.isPaid ? event.eventFee : 0;

          const participationData = {
            eventId: event._id,
            eventName: event.eventName,
            eventFee: eventFee,
          };

          // Record participation in backend (Existing Logic)
          await axiosSecure.post("/event-participants", participationData);

          // 🚀 FIX: পেমেন্ট রেকর্ড সেভ করা
          const transactionIdFromUrl =
            query.get("session_id") || `TID_EVENT_${Date.now()}`; // যদি Stripe session ID URL এ থাকে, সেটি ব্যবহার করুন
          const paymentRecord = {
            amount: eventFee,
            transactionId: transactionIdFromUrl,
            eventId: event._id,
            eventName: event.eventName,
            paymentType: "Event Fee",
          };

          await axiosSecure.post("/payments", paymentRecord);
          // 🚀 END FIX

          // After successful record, refetch status and show success alert
          refetchParticipationStatus();

          Swal.fire({
            title: "Payment Successful!",
            text: "Thanks for joining the event. Your payment has been recorded.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Error creating event participation:", error);
          Swal.fire({
            title: "Error!",
            text: "Payment was successful but recording participation/history failed. Please contact support.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      };

      createParticipation();
    }
  }, [
    isPaid,
    event,
    participationStatus.isParticipant,
    refetchParticipationStatus,
    axiosSecure,
    user,
  ]);

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

  if (isLoadingEvent || isLoadingParticipation) {
    return (
      <div className="py-20 text-center text-lg font-medium">
        <Loader />
      </div>
    );
  }

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
                  <p>
                    {event.isPaid ? `Paid (BDT.${event.eventFee})` : "Free"}
                  </p>
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
              disabled={isAlreadyJoined}
              onClick={() => !isAlreadyJoined && setIsModalOpen(true)}
              className={`btn btn-primary w-full py-3 text-lg font-semibold ${
                isAlreadyJoined ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isAlreadyJoined
                ? "Joined"
                : event.isPaid
                ? "Pay Now"
                : "Join Now"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && !isAlreadyJoined && (
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
