import { useQuery } from "@tanstack/react-query";
import { FaCalendar, FaUser } from "react-icons/fa";
import { Link } from "react-router";
import Loader from "../components/Loader";
import useAxiosSecure from "../hooks/useAxiosSecure";

const Blogs = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: blogs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/public/blogs");
      return res.data;
    },
  });

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="text-center py-20 text-error text-xl">
        Failed to load blogs
      </div>
    );
  }

  if (!blogs.length) {
    return (
      <div className="text-center py-20 text-gray-500 text-xl">
        No blogs found
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Latest <span className="text-primary">Blogs</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="flex flex-col rounded overflow-hidden shadow-md hover:shadow-xl transition border border-base-200 bg-white"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                <span className="absolute bottom-3 left-3 bg-primary text-white text-xs px-3 py-1 rounded-full">
                  {blog.category}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow p-4 space-y-3">
                <h3 className="text-lg font-semibold line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-sm text-gray-700 line-clamp-3 flex-grow">
                  {blog.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <FaUser className="text-primary" />
                    {blog.author?.name}
                  </div>

                  <div className="flex items-center gap-1">
                    <FaCalendar className="text-primary" />
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Button always bottom */}
                <Link
                  to={`/blog/${blog._id}`}
                  className="btn btn-primary w-full mt-auto"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;
