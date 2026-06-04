// services/videoService.js
import axios from "axios";

const BASE_URL = "BACKEND_BASE_URL/api/videos";

export const getVideos = async () => {
  try {
    const response = await axios.post(BASE_URL);
    return response.data;
    //console.log(response.data); // array of videos
  } catch (err) {
    console.error("Error fetching videos:", err);
    return [];
  }
};

export const getVideoById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/${id}`, {
      withCredentials: true,
    });
    return res.data;
    // console.log(res.data); // { video: {...} }
  } catch (err) {
    console.error("Error fetching video by ID:", err.response?.data);
    return null;
  }
};

export const viewCount = async (id) => {
  try {
    const res = await axios.put(`${BASE_URL}/${id}/view`);
  } catch (err) {
    console.error("Error incrementing view count:", err);
  }
};
export const commentLists = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/${id}/commentlist`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching comments:", err.response?.data);
  }
};

export const addComment = async (id, data) => {
  try {
    const res = await axios.post(`${BASE_URL}/${id}/comment`, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Error adding comment:", err.response?.data);
  }
};

export const queryVideo = async (searchQuery) => {
  try {
    console.log("Searching videos with query:", searchQuery);
    const res = await axios.get(
      `${BASE_URL}/search?q=${encodeURIComponent(searchQuery)}`,
    );
    //console.log("Search results received:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error searching videos:", err.response?.data);
    return [];
  }
};
