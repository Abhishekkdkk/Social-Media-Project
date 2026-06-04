import axios from "axios";
const BASE_URL = "http://localhost:5000/api/posts";

export const createPost = async (postData) => {
  try {
    console.log("Creating post with data:", postData);
    const res = await axios.post(`${BASE_URL}/uploadpost`, postData, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const getPosts = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/getposts`, {
      withCredentials: true,
    });
    return res.data.posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const myProfile = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/users/me`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const toggleLike = async (postId) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/${postId}/like`,
      {},
      { withCredentials: true },
    );
    // console.log("Like toggled successfully:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};

export const addComment = async (postId, text) => {
  //console.log("Adding comment to post:", postId, "with data:", text);
  try {
    const res = await axios.post(
      `${BASE_URL}/${postId}/comment`,
      { text },
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export const commentLists = async (postId) => {
  try {
    const res = await axios.get(`${BASE_URL}/${postId}/comments`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};
