const mongoose = require('mongoose');
const messagesSchema = new mongoose.Schema({
  message: String,
  username: String,
  room: String,
  timestamp: Date
});
const Messages = mongoose.model('Messages', messagesSchema);
module.exports = Messages;