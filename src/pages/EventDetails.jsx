import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import Loader from "../components/Loader";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTags,
  FaBuilding,
  FaUserAlt,
  FaEnvelope,
} from "react-icons/fa";
import { FaBangladeshiTakaSign, FaCalendarCheck } from "react-icons/fa6";

const EventsDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Event
  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/events/${id}`);
      return res.data;
    },
  });

  // Participation Status
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

  const isAlreadyJoined = participationStatus.isParticipant;

  // Stripe success detection
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const paymentSuccess = query.get("payment") === "success";
    const sessionId = query.get("session_id");

    if (paymentSuccess && event && user && !isAlreadyJoined) {
      const recordParticipation = async () => {
        try {
          // Record participation
          await axiosSecure.post("/event-participants", {
            eventId: event._id,
            eventName: event.eventName,
            eventFee: event.eventFee,
          });

          // Record payment
          await axiosSecure.post("/payments", {
            transactionId: sessionId || `TID_${Date.now()}`,
            amount: event.eventFee,
            eventId: event._id,
            eventName: event.eventName,
            paymentType: "Event Fee",
          });

          await refetchParticipationStatus();

          Swal.fire({
            title: "Payment Successful!",
            text: "You have successfully joined this event.",
            icon: "success",
          });

          navigate(`/events/${id}`, { replace: true });
        } catch (err) {
          Swal.fire({
            title: "Error!",
            text: "Payment was successful but recording participation failed.",
            icon: "error",
          });
        }
      };
      recordParticipation();
    }
  }, [
    location.search,
    event,
    user,
    isAlreadyJoined,
    axiosSecure,
    refetchParticipationStatus,
    navigate,
    id,
  ]);

  // Handle Modal Open
  const handleJoinEvent = () => {
    if (!user) {
      navigate("/login", { state: location.pathname });
      return;
    }
    setIsModalOpen(true);
  };

  // Handle Modal Payment
  const handlePayNow = async () => {
    if (!event || !user) return;

    if (event.isPaid) {
      try {
        const { data } = await axiosSecure.post("/create-checkout-session", {
          event,
          user,
        });
        window.location.href = data.url;
      } catch {
        Swal.fire({
          title: "Payment Failed",
          text: "Something went wrong.",
          icon: "error",
        });
      }
    } else {
      // Free event join
      try {
        setIsJoining(true);
        await axiosSecure.post("/event-participants", {
          eventId: event._id,
          eventName: event.eventName,
          eventFee: 0,
        });
        await refetchParticipationStatus();
        Swal.fire({
          title: "Joined Successfully",
          text: "You have joined this free event.",
          icon: "success",
        });
        setIsModalOpen(false);
      } catch {
        Swal.fire({
          title: "Error",
          text: "Failed to join event.",
          icon: "error",
        });
      } finally {
        setIsJoining(false);
      }
    }
  };

  if (isLoadingEvent || isLoadingParticipation) return <Loader />;

  return (
    <section className="py-16 bg-base-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          {/* Event Image */}
          <figure className="rounded overflow-hidden shadow-sm h-[400px]">
            <img
              src={event.eventBanner}
              alt={event.eventName}
              className="w-full h-full object-cover rounded"
            />
          </figure>

          {/* Event Content */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">{event.eventName}</h2>
              <p className="text-gray-700 mb-4">{event.eventDescription}</p>

              <p className="flex items-center gap-2 text-gray-800">
                <FaCalendarAlt className="text-primary" />
                {new Date(event.eventDate).toLocaleDateString()}
              </p>
              <p className="flex items-center gap-2 text-gray-800">
                <FaMapMarkerAlt className="text-primary" />
                {event.location}
              </p>
              <p className="flex items-center gap-2 text-gray-800">
                <FaBangladeshiTakaSign className="text-primary" />
                {event.isPaid ? `${event.eventFee}` : "Free"}
              </p>
              <p className="flex items-center gap-2 text-gray-800">
                <FaTags className="text-primary" />
                {event.eventCategory}
              </p>
              <p className="flex gap-2 items-center">
                <FaBuilding className="text-primary" />
                {event.clubName}
              </p>
              <p className="flex gap-2 items-center">
                <FaUserAlt className="text-primary" />
                {event.eventCreator.name}
              </p>
              <p className="flex gap-2 items-center">
                <FaEnvelope className="text-primary" />
                {event.eventCreator.email}
              </p>
            </div>

            {/* Join Button */}
            <button
              disabled={isAlreadyJoined || isJoining}
              onClick={handleJoinEvent}
              className={`btn btn-primary w-full py-3 font-semibold ${
                isAlreadyJoined || isJoining ? "cursor-not-allowed" : ""
              }`}
            >
              {isAlreadyJoined
                ? "Joined"
                : event.isPaid
                ? "Pay Now"
                : isJoining
                ? "Joining..."
                : "Join Now"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && !isAlreadyJoined && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl relative">
            <h3 className="text-2xl font-bold mb-4">Review Event</h3>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <FaBuilding className="text-primary" />
                {event.clubName}
              </p>
              <p className="flex items-center gap-2">
                <FaCalendarCheck className="text-primary" />
                {event.eventName}
              </p>
              <p className="flex items-center gap-2">
                <FaCalendarAlt className="text-primary" />
                {new Date(event.eventDate).toLocaleDateString()}
              </p>
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary" />
                {event.location}
              </p>
              <p className="flex items-center gap-2">
                <FaBangladeshiTakaSign className="text-primary" />
                {event.isPaid ? `${event.eventFee}` : "Free"}
              </p>
            </div>

            <div className="mt-4 p-3 border-2 border-base-300 rounded">
              <p className="font-semibold">User:</p>
              <p>{user?.displayName}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handlePayNow}
                disabled={isJoining}
              >
                {isJoining
                  ? "Processing..."
                  : event.isPaid
                  ? "Proceed to Payment"
                  : "Join Now"}
              </button>
            </div>

            <button
              className="absolute top-3 right-3 text-gray-600 text-2xl hover:text-gray-800 transition"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default EventsDetails;
