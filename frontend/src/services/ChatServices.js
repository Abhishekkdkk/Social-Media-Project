import axios from "axios";
const BASE_URL = "BACKEND_BASE_URL/api/chats";

const getUserChats = async () => {
  try {
    const res = await axios.get(`${BASE_URL}`, {
      withCredentials: true,
    });
    //console.log("User chats response:", res.data.chats);
    return res.data.chats || [];
  } catch (err) {
    console.error("Error fetching user chats:", err.response?.data);
    return [];
  }
};

const searchUsers = async (searchKey) => {
  try {
    const res = await axios.get(`${BASE_URL}/search-users?q=${searchKey}`, {
      withCredentials: true,
    });
    return res.data.users || [];
  } catch (err) {
    console.error("Error searching users:", err.response?.data);
    return [];
  }
};

const startChat = async (userId) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/create-new-chat`,
      { userId },
      {
        withCredentials: true,
      },
    );
    return res.data.chatId;
  } catch (err) {
    console.error("Error starting chat:", err.response?.data);
    return null;
  }
};

export { getUserChats, searchUsers, startChat };
