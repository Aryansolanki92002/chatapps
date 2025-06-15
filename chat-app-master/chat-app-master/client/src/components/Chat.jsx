import { useState, useEffect } from "react";
import io from "socket.io-client";

// Create a unique user ID for this client
const userId = Date.now().toString(); // You can replace with actual user ID if logged in

// Connect to the server
const socket = io("http://localhost:5000"); // Make sure your server is running

function Chat() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    // Listen for incoming messages
    socket.on("message", (message) => {
      const isMe = message.senderId === userId;
      const finalMessage = { ...message, sender: isMe ? "me" : "other" };
      setMessages((prevMessages) => [...prevMessages, finalMessage]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      const message = {
        text: messageInput,
        timestamp: new Date(),
        senderId: userId, // Send userId to identify sender
      };
      socket.emit("message", message); // Only emit to server
      setMessageInput(""); // Clear input
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-gradient-to-b from-blue-300 to-blue-200">
      <div className="bg-white rounded-lg w-96 h-96 p-4 shadow-md">
        <div className="flex flex-col h-full">
          <div className="flex-1 p-2 overflow-y-auto bg-gray-100 rounded-md">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.sender === "me" ? "items-end" : "items-start"
                } mb-2`}
              >
                <div
                  className={`p-2 rounded-md max-w-xs ${
                    msg.sender === "me"
                      ? "bg-green-500 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-gray-500 text-xs">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-gray-300">
            <div className="flex">
              <input
                type="text"
                className="w-full px-2 py-1 border rounded-l-md outline-none"
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
