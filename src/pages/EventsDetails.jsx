import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";

const EventsDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  // Fetch single event
  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/events/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="py-20 text-center text-lg font-medium">
        Loading event details...
      </div>
    );
  }

  return (
    <div className="my-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10">
          {/* LEFT: Banner Image */}
          <div>
            <img
              src={event.eventBanner}
              alt={event.eventName}
              className="w-full rounded-xl shadow-lg"
            />
          </div>

          {/* RIGHT: Event Info */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">{event.eventName}</h2>

            <p className="text-gray-700">{event.eventDescription}</p>

            <p className="text-lg">
              <span className="font-semibold">Category:</span>{" "}
              {event.eventCategory}
            </p>

            <p className="text-lg">
              <span className="font-semibold">Location:</span> {event.location}
            </p>

            {/* Creator Info */}
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
              <img
                src={event.eventCreator?.image}
                alt={event.eventCreator?.name}
                className="w-14 h-14 rounded-full border"
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

            <button className="btn btn-primary w-full">Join Event</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsDetails;
