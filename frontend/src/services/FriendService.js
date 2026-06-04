import axios from "axios";
const BASE_URL = "BACKEND_BASE_URL/api/users";

export const friendSuggestions = async () => {
  try {
    const res = await axios.post(
      `${BASE_URL}/friendsuggestions`,
      {},
      {
        withCredentials: true,
      },
    );
    //console.log("Friend suggestions response:", res.data.suggestions);
    return res.data.suggestions || [];
  } catch (err) {
    console.error("Error fetching friend suggestions:", err.response?.data);
    return [];
  }
};

export const sendFriendRequest = async (friendId) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/friendrequest/${friendId}`,
      {},
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (err) {
    console.error("Error sending friend request:", err.response?.data);
    return null;
  }
};
export const removeSuggestion = async (removedId) => {
  const res = await axios.post(
    `${BASE_URL}/friendsuggestions`,
    { removedIds: [removedId] },
    { withCredentials: true },
  );

  return res.data;
};
