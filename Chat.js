import React, { useState, useEffect } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // code to fetch messages from server and set them using setMessages
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // code to send message to server and add it to messages using setMessages
  };

  return (
    <div>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;