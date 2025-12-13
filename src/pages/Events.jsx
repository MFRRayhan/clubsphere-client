import React from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

const Events = () => {
  const axiosSecure = useAxiosSecure();

  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await axiosSecure.get("/events");
      return res.data;
    },
  });

  return (
    <div className="px-6 py-10">
      <h2 className="text-2xl font-semibold mb-6">Events: {events.length}</h2>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white shadow-md rounded-lg overflow-hidden border"
          >
            {/* Banner */}
            <img
              src={event.eventBanner}
              alt={event.eventName}
              className="w-full h-48 object-cover"
            />

            {/* Content */}
            <div className="p-4 space-y-2">
              <h3 className="text-xl font-semibold">{event.eventName}</h3>

              <p className="text-sm text-gray-700 line-clamp-2">
                {event.eventDescription}
              </p>

              <p className="text-sm">
                <span className="font-semibold">Category:</span>{" "}
                {event.eventCategory}
              </p>

              <p className="text-sm">
                <span className="font-semibold">Location:</span>{" "}
                {event.location}
              </p>

              {/* Creator Info */}
              <div className="flex items-center gap-3 mt-3">
                <img
                  src={event.eventCreator?.image}
                  alt={event.eventCreator?.name}
                  className="w-10 h-10 rounded-full border"
                />
                <div>
                  <p className="text-sm font-medium">
                    {event.eventCreator?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {event.eventCreator?.email}
                  </p>
                </div>
              </div>

              {/* Details Button */}
              <Link
                to={`/events/${event._id}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
