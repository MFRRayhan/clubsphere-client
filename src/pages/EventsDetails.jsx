import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import Loader from "../components/Loader";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaTags,
  FaBuilding,
} from "react-icons/fa";

const EventsDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);

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
          await axiosSecure.post("/event-participants", {
            eventId: event._id,
            eventName: event.eventName,
            eventFee: event.eventFee,
          });

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

  const handleJoinEvent = async () => {
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
                <FaCalendarAlt className="text-blue-500" />
                <strong>Date:</strong>{" "}
                {new Date(event.eventDate).toLocaleDateString()}
              </p>
              <p className="flex items-center gap-2 text-gray-800">
                <FaMapMarkerAlt className="text-red-500" />
                <strong>Location:</strong> {event.location}
              </p>
              <p className="flex items-center gap-2 text-gray-800">
                <FaMoneyBillWave className="text-green-500" />
                <strong>Fee:</strong>{" "}
                {event.isPaid ? `BDT. ${event.eventFee}` : "Free"}
              </p>
              <p className="flex items-center gap-2 text-gray-800">
                <FaTags />
                <strong>Category:</strong> {event.eventCategory}
              </p>
              <p className="flex gap-1 items-center">
                <FaBuilding />
                <b>Hosted By: </b>
                {event.clubName}
              </p>
              <p>
                <b>Manager: </b>
                {event.eventCreator.name}
              </p>
              <p>
                <b>Manager Mail: </b>
                {event.eventCreator.email}
              </p>
            </div>

            {/* Join Button */}
            <button
              disabled={isAlreadyJoined || isJoining}
              onClick={handleJoinEvent}
              className={`btn btn-primary w-full py-3 text-lg font-semibold ${
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
    </section>
  );
};

export default EventsDetails;
