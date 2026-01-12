import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaEye, FaSearch, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ManageBlogs = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Fetch all blogs for admin (only approved + rejected)
  const {
    data: blogs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["adminBlogs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/blogs");
      // Only show approved/rejected blogs here, pending handled separately
      return res.data.filter((blog) => blog.status !== "pending");
    },
  });

  if (isLoading) return <Loader />;

  // Filter blogs based on search
  const filteredBlogs = blogs.filter((blog) =>
    `${blog.title} ${blog.category} ${blog.author?.name}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  // Delete blog
  const handleDelete = (blog) => {
    Swal.fire({
      title: "Delete Blog?",
      text: `Are you sure you want to delete "${blog.title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/blogs/${blog._id}`).then((res) => {
          if (res.data.deletedCount) {
            refetch();
            Swal.fire("Deleted!", "Blog has been deleted.", "success");
          }
        });
      }
    });
  };

  return (
    <div className="py-5">
      <div className="container mx-auto">
        {/* Title + Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-primary">Manage Blogs</h2>

          <div className="w-full md:w-80">
            <div className="input input-bordered flex items-center gap-2">
              <FaSearch className="text-gray-300" />
              <input
                type="search"
                placeholder="Search blog..."
                className="grow"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Blogs Table */}
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="table w-full">
            <thead className="bg-base-300">
              <tr>
                <th>Index</th>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog, index) => (
                  <tr key={blog._id} className="hover:bg-base-200">
                    <td>{index + 1}</td>
                    <td>{blog.title}</td>
                    <td>{blog.author?.name}</td>
                    <td>{blog.category}</td>
                    <td>
                      <span
                        className={`badge capitalize text-white ${
                          blog.status === "approved"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {blog.status}
                      </span>
                    </td>
                    <td className="flex gap-2">
                      <button
                        className="btn btn-square hover:btn-primary"
                        onClick={() => setSelectedBlog(blog)}
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn btn-square hover:btn-error hover:text-white"
                        onClick={() => handleDelete(blog)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-error font-semibold"
                  >
                    No blogs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* View Modal */}
        {selectedBlog && (
          <dialog open className="modal">
            <div className="modal-box max-w-lg">
              <h3 className="font-bold text-xl mb-4 text-center">
                {selectedBlog.title}
              </h3>

              {selectedBlog.image && (
                <img
                  src={selectedBlog.image}
                  alt="blog"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              <div className="space-y-2">
                <p>
                  <strong>Author:</strong> {selectedBlog.author?.name}
                </p>
                <p>
                  <strong>Category:</strong> {selectedBlog.category}
                </p>
                <p>
                  <strong>Status:</strong> {selectedBlog.status}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(selectedBlog.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Description:</strong> {selectedBlog.description}
                </p>
                <p>
                  <strong>Content:</strong> {selectedBlog.content}
                </p>
              </div>

              <div className="modal-action">
                <button
                  className="btn btn-error text-white"
                  onClick={() => setSelectedBlog(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default ManageBlogs;
