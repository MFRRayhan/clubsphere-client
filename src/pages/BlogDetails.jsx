import { useQuery } from "@tanstack/react-query";
import { FaCalendar, FaFolderOpen, FaUser } from "react-icons/fa";
import { useParams } from "react-router";
import Loader from "../components/Loader";
import useAxiosSecure from "../hooks/useAxiosSecure";

const BlogDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const {
    data: blog,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/blogs/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <Loader />;

  if (isError || !blog) {
    return (
      <div className="text-center py-20 text-error text-xl">Blog not found</div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Blog Image */}
        <div className="rounded-xl overflow-hidden shadow-md mb-8">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          <span className="flex items-center gap-1">
            <FaUser className="text-primary" />
            {blog.author?.name}
          </span>

          <span className="flex items-center gap-1">
            <FaCalendar className="text-primary" />
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>

          <span className="flex items-center gap-1">
            <FaFolderOpen className="text-primary" />
            {blog.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{blog.title}</h1>

        {/* Description */}
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          {blog.description}
        </p>

        {/* Content */}
        <div className="prose prose-lg max-w-none">{blog.content}</div>

        {/* Author Box */}
        <div className="mt-12 p-6 bg-base-200 rounded-xl flex items-center gap-4">
          {blog.author?.photo && (
            <img
              src={blog.author.photo}
              alt={blog.author.name}
              className="w-14 h-14 rounded-full object-cover"
            />
          )}

          <div>
            <h4 className="font-semibold">{blog.author?.name}</h4>
            <p className="text-sm text-gray-600">{blog.author?.email}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetails;
