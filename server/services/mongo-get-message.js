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

async function mongoGetMessages(room) {
    try {
      const messages = await Messages.find({ room }).limit(100);
      return JSON.stringify(messages);
    } catch (error) {
      throw new Error(error);
    }
  }

module.exports = mongoGetMessages;