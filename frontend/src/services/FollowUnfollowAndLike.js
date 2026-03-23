import axios from "axios";
const BASE_URL = "http://localhost:5000/api/users";
export const followUser = async (userId) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/follow/${userId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error following user:", err.response?.data);
    return null;
  }
};
export const unfollowUser = async (userId) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/unfollow/${userId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error unfollowing user:", err);
    return null;
  }
};
const BASE_VIDEO_URL = "http://localhost:5000/api/videos";
export const likeVideo = async (videoId) => {
  try {
    const res = await axios.put(
      `${BASE_VIDEO_URL}/${videoId}/like`,
      {},
      {
        withCredentials: true,
      }
    );
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.error("Error liking video:", err.response?.data);
    return null;
  }
};
