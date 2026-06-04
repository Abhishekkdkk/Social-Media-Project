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
      const res = await axios.get("BACKEND_BASE_URL/api/users/me", {
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

      <div className="main-chatsection">
        <div className="user-section">
          <ChatSideBar
            setChatId={setChatId}
            setActiveChat={setActiveChat}
            activeChat={activeChat}
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
              <div className="empty-chat-content">
                <h2>Messages</h2>
                <p>Select a conversation from the sidebar to start chatting.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
