import React, { useState, useEffect } from "react";

const ChatHistory = () => {
  const [chats, setChats] = useState([]);  // State to store chats

  // Fetch chat records from the backend
  const fetchChats = async () => {
    try {
      const response = await fetch("http://localhost:5001/chats");  // Correct endpoint
      const data = await response.json();
      setChats(data);  // Update state with fetched data
    } catch (error) {
      console.error("❌ chat history: Error fetching chats:", error);
    }
  };

  useEffect(() => {
    fetchChats();  // Call fetchChats when component mounts
  }, []);

  return (
    <div>
      <h2>Chat History</h2>
      <ul>
        {chats.length > 0 ? (
          chats.map((chat) => (
            <li key={chat._id}>
              <strong>User:</strong> {chat.userMessage}
              <br />
              <strong>AI:</strong> {chat.aiResponse}
              <br />
              <small>Created at: {new Date(chat.createdAt).toLocaleString()}</small>
              <hr />
            </li>
          ))
        ) : (
          <p>No chat history available.</p>
        )}
      </ul>
    </div>
  );
};

export default ChatHistory;
