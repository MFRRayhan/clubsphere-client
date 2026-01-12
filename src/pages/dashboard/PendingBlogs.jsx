import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaCheck, FaEye, FaSearch, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PendingBlogs = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchText, setSearchText] = useState("");

  const {
    data: blogs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["pending-blogs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/blogs");
      return res.data.filter((blog) => blog.status === "pending");
    },
  });

  if (isLoading) return <Loader />;

  const filteredBlogs = blogs.filter((blog) =>
    `${blog.title} ${blog.category} ${blog.author?.email}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const handleStatusChange = (blogId, status) => {
    Swal.fire({
      title: `Are you sure?`,
      text:
        status === "approved"
          ? "This blog will be published."
          : "This blog will be rejected.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: status === "approved" ? "#16a34a" : "#dc2626",
      confirmButtonText: "Yes, confirm",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch(`/admin/blogs/${blogId}/status`, { status })
          .then((res) => {
            if (res.data.modifiedCount) {
              refetch();
              Swal.fire("Success!", `Blog has been ${status}.`, "success");
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
          <h2 className="text-2xl font-bold text-primary">Pending Blogs</h2>

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

        {/* Table */}
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="table">
            <thead className="bg-base-300">
              <tr>
                <th>Index</th>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Created</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog, index) => (
                  <tr key={blog._id} className="hover:bg-base-200">
                    <td>{index + 1}</td>

                    <td className="font-semibold max-w-xs truncate">
                      {blog.title}
                    </td>

                    <td>{blog.category}</td>

                    <td>{blog.author?.email}</td>

                    <td>{new Date(blog.createdAt).toLocaleDateString()}</td>

                    <td>
                      <span className="badge badge-warning text-white capitalize">
                        pending
                      </span>
                    </td>

                    <td className="flex gap-2">
                      <button
                        className="btn btn-square hover:btn-primary"
                        onClick={() => setSelectedBlog(blog)}
                      >
                        <FaEye />
                      </button>

                      <button
                        className="btn btn-square btn-success text-white"
                        onClick={() => handleStatusChange(blog._id, "approved")}
                      >
                        <FaCheck />
                      </button>

                      <button
                        className="btn btn-square btn-error text-white"
                        onClick={() => handleStatusChange(blog._id, "rejected")}
                      >
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-6 text-2xl text-error font-semibold"
                  >
                    No pending blogs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* View Blog Modal */}
        {selectedBlog && (
          <dialog open className="modal">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-xl mb-3">{selectedBlog.title}</h3>

              <img
                src={selectedBlog.image}
                alt="blog"
                className="w-full h-52 object-cover rounded-lg mb-4"
              />

              <p className="mb-2 text-sm text-gray-500">
                Category: {selectedBlog.category}
              </p>

              <p className="mb-4">{selectedBlog.description}</p>

              <div className="prose max-w-none">{selectedBlog.content}</div>

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

export default PendingBlogs;
