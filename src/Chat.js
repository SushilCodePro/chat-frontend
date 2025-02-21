import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("https://chat-backend-6koy.onrender.com");

const Chat = () => {
  const [username, setUsername] = useState(""); // Store username
  const [tempName, setTempName] = useState(""); 
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // useEffect(() => {
  //   console.log(`useeffect called`)
  //   // if (!socket.connected) {
  //   //     socket.connect(); // Ensure the socket connects only once
  //   //   }
  //   socket.on("receiveMessage", (data) => {
  //     console.log('inside socket.on in Rcvmsg')
  //     setMessages((prevMessages) => [...prevMessages, data]);
  //   });
  //   // console.log(`useeffect : ${messages}`)
  //   return () => {
  //     socket.off("receiveMessage");
  //   };
  // }, []);
  // console.log(`Name : ${username}`)
  // console.log(`Messages : ${message}`)
  // const sendMessage = () => {
  //   if (message.trim() && username.trim()) {
  //     console.log(`sendmsg called bfor socket.emit ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`)
  //     socket.emit("sendMessage", { username, message });
  //     console.log(`after socket.emit ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`)
  //     setMessage("");
  //   }
  // };
  useEffect(() => {
    console.log("🛠️ useEffect called");

    // Load previous messages
    socket.on("previousMessages", (prevMessages) => {
      setMessages(prevMessages);
    });

    // Listen for new messages
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("previousMessages");
      socket.off("receiveMessage");
    };
  }, []);

  console.log("👤 Username:", username);
  console.log("📨 Current message:", message);

  const sendMessage = () => {
    if (message.trim() && username.trim()) {
      socket.emit("sendMessage", { username, message });
      setMessage("");
    }
  };
  return (
    <div className="chat-container">
      {/* <h2>🔥 Real-Time Chat</h2> */}

      {!username && (
        <div>
          <input
            type="text"
            placeholder="Enter your name..."
            onChange={(e) => setTempName(e.target.value)}
          />
          <button onClick={() => setUsername(tempName.trim())}>Set Name</button>
        </div>
      )}
      {username && (
        <>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </>
      )}
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}: </strong> {msg.message}
          </div>
        ))}
      </div>

    </div>
  );
};

export default Chat;
