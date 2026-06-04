import axios from "axios";
const BASE_URL = "BACKEND_BASE_URL/api/messages";

const sendMessage = async (chatId, text) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/new-message`,
      { chatId, text },
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

const getMessages = async (chatId) => {
  try {
    const res = await axios.get(`${BASE_URL}/get-chat-messages/${chatId}`, {
      withCredentials: true,
    });
    console.log("Get messages response:", res.data);
    return res.data;
  } catch (err) {
    console.log("Get messages error:", err);
    return { messages: [] };
  }
};
export { sendMessage, getMessages };
