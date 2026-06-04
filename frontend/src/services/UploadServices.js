import axios from "axios";

const BASE_URL = "BACKEND_BASE_URL/api/videos/upload";

export const uploadVideo = async (formData) => {
  try {
    // read token dynamically from localStorage
    const token = localStorage.getItem("token");

    const response = await axios.post(BASE_URL, formData, {
      headers: {
        Authorization: `Bearer ${token}`, // use the up-to-date token
      },
    });

    return response.data;
  } catch (err) {
    console.error(
      "Error uploading video:",
      err.response?.status,
      err.response?.data || err.message,
    );

    return null;
    const uploadVideo = async (formData) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(BASE_URL, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (err) {
        console.error("Axios Error object:", err); // log full object
        console.error(
          "Error status:",
          err.response?.status,
          "Error data:",
          err.response?.data,
        );
        return null;
      }
    };
  }
};
export default uploadVideo;
