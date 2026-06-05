import "./ChatSection.css";
import { useState, useEffect, useRef } from "react";
import { useLayoutEffect } from "react";
import { getMessages } from "../../services/MessageService.js";
import socket from "../../socket.js";

function ChatSection({ chatId, activeChat, myUserId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const chatContainerRef = useRef(null);
  const messagesRef = useRef(messages);
  const joinedRoomRef = useRef(null);

  const normalizedChatId = chatId ? String(chatId) : null;

  // keep latest state reference
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  useEffect(() => {
    if (!normalizedChatId) return;

    const initChat = async () => {
      if (joinedRoomRef.current !== normalizedChatId) {
        socket.emit("join_chat", normalizedChatId);
        joinedRoomRef.current = normalizedChatId;
      }

      const data = await getMessages(normalizedChatId);
      setMessages(data?.messages || []);
    };

    initChat();

    return () => {
      socket.emit("leave_chat", normalizedChatId);
      joinedRoomRef.current = null;
    };
  }, [normalizedChatId]);

  useEffect(() => {
    const handler = (message) => {
      const msgChatId = String(
        typeof message.chatId === "object"
          ? message.chatId._id
          : message.chatId,
      );

      if (msgChatId !== normalizedChatId) return;

      const current = messagesRef.current;

      const exists = current.some((m) => String(m._id) === String(message._id));

      if (exists) return;

      setMessages((prev) => [...prev, { ...message, new: true }]);

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m._id === message._id ? { ...m, new: false } : m)),
        );
      }, 1500);
    };

    socket.on("receive_message", handler);

    return () => {
      socket.off("receive_message", handler);
    };
  }, [normalizedChatId]);

  const handleSendMessage = () => {
    if (!text.trim() || !normalizedChatId) return;

    socket.emit("send_message", {
      chatId: normalizedChatId,
      text,
      senderId: String(myUserId),
    });

    setText("");
  };

  if (!activeChat) {
    return <div className="empty-chat">Select a chat</div>;
  }
  useLayoutEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        {activeChat?.otherMember?.username || activeChat?.name}
      </div>

      <div className="chat-messages" ref={chatContainerRef}>
        {messages.map((msg) => {
          const senderId =
            typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;

          const isMine = String(senderId) === String(myUserId);

          return (
            <div
              key={msg._id}
              className={`bubble ${isMine ? "sent" : "received"} ${msg.new ? "new" : ""}`}
            >
              {msg.text}
            </div>
          );
        })}
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />

        <button onClick={handleSendMessage}>➤</button>
      </div>
    </div>
  );
}

export default ChatSection;
