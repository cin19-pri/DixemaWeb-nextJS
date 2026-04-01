import { useState } from "react";
import { getResponse } from "../utils/chatdata";
import { Message } from "../types/chat";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "👋 Hola, soy Dixema ¿En qué puedo ayudarte?", from: "bot" }
  ]);

  const [typing, setTyping] = useState(false);

  const sendMessage = (text: string) => {
    if (!text) return;

    const userMsg: Message = { text, from: "user" };
    setMessages(prev => [...prev, userMsg]);

    setTyping(true);

    setTimeout(() => {
      const botMsg: Message = {
        text: getResponse(text),
        from: "bot"
      };

      setMessages(prev => [...prev, botMsg]);
      setTyping(false);
    }, 800);
  };

  return { messages, sendMessage, typing };
}