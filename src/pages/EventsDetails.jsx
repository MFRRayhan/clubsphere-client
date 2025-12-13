import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import Loader from "../components/Loader";

const EventsDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);

  // Fetch Event Details
  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/events/${id}`);
      return res.data;
    },
  });

  // Fetch Participation Status
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

  // Detect Stripe Success URL
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const paymentSuccess = query.get("payment") === "success";
    const sessionId = query.get("session_id");

    if (paymentSuccess && event && user && !isAlreadyJoined) {
      const recordParticipation = async () => {
        try {
          // Record participation
          const participationData = {
            eventId: event._id,
            eventName: event.eventName,
            eventFee: event.eventFee,
          };
          await axiosSecure.post("/event-participants", participationData);

          // Record payment
          const paymentData = {
            transactionId: sessionId || `TID_${Date.now()}`,
            amount: event.eventFee,
            eventId: event._id,
            eventName: event.eventName,
            paymentType: "Event Fee",
          };
          await axiosSecure.post("/payments", paymentData);

          await refetchParticipationStatus();

          Swal.fire({
            title: "Payment Successful!",
            text: "You have successfully joined this event.",
            icon: "success",
          });

          // Remove query params from URL
          navigate(`/events/${id}`, { replace: true });
        } catch (err) {
          console.error(err);
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
    id,
    isAlreadyJoined,
    axiosSecure,
    refetchParticipationStatus,
    navigate,
  ]);

  // Join Free or Paid Event
  const handleJoinEvent = async () => {
    if (!event || !user) return;

    if (event.isPaid) {
      try {
        const { data } = await axiosSecure.post("/create-checkout-session", {
          event,
          user,
        });
        window.location.href = data.url;
      } catch (error) {
        Swal.fire({
          title: "Payment Failed",
          text: "Something went wrong.",
          icon: "error",
        });
      }
    } else {
      try {
        setIsJoining(true);
        const participationData = {
          eventId: event._id,
          eventName: event.eventName,
          eventFee: 0,
        };
        await axiosSecure.post("/event-participants", participationData);
        await refetchParticipationStatus();

        Swal.fire({
          title: "Joined Successfully",
          text: "You have successfully joined this free event.",
          icon: "success",
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error",
          text: "Failed to join event. Please try again.",
          icon: "error",
        });
      } finally {
        setIsJoining(false);
      }
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
    <div className="my-10 container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <img
            src={event.eventBanner}
            alt={event.eventName}
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-4">
            <h2 className="text-3xl text-white font-bold">{event.eventName}</h2>
            <p className="text-white">
              {new Date(event.eventDate).toLocaleDateString()} |{" "}
              {event.location}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white shadow rounded-xl border">
            <h3 className="text-xl font-semibold mb-4">Event Details</h3>
            <p className="text-gray-700 mb-2">{event.eventDescription}</p>

            <div className="grid grid-cols-2 gap-4 text-gray-800 mt-4">
              <div>
                <p className="font-semibold">Category</p>
                <p>{event.eventCategory}</p>
              </div>
              <div>
                <p className="font-semibold">Event Type</p>
                <p>{event.isPaid ? `Paid (BDT.${event.eventFee})` : "Free"}</p>
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

          <button
            disabled={isAlreadyJoined || isJoining}
            onClick={handleJoinEvent}
            className={`btn btn-primary w-full py-3 text-lg font-semibold ${
              isAlreadyJoined || isJoining
                ? "opacity-50 cursor-not-allowed"
                : ""
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
  );
};

export default EventsDetails;
