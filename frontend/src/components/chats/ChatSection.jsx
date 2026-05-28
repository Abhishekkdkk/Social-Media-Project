import "./ChatSection.css";
import { useState, useEffect, useRef } from "react";
import { sendMessage, getMessages } from "../../services/MessageService.js";

function ChatSection({ chatId, activeChat, myUserId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      const data = await getMessages(chatId);
      setMessages(data.messages || []);
    };

    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!activeChat) {
    return (
      <div className="chat-container">
        <div className="empty-chat">Select a chat</div>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (!text.trim() || !chatId) return;

    const tempMessage = {
      _id: Date.now(),
      text,
      senderId: myUserId,
    };

    setMessages((prev) => [...prev, tempMessage]);

    const response = await sendMessage(chatId, text);

    if (!response) return;

    setMessages((prev) =>
      prev.map((msg) => (msg._id === tempMessage._id ? response.message : msg)),
    );

    setText("");
  };

  return (
    <div className="chat-container">
      {/* HEADER */}
      <div className="chat-header">
        {activeChat?.otherMember?.username || activeChat?.name || "Chat"}
      </div>

      {/* MESSAGES */}
      <div className="chat-messages">
        {messages.map((msg) => {
          const isMine = msg.senderId === myUserId;

          return (
            <div
              key={msg._id}
              className={`bubble ${isMine ? "sent" : "received"}`}
            >
              {msg.text}
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
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
