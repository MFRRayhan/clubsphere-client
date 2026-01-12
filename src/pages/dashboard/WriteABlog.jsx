import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { imgUpload } from "../../utils";

const WriteABlog = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleBlogSubmit = async (data) => {
    try {
      setLoading(true);

      // Upload blog image
      const imageFile = data.image[0];
      const imageUrl = await imgUpload(imageFile);

      const blogData = {
        title: data.title,
        description: data.description,
        content: data.content,
        category: data.category,
        image: imageUrl,
      };

      await axiosSecure.post("/blogs", blogData);

      Swal.fire({
        icon: "success",
        title: "Blog Submitted!",
        text: "Your blog has been submitted and is pending admin approval.",
      });

      reset();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Something went wrong while submitting the blog.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Write a Blog</h2>

      <form onSubmit={handleSubmit(handleBlogSubmit)} className="space-y-4">
        {/* Title */}
        <fieldset className="fieldset">
          <label className="label">Blog Title</label>
          <input
            type="text"
            className="input w-full"
            placeholder="Enter blog title"
            {...register("title", { required: true })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">Title is required</p>
          )}
        </fieldset>

        {/* Short Description */}
        <fieldset className="fieldset">
          <label className="label">Short Description</label>
          <textarea
            className="textarea w-full"
            placeholder="Short summary of the blog"
            {...register("description", { required: true })}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">Description is required</p>
          )}
        </fieldset>

        {/* Category */}
        <fieldset className="fieldset">
          <label className="label">Category</label>
          <select
            className="select w-full"
            defaultValue=""
            {...register("category", { required: true })}
          >
            <option value="" disabled>
              Select category
            </option>
            <option>Club Activities</option>
            <option>Events</option>
            <option>Leadership</option>
            <option>Technology</option>
            <option>Sports</option>
            <option>Others</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm">Category is required</p>
          )}
        </fieldset>

        {/* Blog Content */}
        <fieldset className="fieldset">
          <label className="label">Blog Content</label>
          <textarea
            className="textarea w-full min-h-[180px]"
            placeholder="Write full blog content here..."
            {...register("content", { required: true })}
          />
          {errors.content && (
            <p className="text-red-500 text-sm">Content is required</p>
          )}
        </fieldset>

        {/* Image */}
        <fieldset className="fieldset">
          <label className="label">Blog Image</label>
          <input
            type="file"
            className="file-input w-full"
            {...register("image", { required: true })}
          />
          {errors.image && (
            <p className="text-red-500 text-sm">Image is required</p>
          )}
        </fieldset>

        {/* Author Info (readonly) */}
        <fieldset className="fieldset">
          <label className="label">Author</label>
          <input
            type="text"
            className="input w-full bg-gray-100"
            value={user?.displayName || user?.email}
            disabled
          />
        </fieldset>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-neutral w-full mt-4"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Blog"}
        </button>
      </form>
    </div>
  );
};

export default WriteABlog;
