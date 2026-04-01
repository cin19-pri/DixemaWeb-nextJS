import { Message } from "../types/chat";
import "../styles/chat.css";

export default function ChatMessage({ msg }: { msg: Message }) {
  return (
    <div className={`message ${msg.from === "user" ? "user" : "bot"}`}>
      {msg.text}
    </div>
  );
}