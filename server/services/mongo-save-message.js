const mongoose = require('mongoose');

// Connect To MongoDB
mongoose.connect("mongodb+srv://bflores09:Divanny510@user-chats.qdgydhu.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB')
});

const Messages = require('../models/messages')

function saveMessageToMongoDB(message, username, room, timestamp) {
    const newMessage = new Messages({
      message,
      username,
      room,
      timestamp
    });
    return newMessage.save();
  }

  module.exports = saveMessageToMongoDB;