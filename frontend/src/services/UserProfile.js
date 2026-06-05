import axios from "axios";
const BASE_URL = `${import.meta.env.VITE_BACKEND_BASE_URL}/users`;
const getUserProfile = async (userId) => {
  try {
    const res = await axios.get(`${BASE_URL}/profile/${userId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching user profile:", err.response?.data);
    return null;
  }
};
export { getUserProfile };
