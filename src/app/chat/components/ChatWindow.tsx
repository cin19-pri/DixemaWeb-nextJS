"use client";
import { useState } from "react";
import { useChat } from "../hooks/usechat";
import ChatMessage from "./ChatMessage";
import QuickReplies from "./QuickReplies";
import "../styles/chat.css";

type ChatWindowProps = {
  onClose: () => void;
};

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const { messages, sendMessage, typing } = useChat();
  const [input, setInput] = useState("");

  return (
    <div className="chat-window">
      <div className="chat-header">
        Dixema Chat
        <span onClick={onClose} style={{ float: "right", cursor: "pointer" }}>
          ✖
        </span>
      </div>

      <div className="chat-body">
        {messages.map((m, i) => (
          <ChatMessage key={i} msg={m} />
        ))}

        {typing && (
          <p style={{ fontSize: "12px", color: "#6b7280" }}>
            Escribiendo...
          </p>
        )}
      </div>

      <QuickReplies send={sendMessage} />

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe..."
        />
        <button
          onClick={() => {
            if (!input.trim()) return;
            sendMessage(input);
            setInput("");
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}