import "./ChatPage.css";
import NavBar from "../../assets/NavBar";
import ChatSideBar from "./ChatSideBar";
import ChatSection from "./ChatSection";
import { useState, useEffect } from "react";
import axios from "axios";
function ChatPage() {
  const [chatId, setChatId] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get("http://localhost:5000/api/users/me", {
        withCredentials: true,
      });

      setUser(res.data.user);
    };

    fetchUser();
  }, []);
  return (
    <div className="chat-page">
      <div className="nav-section">
        <NavBar />
      </div>
      <div className="main-section">
        <div className="user-section">
          <ChatSideBar
            setChatId={setChatId}
            setActiveChat={setActiveChat}
            user={user}
          />
        </div>
        <div className="chat-section">
          {chatId ? (
            <ChatSection
              chatId={chatId}
              activeChat={activeChat}
              myUserId={user?._id}
            />
          ) : (
            <div className="empty-chat">
              <h2>Welcome 👋</h2>
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
