import React, { useState, useEffect } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import Loader from "../components/Loader";
import { FaBuilding, FaLocationDot } from "react-icons/fa6";
import { FaCalendar, FaSearch } from "react-icons/fa";
import NoResults from "../components/NoResults";

const Events = ({ variant = "page" }) => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Decide itemsPerPage based on variant
  const itemsPerPage = variant === "home" ? 8 : 12;

  // Pagination calculations
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (isLoading) return <Loader />;

  return (
    <section className="py-16 bg-base-100">
      <div className="container mx-auto">
        <div
          className={`mb-12 ${
            variant === "home"
              ? "text-center"
              : "flex flex-col md:flex-row justify-between items-center gap-4"
          }`}
        >
          <h2 className="text-4xl font-bold">
            {variant === "home" ? (
              <>
                Recent <span className="text-primary">Events</span>
              </>
            ) : (
              <>
                Upcoming <span className="text-primary">Events</span>
              </>
            )}
          </h2>

          {variant === "page" && (
            <div className="relative w-full md:w-80 mt-4 md:mt-0">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-20" />
              <input
                type="search"
                placeholder="Search events by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full pl-10"
              />
            </div>
          )}
        </div>

        {/* Events Grid */}
        {paginatedEvents.length === 0 ? (
          <NoResults type="events" searchTerm={searchTerm} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {paginatedEvents.map((event) => (
                <div
                  key={event._id}
                  className="group bg-white rounded overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-gray-300 p-4"
                >
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

                  <div className="py-2 space-y-3">
                    <h3 className="text-xl font-semibold">{event.eventName}</h3>

                    <div className="text-sm text-gray-700 space-y-1">
                      <p className="flex gap-1 items-center">
                        <FaLocationDot />
                        {event.location}
                      </p>
                      <p className="flex gap-1 items-center">
                        <FaBuilding />
                        <b>Hosted By:</b> {event.clubName}
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

            {/* Pagination: Only show on 'page' variant */}
            {variant === "page" && totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 gap-2 flex-wrap">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="btn btn-sm btn-outline disabled:btn-disabled"
                >
                  Prev
                </button>

                {[...Array(totalPages).keys()].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page + 1)}
                    className={`btn btn-sm ${
                      currentPage === page + 1 ? "btn-primary" : "btn-outline"
                    }`}
                  >
                    {page + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="btn btn-sm btn-outline disabled:btn-disabled"
                >
                  Next
                </button>
              </div>
            )}

            {/* Home variant: View All Events button */}
            {variant === "home" && (
              <div className="flex justify-center mt-8">
                <Link to="/events" className="btn btn-primary">
                  View All Events
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Events;
