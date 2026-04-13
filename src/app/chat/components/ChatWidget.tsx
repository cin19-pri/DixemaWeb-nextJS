"use client";
import { useState } from "react";
import ChatWindow from "./ChatWindow";
import "../styles/chat.css";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <div
        className="chat-bubble"
        onClick={() => setOpen(!open)}
      >
        <i className="bx bx-message-dots"></i>
      </div>

      {/* VENTANA */}
      {open && (
        <div className="chat-overlay">
          <ChatWindow onClose={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}