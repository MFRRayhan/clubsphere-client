import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router";
import Loader from "../components/Loader";
import NoResults from "../components/NoResults";
import useAxiosSecure from "../hooks/useAxiosSecure";

const Clubs = ({ variant = "page" }) => {
  const axiosSecure = useAxiosSecure();
  const isHome = variant === "home";

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["clubs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/clubs");
      return res.data;
    },
  });

  // Approved + Recent first
  const approvedClubs = clubs
    .filter((club) => club.status === "approved")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Search only for full page
  const filteredClubs = isHome
    ? approvedClubs
    : approvedClubs.filter((club) =>
        club.clubName.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // Reset page when searching
  useEffect(() => {
    if (!isHome) {
      setCurrentPage(1);
    }
  }, [searchTerm, isHome]);

  const totalPages = Math.ceil(filteredClubs.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const displayClubs = isHome
    ? filteredClubs.slice(0, 8)
    : filteredClubs.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="py-16 bg-base-100">
      <div className="container mx-auto">
        {/* Title + Search */}
        <div
          className={`mb-12 ${
            isHome
              ? "text-center"
              : "flex flex-col md:flex-row justify-between items-center gap-4"
          }`}
        >
          <h2 className="text-4xl font-bold">
            {isHome ? (
              <>
                Recent <span className="text-primary">Clubs</span>
              </>
            ) : (
              <>
                Explore <span className="text-primary">Clubs</span>
              </>
            )}
          </h2>

          {!isHome && (
            <div className="relative w-full md:w-80 mt-4 md:mt-0">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-20" />
              <input
                type="search"
                placeholder="Search clubs by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full pl-10"
              />
            </div>
          )}
        </div>

        {/* Clubs Grid */}
        {displayClubs.length === 0 ? (
          <NoResults type="clubs" searchTerm={searchTerm} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayClubs.map((club) => (
                <div
                  key={club._id}
                  className="group rounded overflow-hidden shadow-md hover:shadow-xl transition border border-base-200 p-4"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={club.bannerImage}
                      alt={club.clubName}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                    <span className="absolute bottom-3 left-3 bg-primary text-white text-xs px-3 py-1 rounded-full">
                      {club.category}
                    </span>
                  </div>

                  <div className="py-2 space-y-3">
                    <h3 className="text-xl font-semibold">{club.clubName}</h3>

                    <p className="flex gap-1 items-center text-sm text-gray-700">
                      <FaLocationDot />
                      {club.location}
                    </p>

                    <Link
                      to={`/clubs/${club._id}`}
                      className="btn btn-primary w-full"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Home Page Button */}
            {isHome && (
              <div className="flex justify-center mt-12">
                <Link to="/clubs" className="btn btn-primary">
                  View All Clubs
                </Link>
              </div>
            )}

            {/* Pagination (only full page) */}
            {!isHome && totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 gap-2 flex-wrap">
                <button
                  onClick={() => setCurrentPage((prev) => prev - 1)}
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
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage === totalPages}
                  className="btn btn-sm btn-outline disabled:btn-disabled"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Clubs;
