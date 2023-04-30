const mongoose = require('mongoose');
const messagesSchema = new mongoose.Schema({
  username: String,
  message: String,
  room: String,
  timestamp: Date
});
const Messages = mongoose.model('Messages', messagesSchema);
module.exports = Messages;