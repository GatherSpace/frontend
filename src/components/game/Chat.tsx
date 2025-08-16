import React from "react";
import { WebSocketService } from "../../services/WebSocketService";

interface Message {
  sender: string;
  text: string;
}

const Chat: React.FC<{
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  wsService: WebSocketService;
  userId: string;
}> = ({ messages, setMessages, wsService, userId }) => {
  return (
    <div>
      <h2>Chat</h2>
      <ul>
        {messages.map((message, index) => (
          <li key={index} className={message.sender === "You" ? "you" : ""}>
            <strong>{message.sender}:</strong> {message.text}
          </li>
        ))}
      </ul>

      <form
        style={{
          position: "absolute",
          bottom: "20px",
          width: "100%",
          display: "flex",
          gap: "10px",
        }}
        onSubmit={async (e) => {
          e.preventDefault();
          const sender = "You";
          const text = (e.target as HTMLFormElement).message.value;
          await wsService.sendChatMessage({ userId, message: text });
          setMessages([...messages, { sender, text }]);
          (e.target as HTMLFormElement).reset();
        }}
      >
        <input
          type="text"
          name="message"
          placeholder="Type your message..."
          style={{ outline: "none" }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
