import React, { useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import Loader from "../components/Loader";
import { FaBuilding, FaLocationDot } from "react-icons/fa6";
import { FaCalendar, FaSearch } from "react-icons/fa";

const Events = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await axiosSecure.get("/events");
      return res.data;
    },
  });

  const filteredEvents = events.filter((event) =>
    event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="px-6 py-16 bg-base-100">
      <div className="max-w-7xl mx-auto">
        {/* Title + Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <h2 className="text-3xl font-bold">Upcoming Events</h2>

          <div className="relative w-full md:w-80">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-20" />
            <input
              type="text"
              id="eventSearch"
              name="eventSearch"
              placeholder="Search events by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <p className="text-center text-gray-500">No events found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div
                key={event._id}
                className="group bg-white rounded overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-gray-300 p-4"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={event.eventBanner}
                    alt={event.eventName}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                  <span className="absolute bottom-3 left-3 bg-primary text-white text-xs px-3 py-1 rounded-full">
                    {event.eventCategory}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-xl font-semibold">{event.eventName}</h3>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {event.eventDescription}
                  </p>

                  <div className="text-sm text-gray-700 space-y-1">
                    <p className="flex gap-1 items-center">
                      <FaLocationDot />
                      {event.location}
                    </p>
                    <p className="flex gap-1 items-center">
                      <FaBuilding />
                      <b>Hosted By:</b> {event.clubName}
                    </p>
                    <p className="flex gap-1 items-center">
                      <FaCalendar />
                      <b>Event Date:</b> {event.eventDate}
                    </p>
                  </div>

                  <Link
                    to={`/events/${event._id}`}
                    className="btn btn-primary w-full mt-4"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;
