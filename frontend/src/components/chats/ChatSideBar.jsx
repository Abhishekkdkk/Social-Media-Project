import "./ChatSideBar.css";
import { useState, useEffect } from "react";
import {
  getUserChats,
  searchUsers,
  startChat,
} from "../../services/ChatServices";
import UserDisplay from "./UserDisplay";
import socket from "../../socket";

function ChatSideBar({
  setChatId,
  setActiveChat,
  user,
  chatId, // IMPORTANT: active selection source of truth
}) {
  const [users, setUsers] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // GET CHATS
  const getChats = async () => {
    try {
      const res = await getUserChats();
      const data = Array.isArray(res) ? res : [];

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

  // INITIAL LOAD
  useEffect(() => {
    if (user?._id) getChats();
  }, [user]);

  // ONLINE USERS SOCKET
  useEffect(() => {
    const handleOnlineUsers = (users) => {
      setOnlineUsers(users || []);
    };

    socket.on("online_users", handleOnlineUsers);

    return () => {
      socket.off("online_users", handleOnlineUsers);
    };
  }, []);

  // NEW MESSAGE SOCKET UPDATE
  useEffect(() => {
    const handleNewMessage = (data) => {
      setUsers((prev) =>
        prev.map((chat) => {
          if (chat._id === data.chatId) {
            return {
              ...chat,
              lastMessage: {
                message: data.message,
                sender: data.sender,
                read: false,
              },
              isUnread: true,
            };
          }
          return chat;
        }),
      );
    };

    socket.on("receive_message", handleNewMessage);

    return () => {
      socket.off("receive_message", handleNewMessage);
    };
  }, []);

  // SEARCH USERS
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!searchKey.trim()) {
        setSearchResults([]);
        return;
      }

      const res = await searchUsers(searchKey);
      setSearchResults(res);
    }, 300);

    return () => clearTimeout(delay);
  }, [searchKey]);

  // START CHAT
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
      {/* SEARCH */}
      <div className="search-bar">
        <input
          type="text"
          className="user-search-text"
          placeholder="Search or start new chat..."
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />
      </div>

      {/* LIST */}
      <div className="users-list">
        {/* EXISTING CHATS */}
        {!showSearch &&
          users.map((chat) => {
            const otherUserId = chat?.otherMember?._id;
            const isOnline = onlineUsers.includes(otherUserId);

            const isActive = String(chatId) === String(chat._id); // 🔥 FIXED ACTIVE STATE

            return (
              <div
                key={chat._id}
                className={`chat-item ${chat.isUnread ? "unread" : ""}`}
                onClick={() => {
                  setChatId(chat._id);
                  setActiveChat(chat);
                }}
              >
                <UserDisplay
                  user={chat}
                  isOnline={isOnline}
                  isActive={isActive}
                />
              </div>
            );
          })}

        {/* SEARCH RESULTS */}
        {showSearch &&
          searchResults.map((user) => {
            const isOnline = onlineUsers.includes(user._id);

            return (
              <div key={user._id} className="search-item">
                <UserDisplay user={user} isOnline={isOnline} />

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
            );
          })}
      </div>
    </div>
  );
}

export default ChatSideBar;
