// services/videoService.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/videos"; 

export const getVideos = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data; // array of videos
  } catch (err) {
    console.error("Error fetching videos:", err);
    return [];
  }
};
