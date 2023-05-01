require('dotenv').config();
console.log(process.env.MONGODB_URL);
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io'); // Add this
const { truncate } = require('fs');
const mongoSaveMessage = require('./services/mongo-save-message');
const mongoGetMessage = require('./services/mongo-get-message');
const leaveRoom = require('./utils/leave-room');
const gptGetMessage = require('./services/gpt-get-response');

app.use(cors()); // Add cors middleware

const server = http.createServer(app); // Add this

// Add this
// Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const CHAT_BOT = 'ChatBot';
let chatRoom = ''; // E.g. javascript, node,...
let allUsers = []; // All users in current chat room

// Listen for when the client connects via socket.io-client
io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);

    // We can write our socket event listeners in here...
    // Add a user to a room
    socket.on('join_room', (data) => {
      const { username, room } = data; // Data sent from client when join_room event emitted
      socket.join(room); // Join the user to a socket room
      let __createdtime__ = Date.now(); // Current timestamp
      // Send message to all users currently in the room, apart from the user that just joined
      socket.to(room).emit('receive_message', {
        message: `${username} has joined the chat room`,
        username: CHAT_BOT,
        __createdtime__,
      });
      mongoGetMessage(room)
      .then((last100Messages) => {
        // console.log('latest messages', last100Messages);
        socket.emit('last_100_messages', last100Messages);
      })
      .catch((err) => console.log(err));

    // Send welcome msg to user that just joined chat only
    socket.emit('receive_message', {
      message: `Welcome ${username}`,
      username: CHAT_BOT,
      __createdtime__,
    });

    // Save the new user to the room
    chatRoom = room;
    allUsers.push({ id: socket.id, username, room });
    chatRoomUsers = allUsers.filter((user) => user.room === room);
    socket.to(room).emit('chatroom_users', chatRoomUsers);
    socket.emit('chatroom_users', chatRoomUsers);

    socket.on('send_message', (data) => {
      const { message, username, room, __createdtime__ } = data;
      io.in(room).emit('receive_message', data); // Send to all users in room, including sender
      mongoSaveMessage(message, username, room, __createdtime__)
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
        if (message.length > 9 && message.slice(0, 9) == 'CHAT_BOT/') {
          console.log(message);
          var gptResponse = gptGetMessage(message.slice(9));
          mongoSaveMessage(gptResponse, username, room, __createdtime__)
          .then((response) => console.log(response))
          .catch((err) => console.log(err));
        }
        
      
    });
  });
  socket.on('leave_room', (data) => {
    const { username, room } = data;
    socket.leave(room);
    const __createdtime__ = Date.now();
    // Remove user from memory
    allUsers = leaveRoom(socket.id, allUsers);
    socket.to(room).emit('chatroom_users', allUsers);
    socket.to(room).emit('receive_message', {
      username: CHAT_BOT,
      message: `${username} has left the chat`,
      __createdtime__,
    });
    console.log(`${username} has left the chat`);
  });
});
server.listen(4000, () => 'Server is running on port 3000');