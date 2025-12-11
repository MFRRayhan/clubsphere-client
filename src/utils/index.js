import axios from "axios";

export const imgUpload = async (imgData) => {
  const formData = new FormData();
  formData.append("image", imgData);

  const IMG_API_URL = `https://api.imgbb.com/1/upload?key=${
    import.meta.env.VITE_image_host_key
  }`;
  const { data } = await axios.post(IMG_API_URL, formData);

  return data?.data?.display_url;
};
