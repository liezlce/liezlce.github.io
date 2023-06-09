const express = require('express');

const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io'); 

const mongoSaveMessage = require('./services/mongo-save-message');
const mongoGetMessage = require('./services/mongo-get-message');
const leaveRoom = require('./utils/leave-room');
const {gptGetMessage} = require('./services/gpt-get-response');

app.use(cors()); 


const server = http.createServer(app); 


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

    socket.on('send_message', async (data) => {
      const { username, room, message, __createdtime__ } = data;

      if (message.length > 9 && message.slice(0, 9) == 'CHAT_BOT/') {
        try {
          // generate response with gpt
          let gptResponse = await gptGetMessage(message.slice(9));
          
          // save response to database
          let response = await mongoSaveMessage(gptResponse, 'CHAT_BOT', room, __createdtime__);
    
          // send to all users in room, including sender
          io.in(room).emit('receive_message', {
            message: `CHAT_BOT: ${response.message}`,
            username: 'CHAT_BOT',
            room: response.room,
            __createdtime__: response.__createdtime__,
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          // save message to database
          let response = await mongoSaveMessage(message, username, room, __createdtime__);
    
          // send to all users in room, including sender
          io.in(room).emit('receive_message', {
            message: response.message,
            username: response.username,
            room: response.room,
            __createdtime__: response.__createdtime__,
          });
        } catch (error) {
          console.log(error);
        }
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
server.listen(4000, () => console.log('Server is running on port 4000'));