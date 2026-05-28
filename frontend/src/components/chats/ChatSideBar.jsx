import "./ChatSideBar.css";
import { useState, useEffect } from "react";
import {
  getUserChats,
  searchUsers,
  startChat,
} from "../../services/ChatServices";
import UserDisplay from "./UserDisplay";

function ChatSideBar({ setChatId, setActiveChat, user }) {
  const [users, setUsers] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const getChats = async () => {
    try {
      const res = await getUserChats();

      // console.log("RAW RESPONSE:", res);

      const data = Array.isArray(res) ? res : [];

      // console.log("EXTRACTED CHATS:", data);

      const formatted = data.map((chat) => {
        const lastMsg = chat.lastMessage;

        const isUnread =
          lastMsg && lastMsg.read === false && lastMsg.sender !== user?._id;

        return {
          ...chat,
          isUnread,
        };
      });

      setUsers(formatted);
    } catch (err) {
      console.error(err);
      setUsers([]);
    }
  };
  useEffect(() => {
    if (user?._id) {
      getChats();
    }
  }, [user]);

  // Search users with debounce
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (searchKey.trim() === "") {
        setSearchResults([]);
        return;
      }

      const res = await searchUsers(searchKey);
      setSearchResults(res);
    }, 300);

    return () => clearTimeout(delay);
  }, [searchKey]);

  const handleStartChat = async (userId) => {
    const chat = await startChat(userId);

    await getChats();

    setSearchKey("");
    setSearchResults([]);

    return chat;
  };

  const showSearch = searchKey.trim().length > 0;

  return (
    <div className="side-bar">
      {/* Search input */}
      <div className="search-bar">
        <input
          type="text"
          className="user-search-text"
          placeholder="Search or start new chat..."
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />
      </div>

      {/* User / Chat list */}
      <div className="users-list">
        {/* Existing chats */}
        {!showSearch &&
          users.map((chat) => (
            <div
              key={chat._id}
              className={`chat-item ${chat.isUnread ? "unread" : ""}`}
              onClick={() => {
                setChatId(chat._id);
                setActiveChat(chat);
              }}
            >
              <UserDisplay user={chat} />
            </div>
          ))}

        {/* Search results */}
        {showSearch &&
          searchResults.map((user) => (
            <div key={user._id} className="search-item">
              <UserDisplay user={user} />

              <button
                className="start-chat-btn"
                onClick={async () => {
                  const chat = await handleStartChat(user._id);

                  if (chat) {
                    setChatId(chat.chatId || chat._id);
                  }
                }}
              >
                Start Chat
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ChatSideBar;
