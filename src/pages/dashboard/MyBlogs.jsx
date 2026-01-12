import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MyBlogs = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [searchText, setSearchText] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Fetch blogs according to user's role
  const {
    data: blogs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myBlogs", user.userEmail],
    queryFn: async () => {
      const res = await axiosSecure.get("/blogs"); // API now filters based on user role
      return res.data;
    },
  });

  if (isLoading) return <Loader />;

  // search functionality
  const filteredBlogs = blogs.filter((blog) =>
    `${blog.title} ${blog.category}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const handleDelete = (blog) => {
    Swal.fire({
      title: "Delete Blog?",
      text: `Are you sure you want to delete "${blog.title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/blogs/${blog._id}`);
          if (res.data.deletedCount) {
            refetch();
            Swal.fire("Deleted!", "Blog has been deleted.", "success");
          }
        } catch (error) {
          Swal.fire(
            "Error",
            error.response?.data?.message || "Failed to delete blog",
            "error"
          );
        }
      }
    });
  };

  return (
    <div className="py-5">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-primary">
            My Published Blogs
          </h2>

          <div className="w-full md:w-80">
            <input
              type="search"
              placeholder="Search blog..."
              className="input input-bordered w-full"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl shadow">
          <table className="table w-full">
            <thead className="bg-base-300">
              <tr>
                <th>Index</th>
                <th>Title</th>
                <th>Category</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog, index) => (
                  <tr key={blog._id} className="hover:bg-base-200">
                    <td>{index + 1}</td>
                    <td>{blog.title}</td>
                    <td>{blog.category}</td>
                    <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                    <td className="flex gap-2">
                      <button
                        className="btn btn-square hover:btn-primary"
                        onClick={() => setSelectedBlog(blog)}
                        title="View"
                      >
                        <FaEye />
                      </button>

                      <button
                        className="btn btn-square hover:btn-warning hover:text-white"
                        onClick={() =>
                          (window.location.href = `/dashboard/edit-blog/${blog._id}`)
                        }
                        title="Edit"
                      >
                        <FaEdit />
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
                    colSpan="5"
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
            <div className="modal-box max-w-3xl">
              <h3 className="font-bold text-xl mb-4 text-center">
                {selectedBlog.title}
              </h3>

              {selectedBlog.image && (
                <img
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}

              <div className="space-y-2">
                <p>
                  <strong>Category:</strong> {selectedBlog.category}
                </p>
                <p>
                  <strong>Author:</strong> {selectedBlog.author.name} (
                  {selectedBlog.author.email})
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

export default MyBlogs;
